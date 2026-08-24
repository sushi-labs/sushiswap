'use client'

import {
  Button,
  Dialog,
  DialogTrigger,
  LinkExternal,
  Separator,
  classNames,
} from '@sushiswap/ui'
import dynamic from 'next/dynamic'
import { useSelectedLayoutSegments } from 'next/navigation'
import { type ReactElement, useCallback, useEffect, useState } from 'react'
import { announceCookieChange } from './announce-cookie-change'
import {
  type CookieDialogVariant,
  type CookieType,
  type ManageAction,
  alwaysEnabledCookieTypes,
  cookieTypes,
} from './cookie-types'

const ManageCookieDialog = dynamic(() =>
  import('./manage-cookie-dialog').then((module) => module.ManageCookieDialog),
)

type BaseAction = 'accept' | 'reject' | 'manage'

function BaseCookieBanner({
  variant,
  onAction,
}: {
  variant: CookieDialogVariant
  onAction: (action: BaseAction) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section
      aria-labelledby="cookie-policy-title"
      className={classNames(
        'fixed bottom-0 right-0 z-50 grid w-full gap-4 rounded-t-2xl p-6 shadow-lg md:right-[50px] md:bottom-[50px] md:w-[720px] md:rounded-2xl',
        variant === 'perps'
          ? 'border border-white/[0.07] bg-perps-background/95 text-perps-muted backdrop-blur-2xl'
          : 'bg-gray-100 dark:bg-slate-800 black:bg-secondary',
      )}
    >
      <h2 id="cookie-policy-title" className="sr-only">
        Cookie Policy
      </h2>
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
            className={classNames(
              'ml-1 float-right clear-both',
              variant === 'perps' && '!text-perps-blue',
            )}
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
        <Button
          variant={variant === 'perps' ? 'perps-default' : undefined}
          onClick={() => onAction('accept')}
        >
          Accept all cookies
        </Button>
        <Button
          variant={variant === 'perps' ? 'perps-secondary' : 'secondary'}
          onClick={() => onAction('manage')}
        >
          Manage cookie preferences
        </Button>
        <Button
          variant={variant === 'perps' ? 'perps-secondary' : 'secondary'}
          onClick={() => onAction('reject')}
        >
          Reject all non-essential cookies
        </Button>
      </div>
    </section>
  )
}

export type { CookieType } from './cookie-types'

export function CookieDialog({
  defaultOpen,
  children,
}: { defaultOpen: boolean; children: ReactElement }) {
  const segments = useSelectedLayoutSegments()
  const variant: CookieDialogVariant = segments.some(
    (segment) => segment === 'perps' || segment === 'launchpad',
  )
    ? 'perps'
    : 'default'
  const [open, setOpen] = useState(defaultOpen)
  const [page, setPage] = useState<'base' | 'manage'>('base')

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
    <>
      {open && page === 'base' ? (
        <BaseCookieBanner variant={variant} onAction={onBaseAction} />
      ) : null}

      <Dialog open={open && page === 'manage'} onOpenChange={setOpen}>
        <DialogTrigger asChild onClick={() => setPage('manage')}>
          {children}
        </DialogTrigger>

        {page === 'manage' ? (
          <ManageCookieDialog
            cookieSet={enabledCookieSet}
            variant={variant}
            onAction={onManageAction}
          />
        ) : null}
      </Dialog>
    </>
  )
}
