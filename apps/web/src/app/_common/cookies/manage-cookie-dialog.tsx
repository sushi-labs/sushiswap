'use client'

import { ChevronDownIcon } from '@heroicons/react/24/solid'
import {
  Button,
  Collapsible,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Separator,
  Switch,
} from '@sushiswap/ui'
import { useState } from 'react'
import type { CookieType, ManageAction } from './cookie-types'

export function ManageCookieDialog({
  cookieSet,
  onAction,
}: { cookieSet: Set<CookieType>; onAction: (action: ManageAction) => void }) {
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)

  return (
    <DialogContent
      hideClose
      className="!left-[unset] !top-[unset] !bottom-0 md:!right-0 !translate-x-[0%] md:!translate-x-[-50px] md:!translate-y-[-50px] space-y-4"
    >
      <DialogHeader>
        <DialogTitle className="!mr-0">Manage cookie preferences</DialogTitle>
        <DialogDescription className="sr-only">
          Choose which non-essential cookies Sushi may store on your device.
        </DialogDescription>
      </DialogHeader>
      <div className="[&>*]:flex [&>*]:justify-between [&>*]:items-center space-y-3">
        <div>
          <span>Strictly Neccessary Cookies</span>
          <Switch checked disabled />
        </div>
        <Separator />
        <div>
          <span>Functional Cookies</span>
          <Switch
            checked={cookieSet.has('functional')}
            onCheckedChange={(enabled) =>
              onAction({ type: 'set', cookieType: 'functional', enabled })
            }
          />
        </div>
        <Separator />
        <div>
          <span>Analytical Cookies</span>
          <Switch
            checked={cookieSet.has('analytical')}
            onCheckedChange={(enabled) => {
              onAction({ type: 'set', cookieType: 'analytical', enabled })
              onAction({ type: 'set', cookieType: 'google', enabled })
              onAction({ type: 'set', cookieType: 'hotjar', enabled })
            }}
          />
        </div>
        <div>
          <div className="flex flex-col gap-2">
            <button
              className="flex gap-1 items-center"
              type="button"
              onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
            >
              <ChevronDownIcon className="w-3 h-3" />
              <span>Cookies(2)</span>
            </button>
            <Collapsible
              open={isAnalyticsOpen}
              className="flex flex-col gap-2 pl-4"
            >
              <div className="flex gap-1.5 items-center">
                <input
                  type="checkbox"
                  checked={cookieSet.has('google')}
                  onChange={(event) => {
                    onAction({
                      type: 'set',
                      cookieType: 'google',
                      enabled: event.currentTarget.checked,
                    })
                    if (!cookieSet.has('analytical')) {
                      onAction({
                        type: 'set',
                        cookieType: 'analytical',
                        enabled: true,
                      })
                    }
                  }}
                />
                Google
              </div>
              <div className="flex gap-1.5 items-center">
                <input
                  type="checkbox"
                  checked={cookieSet.has('hotjar')}
                  onChange={(event) => {
                    onAction({
                      type: 'set',
                      cookieType: 'hotjar',
                      enabled: event.currentTarget.checked,
                    })
                    if (!cookieSet.has('analytical')) {
                      onAction({
                        type: 'set',
                        cookieType: 'analytical',
                        enabled: true,
                      })
                    }
                  }}
                />
                HotJar
              </div>
            </Collapsible>
          </div>
        </div>
      </div>
      <DialogFooter className="!justify-start flex flex-wrap gap-3">
        <Button onClick={() => onAction({ type: 'confirm' })}>Confirm</Button>
        <Button
          variant="secondary"
          onClick={() => onAction({ type: 'reject' })}
        >
          Reject all non-essential cookies
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
