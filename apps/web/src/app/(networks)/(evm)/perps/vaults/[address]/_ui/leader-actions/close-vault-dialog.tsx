'use client'
import {
  Button,
  Message,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
} from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import { type ReactNode, useCallback, useState } from 'react'
import { useVaultDistribute } from 'src/lib/perps'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import type { EvmAddress } from 'sushi/evm'
import { PerpsChecker } from '~evm/perps/_ui/perps-checker'

export const CloseVaultDialog = ({
  trigger,
  isOpen,
  onOpenChange,
  vaultAddress,
}: {
  vaultAddress: EvmAddress
  trigger?: ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()
  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open
  const { vaultDistributeAsync: closeVaultAsync, isPending } =
    useVaultDistribute()

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

  const closeVault = useCallback(async () => {
    try {
      await closeVaultAsync({
        vaultAddress,
        usdAmount: 0,
      })
      router.push('/perps/vaults')
    } catch (e) {
      console.error('failed to close vault', e)
    }
  }, [vaultAddress, closeVaultAsync, router])

  return (
    <PerpsDialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <PerpsDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="perps-secondary">Close Vault</Button>
        )}
      </PerpsDialogTrigger>
      <PerpsDialogContent aria-describedby={undefined}>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Close Vault</PerpsDialogTitle>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="flex flex-col gap-4 !text-xs">
            <p className="text-xs text-perps-muted-50 text-center italic mb-1">
              In order to close the vault, all positions must be closed. All
              depositors will receive their share of the vault as soon as the
              vault is closed.
            </p>
            <Message
              variant="destructive"
              className="!p-3 !text-xs !rounded-md !text-red-100 border border-red/50"
            >
              Note: Closing a vault is permanent.
            </Message>

            <PerpsChecker.Legal size="default" variant="perps-tertiary">
              <Checker.Connect
                size="default"
                variant="perps-tertiary"
                namespace="evm"
              >
                <PerpsChecker.EnableTrading
                  size="default"
                  variant="perps-tertiary"
                >
                  <PerpsChecker.BuilderFee
                    size="default"
                    variant="perps-tertiary"
                  >
                    <PerpsChecker.HyperReferral
                      size="default"
                      variant="perps-tertiary"
                    >
                      <Button
                        size="default"
                        className="w-full"
                        onClick={closeVault}
                        loading={isPending}
                        variant="perps-tertiary"
                      >
                        Close Vault
                      </Button>
                    </PerpsChecker.HyperReferral>
                  </PerpsChecker.BuilderFee>
                </PerpsChecker.EnableTrading>
              </Checker.Connect>
            </PerpsChecker.Legal>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
