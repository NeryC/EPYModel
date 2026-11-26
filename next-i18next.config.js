const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
  },
  // Ruta ABSOLUTA en el servidor: en Vercel las páginas se regeneran (ISR)
  // dentro de una función serverless que solo incluye los archivos que el
  // build detecta como usados. Con path.resolve las traducciones se empaquetan;
  // sin esto la regeneración fallaba y la página quedaba con los datos del build.
  localePath:
    typeof window === "undefined"
      ? path.resolve("./public/locales")
      : "/locales",
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
