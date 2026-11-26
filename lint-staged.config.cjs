// ESLint vuelve al pre-commit: el fallo "Converting circular structure to JSON"
// venía de cargar eslint-config-next 16 (ya flat config) con FlatCompat; ver
// eslint.config.mjs. Los errores bloquean el commit; las advertencias heredadas
// (reglas del React Compiler, `any`, etc.) no, para no frenar commits ajenos.
module.exports = {
  '*.{ts,tsx,js,jsx}': ['eslint --fix', () => 'vitest related --run'],
  '*.{ts,tsx,js,jsx,md,json}': ['prettier --write'],
};
