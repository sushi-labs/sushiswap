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
import { useSpotClearinghouseState } from 'src/lib/perps'
import { useVaultDetails } from 'src/lib/perps/info/use-vault-details'
import { useVaultTransfer } from 'src/lib/perps/vaults/use-vault-transfer'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { type EvmAddress, EvmChainId, USDC } from 'sushi/evm'
import { InputWithKeyboard } from '~evm/perps/_ui/_common'
import { useUserSettingsState } from '~evm/perps/_ui/account-management'
import { PerpsChecker } from '~evm/perps/_ui/perps-checker'
import { useUserState } from '~evm/perps/user-provider'

const currency = USDC[EvmChainId.ARBITRUM]
const chainId = EvmChainId.ARBITRUM
const MIN_DEPOSIT_AMOUNT = 5 //5.000000 usdc

export const DepositDialog = ({
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
  const { data: vaultDetails } = useVaultDetails({
    vaultAddress,
  })
  const [open, setOpen] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>('')
  const _amount = Amount.tryFromHuman(currency, amount)
  const {
    state: {
      webData2Query: {
        data,
        isLoading: isLoadingWebData2,
        error: errorWebData2,
      },
    },
  } = useUserState()
  const {
    state: { isUnifiedAccountModeEnabled },
  } = useUserSettingsState()
  const address = useAccount('evm')
  const {
    data: spotClearinghouseState,
    isLoading: isLoadingSpotClearinghouse,
    error: errorSpotClearinghouse,
  } = useSpotClearinghouseState({ address })
  const isLoading = isLoadingWebData2 || isLoadingSpotClearinghouse
  const error = errorWebData2 || errorSpotClearinghouse

  const depositableBalance = useMemo(() => {
    if (isUnifiedAccountModeEnabled) {
      const usdc = spotClearinghouseState?.balances?.find(
        (b) => b.coin === 'USDC',
      )
      const total = usdc?.total || '0'
      const hold = usdc?.hold || '0'
      return Number(total) - Number(hold)
    }
    return data?.clearinghouseState.withdrawable
  }, [data, isUnifiedAccountModeEnabled, spotClearinghouseState])

  const balance = Amount.tryFromHuman(currency, depositableBalance ?? '0')

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
    address && depositableBalance && _amount && balance?.lt(_amount)

  const depositUsdc = useCallback(async () => {
    if (!address || !_amount) return

    await updateVaultTransferAsync({
      type: 'deposit',
      usdAmount: _amount.amount.toString(),
      vaultAddress,
    })
    setAmount('')
    setOpen(false)
  }, [address, _amount, vaultAddress, updateVaultTransferAsync])

  return (
    <PerpsDialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <PerpsDialogTrigger asChild>
        {trigger ? trigger : <Button variant="perps-secondary">Deposit</Button>}
      </PerpsDialogTrigger>
      <PerpsDialogContent>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Deposit</PerpsDialogTitle>
          <PerpsDialogDescription>
            Deposit funds to {vaultDetails?.name}. The deposit lock-up period is
            1 day.
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
                    showChildren={vaultDetails?.allowDeposits}
                    buttonText={'This vault does not accept deposits'}
                    onClick={() => {}}
                    disabled={!vaultDetails?.allowDeposits}
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
                          showChildren={Number(amount) >= MIN_DEPOSIT_AMOUNT}
                          buttonText={`Minimum Deposit ${MIN_DEPOSIT_AMOUNT} USDC`}
                          onClick={() => {}}
                          disabled={Number(amount) < MIN_DEPOSIT_AMOUNT}
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
                                  onClick={depositUsdc}
                                  loading={isPending}
                                  variant="perps-tertiary"
                                >
                                  Deposit
                                </Button>
                              </PerpsChecker.HyperReferral>
                            </PerpsChecker.BuilderFee>
                          </PerpsChecker.EnableTrading>
                        </Checker.Custom>
                      </Checker.Custom>
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
