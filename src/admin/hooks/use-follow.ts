import { useCallback, useEffect, useRef, useState } from 'react'
export function useFollow() {
  const scroller = useRef<HTMLDivElement>(null)
  const [following, setFollowing] = useState(true)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const programmatic = useRef(false)
  const hasSelection = useCallback(() => {
    const selection = window.getSelection()
    return (
      !!selection &&
      !selection.isCollapsed &&
      !!scroller.current &&
      (scroller.current.contains(selection.anchorNode) ||
        scroller.current.contains(selection.focusNode))
    )
  }, [])
  const pause = useCallback(() => {
    setFollowing(false)
    clearTimeout(timer.current)
    const resume = () => {
      if (hasSelection()) timer.current = setTimeout(resume, 30000)
      else setFollowing(true)
    }
    timer.current = setTimeout(resume, 30000)
  }, [hasSelection])
  const align = useCallback(() => {
    const node = scroller.current
    if (following && node && !hasSelection()) {
      programmatic.current = true
      node.scrollTop = node.scrollHeight
      requestAnimationFrame(() => {
        programmatic.current = false
      })
    }
  }, [following, hasSelection])
  useEffect(() => {
    const selection = () => {
      if (hasSelection()) pause()
    }
    document.addEventListener('selectionchange', selection)
    return () => {
      document.removeEventListener('selectionchange', selection)
      clearTimeout(timer.current)
    }
  }, [hasSelection, pause])
  return {
    scroller,
    following,
    hasSelection,
    align,
    pause,
    setFollowing: (value: boolean) => {
      if (value) {
        clearTimeout(timer.current)
        setFollowing(true)
      } else pause()
    },
    onScroll: () => {
      const node = scroller.current
      if (
        !programmatic.current &&
        node &&
        node.scrollHeight - node.clientHeight - node.scrollTop > 32
      )
        pause()
    },
  }
}
