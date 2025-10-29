import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'test/*.spec.ts', 'test/*.test.ts'],
    testTimeout: 80000,
    globals: true,
    "setupFiles": [
      "./setupVitest.mjs"
    ],
  },
})
