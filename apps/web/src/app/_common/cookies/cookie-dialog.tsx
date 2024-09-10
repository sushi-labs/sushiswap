'use client'

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
import { useCallback, useState } from 'react'

type BaseAction = 'accept' | 'reject' | 'manage'

function BaseCookieDialog({
  onAction,
}: { onAction: (action: BaseAction) => void }) {
  return (
    <DialogContent
      hideClose
      className="lg:min-w-[750px] md:min-w-[600px] !left-[unset] !top-[unset] !bottom-0 !right-0 !translate-x-[-50px] !translate-y-[-50px]"
    >
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
      <div className="space-x-3">
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
        className="!left-[unset] !top-[unset] !bottom-0 !right-0 !translate-x-[-50px] !translate-y-[-50px] space-y-4"
      >
        <DialogHeader>
          <DialogTitle>Manage cookie preferences</DialogTitle>
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
        <DialogFooter className="!justify-start">
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
