'use client'

import {
  Navigation as SharedNavigation,
  SushiNavigationDropdown as SharedSushiNavigationDropdown,
} from '@sushiswap/ui'
import {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  type RefObject,
  useRef,
} from 'react'
import { CookieDialog } from './cookies/cookie-dialog'

function CookiePreferences({
  children,
}: {
  children: (
    trigger: ReactElement,
    menuTriggerRef: RefObject<HTMLButtonElement | null>,
  ) => ReactNode
}): ReactElement {
  const menuTriggerRef = useRef<HTMLButtonElement>(null)

  return (
    <CookieDialog
      defaultOpen={false}
      renderTrigger={(trigger) => children(trigger, menuTriggerRef)}
      onCloseAutoFocus={(event) => {
        // The menu item unmounts when focus moves into the dialog.
        event.preventDefault()
        menuTriggerRef.current?.focus()
      }}
    >
      <button
        type="button"
        className="flex min-h-9 w-full items-center rounded-lg p-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:bg-muted focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
      >
        Manage Cookie Preferences
      </button>
    </CookieDialog>
  )
}

export function Navigation(
  props: ComponentProps<typeof SharedNavigation>,
): ReactElement {
  return (
    <CookiePreferences>
      {(trigger, menuTriggerRef) => (
        <SharedNavigation
          {...props}
          cookiePreferences={trigger}
          sushiDropdownTriggerRef={menuTriggerRef}
        />
      )}
    </CookiePreferences>
  )
}

export function SushiNavigationDropdown(
  props: ComponentProps<typeof SharedSushiNavigationDropdown>,
): ReactElement {
  return (
    <CookiePreferences>
      {(trigger, menuTriggerRef) => (
        <SharedSushiNavigationDropdown
          {...props}
          cookiePreferences={trigger}
          triggerRef={menuTriggerRef}
        />
      )}
    </CookiePreferences>
  )
}
