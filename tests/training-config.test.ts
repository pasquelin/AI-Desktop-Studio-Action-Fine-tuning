import { expect, it } from 'vitest'
import { loraConfig } from '../src/training/config.ts'

it('refuses missing approved partitions before configuring training', () => {
  for (const split of ['train', 'valid', 'test'] as const) {
    const rows = { train: [{}], valid: [{}], test: [{}] }
    rows[split] = []
    expect(() => loraConfig(rows, '/model', '/data', '/adapter')).toThrow(
      `Missing approved ${split}`,
    )
  }
})
