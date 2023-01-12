import Image from 'next/image';
import LanguajeDropdown from '../../LanguajeDropdown';

export default function Header() {
  return (
    <div className="relative bg-white border-b-2 border-b-gray-theme drop-shadow-xl">
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
          <div className="flex items-center">
            <LanguajeDropdown />
          </div>
        </div>
      </div>
    </div>
  );
}
