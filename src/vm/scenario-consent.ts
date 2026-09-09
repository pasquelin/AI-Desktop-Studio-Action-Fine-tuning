/** Only the fixed disposable-project reference scenario may automatically repeat a call. */
const actions = new Set([
  "project.create",
  "project.open",
  "project.close",
  "project.rename",
  "project.forget",
  "project.trash",
  "workspace.open",
  "document.open",
  "document.save",
  "node.add",
  "node.rename",
  "node.transform",
]);
export function scenarioConsent(
  action: string,
  result: unknown,
): string | undefined {
  if (
    !actions.has(action) ||
    !result ||
    typeof result !== "object" ||
    !("isError" in result) ||
    result.isError !== true ||
    !("content" in result) ||
    !Array.isArray(result.content)
  )
    return undefined;
  const text = result.content
    .filter(
      (item: unknown): item is { type: string; text: string } =>
        !!item &&
        typeof item === "object" &&
        "type" in item &&
        item.type === "text" &&
        "text" in item &&
        typeof item.text === "string",
    )
    .map((item) => item.text)
    .join("\n");
  if (!text.startsWith("Nothing engaged: that call needs a consent token."))
    return undefined;
  return /its consent parameter set to ([a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12})\./.exec(
    text,
  )?.[1];
}
