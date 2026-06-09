'use client'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  IconButton,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  classNames,
} from '@sushiswap/ui'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import {
  type BalanceItemType,
  perpsNumberFormatter,
  useSendAsset,
  useSendableAssets,
} from 'src/lib/perps'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { EvmChainId, EvmToken, USDC } from 'sushi/evm'
import { useUserState } from '~evm/perps/user-provider'
import { ValueInput } from '../_common'
import { useAssetListState } from '../asset-selector'
import { PerpsChecker } from '../perps-checker'
import { useAssetState } from '../trade-widget'
import { useUserSettingsState } from './settings-provider'

const chainId = EvmChainId.ARBITRUM

export const PerpSpotTransferDialog = ({
  trigger,
  defaultDst,
  isOpen,
  onOpenChange,
  balanceItem,
  defaultDex,
}: {
  trigger?: ReactNode
  defaultDst?: 'perp' | 'spot'
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  balanceItem?: BalanceItemType
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
        // isLoading: isWebData2Loading,
        // error: webData2Error,
      },
      allDexClearinghouseStateQuery: {
        data: clearinghouseStateData,
        // isLoading: isClearinghouseStateLoading,
        // error: clearinghouseStateError,
      },
    },
  } = useUserState()
  // const isLoading = isWebData2Loading || isClearinghouseStateLoading
  // const error = webData2Error || clearinghouseStateError
  const {
    state: { asset },
  } = useAssetState()
  const {
    state: { isUnifiedAccountModeEnabled },
  } = useUserSettingsState()
  const {
    state: { dexQuoteMap, uniqueDexes },
  } = useAssetListState()

  const [selectedDex, setSelectedDex] = useState<string>(
    balanceItem?.dex ?? defaultDex ?? asset?.dex ?? '',
  )
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
    const quoteSymbol =
      selectedDex !== undefined && dexQuoteMap?.has(selectedDex)
        ? dexQuoteMap?.get(selectedDex)
        : 'USDC'
    return new EvmToken({
      address: USDC[chainId].address,
      decimals: 6,
      symbol: quoteSymbol || '',
      name: quoteSymbol || '',
      chainId,
    })
  }, [selectedDex, dexQuoteMap])

  const _amount = Amount.tryFromHuman(currency, amount)

  const sendableBalance = useMemo(() => {
    if (dst === 'spot') {
      return clearinghouseStateData?.clearinghouseStates.find(
        ([dex]) => dex === selectedDex,
      )?.[1].withdrawable
    }

    const spot = data?.spotState?.balances?.find(
      (b) => b.coin === currency?.symbol,
    )
    const total = Number(spot?.total || 0)
    const hold = Number(spot?.hold || 0)
    const balance = total - hold
    return balance.toString()
  }, [
    dst,
    selectedDex,
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

    const _dexName = selectedDex ? selectedDex : ''
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
  }, [
    address,
    _amount,
    dst,
    selectedDex,
    sendAsset,
    handleOpenChange,
    assetToSend,
  ])

  const handleDstToggle = useCallback(() => {
    setDst((prevDst) => (prevDst === 'spot' ? 'perp' : 'spot'))
    setAmount('')
  }, [])

  const handleMaxAmount = useCallback(() => {
    if (!balance) return
    setAmount(balance.toString())
  }, [balance])

  if (isUnifiedAccountModeEnabled) {
    return (
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger
          asChild
          tabIndex={0}
          className="opacity-50 cursor-not-allowed"
        >
          {trigger ? (
            trigger
          ) : (
            <Button className="w-full" variant="perps-secondary" size="sm">
              Perps
              <ArrowsUpDownIcon className="w-3 h-3 rotate-90" /> Spot
            </Button>
          )}
        </HoverCardTrigger>
        <HoverCardContent
          forceMount
          side="top"
          className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
        >
          <p>
            When unified account is enabled, trading is from a single unified
            account.
          </p>
        </HoverCardContent>
      </HoverCard>
    )
  }

  return (
    <PerpsDialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <PerpsDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="w-full" variant="perps-secondary" size="sm">
            Perps
            <ArrowsUpDownIcon className="w-3 h-3 rotate-90" /> Spot
          </Button>
        )}
      </PerpsDialogTrigger>

      <PerpsDialogContent>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Transfer {currency.symbol}</PerpsDialogTitle>
          <PerpsDialogDescription>
            Transfer {currency.symbol} between your Perps and Spot balances.
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center self-center gap-2">
              <div className="text-right">
                {dst === 'spot'
                  ? `Perps ${selectedDex ? `(${selectedDex})` : ''}`
                  : 'Spot'}{' '}
              </div>
              <IconButton
                variant="perps-secondary"
                onClick={handleDstToggle}
                className="!rounded-full"
                name="switch"
                icon={ArrowsUpDownIcon}
                iconProps={{
                  className: 'w-3 h-3 rotate-90 text-perps-blue',
                }}
              />
              <div>
                {dst === 'spot'
                  ? 'Spot'
                  : `Perps ${selectedDex ? `(${selectedDex})` : ''}`}
              </div>
            </div>

            <Select
              value={selectedDex}
              onValueChange={(val: string) => {
                setSelectedDex(val === 'hyper' ? '' : val)
              }}
            >
              <SelectTrigger className="w-full text-sm !px-2 !h-[40px] !gap-1 !border-[#FFFFFF1A] bg-transparent !border">
                <div className="flex items-center gap-1 pl-2">
                  <span className="text-perps-muted-50">
                    Selected Perps Dex:{' '}
                  </span>
                  {selectedDex === '' ? 'hyper' : selectedDex}
                  {dexQuoteMap?.has(selectedDex)
                    ? ` - ${dexQuoteMap.get(selectedDex)}`
                    : ' - USDC'}
                </div>
              </SelectTrigger>
              <SelectContent className="w-full !bg-black/10">
                {['hyper', ...uniqueDexes]?.map((i, idx) => (
                  <SelectItem
                    key={`${i}-${idx}`}
                    value={i}
                    className="font-medium !text-white gap-4"
                  >
                    {i}{' '}
                    {dexQuoteMap?.has(i) ? `- ${dexQuoteMap.get(i)}` : '- USDC'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex w-full">
              <ValueInput
                value={amount}
                onChange={setAmount}
                label=""
                type="number"
                placeholder="Amount"
                inputClassName="!text-left !text-sm placeholder:text-[#8f9399] pr-10"
                maxDecimals={currency?.decimals ?? 6}
                className="!px-2 !py-0.5 !text-sm"
              />
              <Button
                size="xs"
                variant={'perps-secondary'}
                onClick={handleMaxAmount}
                className={classNames(
                  'text-xs !min-h-[18px] !h-[18px] !px-1 !rounded-md absolute top-1/2 -translate-y-1/2 right-2',
                )}
              >
                Max:{' '}
                {balance
                  ? perpsNumberFormatter({
                      value: balance?.toString() || '0',
                      maxFraxDigits: 6,
                    })
                  : '0'}{' '}
                {currency.symbol}
              </Button>
            </div>

            <PerpsChecker.Legal size="default" variant="perps-tertiary">
              <Checker.Connect
                size="default"
                variant="perps-tertiary"
                namespace="evm"
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
                    <Button
                      size="default"
                      className="w-full"
                      onClick={transferUsdc}
                      loading={isPending}
                      variant="perps-tertiary"
                    >
                      {`Transfer to ${dst === 'spot' ? 'Spot' : `Perps ${selectedDex ? `(${selectedDex})` : ''}`}`}
                    </Button>
                  </Checker.Custom>
                </Checker.Custom>
              </Checker.Connect>
            </PerpsChecker.Legal>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
