import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Ajv } from 'ajv'
import standaloneCode from 'ajv/dist/standalone/index.js'
import { declarativeScenarioSchema } from '../src/scenarios/declarative-schema.ts'

/** Generate browser-safe validators: Ajv code generation runs only during the build. */
export async function buildAdminValidators(root: string) {
  const fields = declarativeScenarioSchema.properties.steps.items.properties
  const ajv = new Ajv({
    strict: false,
    allErrors: true,
    code: { source: true, esm: true },
  })
  ajv.addSchema(declarativeScenarioSchema, 'scenario')
  ajv.addSchema(fields.input, 'input')
  ajv.addSchema(fields.assertions, 'assertions')
  const code = standaloneCode
    .default(ajv, {
      scenario: 'scenario',
      input: 'input',
      assertions: 'assertions',
    })
    .replace('require("ajv/dist/runtime/ucs2length").default', 'ucs2length')
  // A build output, not a source: it is gitignored and excluded from the checks.
  await writeFile(
    join(root, 'src/admin/json-validators.js'),
    `import ucs2length from 'ajv/dist/runtime/ucs2length.js'\n${code}`,
  )
}
