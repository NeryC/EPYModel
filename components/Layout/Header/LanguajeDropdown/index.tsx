import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import cookie from "js-cookie";

/**
 * LanguageDropdown component for switching between available locales
 * Supports mouse hover interactions with automatic close on mouse leave
 */
const LanguageDropdown: React.FC = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const timeoutControllerRef = useRef<NodeJS.Timeout | null>(null);

  const openMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const setLocale = (locale: string): void => {
    cookie.set("NEXT_LOCALE", locale);
    setIsMenuOpen(false);
  };

  const handleMouseLeave = (): void => {
    timeoutControllerRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 1000);
  };

  const handleMouseEnter = (): void => {
    if (timeoutControllerRef.current) {
      clearTimeout(timeoutControllerRef.current);
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutControllerRef.current) {
        clearTimeout(timeoutControllerRef.current);
      }
    };
  }, []);

  return (
    <div
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onKeyDown={handleKeyDown}
      className="flex justify-center text-xs font-medium"
    >
      <div className="dropdown relative">
        <button
          className={`
             dropdown-toggle
             px-3
             py-3
             min-h-[44px]
             rounded-lg
             ${isMenuOpen && "shadow-complete-box"}
             hover:shadow-complete-box
             flex
             items-center
            `}
          type="button"
          id="language-menu-button"
          aria-haspopup="listbox"
          aria-expanded={isMenuOpen}
          aria-label={`Idioma: ${router.locale ? t(router.locale) : ""}`}
          onClick={openMenu}
        >
          <svg
            aria-hidden="true"
            className="mr-2 shrink-0"
            width="15"
            height="15"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.99167 1.66669C5.39167 1.66669 1.66667 5.40002 1.66667 10C1.66667 14.6 5.39167 18.3334 9.99167 18.3334C14.6 18.3334 18.3333 14.6 18.3333 10C18.3333 5.40002 14.6 1.66669 9.99167 1.66669ZM15.7667 6.66669H13.3083C13.0417 5.62502 12.6583 4.62502 12.1583 3.70002C13.6917 4.22502 14.9667 5.29169 15.7667 6.66669ZM10 3.36669C10.6917 4.36669 11.2333 5.47502 11.5917 6.66669H8.40834C8.76667 5.47502 9.30834 4.36669 10 3.36669ZM3.55001 11.6667C3.41667 11.1334 3.33334 10.575 3.33334 10C3.33334 9.42502 3.41667 8.86669 3.55001 8.33335H6.36667C6.3 8.88335 6.25 9.43335 6.25 10C6.25 10.5667 6.3 11.1167 6.36667 11.6667H3.55001ZM4.23334 13.3334H6.69167C6.95834 14.375 7.34167 15.375 7.84167 16.3C6.30834 15.775 5.03334 14.7167 4.23334 13.3334ZM6.69167 6.66669H4.23334C5.03334 5.28335 6.30834 4.22502 7.84167 3.70002C7.34167 4.62502 6.95834 5.62502 6.69167 6.66669ZM10 16.6334C9.30834 15.6334 8.76667 14.525 8.40834 13.3334H11.5917C11.2333 14.525 10.6917 15.6334 10 16.6334ZM11.95 11.6667H8.05C7.975 11.1167 7.91667 10.5667 7.91667 10C7.91667 9.43335 7.975 8.87502 8.05 8.33335H11.95C12.025 8.87502 12.0833 9.43335 12.0833 10C12.0833 10.5667 12.025 11.1167 11.95 11.6667ZM12.1583 16.3C12.6583 15.375 13.0417 14.375 13.3083 13.3334H15.7667C14.9667 14.7084 13.6917 15.775 12.1583 16.3ZM13.6333 11.6667C13.7 11.1167 13.75 10.5667 13.75 10C13.75 9.43335 13.7 8.88335 13.6333 8.33335H16.45C16.5833 8.86669 16.6667 9.42502 16.6667 10C16.6667 10.575 16.5833 11.1334 16.45 11.6667H13.6333Z" fill="#364057"/>
          </svg>
          <span className="leading-none">{router.locale && t(router.locale)}</span>
          <FontAwesomeIcon
            icon={!isMenuOpen ? faChevronDown : faChevronUp}
            className="ml-2"
            aria-hidden="true"
          />
        </button>
        <ul
          role="listbox"
          aria-labelledby="language-menu-button"
          className={`
              w-full
              dropdown-menu
              absolute
              bg-white
              z-50
              py-2
              list-none
              text-left
              rounded-lg
              shadow-lg
              mt-1
              ${!isMenuOpen && "hidden"}
              shadow-complete-box
              my-2
              bg-clip-padding
              border-none
            `}
        >
          {router &&
            router.locales &&
            router.locales.map((locale: string, index: number) => {
              if (locale === router.locale) return null;
              return (
                <li
                  key={index}
                  role="option"
                  aria-selected={false}
                  className="dropdown-item hover:bg-blue-100 px-4 py-1"
                >
                  <Link
                    href={router.asPath}
                    locale={locale}
                    className="py-2 px-4 block w-full flex items-center"
                    onClick={() => setLocale(locale)}
                  >
                    {t(locale)}
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default LanguageDropdown;
