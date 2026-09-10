import type { ReactNode } from 'react'
import { Section } from './layout.tsx'
export function FilterBar({
  children,
  label = 'Filtres des scénarios',
  medium = false,
}: {
  children: ReactNode
  label?: string
  medium?: boolean
}) {
  return (
    <Section label={label}>
      <div
        className={`grid content-start items-end grid-cols-1 gap-3 ${medium ? 'md:grid-flow-col md:auto-cols-fr md:grid-cols-none' : 'lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none'}`}
      >
        {children}
      </div>
    </Section>
  )
}
