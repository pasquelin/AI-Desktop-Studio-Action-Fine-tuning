import { mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { build, normalizePath } from "vite";

export async function loadSnapshot(root: string): Promise<unknown> {
  const temp = realpathSync(mkdtempSync(join(tmpdir(), "studio-catalogue-")));
  root = realpathSync(root);
  try {
    const entry = join(temp, "snapshot.ts");
    const shared = resolve(root, "src/shared");
    writeFileSync(
      entry,
      `
import { ACTION_FAMILIES, ACTION_REGISTRY } from ${JSON.stringify(join(shared, "domain/assistant.ts"))};
import { schemaOfFields, mcpTools } from ${JSON.stringify(resolve(root, "src/main/mcp/tools.ts"))};
import { TRANSLATIONS, textAt } from ${JSON.stringify(join(shared, "i18n/index.ts"))};
const languages = Object.keys(TRANSLATIONS);
const actions = ACTION_FAMILIES.flatMap(family => family.actions.map(action => ({
  ...action,
  family: family.name,
  inputSchema: schemaOfFields(action.fields),
  translations: Object.fromEntries(languages.map(language => [language, {
    title: textAt(TRANSLATIONS[language], action.titleKey),
    description: textAt(TRANSLATIONS[language], action.descriptionKey),
    fields: Object.fromEntries(action.fields.map(field => [field.key, textAt(TRANSLATIONS[language], field.labelKey)])),
  }])),
})));
export default JSON.stringify({
  language: 'en', languages,
  families: ACTION_FAMILIES.map(family => ({name: family.name, actions: family.actions.map(action => action.name)})),
  registryNames: ACTION_REGISTRY.map(action => action.name), actions, mcpTools: mcpTools(),
}, (_key, value) => typeof value === 'function' ? {runtimeFunction: true} : value);
`,
    );
    const result = await build({
      configFile: false,
      root: temp,
      envDir: temp,
      publicDir: false,
      logLevel: "silent",
      resolve: { alias: { "@shared": shared } },
      build: {
        write: false,
        minify: false,
        target: "esnext",
        lib: { entry, name: "StudioCatalogue", formats: ["iife"] },
      },
      plugins: [
        {
          name: "restrict-catalogue-imports",
          moduleParsed(info) {
            if (
              info.id !== normalizePath(entry) &&
              !info.id.startsWith(`${normalizePath(shared)}/`) &&
              info.id !== normalizePath(resolve(root, "src/main/mcp/tools.ts"))
            ) {
              throw new Error(`Unexpected catalogue dependency: ${info.id}`);
            }
          },
        },
      ],
    });
    const outputs = Array.isArray(result) ? result : [result];
    const output = outputs[0];
    if (outputs.length !== 1 || !output || !("output" in output))
      throw new Error("Unexpected build result.");
    const chunk = output.output[0];
    if (
      output.output.length !== 1 ||
      chunk?.type !== "chunk" ||
      chunk.imports.length > 0
    )
      throw new Error("Catalogue must be self-contained.");
    // Only the reviewed registry modules run; no application entry, Node globals or server.
    const serialized: unknown = runInNewContext(
      `${chunk.code}\nStudioCatalogue`,
      Object.create(null),
      {
        timeout: 10000,
        contextCodeGeneration: { strings: false, wasm: false },
      },
    );
    if (typeof serialized !== "string")
      throw new Error("Unexpected catalogue payload.");
    return JSON.parse(serialized);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}
