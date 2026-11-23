'use client'

import { Button, type ButtonProps, LinkInternal } from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import type { ReactElement, Ref } from 'react'

type BackButtonProps = Omit<ButtonProps, 'icon'> &
  (
    | { backUrl: string; ref?: Ref<HTMLAnchorElement> }
    | { backUrl?: undefined; ref?: Ref<HTMLButtonElement> }
  )

function BackButton({ backUrl, ref, ...props }: BackButtonProps): ReactElement {
  const { back } = useRouter()
  if (backUrl !== undefined) {
    return (
      <LinkInternal
        href={backUrl}
        ref={ref}
        className="text-sm text-pink hover:underline"
      >
        ← Back
      </LinkInternal>
    )
  }
  return (
    <Button
      onClick={back}
      {...props}
      ref={ref}
      variant="link"
      className="text-sm !font-normal !rounded-none"
    >
      ← Back
    </Button>
  )
}

export { BackButton }
