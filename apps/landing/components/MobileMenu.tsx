import { Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import logo from '../public/logo.png'

const MobileMenu = ({ setIsOpen, isOpen }) => {
  return (
    <>
      <Transition
        show={isOpen}
        enter="ease-out duration-150"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-100"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="absolute inset-x-0 top-0 z-50 p-2 transition origin-top-right transform md:hidden">
          <div className="rounded-lg shadow-md">
            <div
              className="overflow-hidden rounded-lg shadow-xs"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="main-menu"
              style={{ background: '#0c0e20' }}
            >
              <div className="flex items-center justify-between px-5 pt-4">
                <Link href="/" passHref aria-label="Home">
                  <Image width={32} height={32} className="w-auto h-8" src={logo} alt="Logo" priority unoptimized />
                </Link>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 text-white transition duration-150 ease-in-out rounded-md focus:outline-none"
                    aria-label="Close menu"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="https://forum.sushi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-base font-medium text-white transition duration-150 ease-in-out rounded-md focus:outline-none"
                  role="menuitem"
                >
                  Forum
                </a>
                <a
                  href="https://snapshot.org/#/sushi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-base font-medium text-white transition duration-150 ease-in-out rounded-md focus:outline-none"
                  role="menuitem"
                >
                  Snapshot
                </a>
                <a
                  href="https://docs.sushi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-base font-medium text-white transition duration-150 ease-in-out rounded-md focus:outline-none"
                  role="menuitem"
                >
                  Docs
                </a>
                <Link href="https://app.sushi.com">
                  <a
                    className="block px-3 py-2 text-base font-medium text-white transition duration-150 ease-in-out rounded-md focus:outline-none"
                    role="menuitem"
                  >
                    Enter App
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </>
  )
}

export default MobileMenu
