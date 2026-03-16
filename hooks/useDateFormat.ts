import { useTranslation } from "next-i18next";
import { es, en } from "./localFormats";

export function useDateFormat() {
  const { t, i18n } = useTranslation("common");

  const formatDate = (dateString: string): string => {
    // Parse the date manually to avoid timezone issues
    // Expected format: "YYYY-MM-DD"
    const [year, month, day] = dateString.split("-").map(Number);

    // Get the month name from localFormats based on current language
    const monthNames = i18n.language === "es" ? es.months : en.months;
    const monthName = monthNames[month - 1];

    // Use i18n interpolation for date formatting
    return t("date-format", {
      day,
      month: monthName,
      year,
    });
  };

  return { formatDate };
}
