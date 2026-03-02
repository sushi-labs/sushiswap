import { sendAsset, withdraw3 } from '@nktkas/hyperliquid/api/exchange'
import { formatSize } from '@nktkas/hyperliquid/utils'
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
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { TOAST_AUTOCLOSE_TIME } from 'src/lib/perps/config'
import { hlHttpTransport } from 'src/lib/perps/transports'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { EvmChainId, USDC } from 'sushi/evm'
import { useWalletClient } from 'wagmi'
import { useUserState } from '~evm/perps/user-provider'
import { useAssetState } from '../trade-widget/asset-state-provider'
import { TransferInput } from './transfer-input'

//@todo clean up
const currency = USDC[EvmChainId.ARBITRUM]
const chainId = EvmChainId.ARBITRUM

export const PerpSpotTransfer = ({
  trigger,
  defaultDst,
}: { trigger?: ReactNode; defaultDst?: 'perp' | 'spot' }) => {
  const [dst, setDst] = useState<'perp' | 'spot'>(defaultDst ?? 'spot')
  const [open, setOpen] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>('')
  const _amount = Amount.tryFromHuman(currency, amount)
  const { data: walletClient } = useWalletClient()
  const {
    state: {
      webData2Query: { data, isLoading, error },
    },
  } = useUserState()
  const {
    state: { asset, availableToLong },
  } = useAssetState()
  const dexName = useMemo(() => asset?.dex || '', [asset?.dex])

  const sendableBalance = useMemo(() => {
    if (dst === 'spot' && !dexName) {
      return data?.clearinghouseState.withdrawable
    }
    if (dst === 'spot' && dexName) {
      return availableToLong
    }

    return data?.spotState?.balances?.find((b) => b.coin === 'USDC')?.total
  }, [data, dst, dexName, availableToLong])
  const balance = Amount.tryFromHuman(currency, sendableBalance ?? '0')
  const address = useAccount('evm')
  const [isPending, setIsPending] = useState<boolean>(false)

  const insufficientBalance =
    address && sendableBalance && _amount && balance?.lt(_amount)

  const withdrawUsdc = useCallback(async () => {
    if (!walletClient || !address || !_amount) return
    try {
      setIsPending(true)
      createInfoToast({
        summary: `Transferring ${_amount.toSignificant(4)} USDC to ${dst === 'spot' ? 'Spot' : 'Perps'}`,
        account: address,
        type: 'send',
        timestamp: Date.now(),
        groupTimestamp: Date.now(),
        chainId: chainId,
        autoClose: TOAST_AUTOCLOSE_TIME,
      })
      const _dexName = dexName ? dexName : ''
      await sendAsset(
        {
          wallet: walletClient,
          transport: hlHttpTransport,
        },
        {
          amount: formatSize(_amount?.toString(), 2),
          destination: address,
          token: 'USDC',
          sourceDex: dst === 'perp' ? 'spot' : _dexName,
          destinationDex: dst === 'perp' ? _dexName : 'spot',
        },
      )
      createSuccessToast({
        summary: `Transfer of ${_amount.toSignificant(4)} USDC to ${dst === 'spot' ? 'Spot' : 'Perps'} submitted`,
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
  }, [walletClient, address, _amount, dst, dexName])

  const handleDstToggle = useCallback(() => {
    setDst((prevDst) => (prevDst === 'spot' ? 'perp' : 'spot'))
    setAmount('')
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="w-full" variant="secondary" size="sm">
            Perps
            <ArrowsLeftRightIcon className="w-2 h-2" /> Spot
          </Button>
        )}
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
              {dst === 'spot'
                ? `Perps ${dexName ? `(${dexName})` : ''}`
                : 'Spot'}{' '}
              <ArrowsLeftRightIcon className="w-2 h-2 min-w-2 min-h-2" />{' '}
              {dst === 'spot'
                ? 'Spot'
                : `Perps ${dexName ? `(${dexName})` : ''}`}
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
              {/* <Checker.Network chainId={dst === 'perp' ? undefined : chainId}> */}
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
              {/* </Checker.Network> */}
            </Checker.Connect>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
