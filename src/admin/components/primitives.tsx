import { type ComponentProps, type ReactNode, useEffect, useId, useRef } from 'react'

/** One appearance for every action, whether it acts on the page or navigates away. */
const actionClass = (primary: boolean, extra: string) =>
  `btn btn-sm ${primary ? 'btn-primary' : 'btn-ghost'} ${extra}`

export function Button({
  primary = false,
  className = '',
  ...props
}: ComponentProps<'button'> & { primary?: boolean }) {
  return <button type="button" className={actionClass(primary, className)} {...props} />
}
export function Link({
  primary = false,
  className = '',
  ...props
}: ComponentProps<'a'> & { primary?: boolean }) {
  return <a className={actionClass(primary, className)} {...props} />
}
export function Badge({
  children,
  error = false,
  soft = false,
  ...props
}: ComponentProps<'span'> & {
  error?: boolean
  soft?: boolean
}) {
  return (
    <span
      {...props}
      className={`badge ${error ? 'badge-error' : 'badge-outline'} ${soft ? 'badge-soft' : ''}`}
    >
      {children}
    </span>
  )
}
export function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return children ? (
    <div
      role={error ? 'alert' : 'status'}
      className={`alert alert-soft text-sm ${error ? 'alert-error' : ''}`}
    >
      <span>{children}</span>
    </div>
  ) : null
}
export function Empty({ children }: { children: ReactNode }) {
  return <p className="p-6 text-center text-muted">{children}</p>
}
export function Field({
  label,
  multiline,
  ...props
}: ComponentProps<'input'> & { label: string; multiline?: false }): ReactNode
export function Field({
  label,
  multiline,
  ...props
}: ComponentProps<'textarea'> & { label: string; multiline: true }): ReactNode
export function Field({
  label,
  multiline = false,
  ...props
}: (ComponentProps<'input'> | ComponentProps<'textarea'>) & {
  label: string
  multiline?: boolean
}) {
  const id = useId()
  return (
    <div className="fieldset min-w-0 gap-1 p-0">
      <label className="label whitespace-normal text-xs" htmlFor={id}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          {...(props as ComponentProps<'textarea'>)}
          className={`textarea textarea-sm w-full ${props.className ?? ''}`}
        />
      ) : (
        <input
          id={id}
          {...(props as ComponentProps<'input'>)}
          className={`input input-sm w-full ${props.className ?? ''}`}
        />
      )}
    </div>
  )
}
export function Select({
  label,
  options,
  ...props
}: ComponentProps<'select'> & { label: string; options: [string, string][] }) {
  const id = useId()
  return (
    <div className="fieldset min-w-0 gap-1 p-0">
      <label className="label whitespace-normal text-xs" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="select select-sm w-full" {...props}>
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </div>
  )
}
export function Tabs({
  labels,
  value,
  onChange,
  compact = false,
}: {
  labels: string[]
  value: string
  onChange: (value: string) => void
  compact?: boolean
}) {
  return (
    <div
      role="tablist"
      aria-label="Sections"
      className={`tabs tabs-box ${compact ? 'tabs-sm min-w-0 flex-nowrap gap-0' : 'flex-wrap gap-2'}`}
    >
      {labels.map(label => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={value === label}
          className={`tab ${compact ? 'px-2' : ''} ${value === label ? 'tab-active' : ''}`}
          onClick={() => onChange(label)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
export function Code({ value }: { value: unknown }) {
  return (
    <pre className="overflow-auto whitespace-pre-wrap break-words font-mono text-xs">
      {typeof value === 'string' ? value : (JSON.stringify(value, null, 2) ?? 'Non enregistré')}
    </pre>
  )
}
export function Inspect({ label, value }: { label: string; value: unknown }) {
  return (
    <details className="collapse collapse-arrow bg-base-100">
      <summary className="collapse-title font-medium">{label}</summary>
      <div className="collapse-content">
        <Code value={value} />
      </div>
    </details>
  )
}
export function Preview({
  title,
  src,
  onClose,
}: {
  title: string
  src: string
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const id = useId()
  useEffect(() => {
    ref.current?.showModal()
  }, [])
  return (
    <dialog ref={ref} className="modal" aria-labelledby={id} onClose={onClose}>
      <div className="modal-box max-w-5xl">
        <h2 id={id} className="font-semibold">
          {title}
        </h2>
        <img className="max-h-dvh w-full object-contain" src={src} alt={title} />
        <form method="dialog" className="modal-action">
          <Button type="submit">Fermer</Button>
        </form>
      </div>
    </dialog>
  )
}

export function Choice({
  label,
  variant = 'checkbox',
  ...props
}: Omit<ComponentProps<'input'>, 'type' | 'className'> & {
  label: string
  variant?: 'checkbox' | 'toggle'
}) {
  return (
    <label className="label gap-2 whitespace-normal">
      <input
        {...props}
        type="checkbox"
        className={
          variant === 'toggle'
            ? 'toggle toggle-primary toggle-sm shrink-0'
            : 'checkbox checkbox-primary checkbox-sm shrink-0'
        }
      />
      {label}
    </label>
  )
}
