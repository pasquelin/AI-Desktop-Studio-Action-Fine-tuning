/**
 * Node ≥26 defines a `localStorage` accessor on globalThis that stays undefined unless
 * `--localstorage-file` is given. Vitest's jsdom environment copies the window's own properties
 * onto globalThis and leaves that accessor standing, and because `window === globalThis` there,
 * the page code and its tests both read undefined.
 *
 * The replacement keeps its operations on the prototype, and is installed as `Storage` as well:
 * a test that makes storage fail does so through `Storage.prototype`, which must be the very
 * class the instance the page reads was built from.
 */
class MapStorage {
  private readonly entries = new Map<string, string>()
  get length(): number {
    return this.entries.size
  }
  key(index: number): string | null {
    return [...this.entries.keys()][index] ?? null
  }
  getItem(key: string): string | null {
    return this.entries.get(String(key)) ?? null
  }
  setItem(key: string, value: string): void {
    this.entries.set(String(key), String(value))
  }
  removeItem(key: string): void {
    this.entries.delete(String(key))
  }
  clear(): void {
    this.entries.clear()
  }
}

if (typeof document !== 'undefined') {
  const install = (name: string, value: unknown) =>
    Object.defineProperty(globalThis, name, { value, configurable: true, writable: true })
  install('Storage', MapStorage)
  install('localStorage', new MapStorage())
  install('sessionStorage', new MapStorage())
}
