import Image from 'next/image';
import { Popover } from '@headlessui/react';
import LanguajeDropdown from '../../LanguajeDropdown';

export default function Header() {
  return (
    <Popover className="relative bg-white">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-1">
          <div className="relative flex justify-start md:flex-0">
            <div className="w-24 h-16">
              <Image
                src="/logo.png"
                alt="Picture of something nice"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <LanguajeDropdown />
          </div>
        </div>
      </div>
    </Popover>
  );
}
