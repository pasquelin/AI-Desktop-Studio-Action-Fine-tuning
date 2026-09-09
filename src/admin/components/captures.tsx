import { useState } from 'react'
import type { Snapshot } from '../../vm/snapshots.ts'
import { date } from '../api.ts'
import { Empty, Preview } from './primitives.tsx'
export const snapshotUrl = (item: Snapshot) =>
  `/snapshot?run=${encodeURIComponent(item.run)}&file=${encodeURIComponent(item.file)}`
export function Captures({ items }: { items: Snapshot[] }) {
  const [selected, setSelected] = useState<Snapshot | null>(null)
  return (
    <>
      {!items.length && (
        <Empty>
          Captures indisponibles. Seule la dernière session conserve ses images ; les rapports
          précédents restent consultables.
        </Empty>
      )}
      <ul className="menu w-full gap-2 p-0">
        {items.map(item => (
          <li key={`${item.run}/${item.file}`}>
            <button type="button" onClick={() => setSelected(item)}>
              <img
                src={snapshotUrl(item)}
                alt=""
                loading="lazy"
                className="h-16 w-24 shrink-0 object-contain"
              />
              <span>
                <span className="block">{date(item.capturedAt)}</span>
                <span className="text-xs">{item.activity}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <Preview
          title={`${date(selected.capturedAt)} · ${selected.activity}`}
          src={snapshotUrl(selected)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
