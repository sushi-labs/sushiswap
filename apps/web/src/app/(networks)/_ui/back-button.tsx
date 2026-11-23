'use client'

import { Button, type ButtonProps, LinkInternal } from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import { type ReactElement, type Ref, useCallback } from 'react'

type BackButtonProps = Omit<ButtonProps, 'icon'> &
  (
    | { backUrl: string; ref?: Ref<HTMLAnchorElement> }
    | { backUrl?: undefined; ref?: Ref<HTMLButtonElement> }
  )

function BackButton({ backUrl, ref, ...props }: BackButtonProps): ReactElement {
  const router = useRouter()

  const goBack = useCallback(() => {
    if (window.history.length === 1 && document.referrer) {
      const referrer = new URL(document.referrer)
      if (
        referrer.origin === window.location.origin &&
        referrer.href !== window.location.href
      ) {
        router.replace(referrer.href)
        return
      }
    }

    router.back()
  }, [router])

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
      onClick={goBack}
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
