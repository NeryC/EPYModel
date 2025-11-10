import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
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
      className="flex justify-center text-xs font-medium"
    >
      <div className="dropdown relative">
        <button
          className={`
             dropdown-toggle
             px-3
             py-2
             rounded-lg
             ${isMenuOpen && "shadow-complete-box"}
             hover:shadow-complete-box
             flex
             items-center
            `}
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded={isMenuOpen}
          onClick={openMenu}
        >
          <div className="mr-2 flex">
            <Image
              src="/assets/icons/language.svg"
              height={15}
              width={15}
              alt="Language"
            />
          </div>
          {router.locale && t(router.locale)}
          <FontAwesomeIcon
            icon={!isMenuOpen ? faChevronDown : faChevronUp}
            className="ml-2"
          />
        </button>
        <ul
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
              hover:bg-blue-300
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
                  className="dropdown-item hover:bg-blue-100 px-4 py-1"
                >
                  <Link
                    href={router.asPath}
                    locale={locale}
                  >
                    <a
                      className="py-2 px-4 block w-full flex items-center"
                      onClick={() => setLocale(locale)}
                    >
                      <div className="mr-2 flex">
                        <Image
                          src={`/assets/icons/${locale}.svg`}
                          height={20}
                          width={20}
                          alt="Language"
                        />
                      </div>
                      {t(locale)}
                    </a>
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

