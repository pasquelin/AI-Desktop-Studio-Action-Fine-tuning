const rows = ['first', 'second', 'third', 'fourth', 'fifth']
export function LoadingSkeleton({
  label = 'Chargement…',
  variant = 'overview',
}: {
  label?: string
  variant?: 'overview' | 'list' | 'detail' | 'logs' | 'preview'
}) {
  if (variant === 'preview')
    return (
      <div role="status" aria-label={label} className="flex h-full min-h-0">
        <span className="sr-only">{label}</span>
        <div aria-hidden="true" className="skeleton min-h-32 w-full flex-1" />
      </div>
    )
  return (
    <div role="status" aria-label={label} className="flex min-h-0 flex-col gap-4">
      <span className="sr-only">{label}</span>
      {variant === 'overview' && (
        <div aria-hidden="true" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {['cases', 'journeys', 'ready', 'active'].map(id => (
            <div key={id} className="card bg-base-100">
              <div className="card-body gap-3 p-4">
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-8 w-1/3" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}
      <div aria-hidden="true" className="flex flex-col gap-4">
        {variant !== 'logs' && <div className="skeleton h-5 w-1/3" />}
        {rows.map(id => (
          <div key={id} className="flex flex-col gap-2">
            <div
              className={`skeleton w-full ${variant === 'detail' ? 'h-16' : variant === 'logs' ? 'h-3' : 'h-8'}`}
            />
            {variant === 'list' && <div className="skeleton h-3 w-2/3" />}
          </div>
        ))}
      </div>
    </div>
  )
}
