'use client'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  useSendableAssets,
} from 'src/lib/perps'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { EvmChainId, EvmToken } from 'sushi/evm'
import { formatUnits, parseUnits } from 'viem'
import { StatItem, ValueInput } from '../_common'
import { PerpsChecker } from '../perps-checker'

export const SwapStablesDialog = ({
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
  const { data: sendableAssets } = useSendableAssets('stable')
  const [assetToSend, setAssetToSend] = useState<SendableAssetType | null>(null)
  const [assetToBuy, setAssetToBuy] = useState<SendableAssetType | null>(null)
  const address = useAccount('evm')
  const { executeOrders, isPending } = useExecuteOrders()
  const { midPrice } = useMidPrice({
    assetString: assetToBuy?.assetName ?? undefined,
  })

  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open

  const assetsToSelect = useMemo(() => {
    return {
      sell: sendableAssets,
      buy:
        sendableAssets?.filter((i) => {
          if (assetToSend?.symbol === 'USDC') {
            return i.symbol === 'USDT0' || i.symbol === 'USDH'
          }
          if (
            assetToSend?.symbol === 'USDT0' ||
            assetToSend?.symbol === 'USDH'
          ) {
            return i.symbol === 'USDC'
          }
        }) || [],
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
    if (!assetToSend && assetsToSelect['sell']?.length > 0) {
      setAssetToSend(assetsToSelect['sell'][0])
    }
    if (!assetToBuy && assetsToSelect['buy']?.length > 0) {
      setAssetToBuy(assetsToSelect['buy'][0])
    }
  }, [assetToBuy, assetToSend, assetsToSelect])

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

  const swapStables = useCallback(() => {
    if (!orderData) return
    executeOrders(
      { orderData },
      {
        onSuccess: () => {
          setAmount('')
          handleOpenChange(false)
        },
      },
    )
  }, [orderData, executeOrders, handleOpenChange])

  const handleSelectAssetToSend = useCallback(
    (symbol: string) => {
      const asset =
        assetsToSelect['sell']?.find((a) => a?.symbol === symbol) || null
      setAssetToSend(asset)
      if (symbol === 'USDC') {
        const assetToBuy =
          assetsToSelect['buy']?.find(
            (i) => i.symbol === 'USDT0' || i.symbol === 'USDH',
          ) || null
        setAssetToBuy(assetToBuy)
        return
      }
      if (symbol === 'USDT0' || symbol === 'USDH') {
        const assetToBuy =
          assetsToSelect['buy']?.find((i) => i.symbol === 'USDC') || null
        setAssetToBuy(assetToBuy)
        return
      }
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
    <Dialog
      open={resolvedOpen}
      onOpenChange={(val) => {
        handleOpenChange(val)
      }}
    >
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="w-full" variant="perps-secondary" size="sm">
            Swap Stablecoins
          </Button>
        )}
      </DialogTrigger>
      <DialogContent variant="perps-default" className="max-w-xl">
        <DialogHeader className="!text-left">
          <DialogTitle>Swap Stablecoins</DialogTitle>
          <DialogDescription>
            Swap between different stablecoins in your Spot account.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <Select
              value={assetToSend?.symbol || ''}
              onValueChange={handleSelectAssetToSend}
            >
              <SelectTrigger className="capitalize whitespace-nowrap text-sm !px-2 !h-[42px]  !gap-1 !border !border-[#FFFFFF1A] bg-[#FFFFFF0D]">
                {assetToSend
                  ? `${assetToSend?.symbol} ${Number(assetToSend?.balance) > 0 ? ` - ${perpsNumberFormatter({ value: assetToSend?.balance, maxFraxDigits: 2, minFraxDigits: 2 })}` : ''}`
                  : 'Select Asset'}
              </SelectTrigger>
              <SelectContent className="w-full">
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
            <div className="relative flex w-full">
              <ValueInput
                value={amount}
                onChange={setAmount}
                label=""
                type="number"
                placeholder="Amount"
                inputClassName="!text-left !text-sm placeholder:text-[#4A5565] pr-10"
                maxDecimals={2}
                className="!px-2 !py-0 !text-sm"
              />
              <Button
                size="xs"
                variant={'perps-secondary'}
                onClick={handleMaxAmount}
                className={classNames(
                  'text-xs !min-h-[18px] !h-[18px] !px-1 !rounded-md absolute top-1/2 -translate-y-1/2 right-2',
                )}
              >
                Max
              </Button>
            </div>
            <Select
              value={assetToBuy?.symbol || ''}
              onValueChange={handleSelectAssetToBuy}
            >
              <SelectTrigger className="capitalize whitespace-nowrap text-sm !px-2 !h-[42px]  !gap-1 !border !border-[#FFFFFF1A] bg-[#FFFFFF0D]">
                {assetToBuy
                  ? `${assetToBuy?.symbol} ${Number(assetToBuy?.balance) > 0 ? ` - ${perpsNumberFormatter({ value: assetToBuy?.balance, maxFraxDigits: 2, minFraxDigits: 2 })}` : ''}`
                  : 'Select Asset'}
              </SelectTrigger>
              <SelectContent className="w-full">
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
            <StatItem
              title="You receive approx."
              value={`${perpsNumberFormatter({ value: amount || 0, minFraxDigits: 2, maxFraxDigits: 2 })} ${assetToBuy?.symbol || ''}`}
            />
            <StatItem
              title="Estimated Fee"
              value={`${perpsNumberFormatter({ value: estimatedFee, minFraxDigits: 2, maxFraxDigits: 2 })} ${assetToBuy?.symbol || ''}`}
            />
            <div className="mt-2">
              <PerpsChecker.Legal size="default" variant="perps-default">
                <Checker.Connect size="default" variant="perps-default">
                  <Checker.Network
                    chainId={EvmChainId.HYPEREVM}
                    size="default"
                    variant="perps-default"
                  >
                    <Checker.Custom
                      size="default"
                      showChildren={Boolean(assetToSend)}
                      buttonText={'Select Asset'}
                      onClick={() => {}}
                      disabled={!assetToSend}
                      variant="perps-default"
                    >
                      <Checker.Custom
                        size="default"
                        showChildren={Number(amount) > 0}
                        buttonText={'Enter Amount'}
                        onClick={() => {}}
                        disabled={Number(amount) <= 0}
                        variant="perps-default"
                      >
                        <Checker.Custom
                          size="default"
                          showChildren={Number(amount) > 10}
                          buttonText={'Value Must Be Greater Than 10'}
                          onClick={() => {}}
                          disabled={Number(amount) <= 10}
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
                              onClick={swapStables}
                              loading={isPending}
                              variant="perps-default"
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
