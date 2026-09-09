import { useEffect, useState } from 'react'

/** Decodes the next capture off-screen, so the visible one is never replaced by a blank frame. */
export function useDecodedImage(source: string): { loaded: string; error: string } {
  const [loaded, setLoaded] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    if (!source) {
      setLoaded('')
      setError('')
      return
    }
    let cancelled = false
    const next = new Image()
    next.src = source
    void next
      .decode()
      .then(() => {
        if (cancelled) return
        setLoaded(source)
        setError('')
      })
      .catch(() => {
        if (!cancelled) setError('La dernière capture ne peut pas être chargée.')
      })
    return () => {
      cancelled = true
    }
  }, [source])
  return { loaded, error }
}
