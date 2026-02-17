import { sendAsset, withdraw3 } from '@nktkas/hyperliquid/api/exchange'
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
import { ArrowsLeftRightIcon } from '@sushiswap/ui/icons/ArrowsLeftRight'
import { useCallback, useState } from 'react'
import { hlHttpTransport } from 'src/lib/perps/transports'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { Amount } from 'sushi'
import { EvmChainId, USDC } from 'sushi/evm'
import { useAccount, useWalletClient } from 'wagmi'
import { useUserState } from '~evm/perps/user-provider'
import { TransferInput } from './transfer-input'

//@todo clean up
const currency = USDC[EvmChainId.ARBITRUM]
const chainId = EvmChainId.ARBITRUM

export const PerpSpotTransfer = () => {
  const [dst, setDst] = useState<'perp' | 'spot'>('spot')
  const [open, setOpen] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>('')
  const _amount = Amount.tryFromHuman(currency, amount)
  const { data: walletClient } = useWalletClient()
  const {
    state: {
      webData2Query: { data, isLoading, error },
    },
  } = useUserState()
  const sendableBalance =
    dst === 'spot'
      ? data?.clearinghouseState.withdrawable
      : data?.spotState?.balances?.find((b) => b.coin === 'USDC')?.total

  const balance = Amount.tryFromHuman(currency, sendableBalance ?? '0')
  const { address } = useAccount()
  const [isPending, setIsPending] = useState<boolean>(false)

  const insufficientBalance =
    address && sendableBalance && _amount && balance?.lt(_amount)

  const withdrawUsdc = useCallback(async () => {
    if (!walletClient || !address || !_amount) return
    try {
      setIsPending(true)
      createInfoToast({
        summary: `Transferring ${_amount.toSignificant(6)} USDC to ${dst === 'spot' ? 'Spot' : 'Perps'}`,
        account: address,
        type: 'send',
        timestamp: Date.now(),
        groupTimestamp: Date.now(),
        chainId: chainId,
      })
      await sendAsset(
        {
          wallet: walletClient,
          transport: hlHttpTransport,
        },
        {
          amount: _amount?.toString(),
          destination: address,
          token: 'USDC',
          sourceDex: dst === 'perp' ? 'spot' : '',
          destinationDex: dst === 'perp' ? '' : 'spot',
        },
      )
      createSuccessToast({
        summary: `Transfer of ${_amount.toSignificant(6)} USDC to ${dst === 'spot' ? 'Spot' : 'Perps'} submitted`,
        account: address,
        type: 'send',
        timestamp: Date.now(),
        groupTimestamp: Date.now(),
        chainId: chainId,
      })
      setIsPending(false)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      createErrorToast(
        `Transfer to ${dst === 'spot' ? 'Spot' : 'Perps'} failed: ${errorMessage}`,
        false,
      )
      setIsPending(false)
    } finally {
      setIsPending(false)
      setAmount('')
      setOpen(false)
    }
  }, [walletClient, address, _amount, dst])

  const handleDstToggle = useCallback(() => {
    setDst((prevDst) => (prevDst === 'spot' ? 'perp' : 'spot'))
    setAmount('')
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="secondary" size="sm">
          Perps <ArrowsLeftRightIcon className="w-2 h-2" /> Spot
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="!text-left">
          <DialogTitle>Transfer USDC</DialogTitle>
          <DialogDescription>
            Transfer USDC between your Perps and Spot balances.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
          <div className="flex flex-col gap-4">
            <Button
              className="mx-auto"
              variant="secondary"
              onClick={handleDstToggle}
            >
              {dst === 'spot' ? 'Perps' : 'Spot'}{' '}
              <ArrowsLeftRightIcon className="w-2 h-2" />{' '}
              {dst === 'spot' ? 'Spot' : 'Perps'}
            </Button>
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

            <Checker.Connect>
              <Checker.Network chainId={chainId}>
                <Checker.Custom
                  showChildren={Boolean(amount)}
                  buttonText={'Enter Amount'}
                  onClick={() => {}}
                  disabled={!amount}
                >
                  <Checker.Custom
                    showChildren={!insufficientBalance}
                    buttonText={'Insufficient Balance'}
                    onClick={() => {}}
                    disabled={Boolean(insufficientBalance)}
                  >
                    <Button
                      size="xl"
                      className="w-full"
                      onClick={withdrawUsdc}
                      loading={isPending}
                    >
                      {`Transfer to ${dst === 'spot' ? 'Spot' : 'Perps'}`}
                    </Button>
                  </Checker.Custom>
                </Checker.Custom>
              </Checker.Network>
            </Checker.Connect>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
