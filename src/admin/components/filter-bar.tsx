import type { ReactNode } from 'react'
export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <section aria-label="Filtres des scénarios" className="card shrink-0 bg-base-200">
      <div className="card-body flex-none p-0 lg:p-3">
        <div className="grid content-start grid-cols-1 gap-2 lg:grid-cols-4 lg:gap-3">
          {children}
        </div>
      </div>
    </section>
  )
}
