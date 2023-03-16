import Link from "next/link";
import cookie from "js-cookie";
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function LanguajeDropdown() {
  const { t } = useTranslation("common");
  const router = useRouter();
  let timeoutControler;

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
    setValues((state) => ({
      ...state,
      isMenuOpen: !state.isMenuOpen,
    }));
  };

  const handleMouseLeave = () => {
    timeoutControler = setTimeout(() => {
      setValues((state) => ({
        ...state,
        isMenuOpen: false,
      }));
    }, 1000);
  };
  const handleMouseEnter = () => {
    timeoutControler && clearTimeout(timeoutControler);
  };

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
             ${values.isMenuOpen && "shadow-complete-box"}
             hover:shadow-complete-box
             flex
             items-center
            `}
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
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
          {t(router.locale)}
          <FontAwesomeIcon
            icon={!values.isMenuOpen ? faChevronDown : faChevronUp}
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
              ${!values.isMenuOpen && "hidden"}
              shadow-complete-box
              ${!values.isMenuOpen && "hidden"}
              my-2
              bg-clip-padding
              border-none
            `}
        >
          {router &&
            router.locales &&
            router.locales.map(function (locale, index) {
              if (locale === router.locale) return null;
              return (
                <li
                  key={index}
                  className="dropdown-item hover:bg-blue-100 px-4 py-1"
                >
                  <Link
                    className="
                      py-2
                      px-4
                      block
                      w-full
                    "
                    href={router.asPath}
                    locale={locale}
                    passHref
                    onClick={() => setLocale(locale)}
                  >
                    <a className="flex items-center">
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
}
