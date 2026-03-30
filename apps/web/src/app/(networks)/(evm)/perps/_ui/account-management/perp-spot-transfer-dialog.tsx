'use client'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import {
  type BalanceItemType,
  useSendAsset,
  useSendableAssets,
} from 'src/lib/perps'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { EvmChainId, EvmToken, USDC } from 'sushi/evm'
import { useUserState } from '~evm/perps/user-provider'
import { PerpsChecker } from '../perps-checker'
import { useAssetState } from '../trade-widget'
import { useUserSettingsState } from './settings-provider'
import { TransferInput } from './transfer-input'

const chainId = EvmChainId.ARBITRUM

export const PerpSpotTransferDialog = ({
  trigger,
  defaultDst,
  isOpen,
  onOpenChange,
  balanceItem,
  currencySymbol = 'USDC',
  defaultDex,
}: {
  trigger?: ReactNode
  defaultDst?: 'perp' | 'spot'
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  balanceItem?: BalanceItemType
  currencySymbol?: 'USDC' | 'USDT0' | 'USDH' | 'USDE'
  defaultDex?: string
}) => {
  const [dst, setDst] = useState<'perp' | 'spot'>(defaultDst ?? 'spot')
  const [open, setOpen] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>('')
  const { data: sendableAssets } = useSendableAssets('stable')
  const { sendAsset, isPending } = useSendAsset()
  const {
    state: {
      webData2Query: {
        data,
        isLoading: isWebData2Loading,
        error: webData2Error,
      },
      allDexClearinghouseStateQuery: {
        data: clearinghouseStateData,
        isLoading: isClearinghouseStateLoading,
        error: clearinghouseStateError,
      },
    },
  } = useUserState()
  const isLoading = isWebData2Loading || isClearinghouseStateLoading
  const error = webData2Error || clearinghouseStateError
  const {
    state: { asset },
  } = useAssetState()
  const {
    state: { isUnifiedAccountModeEnabled },
  } = useUserSettingsState()
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
  const currency = useMemo(() => {
    if (balanceItem) {
      const symbol = balanceItem.coin?.split(' ')[0] ?? 'USDC'
      return new EvmToken({
        address: USDC[chainId].address,
        decimals: 6,
        symbol: symbol,
        name: symbol,
        chainId,
      })
    }
    return new EvmToken({
      address: USDC[chainId].address,
      decimals: 6,
      symbol: currencySymbol,
      name: currencySymbol,
      chainId,
    })
  }, [currencySymbol, balanceItem])
  const _amount = Amount.tryFromHuman(currency, amount)

  const dexName = useMemo(() => {
    if (balanceItem) {
      return balanceItem.dex
    }
    if (defaultDex !== undefined) {
      return defaultDex
    }
    return asset?.dex || ''
  }, [asset?.dex, balanceItem, defaultDex])

  const sendableBalance = useMemo(() => {
    if (dst === 'spot') {
      return clearinghouseStateData?.clearinghouseStates.find(
        ([dex]) => dex === dexName,
      )?.[1].withdrawable
    }

    return data?.spotState?.balances?.find((b) => b.coin === currency?.symbol)
      ?.total
  }, [
    dst,
    dexName,
    clearinghouseStateData,
    data?.spotState?.balances,
    currency,
  ])

  const balance = Amount.tryFromHuman(currency, sendableBalance ?? '0')
  const address = useAccount('evm')

  const insufficientBalance =
    address && sendableBalance && _amount && balance?.lt(_amount)

  const assetToSend = useMemo(() => {
    if (currency?.symbol !== 'USDC') {
      return sendableAssets?.find((a) => a.symbol === currency?.symbol)?.token
    }
    return 'USDC'
  }, [sendableAssets, currency?.symbol])

  const transferUsdc = useCallback(() => {
    if (!address || !_amount || !assetToSend) return

    const _dexName = dexName ? dexName : ''
    sendAsset(
      {
        amount: _amount.toString(),
        decimals: 2,
        destination: address,
        token: assetToSend,
        sourceDex: dst === 'perp' ? 'spot' : _dexName,
        destinationDex: dst === 'perp' ? _dexName : 'spot',
      },
      {
        onSuccess: () => {
          setAmount('')
          handleOpenChange(false)
        },
      },
    )
  }, [address, _amount, dst, dexName, sendAsset, handleOpenChange, assetToSend])

  const handleDstToggle = useCallback(() => {
    setDst((prevDst) => (prevDst === 'spot' ? 'perp' : 'spot'))
    setAmount('')
  }, [])

  return (
    <Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild disabled={isUnifiedAccountModeEnabled}>
        {trigger ? (
          trigger
        ) : (
          <Button className="w-full" variant="perps-secondary" size="sm">
            Perps
            <ArrowsUpDownIcon className="w-3 h-3 rotate-90" /> Spot
          </Button>
        )}
      </DialogTrigger>
      <DialogContent variant="perps-default">
        <DialogHeader className="!text-left">
          <DialogTitle>Transfer {currency.symbol}</DialogTitle>
          <DialogDescription>
            Transfer {currency.symbol} between your Perps and Spot balances.
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
              <ArrowsUpDownIcon className="w-3 h-3 rotate-90" />{' '}
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

            <PerpsChecker.Legal size="default" variant="perps-default">
              <Checker.Connect
                size="default"
                variant="perps-default"
                namespace="evm"
              >
                <Checker.Custom
                  size="default"
                  showChildren={Boolean(amount)}
                  buttonText={'Enter Amount'}
                  onClick={() => {}}
                  disabled={!amount}
                  variant="perps-default"
                >
                  <Checker.Custom
                    size="default"
                    showChildren={!insufficientBalance}
                    buttonText={'Insufficient Balance'}
                    onClick={() => {}}
                    disabled={Boolean(insufficientBalance)}
                    variant="perps-default"
                  >
                    <Button
                      size="default"
                      className="w-full"
                      onClick={transferUsdc}
                      loading={isPending}
                      variant="perps-default"
                    >
                      {`Transfer to ${dst === 'spot' ? 'Spot' : 'Perps'}`}
                    </Button>
                  </Checker.Custom>
                </Checker.Custom>
              </Checker.Connect>
            </PerpsChecker.Legal>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
