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

export const VaultWithdrawDialog = ({
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
    refetch,
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
    await refetch()
    setAmount('')
    setOpen(false)
  }, [address, _amount, vaultAddress, updateVaultTransferAsync, refetch])

  const { canWithdraw, unlockDate } = useMemo(() => {
    if (!vaultDetails?.followerState)
      return { canWithdraw: false, unlockDate: null }

    const unlockTime = vaultDetails?.followerState?.lockupUntil
    const canWithdraw = Date.now() >= unlockTime
    const unlockDate = new Date(unlockTime)

    return { canWithdraw, unlockDate }
  }, [vaultDetails?.followerState])

  const percentageOfVault = useMemo(() => {
    const amountInVault =
      vaultDetails?.portfolio?.[7]?.[1]?.accountValueHistory?.[
        vaultDetails?.portfolio?.[7]?.[1]?.accountValueHistory?.length - 1
      ]?.[1]
    if (!amountInVault || !_amount) return '0'
    const vaultAmount = Amount.fromHuman(currency, amountInVault)
    const percentage = _amount.divToFraction(vaultAmount)?.mul('100')
    return percentage.toString({ fixed: 2 })
  }, [_amount, vaultDetails?.portfolio])

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
            ) : _amount?.gt('0') && !insufficientBalance ? (
              <div>
                <p className="text-xs text-perps-muted-50 text-center italic mb-1">
                  To withdraw {_amount?.toString()} USDC, which represents{' '}
                  {percentageOfVault}% of the vault, A percentage of each
                  position of the vault may be closed at market price if
                  necessary to free up margin. Due to slippage, the final amount
                  may differ from the amount originally entered.
                </p>
              </div>
            ) : null}
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
