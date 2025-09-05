/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  //@ts-ignore
  plugins:[ angular(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test.setup.ts'],
    globals: true,
    include: ['src/**/*.spec.ts'],
    testTimeout: 30000,
    reporters: [
      ['html', { outputFile: 'reports/tests/results.html' }],
      ['default', { summary: false }]
    ],
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'src/test.setup.ts'],
      reportsDirectory: 'reports/coverage'
    }
  }
});