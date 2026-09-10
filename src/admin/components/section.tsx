import type { ReactNode, Ref } from 'react'
export function Section({
  children,
  title,
  label,
  footer,
  collapsible = false,
  defaultOpen = false,
  fill = false,
  scroll = false,
  inset = false,
  ref,
}: {
  children: ReactNode
  title?: ReactNode
  label?: string
  footer?: ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
  fill?: boolean
  scroll?: boolean
  inset?: boolean
  ref?: Ref<HTMLElement>
}) {
  const surface = `${inset ? 'bg-base-100' : 'bg-base-200'} min-w-0 ${fill ? 'min-h-0 flex-1' : 'shrink-0'}`
  const body = (
    <>
      <div className={scroll ? 'min-h-0 flex-1 overflow-auto' : 'flex min-w-0 flex-col gap-3'}>
        {children}
      </div>
      {footer && <div className="card-actions shrink-0 items-center">{footer}</div>}
    </>
  )
  if (collapsible)
    return (
      <details
        aria-label={label}
        open={defaultOpen}
        className={`collapse collapse-arrow ${surface}`}
      >
        <summary className="collapse-title font-medium">{title}</summary>
        <div className="collapse-content">
          <div className="flex min-h-0 flex-col gap-3">{body}</div>
        </div>
      </details>
    )
  return (
    <section ref={ref} aria-label={label} className={`card border border-neutral ${surface}`}>
      <div className="card-body min-h-0 gap-3 p-3">
        {title && <h2 className="card-title shrink-0 text-sm">{title}</h2>}
        {body}
      </div>
    </section>
  )
}
