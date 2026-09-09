import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from './primitives.tsx'
export const LIVE_LABEL = 'Live'
export const pages = [
  ['live', LIVE_LABEL],
  ['scenarios', 'Scénarios'],
  ['reports', 'Rapports'],
  ['overview', 'Vue d’ensemble'],
] as const
export function Header({
  page,
  onHome,
  scenarioHref,
}: {
  page: string
  onHome: MouseEventHandler<HTMLAnchorElement>
  scenarioHref?: string
}) {
  const links = pages.map(([id, label]) => (
    <li key={id}>
      <Link
        primary
        href={
          id === 'live' ? '/' : id === 'scenarios' ? (scenarioHref ?? '/#scenarios') : `/#${id}`
        }
        onClick={id === 'live' ? onHome : undefined}
        aria-current={page === id ? 'page' : undefined}
        className={page === id ? 'btn-active underline' : ''}
      >
        {label}
      </Link>
    </li>
  ))
  return (
    <header className="navbar shrink-0 flex-nowrap justify-between gap-3 p-0">
      <a href="/" onClick={onHome} className="flex min-w-0 shrink-0 items-center gap-2">
        <img src="/admin/logo.svg" alt="" className="size-12 shrink-0 sm:size-16" />
        <div>
          <p className="text-body font-semibold sm:text-base">AI Desktop Studio</p>
          <p className="text-xs text-muted">Action Fine-tuning</p>
        </div>
      </a>
      <nav aria-label="Navigation principale" className="ml-auto hidden sm:block">
        <ul className="menu menu-horizontal flex-nowrap gap-2 p-0">{links}</ul>
      </nav>
      <details className="dropdown dropdown-end ml-auto sm:hidden" key={page}>
        <summary className="btn btn-primary btn-sm">Menu</summary>
        <ul
          aria-label="Navigation principale"
          className="menu dropdown-content z-10 w-52 gap-2 rounded-box border border-neutral bg-base-200 p-2"
        >
          {links}
        </ul>
      </details>
    </header>
  )
}
export function MainContainer({ children }: { children: ReactNode }) {
  return (
    <main id="main" tabIndex={-1} className="flex min-h-0 flex-1 flex-col gap-3">
      {children}
    </main>
  )
}
export function PageHeading({
  title,
  children,
  alert,
}: {
  title: string
  children?: ReactNode
  alert?: ReactNode
}) {
  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center gap-3">
        <h1 className="text-lg font-semibold">{title}</h1>
        {children}
      </div>
      {alert && <div className="w-full shrink-0">{alert}</div>}
    </>
  )
}
/**
 * Two panels sharing the width. A preview gives the larger share to the first panel and needs a
 * wider viewport to split at all; every other page gives it to the second. The split lives here
 * alone, so a panel never has to know where it sits.
 */
export function Columns({ children, preview = false }: { children: ReactNode; preview?: boolean }) {
  return (
    <div
      className={`grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden ${
        preview
          ? 'grid-rows-[minmax(0,2fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:grid-rows-1'
          : 'grid-rows-2 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:grid-rows-1'
      }`}
    >
      {children}
    </div>
  )
}
export function Panel({
  title,
  children,
  footer,
}: {
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <section className="card min-h-0 min-w-0 border border-neutral bg-base-200">
      <div className="card-body min-h-0 gap-3 p-3">
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <h2 className="card-title text-sm">{title}</h2>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
        {footer && <div className="card-actions shrink-0 items-center">{footer}</div>}
      </div>
    </section>
  )
}
export function Stack({ children }: { children: ReactNode }) {
  return <div className="flex min-w-0 flex-col gap-3">{children}</div>
}

export function ContentPanel({ children }: { children: ReactNode }) {
  return (
    <section className="card min-h-64 min-w-0 flex-1 overflow-auto border border-neutral bg-base-200">
      <div className="card-body p-3">{children}</div>
    </section>
  )
}

export function ControlBar({ children }: { children: ReactNode }) {
  return <div className="flex min-w-0 shrink-0 items-center justify-between gap-2">{children}</div>
}
