import { Link } from './primitives.tsx'

export function RunScenario({ id, enabled }: { id: string; enabled: boolean }) {
  return (
    <Link
      primary
      href={`#qa?scenario=${encodeURIComponent(id)}`}
      title={
        enabled
          ? 'Choisir le modèle local avant le lancement'
          : 'Consulter les prérequis avant le lancement'
      }
    >
      Tester dans Debug / QA
    </Link>
  )
}
