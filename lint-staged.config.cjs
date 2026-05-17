// Note: Next 16 removed the `next lint` command, so we invoke ESLint directly
// (still configured via the Next preset in eslint-config-next).
module.exports = {
  '*.{ts,tsx,js,jsx}': ['eslint --fix --max-warnings=0', () => 'vitest related --run'],
  '*.{ts,tsx,js,jsx,md,json}': ['prettier --write'],
};
