'use client'

import { useRouter } from 'next/navigation'
import type { MouseEvent, ReactNode } from 'react'

const interactiveSelector =
  'a, button, input, select, textarea, label, summary, [tabindex], [role="link"], [role="button"], [role="menuitem"], [aria-haspopup], [contenteditable]:not([contenteditable="false"])'

interface MobileTableRowActionProps {
  children: ReactNode
  href?: string
  label?: string
  onClick?: () => void
}

/** Makes the card actionable while leaving its links, controls and portaled menus independent. */
export function MobileTableRowAction(
  props: MobileTableRowActionProps,
): ReactNode {
  if (props.href) return <LinkedRow {...props} href={props.href} />
  if (!props.onClick) return props.children
  return <RowAction {...props} role="button" onClick={props.onClick} />
}

function LinkedRow({
  children,
  href,
  label,
  onClick,
}: MobileTableRowActionProps & { href: string }): ReactNode {
  const router = useRouter()

  function navigate(): void {
    onClick?.()
    router.push(href)
  }

  return (
    <RowAction role="link" label={label} onClick={navigate}>
      {children}
    </RowAction>
  )
}

function RowAction({
  role,
  children,
  label,
  onClick,
}: {
  role: 'link' | 'button'
  children: ReactNode
  label?: string
  onClick: () => void
}): ReactNode {
  function handleClick(event: MouseEvent<HTMLDivElement>): void {
    const { currentTarget, target } = event
    if (
      event.defaultPrevented ||
      !(target instanceof Element) ||
      !currentTarget.contains(target)
    )
      return

    const control = target.closest(interactiveSelector)
    if (control && control !== currentTarget) return
    onClick()
  }

  return (
    <div
      role={role}
      tabIndex={0}
      aria-label={label}
      className="cursor-pointer rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
      onClick={handleClick}
      onKeyDown={(event) => {
        if (
          !event.defaultPrevented &&
          event.target === event.currentTarget &&
          (event.key === 'Enter' || (role === 'button' && event.key === ' '))
        ) {
          event.preventDefault()
          onClick()
        }
      }}
    >
      {children}
    </div>
  )
}
