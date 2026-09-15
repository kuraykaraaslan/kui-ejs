import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    // Route smoke tests boot the whole app once per file; give them room.
    testTimeout: 15000,
  },
});
