import { useEffect } from 'react'
export function useDebouncedEffect(action: () => void, delay: number) {
  useEffect(() => {
    const timer = setTimeout(action, delay)
    return () => clearTimeout(timer)
  }, [action, delay])
}
