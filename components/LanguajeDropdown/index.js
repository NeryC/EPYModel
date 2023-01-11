import Link from "next/link";
import cookie from "js-cookie";
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export default function LanguajeDropdown() {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [values, setValues] = useState({
    isMenuOpen: false,
  });

  const openMenu = () => {
    setValues((state) => ({
      ...state,
      isMenuOpen: !state.isMenuOpen,
    }));
  };

  const setLocale = (locale) => {
    cookie.set("NEXT_LOCALE", locale);
  };
  return (
    <div className="flex justify-center">
      <div>
        <div className="dropdown relative">
          <button
            className="
              dropdown-toggle
              px-4
              py-2.5
              bg-blue-600
              text-white
              font-medium
              text-xs
              leading-tight
              rounded
              shadow-md
              hover:bg-blue-700 hover:shadow-lg
              focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
              active:bg-blue-800 active:shadow-lg active:text-white
              transition
              duration-150
              ease-in-out
              flex
              items-center
              whitespace-nowrap
            "
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            onClick={openMenu}
          >
            {t(router.locale)}
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="caret-down"
              className="w-2 ml-2"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                fill="currentColor"
                d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
              ></path>
            </svg>
          </button>
          <ul
            className={`
              dropdown-menu
              min-w-max
              absolute
              bg-white
              text-base
              z-50
              float-left
              py-2
              px-4
              list-none
              text-left
              rounded-lg
              shadow-lg
              mt-1
              bg-blue-100
              hover:bg-blue-300
              ${!values.isMenuOpen && "hidden"}
              m-2
              bg-clip-padding
              border-none
            `}
            aria-labelledby="dropdownMenuButton1"
          >
            {router &&
              router.locales &&
              router.locales.map(function (locale, index) {
                if (locale === router.locale) return null;
                return (
                  <Link
                    className="
                      dropdown-item
                      text-sm
                      py-2
                      px-4
                      font-normal
                      block
                      w-full
                      whitespace-nowrap
                      bg-transparent
                      text-gray-700
                      hover:bg-gray-100
                    "
                    href={router.asPath}
                    key={index}
                    locale={locale}
                    passHref
                    onClick={() => setLocale(locale)}
                  >
                    {t(locale)}
                  </Link>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}
