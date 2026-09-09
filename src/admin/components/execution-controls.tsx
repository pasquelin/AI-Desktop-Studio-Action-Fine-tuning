import { useEffect, useState } from 'react'
import type { ExecutionState } from '../../execution/controller.ts'
import { api, message } from '../api.ts'
import { LIVE_LABEL, PageHeading } from './layout.tsx'
import { Badge, Button, Notice } from './primitives.tsx'

export function RunScenario({ id, enabled }: { id: string; enabled: boolean }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  return (
    <>
      <Button
        primary
        disabled={!enabled || busy}
        onClick={() => {
          setBusy(true)
          setError('')
          void api('/api/execution', 'POST', { ids: [id] })
            .then(() => {
              location.hash = 'live'
            })
            .catch(error => setError(message(error)))
            .finally(() => setBusy(false))
        }}
      >
        {busy ? 'Lancement…' : 'Tester la version enregistrée'}
      </Button>
      <Notice error>{error}</Notice>
    </>
  )
}

export function ExecutionStatus({ fallback }: { fallback?: React.ReactNode }) {
  const [state, setState] = useState<ExecutionState | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const abort = new AbortController()
    let timer: ReturnType<typeof setTimeout>
    const refresh = async () => {
      try {
        setState(await api<ExecutionState>('/api/execution', 'GET', undefined, abort.signal))
      } catch (error) {
        if (!abort.signal.aborted) setError(message(error))
      }
      if (!abort.signal.aborted) timer = setTimeout(() => void refresh(), 1000)
    }
    void refresh()
    return () => {
      abort.abort()
      clearTimeout(timer)
    }
  }, [])
  if (!state || state.status === 'idle')
    return (
      <PageHeading title={LIVE_LABEL} alert={error ? <Notice error>{error}</Notice> : undefined}>
        {fallback}
      </PageHeading>
    )
  const labels = {
    running: 'Essai en cours',
    passed: 'Essai réussi',
    failed: 'Essai en échec',
    cancelled: 'Essai arrêté',
  }
  return (
    <PageHeading title={LIVE_LABEL} alert={error ? <Notice error>{error}</Notice> : undefined}>
      <Badge soft error={state.status === 'failed'}>
        {labels[state.status]} · {state.steps.filter(step => step.status === 'passed').length}/
        {state.steps.length}
      </Badge>
      {state.status === 'running' && (
        <Button
          primary
          onClick={() => {
            void api('/api/execution/stop', 'POST', {}).catch(error => setError(message(error)))
          }}
        >
          Arrêter l’essai
        </Button>
      )}
    </PageHeading>
  )
}
