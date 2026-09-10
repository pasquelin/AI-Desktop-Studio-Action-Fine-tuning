/**
 * One definition of how Studio is started in the VM. The build script opens it and the session
 * reset reopens it after archiving the profile, then asserts the argv the other one produced:
 * with two copies, adding an Electron flag means editing three places and noticing the third
 * only when the assertion fails inside the guest.
 */
export const DEBUG_PORT = 9333
export const DEBUG_ORIGIN = `http://127.0.0.1:${DEBUG_PORT}`
export function electronArgv(profile: string): string[] {
  return [
    'node_modules/electron/cli.js',
    '.',
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${DEBUG_PORT}`,
  ]
}
/** `bash` reads the argv one line per entry; a path holding a space survives the round trip. */
if (process.argv[2] === '--argv') console.log(electronArgv(process.argv[3] ?? '').join('\n'))
