const text = { type: 'string', minLength: 1 }

/** Shared JSON contract for server validation and the scenario editor. */
export const declarativeScenarioSchema = {
  type: 'object',
  required: ['id', 'request', 'requires', 'steps', 'blockers', 'trainingApproved'],
  additionalProperties: false,
  properties: {
    schemaVersion: { const: 1 },
    version: { const: 1 },
    id: text,
    request: text,
    requires: { type: 'array', items: text },
    requiredBindings: { type: 'array', uniqueItems: true, items: text },
    blockers: { type: 'array', items: text },
    trainingApproved: { const: false },
    steps: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'action', 'input', 'assertions'],
        properties: {
          id: text,
          action: text,
          input: { type: 'object' },
          saveAs: text,
          expectRefusal: {
            type: 'object',
            required: ['includes'],
            additionalProperties: false,
            properties: { includes: text },
          },
          assertions: {
            type: 'array',
            items: {
              type: 'object',
              required: ['actual', 'op'],
              additionalProperties: false,
              properties: {
                actual: {},
                saveAs: text,
                op: {
                  enum: ['equal', 'notEqual', 'exists', 'length', 'includes'],
                },
                expected: {},
              },
            },
          },
        },
      },
    },
  },
}
