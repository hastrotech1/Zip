import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    },
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});