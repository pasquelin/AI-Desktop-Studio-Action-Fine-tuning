import { useEffect, useState } from 'react'
import { message } from '../api.ts'
/** The caller supplies a stable loader; navigation cancels stale responses. */
export function useResource<T>(loader: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<{ data?: T; error?: string }>({})
  useEffect(() => {
    const controller = new AbortController()
    setState({})
    void loader(controller.signal)
      .then(data => {
        if (!controller.signal.aborted) setState({ data })
      })
      .catch(error => {
        if (!controller.signal.aborted) setState({ error: message(error) })
      })
    return () => controller.abort()
  }, [loader])
  return state
}
