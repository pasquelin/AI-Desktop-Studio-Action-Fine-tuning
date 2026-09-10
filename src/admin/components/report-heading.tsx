import type { ReactNode } from 'react'
import { PageHeading } from './layout.tsx'
import { Link } from './primitives.tsx'

export function ReportHeading({
  title,
  mode,
  children,
}: {
  title: string
  mode: 'training' | 'debug' | 'vm'
  children?: ReactNode
}) {
  return (
    <PageHeading title={title}>
      {(
        [
          ['training', 'Entraînement', '#reports?mode=training'],
          ['debug', 'Campagnes Debug / QA', '#reports?mode=debug'],
          ['vm', 'Archives VM', '#reports'],
        ] as const
      ).map(([id, label, href]) => (
        <Link key={id} primary href={href} aria-current={mode === id ? 'page' : undefined}>
          {label}
        </Link>
      ))}
      {children}
    </PageHeading>
  )
}
