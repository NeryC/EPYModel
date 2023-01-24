import { useRouter } from "next/router";
import { es, en, pr } from "../utils/constants";

export default function useD3Locale() {
  const router = useRouter();
  switch (router.locale) {
    case "es":
      return es;
    case "en":
      return en;
    case "pr":
      return pr;

    default:
      break;
  }
}
