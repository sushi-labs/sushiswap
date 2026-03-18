'use client'

import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useIsMounted } from '@sushiswap/hooks'
import {
  Button,
  Collapsible,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  LinkExternal,
  Separator,
  Switch,
  classNames,
} from '@sushiswap/ui'
import { type ReactElement, useCallback, useEffect, useState } from 'react'
import { announceCookieChange } from './announce-cookie-change'

type BaseAction = 'accept' | 'reject' | 'manage'

function BaseCookieDialog({
  onAction,
}: { onAction: (action: BaseAction) => void }) {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <DialogContent
      hideClose
      className="md:min-w-[720px] !left-[unset] !top-[unset] !bottom-0 md:!right-0 !translate-x-[0%] md:!translate-x-[-50px] md:!translate-y-[-50px]"
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <VisuallyHidden>
        <DialogTitle>Cookie Policy</DialogTitle>
      </VisuallyHidden>
      <p
        className={classNames(
          'text-sm',
          !isExpanded && 'line-clamp-2 before:h-[1lh] before:float-right',
        )}
      >
        {!isExpanded && (
          <Button
            variant="link"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            as="span"
            className={'ml-1 float-right clear-both'}
          >
            <span className="pl-0.5">More</span>
          </Button>
        )}
        <span>
          By clicking on “Accept all cookies”, you consent to the storage of
          cookies on your device and the associated processing of your personal
          data by Sushi Labs and our partners to improve website navigation,
          analyse website usage and conduct surveys. You can revoke your consent
          at any time via the “Manage cookie preferences” button.
          <br />
          <br />
          For further information on our data processing and cookies, please
          visit our{' '}
          <LinkExternal href="/legal/privacy-policy">
            Privacy Policy
          </LinkExternal>{' '}
          and our{' '}
          <LinkExternal href="/legal/cookie-policy">Cookie Policy</LinkExternal>
          .
        </span>
      </p>
      <Separator />
      <div className="flex md:flex-row flex-col w-full gap-3">
        <Button onClick={() => onAction('accept')}>Accept all cookies</Button>
        <Button variant="secondary" onClick={() => onAction('manage')}>
          Manage cookie preferences
        </Button>
        <Button variant="secondary" onClick={() => onAction('reject')}>
          Reject all non-essential cookies
        </Button>
      </div>
    </DialogContent>
  )
}

const cookieTypes = [
  'essential',
  'functional',
  'analytical',
  'google',
  'hotjar',
] as const

export type CookieType = (typeof cookieTypes)[number]

type ManageAction =
  | {
      type: 'confirm'
    }
  | {
      type: 'set'
      cookieType: CookieType
      enabled: boolean
    }
  | {
      type: 'reject'
    }

function ManageCookieDialog({
  cookieSet,
  onAction,
}: { cookieSet: Set<CookieType>; onAction: (action: ManageAction) => void }) {
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)
  return (
    <>
      <DialogContent
        hideClose
        className="!left-[unset] !top-[unset] !bottom-0 md:!right-0 !translate-x-[0%] md:!translate-x-[-50px] md:!translate-y-[-50px] space-y-4"
      >
        <DialogHeader>
          <DialogTitle className="!mr-0">Manage cookie preferences</DialogTitle>
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
                    onChange={(e) => {
                      onAction({
                        type: 'set',
                        cookieType: 'google',
                        enabled: e.currentTarget.checked,
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
                    onChange={(e) => {
                      onAction({
                        type: 'set',
                        cookieType: 'hotjar',
                        enabled: e.currentTarget.checked,
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
    </>
  )
}

const alwaysEnabledCookieTypes = ['essential'] as const

export function CookieDialog({
  defaultOpen,
  children,
}: { defaultOpen: boolean; children: ReactElement }) {
  const [open, setOpen] = useState(defaultOpen)
  const [page, setPage] = useState<'base' | 'manage'>('base')

  const isMounted = useIsMounted()

  const [enabledCookieSet, setEnabledCookieSet] = useState<Set<CookieType>>(
    new Set(alwaysEnabledCookieTypes),
  )

  const onConfirm = useCallback((cookieSet: Set<CookieType>) => {
    const cookieString = Array.from(cookieSet).join(',')
    document.cookie = `accepted-cookies=${cookieString}; max-age=31536000; path=/`
    announceCookieChange()

    setOpen(false)
  }, [])

  const onBaseAction = useCallback(
    (action: BaseAction) => {
      switch (action) {
        case 'accept':
          onConfirm(new Set<CookieType>(cookieTypes))
          break
        case 'reject':
          onConfirm(new Set<CookieType>(alwaysEnabledCookieTypes))
          break
        case 'manage':
          setPage('manage')
          break
      }
    },
    [onConfirm],
  )

  const onManageAction = useCallback(
    (action: ManageAction) => {
      switch (action.type) {
        case 'confirm':
          onConfirm(enabledCookieSet)
          break
        case 'reject':
          onConfirm(new Set<CookieType>(alwaysEnabledCookieTypes))
          break
        case 'set':
          setEnabledCookieSet((prev) => {
            const next = new Set(prev)
            if (action.enabled) {
              next.add(action.cookieType)
            } else {
              next.delete(action.cookieType)
            }
            return next
          })
          break
      }
    },
    [enabledCookieSet, onConfirm],
  )

  useEffect(() => {
    // Auto-accept in development and test environments
    if (
      process.env.NODE_ENV !== 'production' ||
      process.env.NEXT_PUBLIC_APP_ENV === 'test'
    ) {
      onConfirm(new Set<CookieType>(cookieTypes))
    }
  }, [onConfirm])

  return (
    <Dialog open={open && isMounted} onOpenChange={setOpen}>
      <DialogTrigger onClick={() => setPage('manage')}>
        {children}
      </DialogTrigger>

      {page === 'base' ? (
        <BaseCookieDialog onAction={onBaseAction} />
      ) : (
        <ManageCookieDialog
          cookieSet={enabledCookieSet}
          onAction={onManageAction}
        />
      )}
    </Dialog>
  )
}
