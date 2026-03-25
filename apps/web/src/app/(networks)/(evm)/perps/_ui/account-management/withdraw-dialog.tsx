'use client'
import { withdraw3 } from '@nktkas/hyperliquid/api/exchange'
import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { type ReactNode, useCallback, useState } from 'react'
import { TOAST_AUTOCLOSE_TIME, hlHttpTransport } from 'src/lib/perps'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { EvmChainId, USDC } from 'sushi/evm'
import { useWalletClient } from 'wagmi'
import { useUserState } from '~evm/perps/user-provider'
import { PerpsChecker } from '../perps-checker'
import { TransferInput } from './transfer-input'

//@todo clean up
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
      webData2Query: { data, isLoading, error },
    },
  } = useUserState()
  const withdrawableBalance = data?.clearinghouseState.withdrawable
  const balance = Amount.tryFromHuman(currency, withdrawableBalance ?? '0')
  const address = useAccount('evm')
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
      })
      setIsPending(false)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      createErrorToast(`Withdraw failed: ${errorMessage}`, false)
      setIsPending(false)
    } finally {
      setIsPending(false)
      setAmount('')
      setOpen(false)
    }
  }, [walletClient, address, _amount])

  return (
    <Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="w-full" variant="perps-secondary" size="sm">
            Withdraw
          </Button>
        )}
      </DialogTrigger>
      <DialogContent variant="perps-default">
        <DialogHeader className="!text-left">
          <DialogTitle>Withdraw</DialogTitle>
          <DialogDescription>Withdraw USDC to Arbitrum.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
          <div className="flex flex-col gap-4">
            <TransferInput
              amount={amount}
              setAmount={setAmount}
              balance={balance}
              currency={currency}
              error={error?.message}
              isLoading={isLoading}
              address={address}
              chainId={chainId}
            />

            <PerpsChecker.Legal size="xl" variant="perps-default">
              <Checker.Connect variant="perps-default">
                <Checker.Network chainId={chainId} variant="perps-default">
                  <Checker.Custom
                    showChildren={Boolean(amount)}
                    buttonText={'Enter Amount'}
                    onClick={() => {}}
                    disabled={!amount}
                    variant="perps-default"
                  >
                    <Checker.Custom
                      showChildren={!insufficientBalance}
                      buttonText={'Insufficient Balance'}
                      onClick={() => {}}
                      disabled={Boolean(insufficientBalance)}
                      variant="perps-default"
                    >
                      <Checker.Custom
                        showChildren={Number(amount) >= MIN_WITHDRAW_AMOUNT}
                        buttonText={`Minimum Withdraw ${MIN_WITHDRAW_AMOUNT} USDC`}
                        onClick={() => {}}
                        disabled={Number(amount) < MIN_WITHDRAW_AMOUNT}
                        variant="perps-default"
                      >
                        <Button
                          size="xl"
                          className="w-full"
                          onClick={withdrawUsdc}
                          loading={isPending}
                          variant="perps-default"
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
              <p className="text-xs text-muted-foreground italic mb-1">
                A fee of 1 USDC will be deducted from the USDC withdrawn.
              </p>
              <p className="text-xs text-muted-foreground italic">
                If you have USDC in your Spot Balances, transfer it to Perps to
                make it available to withdraw. Withdrawals should arrive within
                5 minutes.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
