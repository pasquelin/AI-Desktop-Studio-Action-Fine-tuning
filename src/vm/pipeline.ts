export interface Pipeline {
  preflight?(): Promise<void>
  findReference(): Promise<string | undefined>
  prepare(): Promise<void>
  build(reference: string): Promise<void>
}
export async function runPipeline(steps: Pipeline): Promise<void> {
  await steps.preflight?.()
  let reference = await steps.findReference()
  if (!reference) {
    await steps.prepare()
    reference = await steps.findReference()
  }
  if (!reference) throw new Error('Preparation did not produce a ready reference')
  await steps.build(reference)
}
