import { useEffect, useState } from 'react'
import { date } from '../api.ts'
import { Captures, snapshotUrl } from '../components/captures.tsx'
import { ExecutionStatus } from '../components/execution-controls.tsx'
import { Columns, ControlBar, Panel } from '../components/layout.tsx'
import { LoadingSkeleton } from '../components/loading-skeleton.tsx'
import { Badge, Choice, Code, Empty, Notice, Tabs } from '../components/primitives.tsx'
import { useDecodedImage } from '../hooks/use-decoded-image.ts'
import { useFollow } from '../hooks/use-follow.ts'
import { lifecycleLabels, logSummary, useLive } from '../hooks/use-live.ts'
export function Live() {
  const follow = useFollow()
  const live = useLive(follow.hasSelection)
  const [tab, setTab] = useState('Étapes')
  const latest = live.snapshots.at(-1)
  const image = latest ? snapshotUrl(latest) : ''
  const { loaded, error: imageError } = useDecodedImage(image)
  // biome-ignore lint/correctness/useExhaustiveDependencies: new output and tab changes alter the scroll height; they trigger the realign without being read.
  useEffect(() => {
    follow.align()
  }, [live.text, live.snapshots, tab, follow.align])
  useEffect(() => {
    const node = follow.scroller.current
    if (!node) return
    const observer = new ResizeObserver(follow.align)
    observer.observe(node)
    return () => observer.disconnect()
  }, [follow.align, follow.scroller])
  return (
    <>
      <ExecutionStatus fallback={<LifecycleBadge run={live.run} status={live.status} />} />
      <Columns preview>
        <Panel
          title="Studio dans la VM"
          footer={
            <p className="flex-none text-xs text-muted">
              Aucun clic ni touche n’est envoyé à la VM. Fermer cette page ne stoppe pas les tests.
            </p>
          }
        >
          <LatestCapture
            error={live.captureError || imageError}
            pending={!live.capturesLoaded && !live.captureError}
            loaded={loaded}
            caption={
              latest && loaded === image ? `${date(latest.capturedAt)} · ${latest.activity}` : ''
            }
          />
        </Panel>
        <Panel
          title="Déroulé et journaux"
          footer={
            <p role="status" className="text-xs text-muted">
              {live.file === 'activity.log'
                ? 'Étapes et sorties collectées · mise à jour toutes les 2 s'
                : 'Journal de construction conservé. Les étapes détaillées dépendent de l’exécution.'}
            </p>
          }
        >
          <div className="flex h-full min-h-0 flex-col gap-3">
            <Notice error>{live.logError}</Notice>
            <ControlBar>
              <Tabs compact labels={['Étapes', 'Logs', 'Captures']} value={tab} onChange={setTab} />
              <div className="shrink-0">
                <Choice
                  label="Suivre la fin"
                  checked={follow.following}
                  onChange={e => follow.setFollowing(e.target.checked)}
                />
              </div>
            </ControlBar>
            <div
              ref={follow.scroller}
              className="min-h-0 flex-1 overflow-auto overscroll-contain"
              role="log"
              aria-label="Journaux défilants"
              aria-live="off"
              // biome-ignore lint/a11y/noNoninteractiveTabindex: Scrollable logs need keyboard access.
              tabIndex={0}
              onScroll={follow.onScroll}
              onWheel={follow.pause}
              onTouchMove={follow.pause}
              onKeyDown={e => {
                if (
                  ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)
                )
                  follow.pause()
              }}
            >
              <LivePanel tab={tab} live={live} />
            </div>
          </div>
        </Panel>
      </Columns>
    </>
  )
}

function LatestCapture({
  error,
  pending,
  loaded,
  caption,
}: {
  error: string
  pending: boolean
  loaded: string
  caption: string
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <Notice error>{error}</Notice>
      {pending ? (
        <LoadingSkeleton variant="preview" label="Chargement des captures…" />
      ) : loaded ? (
        <img
          src={loaded}
          alt="Dernière capture de la fenêtre Studio dans la VM"
          className="min-h-0 w-full flex-1 object-contain"
        />
      ) : (
        <Empty>La première capture apparaîtra avant la première action du scénario.</Empty>
      )}
      {caption && <p className="flex-none text-xs text-muted">{caption}</p>}
    </div>
  )
}

function LifecycleBadge({ run, status }: { run: string; status: string }) {
  const failed = status === 'failed-retained'
  return (
    <Badge role="status" error={failed} soft title={lifecycleLabels[status]}>
      {!run
        ? 'Aucune exécution enregistrée'
        : failed
          ? 'Échec VM'
          : (lifecycleLabels[status] ?? 'État inconnu')}
    </Badge>
  )
}

function LivePanel({ tab, live }: { tab: string; live: ReturnType<typeof useLive> }) {
  if (tab === 'Captures')
    return !live.capturesLoaded && !live.captureError ? (
      <LoadingSkeleton variant="list" label="Chargement des captures…" />
    ) : (
      <Captures items={live.snapshots} />
    )
  if (!live.loaded && !live.logError)
    return <LoadingSkeleton variant="logs" label="Chargement du journal…" />
  return <Code value={tab === 'Étapes' ? logSummary(live.text, live.status) : live.text} />
}
