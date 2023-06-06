import React, { FC, Fragment, useMemo } from 'react'

import { Listbox, Transition } from '@headlessui/react'
import { CogIcon } from '@heroicons/react/outline'
import { classNames } from '@sushiswap/ui'
import { CheckIcon } from '@heroicons/react/solid'
import { useFilters } from './FilterProvider'

export const SettingFilter: FC = ({}) => {
  const { setFilters, isWhitelisted } = useFilters()

  // TODO: Make modular?
  const settings = useMemo(
    () =>
      [
        {
          name: 'Show Unverified',
          isSelected: !isWhitelisted,
          onClick: () => setFilters({ isWhitelisted: !isWhitelisted }),
        },
      ] as const,
    [isWhitelisted, setFilters]
  )

  const selected = useMemo(
    () => settings.filter((setting) => setting.isSelected).map((setting) => setting.name),
    [settings]
  )

  return (
    <Listbox as={Fragment}>
      {() => (
        <div className="relative z-[100]">
          <Listbox.Button as={Fragment}>
            <div className="p-2 bg-white shadow-md cursor-pointer rounded-2xl dark:bg-slate-600/10 hover:dark:bg-slate-600/20 active:dark:bg-slate-600/30">
              <CogIcon
                width={26}
                height={26}
                className="text-gray-700 hover:dark:text-slate-50 dark:text-slate-200 hover:text-gray-900"
              />
            </div>
          </Listbox.Button>
          <Transition
            enter="transition duration-300 ease-out"
            enterFrom="transform translate-y-[-16px] opacity-0"
            enterTo="transform translate-y-0 opacity-100"
            leave="transition duration-300 ease-out"
            leaveFrom="transform translate-y-0 opacity-100"
            leaveTo="transform translate-y-[-16px] opacity-0"
          >
            <div className="absolute pt-2 -top-[-1] right-0 sm:w-[200px]">
              <div className="relative z-[100] p-2 flex flex-col w-full fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] rounded-2xl rounded-b-none sm:rounded-b-xl shadow-md bg-white dark:bg-slate-800">
                <div className="max-h-[300px] scroll">
                  <Listbox.Options className="space-y-1">
                    {settings.map((setting) => (
                      <Listbox.Option
                        key={setting.name}
                        value={setting.name}
                        className={() =>
                          classNames(
                            'w-full group hover:bg-gray-100 hover:dark:bg-slate-700 px-2.5 flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all h-[40px]'
                          )
                        }
                        onClick={setting.onClick}
                      >
                        {() => (
                          <>
                            <div className="flex items-center gap-2.5">
                              <p
                                className={classNames(
                                  selected ? 'font-semibold text-gray-900' : 'font-medium text-gray-500',
                                  'text-sm group-hover:text-gray-900 dark:text-slate-300 dark:group-hover:text-slate-50'
                                )}
                              >
                                {setting.name}
                              </p>
                            </div>
                            {setting.isSelected && <CheckIcon width={16} height={16} className="text-blue" />}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}
