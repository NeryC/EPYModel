import { useRouter } from "next/router";
import { es, en, pt, LocaleFormat } from "./localFormats";

// Define supported locales as a const assertion for better type safety
const SUPPORTED_LOCALES = ["es", "en", "pt"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

// Create a more efficient locale mapping using a Map-like object
const LOCALE_MAP: Record<SupportedLocale, LocaleFormat> = {
  es,
  en,
  pt,
} as const;

function useD3Locale(): LocaleFormat {
  const router = useRouter();
  const locale = router.locale as SupportedLocale;

  // Use nullish coalescing for better fallback handling
  return LOCALE_MAP[locale] ?? es;
}

export default useD3Locale;
