import { useEffect, useState } from 'react'
import { allScenarios, message } from '../api.ts'
import type { ScenarioEntry } from '../scenario-repository.ts'
/** Refresh evidence when returning from QA without unmounting the editor or clearing its draft. */
export function useScenarioCatalogue(active: boolean) {
  const [state, setState] = useState<{ data?: ScenarioEntry[]; error?: string }>({})
  useEffect(() => {
    if (!active) return
    const controller = new AbortController()
    void allScenarios(controller.signal)
      .then(data => {
        if (!controller.signal.aborted) setState({ data })
      })
      .catch(error => {
        if (!controller.signal.aborted)
          setState(previous => ({ ...previous, error: message(error) }))
      })
    return () => controller.abort()
  }, [active])
  return state
}
