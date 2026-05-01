'use client'
import { withdraw3 } from '@nktkas/hyperliquid/api/exchange'
import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
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
import {
  TOAST_AUTOCLOSE_TIME,
  hlHttpTransport,
  useSpotClearinghouseState,
} from 'src/lib/perps'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { EvmChainId, USDC } from 'sushi/evm'
import { useWalletClient } from 'wagmi'
import { useUserState } from '~evm/perps/user-provider'
import { InputWithKeyboard } from '../_common'
import { PerpsChecker } from '../perps-checker'
import { useUserSettingsState } from './settings-provider'

//@todo add more options
const currency = USDC[EvmChainId.ARBITRUM]
const chainId = EvmChainId.ARBITRUM
const MIN_WITHDRAW_AMOUNT = 2 //2.000000 usdc

export const WithdrawDialog = ({
  trigger,
  isOpen,
  onOpenChange,
}: {
  trigger?: ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>('')
  const _amount = Amount.tryFromHuman(currency, amount)
  const { data: walletClient } = useWalletClient()
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

  const withdrawableBalance = useMemo(() => {
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
  const balance = Amount.tryFromHuman(currency, withdrawableBalance ?? '0')

  const [isPending, setIsPending] = useState<boolean>(false)

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
    address && withdrawableBalance && _amount && balance?.lt(_amount)

  const withdrawUsdc = useCallback(async () => {
    if (!walletClient || !address || !_amount) return
    try {
      setIsPending(true)
      createInfoToast({
        summary: `Withdrawing ${_amount.toSignificant(6)} USDC`,
        account: address,
        type: 'send',
        timestamp: Date.now(),
        groupTimestamp: Date.now(),
        chainId: chainId,
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })
      await withdraw3(
        {
          wallet: walletClient,
          transport: hlHttpTransport,
        },
        {
          amount: _amount?.toString(),
          destination: address,
        },
      )
      createSuccessToast({
        summary: `Withdraw for ${_amount.toSignificant(6)} USDC submitted`,
        account: address,
        type: 'send',
        timestamp: Date.now(),
        groupTimestamp: Date.now(),
        chainId: chainId,
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })
      setIsPending(false)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      createErrorToast(`Withdraw failed: ${errorMessage}`, false, 'perps')
      setIsPending(false)
    } finally {
      setIsPending(false)
      setAmount('')
      setOpen(false)
    }
  }, [walletClient, address, _amount])

  return (
    <PerpsDialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <PerpsDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="w-full" variant="perps-secondary" size="sm">
            Withdraw
          </Button>
        )}
      </PerpsDialogTrigger>
      <PerpsDialogContent>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Withdraw</PerpsDialogTitle>
          <PerpsDialogDescription>
            Withdraw USDC to Arbitrum.
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
                        showChildren={Number(amount) >= MIN_WITHDRAW_AMOUNT}
                        buttonText={`Minimum Withdraw ${MIN_WITHDRAW_AMOUNT} USDC`}
                        onClick={() => {}}
                        disabled={Number(amount) < MIN_WITHDRAW_AMOUNT}
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
                      </Checker.Custom>
                    </Checker.Custom>
                  </Checker.Custom>
                </Checker.Network>
              </Checker.Connect>
            </PerpsChecker.Legal>
            <div>
              <p className="text-xs text-perps-muted-50 text-center italic mb-1">
                A fee of 1 USDC will be deducted from the USDC withdrawn. If you
                have USDC in your Spot Balances, transfer it to Perps to make it
                available to withdraw. Withdrawals should arrive within 5
                minutes.
              </p>
            </div>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
