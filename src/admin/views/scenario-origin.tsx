import { useCallback } from 'react'
import { api } from '../api.ts'
import { Link, Notice } from '../components/primitives.tsx'
import { useResource } from '../hooks/use-resource.ts'
import type { RunRepository } from '../run-repository.ts'
export function ScenarioOrigin({ id }: { id: string }) {
  const { data, error } = useResource(
    useCallback(
      (signal: AbortSignal) =>
        api<Awaited<ReturnType<RunRepository['detail']>>>(
          `/api/runs/${encodeURIComponent(id)}`,
          'GET',
          undefined,
          signal,
        ),
      [id],
    ),
  )
  return (
    <>
      <Notice>
        Tu modifies le scénario actuel. Le rapport d’origine et ses preuves restent inchangés.
      </Notice>
      {data?.sourceMatches === false && (
        <Notice>Le contenu actuel diffère de celui qui a été exécuté.</Notice>
      )}
      <Notice error>{error}</Notice>
      <Link href={`#reports?id=${encodeURIComponent(id)}`}>Retour au rapport d’origine</Link>
    </>
  )
}
