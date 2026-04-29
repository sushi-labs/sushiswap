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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  classNames,
} from '@sushiswap/ui'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { NativeAddress } from 'src/lib/constants'
import {
  BUILDER_FEE_SPOT,
  type OrderData,
  type SendableAssetType,
  currencyFormatter,
  formatPrice,
  formatSize,
  perpsNumberFormatter,
  useExecuteOrders,
  useMidPrice,
  useSendAsset,
  useSendableAssets,
} from 'src/lib/perps'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { EvmChainId, EvmToken } from 'sushi/evm'
import { formatUnits, parseUnits } from 'viem'
import { StatItem, ValueInput } from '../_common'
import { PerpsChecker } from '../perps-checker'

const STABLE_PAIRS: Record<string, string[]> = {
  USDC: ['USDT0', 'USDH', 'USDE'],
  USDT0: ['USDC'],
  USDH: ['USDC'],
  USDE: ['USDC'],
}

export const SwapStablesDialog = ({
  trigger,
  isOpen,
  onOpenChange,
  nonSelectableSwapData,
}: {
  trigger?: ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  nonSelectableSwapData?: {
    assetSymbolToSend: string
    assetSymbolToBuy: string
  }
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>('')
  const { data: sendableAssets } = useSendableAssets('stable')
  const [assetToSend, setAssetToSend] = useState<SendableAssetType | null>(null)
  const [assetToBuy, setAssetToBuy] = useState<SendableAssetType | null>(null)
  const address = useAccount('evm')
  const { executeOrdersAsync, isPending: isPendingOrder } = useExecuteOrders()
  const { sendAssetAsync, isPending: isPendingSendAsset } = useSendAsset()
  const { midPrice } = useMidPrice({
    assetString: assetToBuy?.assetName ?? undefined,
  })
  const isPending = isPendingOrder || isPendingSendAsset

  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open

  useEffect(() => {
    if (
      nonSelectableSwapData &&
      sendableAssets &&
      (!assetToSend || !assetToBuy)
    ) {
      const _assetToSend =
        sendableAssets.find(
          (asset) => asset.symbol === nonSelectableSwapData.assetSymbolToSend,
        ) || null
      const _assetToBuy =
        sendableAssets.find(
          (asset) => asset.symbol === nonSelectableSwapData.assetSymbolToBuy,
        ) || null
      setAssetToSend(_assetToSend)
      setAssetToBuy(_assetToBuy)
    }
  }, [nonSelectableSwapData, assetToSend, assetToBuy, sendableAssets])

  const assetsToSelect = useMemo(() => {
    const validSymbols = STABLE_PAIRS[assetToSend?.symbol ?? ''] ?? []
    return {
      sell: sendableAssets,
      buy: sendableAssets?.filter((i) => validSymbols.includes(i.symbol)) ?? [],
    }
  }, [sendableAssets, assetToSend])

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

  useEffect(() => {
    if (
      !assetToSend &&
      assetsToSelect['sell']?.length > 0 &&
      !nonSelectableSwapData
    ) {
      setAssetToSend(assetsToSelect['sell'][0])
    }
    if (
      !assetToBuy &&
      assetsToSelect['buy']?.length > 0 &&
      !nonSelectableSwapData
    ) {
      setAssetToBuy(assetsToSelect['buy'][0])
    }
  }, [assetToBuy, assetToSend, assetsToSelect, nonSelectableSwapData])

  const handleMaxAmount = useCallback(() => {
    if (!assetToSend) return
    //max two decimals for stablecoins
    const [big, portion] = assetToSend.balance.split('.')
    if (portion) {
      setAmount(`${big}.${portion.slice(0, 2)}`)
    } else {
      setAmount(assetToSend.balance)
    }
  }, [assetToSend])

  const amountToSend = useMemo(() => {
    if (!assetToSend || !amount) return undefined
    const decimals =
      assetToSend.evmAddressData?.address === NativeAddress
        ? 18
        : assetToSend.decimals +
          (assetToSend?.evmAddressData?.evm_extra_wei_decimals || 0)
    const currency = new EvmToken({
      chainId: EvmChainId.HYPEREVM,
      address: assetToSend.evmAddressData?.address || '0x',
      decimals: decimals,
      name: assetToSend.symbol,
      symbol: assetToSend.symbol,
    })
    return Amount.tryFromHuman(currency, amount)
  }, [assetToSend, amount])

  const insufficientBalance = useMemo(() => {
    if (!address || !assetToSend || !amountToSend?.currency) return false

    const balance = Amount.tryFromHuman(
      amountToSend?.currency,
      assetToSend.balance,
    )

    if (!balance || !amountToSend) return false

    return balance.lt(amountToSend)
  }, [address, assetToSend, amountToSend])

  const estimatedFee = useMemo(() => {
    if (!assetToSend || !assetToBuy || !amountToSend) return '0'
    return amountToSend.mulHuman(0.000139993).toSignificant(2)
  }, [assetToSend, assetToBuy, amountToSend])

  const orderData = useMemo<OrderData | undefined>(() => {
    if (
      !midPrice ||
      !assetToSend ||
      !amountToSend ||
      !assetToBuy ||
      !assetToBuy?.assetName ||
      !address ||
      assetToSend?.marketType !== 'spot'
    ) {
      return undefined
    }
    const _midPrice = parseUnits(
      assetToBuy?.assetName === 'PURR/USDC' ? '1' : midPrice,
      assetToBuy?.decimals,
    )
    const side =
      assetToSend?.symbol === 'USDC' ? ('long' as const) : ('short' as const)
    const adjustedPrice =
      (_midPrice * BigInt(side === 'long' ? 10_010 : 9_990)) / BigInt(10_000) // 1% slippage
    const price = formatPrice(
      formatUnits(adjustedPrice, assetToBuy?.decimals),
      2,
      assetToBuy?.marketType,
    )

    const _size = formatSize(amountToSend.toString(), 2)
    let assetToUse = assetToBuy.assetName
    if (assetToBuy.symbol === 'USDC') {
      assetToUse = assetToSend.assetName
    }
    const order = {
      asset: assetToUse,
      side,
      price: price,
      size: _size,
      reduceOnly: false,
      orderType: { limit: { timeInForce: 'FrontendMarket' as const } },
    }

    return {
      orders: [order],
      grouping: 'na' as const,
      builder: {
        builderFee: BUILDER_FEE_SPOT,
      },
    }
  }, [assetToBuy, assetToSend, address, midPrice, amountToSend])

  const swapStables = useCallback(async () => {
    if (!orderData || !assetToSend || !address || !amountToSend?.currency)
      return
    const spotBalance = Amount.tryFromHuman(
      amountToSend?.currency,
      assetToSend?.spotBalance || '0',
    )
    if (
      spotBalance &&
      assetToSend.symbol === 'USDC' &&
      assetToSend?.spotBalance &&
      amountToSend?.gt(spotBalance)
    ) {
      const amountToSendFromPerp = spotBalance
        ? amountToSend.sub(spotBalance)
        : amountToSend
      await sendAssetAsync({
        amount: amountToSendFromPerp.toString(),
        decimals: 2,
        destination: address,
        token: 'USDC',
        sourceDex: '',
        destinationDex: 'spot',
      })
    }
    await executeOrdersAsync(
      { orderData },
      {
        onSuccess: () => {
          setAmount('')
          handleOpenChange(false)
        },
      },
    )
  }, [
    orderData,
    executeOrdersAsync,
    sendAssetAsync,
    handleOpenChange,
    assetToSend,
    address,
    amountToSend,
  ])

  const handleSelectAssetToSend = useCallback(
    (symbol: string) => {
      const asset =
        assetsToSelect.sell?.find((a) => a?.symbol === symbol) ?? null
      setAssetToSend(asset)

      const validSymbols = STABLE_PAIRS[symbol] ?? []
      const assetToBuy =
        assetsToSelect.buy?.find((i) => validSymbols.includes(i.symbol)) ?? null
      setAssetToBuy(assetToBuy)
    },
    [assetsToSelect],
  )
  const handleSelectAssetToBuy = useCallback(
    (symbol: string) => {
      const asset =
        assetsToSelect['buy']?.find((a) => a?.symbol === symbol) || null
      setAssetToBuy(asset)
    },
    [assetsToSelect],
  )

  return (
    <PerpsDialog
      open={resolvedOpen}
      onOpenChange={(val) => {
        handleOpenChange(val)
      }}
    >
      <PerpsDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="w-full" variant="perps-secondary" size="sm">
            Swap{' '}
            {nonSelectableSwapData
              ? `${nonSelectableSwapData?.assetSymbolToSend} for ${nonSelectableSwapData?.assetSymbolToBuy}`
              : 'Stablecoins'}
          </Button>
        )}
      </PerpsDialogTrigger>
      <PerpsDialogContent className="max-w-xl">
        <PerpsDialogHeader>
          <PerpsDialogTitle>
            Swap{' '}
            {nonSelectableSwapData
              ? `${nonSelectableSwapData?.assetSymbolToSend} for ${nonSelectableSwapData?.assetSymbolToBuy}`
              : 'Stablecoins'}
          </PerpsDialogTitle>
          <PerpsDialogDescription>
            {nonSelectableSwapData
              ? 'Swap between stablecoins.'
              : 'Swap between different stablecoins in your Spot account.'}
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="flex flex-col gap-2">
            {nonSelectableSwapData ? null : (
              <Select
                value={assetToSend?.symbol || ''}
                onValueChange={handleSelectAssetToSend}
              >
                <SelectTrigger className="capitalize whitespace-nowrap text-sm !px-2 !h-[41px] !pl-4 !gap-1 !border !border-[#FFFFFF1A] bg-transparent">
                  {assetToSend
                    ? `${assetToSend?.symbol} ${Number(assetToSend?.balance) > 0 ? ` - ${perpsNumberFormatter({ value: assetToSend?.balance, maxFraxDigits: 2, minFraxDigits: 2 })}` : ''}`
                    : 'Select Asset'}
                </SelectTrigger>
                <SelectContent className="w-full !bg-black/10">
                  {assetsToSelect['sell']?.map((i) => (
                    <SelectItem
                      key={i?.symbol}
                      value={i?.symbol}
                      className="capitalize font-medium !text-white gap-4"
                    >
                      {i?.symbol}
                      {' - '}
                      {currencyFormatter.format(Number(i?.usdcValue))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div className="relative flex w-full">
              <ValueInput
                value={amount}
                onChange={setAmount}
                label=""
                type="number"
                placeholder="Amount"
                inputClassName="!text-left !text-sm placeholder:text-[#8f9399] pr-10"
                maxDecimals={2}
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
                Max{' '}
                {nonSelectableSwapData
                  ? `: ${perpsNumberFormatter({ value: assetToSend?.balance || '0', maxFraxDigits: 2, minFraxDigits: 2 })}`
                  : null}
              </Button>
            </div>
            {nonSelectableSwapData ? null : (
              <Select
                value={assetToBuy?.symbol || ''}
                onValueChange={handleSelectAssetToBuy}
              >
                <SelectTrigger className="capitalize whitespace-nowrap text-sm !px-2 !h-[41px] !pl-4 !gap-1 !border !border-[#FFFFFF1A] bg-transparent">
                  {assetToBuy
                    ? `${assetToBuy?.symbol} ${Number(assetToBuy?.balance) > 0 ? ` - ${perpsNumberFormatter({ value: assetToBuy?.balance, maxFraxDigits: 2, minFraxDigits: 2 })}` : ''}`
                    : 'Select Asset'}
                </SelectTrigger>
                <SelectContent className="w-full !bg-black/10">
                  {assetsToSelect['buy']?.map((i) => (
                    <SelectItem
                      key={i?.symbol}
                      value={i?.symbol}
                      className="capitalize font-medium !text-white gap-4"
                    >
                      {i?.symbol}
                      {' - '}
                      {currencyFormatter.format(Number(i?.usdcValue))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <StatItem
              title="You receive approx."
              value={`${perpsNumberFormatter({ value: amount || 0, minFraxDigits: 2, maxFraxDigits: 2 })} ${assetToBuy?.symbol || ''}`}
            />
            <StatItem
              title="Estimated Fee"
              value={`${perpsNumberFormatter({ value: estimatedFee, minFraxDigits: 2, maxFraxDigits: 2 })} ${assetToBuy?.symbol || ''}`}
            />
            <div className="mt-2">
              <PerpsChecker.Legal size="default" variant="perps-tertiary">
                <Checker.Connect
                  size="default"
                  variant="perps-tertiary"
                  namespace="evm"
                >
                  <Checker.Network
                    chainId={EvmChainId.HYPEREVM}
                    size="default"
                    variant="perps-tertiary"
                  >
                    <Checker.Custom
                      size="default"
                      showChildren={Boolean(assetToSend)}
                      buttonText={'Select Asset'}
                      onClick={() => {}}
                      disabled={!assetToSend}
                      variant="perps-tertiary"
                    >
                      <Checker.Custom
                        size="default"
                        showChildren={Number(amount) > 0}
                        buttonText={'Enter Amount'}
                        onClick={() => {}}
                        disabled={Number(amount) <= 0}
                        variant="perps-tertiary"
                      >
                        <Checker.Custom
                          size="default"
                          showChildren={Number(amount) > 10}
                          buttonText={'Value Must Be Greater Than 10'}
                          onClick={() => {}}
                          disabled={Number(amount) <= 10}
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
                              onClick={swapStables}
                              loading={isPending}
                              variant="perps-tertiary"
                            >
                              Confirm
                            </Button>
                          </Checker.Custom>
                        </Checker.Custom>
                      </Checker.Custom>
                    </Checker.Custom>
                  </Checker.Network>
                </Checker.Connect>
              </PerpsChecker.Legal>
            </div>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
