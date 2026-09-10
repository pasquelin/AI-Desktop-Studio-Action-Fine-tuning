import { useEffect, useState } from 'react'
import type { Snapshot } from '../../vm/snapshots.ts'
import { api, type Failure, failureOf, NO_FAILURE } from '../api.ts'
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
  const [state, setState] = useState({ text: '', loaded: false, status: '', file: '' })
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [logFailure, setLogFailure] = useState<Failure>(NO_FAILURE)
  const [capturesLoaded, setCapturesLoaded] = useState(false)
  const [captureFailure, setCaptureFailure] = useState<Failure>(NO_FAILURE)
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
      setLogFailure(NO_FAILURE)
      if (!part.run) {
        setState(EMPTY)
        return IDLE_DELAY
      }
      const text = stream.append(part)
      setState({ text, status: part.status, file: part.file, loaded: true })
      return stream.behind(part) ? CATCH_UP_DELAY : IDLE_DELAY
    }

    async function logs() {
      let delay = IDLE_DELAY
      try {
        delay = await readLog()
      } catch (cause) {
        if (!controller.signal.aborted) setLogFailure(failureOf(cause))
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
      setCaptureFailure(NO_FAILURE)
      setCapturesLoaded(true)
    }

    async function captures() {
      try {
        await readCaptures()
      } catch (cause) {
        if (!controller.signal.aborted) setCaptureFailure(failureOf(cause))
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
  // An unreachable observer is one condition, not two failing readers: the view shows a single
  // notice, so the offline case is reported once here instead of being re-derived per message.
  const offline = logFailure.code === 'offline' || captureFailure.code === 'offline'
  return {
    ...state,
    snapshots,
    offline,
    logError: logFailure.code === 'offline' ? '' : logFailure.message,
    captureError: captureFailure.code === 'offline' ? '' : captureFailure.message,
    capturesLoaded,
  }
}
