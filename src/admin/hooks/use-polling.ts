import { useEffect, useState } from 'react'
import { api, type Failure, failureOf, NO_FAILURE } from '../api.ts'

/** One read, outside the effect: the loop below then says only when to read, never how. */
async function readOnce<T>(
  path: string,
  signal: AbortSignal,
  reset: boolean,
  apply: { data: (value: T | null) => void; failure: (value: Failure) => void },
) {
  // A hidden tab still pays for the request and the snapshot it produces; use-live already
  // skips its own reads for the same reason.
  if (document.hidden) return
  try {
    apply.data(await api<T>(path, 'GET', undefined, signal))
    if (reset) apply.failure(NO_FAILURE)
  } catch (cause) {
    if (signal.aborted) return
    if (reset) apply.data(null)
    apply.failure(failureOf(cause))
  }
}

/**
 * Follows a local endpoint until unmount; a stale response never lands after navigation.
 * 'reset' drops the snapshot and reports the failure; 'keep' leaves the last snapshot and
 * any caller-owned error in place, so a poll never erases a message the user must still read.
 */
export function usePolling<T>(path: string, intervalMs: number, onFailure: 'reset' | 'keep') {
  const [data, setData] = useState<T | null>(null)
  const [failure, setFailure] = useState<Failure>(NO_FAILURE)
  const reset = onFailure === 'reset'
  useEffect(() => {
    const abort = new AbortController()
    let timer: ReturnType<typeof setTimeout>
    const refresh = async () => {
      await readOnce<T>(path, abort.signal, reset, { data: setData, failure: setFailure })
      if (!abort.signal.aborted) timer = setTimeout(() => void refresh(), intervalMs)
    }
    void refresh()
    return () => {
      abort.abort()
      clearTimeout(timer)
    }
  }, [path, intervalMs, reset])
  return { data, setData, failure, setFailure }
}
