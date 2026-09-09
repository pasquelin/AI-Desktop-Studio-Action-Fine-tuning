import { useEffect, useState } from 'react'
import type { Snapshot } from '../../vm/snapshots.ts'
import { api, message } from '../api.ts'
import { type LiveLog, LogStream } from '../log-stream.ts'

export type { LiveLog } from '../log-stream.ts'

const IDLE_DELAY = 2000
const CATCH_UP_DELAY = 100
const CAPTURE_DELAY = 1000
const EMPTY = {
  text: 'Lance la chaîne VM pour voir ses étapes ici.',
  loaded: true,
  status: '',
  file: '',
  run: '',
}

export const lifecycleLabels: Record<string, string> = {
  created: 'Exécution créée · en cours ou interrompue',
  ready: 'Référence préparée',
  'build-passed': 'Construction et démarrage validés',
  'failed-retained': 'Échec · VM conservée pour diagnostic',
  removed: 'VM supprimée · journaux conservés',
}

export function logSummary(text: string, status: string) {
  const stages = text.split('\n').filter(line => /^\[\d{2}:\d{2}:\d{2}\]|^\[Étape\]/.test(line))
  if (stages.length) return stages.join('\n\n')
  return status === 'build-passed'
    ? 'Construction de Studio terminée.\n\nContrôle du chargement de son interface réussi.\n\nAucun scénario métier exécuté. Aucun apprentissage lancé.\n\nLes détails de cette ancienne exécution sont dans « Logs ».'
    : 'Pas encore de déroulé détaillé. Les informations disponibles sont dans « Logs ».'
}

/** Follows the current run's log and its captures; a text selection pauses the log refresh. */
export function useLive(hasSelection: () => boolean) {
  const [state, setState] = useState({ text: '', loaded: false, status: '', file: '', run: '' })
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [logError, setLogError] = useState('')
  const [capturesLoaded, setCapturesLoaded] = useState(false)
  const [captureError, setCaptureError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    const stream = new LogStream()
    let logTimer: ReturnType<typeof setTimeout>
    let captureTimer: ReturnType<typeof setTimeout>
    let lastCaptures = ''

    async function readLog(): Promise<number> {
      if (document.hidden || hasSelection()) return IDLE_DELAY
      const part = await api<LiveLog>(
        `/logs?run=${encodeURIComponent(stream.run)}&offset=${stream.offset}`,
        'GET',
        undefined,
        controller.signal,
      )
      if (controller.signal.aborted || hasSelection()) return IDLE_DELAY
      setLogError('')
      if (!part.run) {
        setState(EMPTY)
        return IDLE_DELAY
      }
      const text = stream.append(part)
      setState({ text, status: part.status, file: part.file, run: stream.run, loaded: true })
      return stream.behind(part) ? CATCH_UP_DELAY : IDLE_DELAY
    }

    async function logs() {
      let delay = IDLE_DELAY
      try {
        delay = await readLog()
      } catch (failure) {
        if (!controller.signal.aborted) setLogError(message(failure))
      } finally {
        if (!controller.signal.aborted) logTimer = setTimeout(() => void logs(), delay)
      }
    }

    async function readCaptures(): Promise<void> {
      if (document.hidden) return
      const items = await api<Snapshot[]>('/snapshots', 'GET', undefined, controller.signal)
      if (controller.signal.aborted) return
      const key = JSON.stringify(items)
      if (key !== lastCaptures) {
        lastCaptures = key
        setSnapshots(items)
      }
      setCaptureError('')
      setCapturesLoaded(true)
    }

    async function captures() {
      try {
        await readCaptures()
      } catch (failure) {
        if (!controller.signal.aborted) setCaptureError(message(failure))
      } finally {
        if (!controller.signal.aborted)
          captureTimer = setTimeout(() => void captures(), CAPTURE_DELAY)
      }
    }

    void logs()
    void captures()
    return () => {
      controller.abort()
      clearTimeout(logTimer)
      clearTimeout(captureTimer)
    }
  }, [hasSelection])
  return { ...state, snapshots, logError, captureError, capturesLoaded }
}
