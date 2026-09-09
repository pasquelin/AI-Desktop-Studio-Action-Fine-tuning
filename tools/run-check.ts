/** Shared exit contract for the repository gates: messages on stderr, exit code 1. */
export function runCheck(
  inspect: () => string[],
  success: string,
  failure: string,
): void {
  try {
    const errors = inspect();
    if (errors.length > 0) {
      console.error(errors.join("\n"));
      process.exitCode = 1;
    } else {
      console.log(success);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : failure);
    process.exitCode = 1;
  }
}
