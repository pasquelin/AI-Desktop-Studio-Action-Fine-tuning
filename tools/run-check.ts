/** Shared exit contract for the repository gates: messages on stderr, exit code 1. */
export async function runCheck(
  inspect: () => string[] | Promise<string[]>,
  success: string | (() => string),
  failure: string,
): Promise<void> {
  try {
    const errors = await inspect();
    if (errors.length > 0) {
      console.error(errors.join("\n"));
      process.exitCode = 1;
    } else {
      console.log(typeof success === "string" ? success : success());
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : failure);
    process.exitCode = 1;
  }
}
