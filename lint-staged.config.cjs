// Note: Next 16 removed the `next lint` command, so we would normally invoke
// ESLint directly. However, ESLint 9 + eslint-config-next 16 currently crashes
// via FlatCompat with a "Converting circular structure to JSON" error.
// See docs/TEST_METRICS.md "Known issues". Until upstream fixes land, ESLint is
// excluded from pre-commit. Re-enable by un-commenting the eslint entry once
// `yarn lint` runs cleanly.
module.exports = {
  '*.{ts,tsx,js,jsx}': [/* 'eslint --fix --max-warnings=0', */ () => 'vitest related --run'],
  '*.{ts,tsx,js,jsx,md,json}': ['prettier --write'],
};
