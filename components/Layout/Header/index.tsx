import Image from 'next/image'
import { Popover } from '@headlessui/react'
import {
  MenuIcon,
} from '@heroicons/react/outline'
import Link from 'next/link'

export default function Header() {
  return (
    <Popover className="relative bg-gray-200">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-1">
          <div className="relative flex justify-start md:flex-0">
            <a href="#">
              <div className="w-24 h-16">
                <Image
                  src="/logo.png"
                  alt="Picture of something nice"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </a>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <Popover.Group as="nav" className="hidden md:flex space-x-5">
            <div
              className="text-base font-medium text-gray-500 hover:text-gray-900"
            >
              <Link
                href="/"
              >
                Projections
              </Link>
            </div>
            <div
              className="text-base font-medium text-gray-500 hover:text-gray-900"
            >
              <Link
                href="/Model"
              >
                Model Explanation
              </Link>
            </div>
          </Popover.Group>
          <div className="hidden md:flex items-center">
            <a href="#" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
              Sign in
            </a>
            <a
              href="#"
              className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Download Data
            </a>
          </div>
        </div>
      </div>
    </Popover>
  )
}
