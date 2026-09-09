import { useEffect, useState } from 'react'
import { Header, MainContainer, pages } from './components/layout.tsx'
import { Button } from './components/primitives.tsx'
import { Live } from './views/live.tsx'
import { Overview } from './views/overview.tsx'
import { Reports } from './views/reports.tsx'
import { Scenarios } from './views/scenarios.tsx'

// The home view is a product choice, independent of the visual menu order.
const DEFAULT_PAGE = 'live'

export function App() {
  const [hash, setHash] = useState(() => location.hash)
  useEffect(() => {
    const change = () => {
      if (location.hash === '#live') history.replaceState(null, '', '/')
      setHash(location.hash)
    }
    change()
    window.addEventListener('hashchange', change)
    window.addEventListener('popstate', change)
    return () => {
      window.removeEventListener('hashchange', change)
      window.removeEventListener('popstate', change)
    }
  }, [])
  const [requested = DEFAULT_PAGE, query = ''] = hash.slice(1).split('?')
  const page = pages.some(([id]) => id === requested) ? requested : DEFAULT_PAGE
  const params = new URLSearchParams(query)
  const [scenarioHash, setScenarioHash] = useState<string | null>(null)
  if (page === 'scenarios' && scenarioHash !== hash) setScenarioHash(hash)
  return (
    <div className="flex h-dvh flex-col gap-3 overflow-hidden p-3">
      <Button
        className="sr-only focus:not-sr-only"
        onClick={event => {
          event.preventDefault()
          document.getElementById('main')?.focus()
        }}
      >
        Aller au contenu
      </Button>
      <Header
        page={page}
        scenarioHref={scenarioHash ? `/${scenarioHash}` : '/#scenarios'}
        onHome={event => {
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return
          event.preventDefault()
          if (location.pathname !== '/' || location.hash || location.search)
            history.pushState(null, '', '/')
          setHash('')
        }}
      />
      <MainContainer>
        {scenarioHash !== null && (
          <div className={page === 'scenarios' ? 'contents' : 'hidden'}>
            <Scenarios
              active={page === 'scenarios'}
              params={new URLSearchParams(scenarioHash.split('?')[1] ?? '')}
            />
          </div>
        )}
        {page === 'scenarios' ? null : page === 'reports' ? (
          <Reports key={hash} params={params} />
        ) : page === 'overview' ? (
          <Overview />
        ) : (
          <Live />
        )}
      </MainContainer>
    </div>
  )
}
