import { timingSafeEqual } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import i18nConfig from "../../next-i18next.config";

/**
 * Revalidación bajo demanda de las páginas estáticas (ISR).
 *
 * Uso, después de actualizar los datos del backend (pipeline o simulación inicial):
 *   curl -X POST "https://<frontend>/api/revalidate?secret=$REVALIDATE_TOKEN"
 *
 * Sin esto las páginas se refrescan solas cada hora (revalidate: 3600).
 * Antes era una plantilla sin terminar: revalidaba "/path-to-revalidate"
 * (ruta inexistente) y, sin REVALIDATE_TOKEN, aceptaba peticiones sin secreto.
 */

const ROUTES = ["/", "/Simulador"];
const { defaultLocale, locales } = i18nConfig.i18n;

/** Rutas reales a revalidar: el idioma por defecto va sin prefijo. */
export const PAGES_TO_REVALIDATE: string[] = locales.flatMap((locale: string) =>
  ROUTES.map((route) =>
    locale === defaultLocale
      ? route
      : `/${locale}${route === "/" ? "" : route}`,
  ),
);

function sameSecret(given: unknown, expected: string): boolean {
  if (typeof given !== "string") return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = process.env.REVALIDATE_TOKEN;
  if (!token) {
    return res
      .status(503)
      .json({ message: "Revalidation is not configured (REVALIDATE_TOKEN)" });
  }
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Use POST" });
  }
  if (!sameSecret(req.query.secret, token)) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Se intentan todas aunque alguna falle; Next.js sigue sirviendo la última
  // versión generada con éxito de las que no se pudieron regenerar.
  const results = await Promise.allSettled(
    PAGES_TO_REVALIDATE.map((p) => res.revalidate(p)),
  );
  const failed = PAGES_TO_REVALIDATE.filter(
    (_, i) => results[i]?.status === "rejected",
  );
  if (failed.length > 0) {
    return res.status(500).json({ revalidated: false, failed });
  }
  return res.json({ revalidated: true, paths: PAGES_TO_REVALIDATE });
}
