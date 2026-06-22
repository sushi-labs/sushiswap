'use client'
import {
  Button,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
} from '@sushiswap/ui'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { useVaultDetails, useVaultDistribute } from 'src/lib/perps'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { type EvmAddress, EvmChainId, USDC } from 'sushi/evm'
import { InputWithKeyboard } from '~evm/perps/_ui/_common'
import { PerpsChecker } from '~evm/perps/_ui/perps-checker'

const currency = USDC[EvmChainId.ARBITRUM]
const chainId = EvmChainId.ARBITRUM

export const DistributeVaultDialog = ({
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
  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open
  const { vaultDistributeAsync, isPending } = useVaultDistribute()
  const [amount, setAmount] = useState<string>('')
  const _amount = Amount.tryFromHuman(currency, amount)
  const {
    data: vaultDetails,
    isLoading,
    error,
    refetch,
  } = useVaultDetails({
    vaultAddress,
  })
  const address = useAccount('evm')

  const withdrawableBalance = useMemo(() => {
    if (!vaultDetails?.maxDistributable || !address) return '0'
    return String(vaultDetails?.maxDistributable)
  }, [vaultDetails, address])

  const balance = Amount.tryFromHuman(currency, withdrawableBalance ?? '0')

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
  const insufficientBalance =
    address &&
    withdrawableBalance &&
    _amount &&
    (balance?.lt(_amount) || balance?.eq('0'))
  const distributeVault = useCallback(async () => {
    if (!vaultAddress || !_amount) return
    try {
      await vaultDistributeAsync({
        vaultAddress,
        usdAmount: Number(_amount?.amount.toString()),
      })
      await refetch()
    } catch (e) {
      console.error('failed to distribute vault', e)
    }
  }, [vaultAddress, vaultDistributeAsync, _amount, refetch])

  return (
    <PerpsDialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <PerpsDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="perps-secondary">Distribute</Button>
        )}
      </PerpsDialogTrigger>
      <PerpsDialogContent aria-describedby={undefined}>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Distribute to Depositors</PerpsDialogTitle>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="flex flex-col gap-4 !text-xs">
            <InputWithKeyboard
              amount={amount}
              setAmount={setAmount}
              balance={balance}
              currency={currency}
              error={error?.message}
              isLoading={isLoading}
              address={address}
            />
            <p className="text-xs text-perps-muted-50 text-center italic mb-1">
              Distributions are a way for leaders to return capital to
              depositors when the strategy is at capacity. The distribution
              amount will be withdrawn from the vault and sent to depositors in
              proportion to their deposit. The usual P&L share for the leader
              will apply.
            </p>

            <PerpsChecker.Legal size="default" variant="perps-tertiary">
              <Checker.Connect
                size="default"
                variant="perps-tertiary"
                namespace="evm"
              >
                <Checker.Network
                  size="default"
                  chainId={chainId}
                  variant="perps-tertiary"
                >
                  <Checker.Custom
                    size="default"
                    showChildren={Boolean(amount)}
                    buttonText={'Enter Amount'}
                    onClick={() => {}}
                    disabled={!amount}
                    variant="perps-tertiary"
                  >
                    <Checker.Custom
                      size="default"
                      showChildren={!insufficientBalance}
                      buttonText={'Insufficient Balance'}
                      onClick={() => {}}
                      disabled={Boolean(insufficientBalance)}
                      variant="perps-tertiary"
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
                              onClick={distributeVault}
                              loading={isPending}
                              variant="perps-tertiary"
                            >
                              Distribute
                            </Button>
                          </PerpsChecker.HyperReferral>
                        </PerpsChecker.BuilderFee>
                      </PerpsChecker.EnableTrading>
                    </Checker.Custom>
                  </Checker.Custom>
                </Checker.Network>
              </Checker.Connect>
            </PerpsChecker.Legal>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
