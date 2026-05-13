'use client'
import {
  Button,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
} from '@sushiswap/ui'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { useVaultDetails } from 'src/lib/perps/info/use-vault-details'
import { useVaultTransfer } from 'src/lib/perps/vaults/use-vault-transfer'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { type EvmAddress, EvmChainId, USDC } from 'sushi/evm'
import { InputWithKeyboard } from '~evm/perps/_ui/_common'
import { PerpsChecker } from '~evm/perps/_ui/perps-checker'

const currency = USDC[EvmChainId.ARBITRUM]
const chainId = EvmChainId.ARBITRUM

export const WithdrawDialog = ({
  trigger,
  isOpen,
  onOpenChange,
  vaultAddress,
}: {
  trigger?: ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  vaultAddress: EvmAddress
}) => {
  const { updateVaultTransferAsync, isPending } = useVaultTransfer()
  const {
    data: vaultDetails,
    isLoading,
    error,
  } = useVaultDetails({
    vaultAddress,
  })
  const [open, setOpen] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>('')
  const _amount = Amount.tryFromHuman(currency, amount)

  const address = useAccount('evm')

  const withdrawableBalance = useMemo(() => {
    if (!vaultDetails?.followerState || !address) return '0'
    return vaultDetails?.followerState?.vaultEquity
  }, [vaultDetails?.followerState, address])

  const balance = Amount.tryFromHuman(currency, withdrawableBalance ?? '0')

  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open

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

  const withdrawUsdc = useCallback(async () => {
    if (!address || !_amount) return

    await updateVaultTransferAsync({
      type: 'withdraw',
      usdAmount: _amount.amount.toString(),
      vaultAddress,
    })
    setAmount('')
    setOpen(false)
  }, [address, _amount, vaultAddress, updateVaultTransferAsync])

  const { canWithdraw, unlockDate } = useMemo(() => {
    if (!vaultDetails?.followerState)
      return { canWithdraw: false, unlockDate: null }

    const unlockTime = vaultDetails?.followerState?.lockupUntil
    const canWithdraw = Date.now() >= unlockTime
    const unlockDate = new Date(unlockTime)

    return { canWithdraw, unlockDate }
  }, [vaultDetails?.followerState])

  return (
    <PerpsDialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <PerpsDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="perps-secondary">Withdraw</Button>
        )}
      </PerpsDialogTrigger>
      <PerpsDialogContent>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Withdraw</PerpsDialogTitle>
          <PerpsDialogDescription>
            Withdraw funds from {vaultDetails?.name}.
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="flex flex-col gap-4">
            <InputWithKeyboard
              amount={amount}
              setAmount={setAmount}
              balance={balance}
              currency={currency}
              error={error?.message}
              isLoading={isLoading}
              address={address}
              maxDecimals={6}
            />

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
                      <Checker.Custom
                        size="default"
                        showChildren={canWithdraw}
                        buttonText={`Lockup period active`}
                        onClick={() => {}}
                        disabled={!canWithdraw}
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
                                onClick={withdrawUsdc}
                                loading={isPending}
                                variant="perps-tertiary"
                              >
                                Withdraw
                              </Button>
                            </PerpsChecker.HyperReferral>
                          </PerpsChecker.BuilderFee>
                        </PerpsChecker.EnableTrading>
                      </Checker.Custom>
                    </Checker.Custom>
                  </Checker.Custom>
                </Checker.Network>
              </Checker.Connect>
            </PerpsChecker.Legal>
            {!canWithdraw && unlockDate ? (
              <div>
                <p className="text-xs text-red-400 text-center italic mb-1">
                  Withdrawals are disabled for a lockup period after each of
                  your deposits. You can withdraw after{' '}
                  {unlockDate.toLocaleString()}.
                </p>
              </div>
            ) : null}
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
