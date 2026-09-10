import { readdir } from 'node:fs/promises'

/** Test data is never passed as training data; every partition must be populated. */
export function assertApprovedSplits(rows: {
  train: unknown[]
  valid: unknown[]
  test: unknown[]
}) {
  for (const split of ['train', 'valid', 'test'] as const)
    if (!rows[split].length) throw new Error(`Missing approved ${split} examples`)
}

/** One definition of a usable local model: Ollama blobs carry neither of these. */
export async function assertLocalModel(model: string) {
  const files = await readdir(model)
  if (!files.includes('config.json') || !files.some(file => file.endsWith('.safetensors')))
    throw new Error('Modèle MLX local requis : configuration et poids safetensors')
}

export function loraConfig(
  rows: { train: unknown[]; valid: unknown[]; test: unknown[] },
  model: string,
  data: string,
  adapter: string,
) {
  assertApprovedSplits(rows)
  return {
    model,
    data,
    adapter_path: adapter,
    train: true,
    fine_tune_type: 'lora',
    num_layers: 4,
    batch_size: 1,
    iters: 100,
    learning_rate: 0.00001,
    max_seq_length: 2048,
    grad_checkpoint: true,
    mask_prompt: true,
    seed: 42,
    steps_per_report: 10,
    steps_per_eval: 25,
    val_batches: 1,
    save_every: 100,
    lora_parameters: { rank: 8, scale: 16, dropout: 0 },
  }
}
