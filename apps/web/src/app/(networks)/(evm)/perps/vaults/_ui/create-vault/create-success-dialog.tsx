'use client'
import {
  Button,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
} from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

export const CreateSuccessDialog = ({
  isOpen,
  onOpenChange,
}: {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [open, setOpen] = useState<boolean>(true)
  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open
  const router = useRouter()

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(nextOpen)
      } else {
        setOpen(nextOpen)
      }
    },
    [isControlled, onOpenChange],
  )

  const goTrade = useCallback(() => {
    router.push('/perps')
  }, [router])

  return (
    <PerpsDialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <PerpsDialogContent aria-describedby={undefined}>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Vault Created</PerpsDialogTitle>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="flex flex-col gap-4 !text-xs">
            <p>Start trading from your new vault.</p>
            <p>
              In the future, trade on behalf of your vault by using the address
              selector in settings in the nav bar.
            </p>

            <Button
              size="default"
              className="w-full"
              onClick={goTrade}
              variant="perps-tertiary"
            >
              Trade
            </Button>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
