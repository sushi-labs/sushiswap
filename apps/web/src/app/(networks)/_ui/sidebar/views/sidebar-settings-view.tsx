import { RadioGroup } from '@headlessui/react'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useLocalStorage } from '@sushiswap/hooks'
import { IconButton, Switch, classNames } from '@sushiswap/ui'
import { useTheme } from 'next-themes'
import React, { Fragment } from 'react'
import { DefaultSidebarView, useSidebar } from 'src/app/(networks)/_ui/sidebar'

const map = {
  system: <span className="text-sm font-medium">Auto</span>,
  light: <SunIcon width={20} height={20} />,
  dark: <MoonIcon width={18} height={18} />,
}

export const SidebarSettingsView = () => {
  const { setView } = useSidebar()
  const { theme, setTheme } = useTheme()
  const [showTestnets, setShowTestnets] = useLocalStorage('showTestnets', false)

  return (
    <div className="flex flex-col gap-6 bg-background px-6 pt-4 pb-6">
      <div className="grid shrink-0 grid-cols-[32px_1fr_32px] items-center">
        <div className="flex justify-start">
          <IconButton
            size="sm"
            variant="ghost"
            className="!h-8 !w-8 !min-h-8 !min-w-8 focus-visible:ring-pink"
            onClick={() => setView(DefaultSidebarView)}
            icon={ArrowLeftIcon}
            name="Back"
          />
        </div>
        <span className="text-lg leading-7 font-medium text-center">
          Settings
        </span>
        <div />
      </div>
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Preferences
        </h3>
        <div className="divide-y divide-accent">
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <span className="text-base font-medium">Theme</span>
            <RadioGroup value={theme} onChange={setTheme} aria-label="Theme">
              <div className="flex items-center gap-1 rounded-full bg-muted p-1">
                {Object.entries(map).map(([k, v], i) => (
                  <RadioGroup.Option as={Fragment} key={i} value={k}>
                    {({ checked }) => (
                      <button
                        type="button"
                        aria-label={k}
                        className={classNames(
                          'relative flex h-8 w-12 items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                          checked
                            ? 'bg-background text-primary shadow-sm'
                            : 'text-muted-foreground hover:bg-background/60 hover:text-primary',
                        )}
                      >
                        {v}
                      </button>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>
          <div className="flex items-center justify-between gap-4 py-4">
            <span className="text-base font-medium">Show testnets</span>
            <Switch
              checked={showTestnets}
              onCheckedChange={setShowTestnets}
              aria-label="Show testnets"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
