'use client'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useIsMounted } from '@sushiswap/hooks'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  LinkExternal,
  Separator,
  Switch,
} from '@sushiswap/ui'
import { useCallback, useEffect, useState } from 'react'
import { announceCookieChange } from './announce-cookie-change'

type BaseAction = 'accept' | 'reject' | 'manage'

function BaseCookieDialog({
  onAction,
}: { onAction: (action: BaseAction) => void }) {
  return (
    <DialogContent
      hideClose
      className="md:min-w-[720px] !left-[unset] !top-[unset] !bottom-0 md:!right-0 !translate-x-[0%] md:!translate-x-[-50px] md:!translate-y-[-50px]"
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <VisuallyHidden>
        <DialogTitle>Cookie Policy</DialogTitle>
      </VisuallyHidden>
      <div>
        Sushi Labs and our third-party service providers may use cookies as set
        forth in our{' '}
        <LinkExternal href="/legal/cookie-policy">Cookie Policy</LinkExternal>,
        which process your personal data. You may manage your cookie preferences
        below. Even if you reject all cookies, you hereby consent to the
        collection of your personal data by us and our service providers as you
        use our services, through technologies other than cookies, as described
        in our{' '}
        <LinkExternal href="/legal/privacy-policy">Privacy Policy</LinkExternal>
        , including when such collection may be considered an interception of
        communications by third parties.
      </div>
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

const cookieTypes = ['essential', 'functional', 'performance'] as const

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
            <span>Performance Cookies</span>
            <Switch
              checked={cookieSet.has('performance')}
              onCheckedChange={(enabled) =>
                onAction({ type: 'set', cookieType: 'performance', enabled })
              }
            />
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

export function CookieDialog({ open: _open }: { open: boolean }) {
  const [open, setOpen] = useState(_open)
  const [page, setPage] = useState<'base' | 'manage'>('base')

  const isMounted = useIsMounted()

  const [enabledCookieSet, setEnabledCookieSet] = useState<Set<CookieType>>(
    new Set(cookieTypes),
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
          onConfirm(new Set<CookieType>(['essential']))
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
          onConfirm(new Set<CookieType>(['essential']))
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
