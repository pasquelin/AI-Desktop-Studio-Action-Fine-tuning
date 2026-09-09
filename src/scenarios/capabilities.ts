export const BENCH_REQUIREMENTS = [
  'isolated-vm',
  'guest-git-identity',
  'local-media-fixtures',
] as const

/** One definition of a playable journey, shared by the checker, the launcher and the engine. */
export function benchReadiness(
  plan: {
    requires: string[]
    requiredBindings?: string[]
    blockers: string[]
  },
  available: readonly string[] = BENCH_REQUIREMENTS,
) {
  const missing = plan.requires.filter(item => !available.includes(item))
  const unbound = plan.requiredBindings ?? []
  return {
    ready: !missing.length && !unbound.length && !plan.blockers.length,
    missing,
    unbound,
    blockers: plan.blockers,
  }
}
