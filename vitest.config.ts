import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/setup/web-storage.ts'],
    testTimeout: 5000,
    allowOnly: false,
    passWithNoTests: false,
    clearMocks: true,
  },
})
