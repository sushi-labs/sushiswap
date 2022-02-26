import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
const Menu = ({ setIsOpen, isOpen }) => {
  return (
    <>
      <nav className="relative flex items-center justify-between max-w-screen-lg px-4 mx-auto sm:px-6">
        <div className="flex items-center flex-1">
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link href="/" passHref aria-label="Home">
              <Image
                width={40}
                height={40}
                className="w-auto max-h-8 sm:max-h-10"
                src={'/logo.png'}
                unoptimized
                alt="Logo"
              />
            </Link>
            <Link href="/">
              <a className="ml-2 text-xl font-bold leading-6 text-white sm:truncate">Sushi</a>
            </Link>
            <div className="flex items-center -mr-2 md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 text-white transition duration-150 ease-in-out rounded-md focus:outline-none"
                id="main-menu"
                aria-label="Main menu"
                aria-haspopup="true"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="items-center content-center hidden space-x-10 md:flex">
          <Link href="https://app.sushi.com">
            <a
              className="inline-flex items-center text-sm font-medium leading-5 text-white"
              style={{
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
                border: 'double 3px transparent',
                borderRadius: '80px',
                backgroundImage:
                  'linear-gradient(#0d0e21, #0d0e21), radial-gradient(circle at top left, #016eda, #d900c0)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              Enter App
            </a>
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Menu
