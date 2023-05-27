import { useRouter } from "next/router";
import { es, en, pr } from "../utils/constants";

const useD3Locale = () => {
  const router = useRouter();
  const locale = router.locale;

  const localeMap = {
    es,
    en,
    pr,
  };

  return localeMap[locale] || es;
};

export default useD3Locale;
