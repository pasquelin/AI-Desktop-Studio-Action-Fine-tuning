import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  approvedContentHash,
  prepareApprovedExport,
  publishApprovedExport,
  verifyRecordedConversation,
} from '../src/scenarios/export-approved.ts'
import { splitFor } from '../src/scenarios/split.ts'

const hash = 'a'.repeat(64)
const context = {
  studioRevision: 'revision-1',
  catalogueHash: hash,
  scenarioHashes: { cube: hash },
}
function fixture() {
  const example = {
    id: 'synthetic-only',
    scenarioId: 'cube',
    scenarioHash: hash,
    group: 'node.add',
    relatedGroups: [],
    messages: [
      { role: 'user', content: 'Ajoute un cube.' },
      {
        role: 'assistant',
        content: null,
        tool_calls: [
          {
            id: 'call1',
            type: 'function',
            function: { name: 'node_add', arguments: '{"kind":"box"}' },
          },
        ],
      },
      { role: 'tool', content: '{"ok":true}', tool_call_id: 'call1' },
      { role: 'assistant', content: 'Le cube est ajouté.' },
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'node_add',
          description: 'Adds a node',
          parameters: {
            type: 'object',
            properties: { kind: { const: 'box' } },
            required: ['kind'],
            additionalProperties: false,
          },
        },
      },
    ],
    review: {
      decision: 'approved',
      kind: 'semantic-review',
      reviewer: 'synthetic-test-reviewer',
      contentHash: '',
    },
    evidence: {
      kind: 'real-vm',
      status: 'passed',
      runId: 'synthetic-test-run',
      scenarioId: 'cube',
      scenarioHash: hash,
      contentHash: '',
      studioRevision: 'revision-1',
      catalogueHash: hash,
      checks: [{ name: 'cube-exists', passed: true }],
    },
  }
  const digest = approvedContentHash(example)
  example.review.contentHash = digest
  example.evidence.contentHash = digest
  return { seed: 'test-seed', examples: [example] as [typeof example] }
}

describe('approved export (synthetic evidence only)', () => {
  it('exports reviewed exact-content evidence into its stable partition', () => {
    const result = prepareApprovedExport(fixture(), context)
    expect(result.rows[splitFor('node.add', 'test-seed')]).toHaveLength(1)
  })
  it.each(['failed', 'incomplete'])('rejects a %s execution', status => {
    const bundle = fixture()
    bundle.examples[0].evidence.status = status
    expect(() => prepareApprovedExport(bundle, context)).toThrow('Invalid or unreviewed')
  })
  it('rejects machine-only review and empty checks', () => {
    const bundle = fixture()
    bundle.examples[0].review.kind = 'machine-review-only'
    expect(() => prepareApprovedExport(bundle, context)).toThrow()
    const empty = fixture()
    empty.examples[0].evidence.checks = []
    expect(() => prepareApprovedExport(empty, context)).toThrow()
  })
  it('rejects changed content, Studio, catalogue and scenario hashes', () => {
    const bundle = fixture()
    const first = bundle.examples[0].messages[0]
    if (!first) throw new Error('Missing fixture message')
    first.content = 'Change'
    expect(() => prepareApprovedExport(bundle, context)).toThrow('Stale content')
    expect(() => prepareApprovedExport(fixture(), { ...context, studioRevision: 'new' })).toThrow(
      'Stale Studio',
    )
    expect(() =>
      prepareApprovedExport(fixture(), {
        ...context,
        catalogueHash: 'b'.repeat(64),
      }),
    ).toThrow('Stale Studio')
    expect(() =>
      prepareApprovedExport(fixture(), {
        ...context,
        scenarioHashes: { cube: 'b'.repeat(64) },
      }),
    ).toThrow('Stale scenario')
  })
  it('rejects a requested partition that conflicts with its semantic family', () => {
    const bundle = fixture()
    const split = splitFor('node.add', bundle.seed) === 'train' ? 'test' : 'train'
    expect(() =>
      prepareApprovedExport({ ...bundle, examples: [{ ...bundle.examples[0], split }] }, context),
    ).toThrow('Split conflicts')
  })
  it('rejects identical conversations assigned to different semantic groups', () => {
    const bundle = fixture()
    const second = structuredClone(bundle.examples[0])
    second.id = 'another'
    second.group = 'other-group'
    second.review.contentHash = approvedContentHash(second)
    second.evidence.contentHash = second.review.contentHash
    expect(() =>
      prepareApprovedExport({ ...bundle, examples: [...bundle.examples, second] }, context),
    ).toThrow('Duplicate content')
  })
  it('requires a real saved conversation link, not copied evidence fields', () => {
    const example = fixture().examples[0]
    const report = {
      status: 'passed',
      steps: [{ status: 'passed' }],
      provenance: { ...example.evidence },
    }
    expect(() => verifyRecordedConversation(example, report)).toThrow('no evidence linked')
    const linked = {
      ...report,
      conversationEvidence: [
        {
          contentHash: example.evidence.contentHash,
          scenarioId: example.scenarioId,
          scenarioHash: example.scenarioHash,
          checks: example.evidence.checks,
        },
      ],
    }
    expect(() => verifyRecordedConversation(example, linked)).not.toThrow()
    expect(() => verifyRecordedConversation(example, { ...linked, status: 'failed' })).toThrow(
      'did not pass',
    )
    expect(() =>
      verifyRecordedConversation(example, {
        ...linked,
        provenance: { ...linked.provenance, catalogueHash: 'wrong' },
      }),
    ).toThrow('provenance mismatch')
  })
  it('publishes all files together and leaves no directory after rejection', async () => {
    const parent = await mkdtemp(join(tmpdir(), 'approved-test-'))
    try {
      const bad = fixture()
      bad.examples[0].evidence.status = 'failed'
      expect(() => prepareApprovedExport(bad, context)).toThrow()
      expect(await readdir(parent)).toEqual([])
      const destination = await publishApprovedExport(
        prepareApprovedExport(fixture(), context),
        parent,
      )
      expect((await readdir(destination)).sort()).toEqual([
        'manifest.json',
        'test.jsonl',
        'train.jsonl',
        'valid.jsonl',
      ])
      expect(
        JSON.parse(await readFile(join(destination, 'manifest.json'), 'utf8')).provenance,
      ).toHaveLength(1)
      expect((await readdir(parent)).some(name => name.startsWith('.approved-'))).toBe(false)
    } finally {
      await rm(parent, { recursive: true, force: true })
    }
  })
})
