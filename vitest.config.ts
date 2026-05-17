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
        // Calibrated initial state (no tests yet). Will be raised as tests land.
        // Target state documented in docs/TEST_METRICS.md.
        lines: 0,
        branches: 0,
        functions: 0,
        statements: 0,
      },
    },
  },
});
