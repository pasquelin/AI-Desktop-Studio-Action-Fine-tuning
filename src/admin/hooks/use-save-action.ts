import { useCallback, useState } from 'react'
import { message } from '../api.ts'

/** One shape for every editor save: a busy flag while it runs and the failure text if it fails. */
export function useSaveAction() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const run = useCallback(async (work: () => Promise<void>) => {
    setBusy(true)
    setError('')
    try {
      await work()
    } catch (failure) {
      setError(message(failure))
    } finally {
      setBusy(false)
    }
  }, [])
  return { busy, error, setError, run }
}
