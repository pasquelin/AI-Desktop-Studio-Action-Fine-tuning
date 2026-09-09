export interface Operations {
  clone(): Promise<void>
  start(): Promise<void>
  execute(): Promise<void>
  stop(): Promise<void>
  remove(): Promise<void>
}
export async function cycle(operations: Operations, keep: boolean): Promise<void> {
  await operations.clone()
  try {
    await operations.start()
    await operations.execute()
  } finally {
    await operations.stop()
  }
  if (!keep) await operations.remove()
}
