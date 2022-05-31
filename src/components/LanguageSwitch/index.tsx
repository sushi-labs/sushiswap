import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { classNames } from 'app/functions/styling'
// @ts-ignore TYPE NEEDS FIXING
import cookieCutter from 'cookie-cutter'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'

import Typography from '../Typography'

const LANG_TO_COUNTRY: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  ro: 'Română',
  ru: 'Русский',
  vi: 'Tiếng Việt',
  zh_CN: '简体中文',
  zh_TW: '繁體中文',
  ko: '한국어',
  ja: '日本語',
  fa: 'فارسی',
  pt_BR: 'Português',
  hi: 'हिन्दी',
  es: 'Español',
  tr: 'Türkçe',
  el: 'ελληνικά',
  pl: 'Polskie',
}

export default function LangSwitcher() {
  const { locale, locales, asPath, push } = useRouter()

  return (
    <Menu as="div" className="relative inline-block w-full text-left">
      <div>
        <Menu.Button className="w-full px-4 py-2 text-sm font-bold bg-transparent border-2 rounded shadow-sm text-primary border-dark-800 hover:border-dark-700 bg-dark-1000">
          <div className="flex flex-row items-center justify-between">
            <Typography weight={700} variant="sm">
              {locale && LANG_TO_COUNTRY[locale]}
            </Typography>
            <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          static
          className="absolute max-h-[240px] overflow-auto w-full border-2 mt-2 divide-y rounded shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border-dark-900 bg-dark-1000 divide-dark-900"
        >
          {locales?.map((l, index) => {
            return (
              <Menu.Item
                onClick={() => {
                  cookieCutter.set('NEXT_LOCALE', l)
                  push(asPath, undefined, { locale: l })
                }}
                key={index}
              >
                {({ active }) => {
                  return (
                    <Typography
                      variant="sm"
                      weight={700}
                      className={classNames(
                        active ? 'text-white' : 'text-primary',
                        'px-3 py-2 cursor-pointer hover:bg-dark-900/40'
                      )}
                    >
                      {LANG_TO_COUNTRY[l]}
                    </Typography>
                  )
                }}
              </Menu.Item>
            )
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
