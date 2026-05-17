import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
      '@/components': path.resolve(__dirname, 'components'),
      '@/store': path.resolve(__dirname, 'store'),
      '@/services': path.resolve(__dirname, 'services'),
      '@/hooks': path.resolve(__dirname, 'hooks'),
      '@/utils': path.resolve(__dirname, 'utils'),
      '@/types': path.resolve(__dirname, 'types'),
      '@/config': path.resolve(__dirname, 'config'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: [
      '**/__tests__/**/*.{test,spec}.{ts,tsx}',
      '**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: [
      'node_modules/**',
      '.next/**',
      'tests/e2e/**',
      'tests/setup.ts',
    ],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: [
        'components/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        'store/**/*.{ts,tsx}',
        'services/**/*.{ts,tsx}',
        'utils/**/*.{ts,tsx}',
        'config/**/*.{ts,tsx}',
      ],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/__tests__/**',
        '**/index.ts',
        'types/**',
        'config/**',
      ],
      thresholds: {
        // Calibrated to measured initial coverage with ~5% growth headroom.
        // Per-layer aspirational targets documented in docs/TEST_METRICS.md.
        'store/reducers/**/*.ts': { lines: 76, branches: 72, functions: 80, statements: 76 },
        'hooks/**/*.{ts,tsx}': { lines: 75, branches: 71, functions: 40, statements: 75 },
        'utils/**/*.ts': { lines: 95, branches: 45, functions: 95, statements: 95 },
        'services/**/*.ts': { lines: 56, branches: 49, functions: 66, statements: 56 },
        'components/Loading/**/*.{ts,tsx}': { lines: 95, branches: 95, functions: 95, statements: 95 },
        'components/ErrorBoundary/**/*.{ts,tsx}': { lines: 77, branches: 68, functions: 95, statements: 77 },
        // Global floor — low because we have not tested pages/, _app, _document, etc.
        lines: 54,
        branches: 63,
        functions: 56,
        statements: 54,
      },
    },
  },
});
