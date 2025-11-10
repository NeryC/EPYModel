import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LanguajeDropdown from './LanguajeDropdown';

/**
 * Header component that displays the application logo, navigation links, and language selector
 */
const Header: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const getClass = (actualRoute: string): string => {
    return actualRoute === router.route
      ? 'text-blue-700 hidden sm:block'
      : 'hover:text-blue-700';
  };

  return (
    <div className="relative bg-white border-b-2 border-b-gray-theme drop-shadow-md">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-2">
          <div className="relative flex justify-start md:flex-0">
            <div className="relative h-9 w-16">
              <Image
                src="/logo.png"
                alt="Picture of something nice"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          <div className="flex w-auto items-center justify-between gap-8 font-bold">
            <Link href="/" className={getClass('/')}>
              {t('home')}
            </Link>
            <Link href="/Simulador" className={getClass('/Simulador')}>
              {t('simulator')}
            </Link>
          </div>
          <div className="flex items-center">
            <LanguajeDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
