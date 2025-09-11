import {
  ArrowTopRightOnSquareIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/20/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import type { PinnedTokenId } from '@sushiswap/hooks'
import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import {
  IconButton,
  SkeletonCircle,
  SkeletonText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import { Badge } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type React from 'react'
import {
  type CSSProperties,
  type FC,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { NativeAddress } from 'src/lib/constants'
import { useNetworkOptions } from 'src/lib/hooks/useNetworkOptions'
import { formatUSD, getChainById } from 'sushi'
import { type Amount, ZERO } from 'sushi'
import {
  type EvmChainId,
  type EvmCurrency,
  EvmNative,
  EvmToken,
} from 'sushi/evm'
import { formatUnits, zeroAddress } from 'viem'
import { NetworkButton } from '~evm/[chainId]/(trade)/swap/_ui/chain-options-selector'
import { FavoriteButton } from '~evm/[chainId]/(trade)/swap/_ui/trade/favorite-button'

export interface TokenSelectorRowV2 {
  account?: `0x${string}`
  currency: EvmCurrency
  style?: CSSProperties
  className?: string
  onSelect(currency: EvmCurrency): void
  balance?: Amount<EvmCurrency> | undefined
  showWarning: boolean
  price?: number
  selected: boolean
  isBalanceLoading: boolean
  onShowInfo: () => void
  showChainOptions: boolean
  bridgeInfo?: { address: string; chainId: unknown; decimals: number }[] | null
}

export const TokenSelectorRowV2: FC<TokenSelectorRowV2> = memo(
  function TokenSelectorRow({
    price,
    balance,
    currency,
    style,
    className,
    onSelect,
    selected,
    isBalanceLoading,
    showWarning,
    onShowInfo,
    showChainOptions,
    bridgeInfo,
  }) {
    const [isHovered, setIsHovered] = useState(false)

    const onClick = useCallback(
      (newCurrency: EvmCurrency) => {
        onSelect(newCurrency)
      },
      [onSelect],
    )

    const showInfo = useCallback(
      (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation()
        onShowInfo()
      },
      [onShowInfo],
    )
    const { networkOptions } = useNetworkOptions()

    const filteredBridgeInfo = useMemo(() => {
      if (!bridgeInfo) return []
      return bridgeInfo.filter((info) =>
        networkOptions.some((option) => option === info.chainId),
      )
    }, [bridgeInfo, networkOptions])

    return (
      <TraceEvent
        events={[BrowserEvent.onClick, BrowserEvent.onKeyPress]}
        name={InterfaceEventName.TOKEN_SELECTED}
        properties={{
          token_symbol: currency?.symbol,
          token_address: currency?.isNative ? NativeAddress : currency?.address,
          total_balances_usd: balance?.amount,
        }}
        element={InterfaceElementName.TOKEN_SELECTOR_ROW}
      >
        <div className="relative py-0.5 h-[64px]" style={style}>
          <div
            testdata-id={`token-selector-row-${
              currency.isNative
                ? NativeAddress
                : currency.wrap().address.toLowerCase()
            }`}
            onClick={() => onClick(currency)}
            onKeyDown={() => onClick(currency)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={classNames(
              className,
              `group flex items-center w-full hover:bg-blue/10 focus:bg-bg-blue/20 dark:hover:bg-skyblue/10 dark:focus:bg-bg-skyblue/20 h-full rounded-lg px-3 token-${currency?.symbol}`,
            )}
          >
            <div className="flex items-center justify-between flex-grow gap-2 rounded cursor-pointer">
              <FavoriteButton
                currencyId={
                  `${currency?.id}:${currency?.symbol}` as PinnedTokenId
                }
                className="!px-0.5"
              />
              <div className="flex flex-row items-center flex-grow gap-4">
                <div className="w-10 h-10">
                  <Badge
                    className="dark:border-white/10 border-black/10 border rounded-[4px] z-[11] !right-[5%] -bottom-[5%]"
                    position="bottom-right"
                    badgeContent={
                      <NetworkIcon
                        type="square"
                        className="rounded-[3px]"
                        chainId={currency.chainId}
                        width={14}
                        height={14}
                      />
                    }
                  >
                    <Currency.Icon
                      disableLink
                      currency={currency}
                      width={32}
                      height={32}
                    />
                  </Badge>
                </div>

                <div className="flex flex-col items-start">
                  <div className="flex gap-1">
                    <span className="font-semibold text-primary">
                      {currency.symbol}
                    </span>
                    {showWarning ? (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <ExclamationCircleIcon
                              width={20}
                              height={20}
                              className="text-yellow"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            Not on our default token list
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : null}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm text-muted-foreground hover:underline">
                          {currency.name ?? currency.symbol}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="flex items-center gap-1"
                      >
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={getChainById(currency.chainId)?.getTokenUrl(
                            currency.wrap().address,
                          )}
                          className="text-blue hover:underline flex gap-1"
                        >
                          Show on explorer{' '}
                          <ArrowTopRightOnSquareIcon width={16} height={16} />
                        </a>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {isHovered && showChainOptions && filteredBridgeInfo?.length ? (
                  <div className="flex gap-1 items-center">
                    {filteredBridgeInfo?.map((info) => (
                      <NetworkButton
                        key={`${info.chainId}-${info.address}`}
                        chainId={info.chainId as number}
                        iconSize={16}
                        onClick={(e) => {
                          e.stopPropagation()
                          onClick(
                            new EvmToken({
                              address: info.address as `0x${string}`,
                              chainId: info.chainId as EvmChainId,
                              decimals: info.decimals,
                              symbol: currency.symbol,
                              name: currency.name,
                            }),
                          )
                        }}
                      />
                    ))}
                  </div>
                ) : isBalanceLoading ? (
                  <div className="flex flex-col min-w-[60px]">
                    <SkeletonText className="w-[60px]" align="right" />
                    <SkeletonText
                      fontSize="sm"
                      className="w-[20px]"
                      align="right"
                    />
                  </div>
                ) : (
                  balance?.gt(ZERO) && (
                    <div className="flex flex-col max-w-[140px]">
                      <span
                        className={classNames(
                          selected ? 'font-semibold' : 'font-medium',
                          'text-right text-gray-900 dark:text-slate-50 truncate black:text-slate-50',
                        )}
                      >
                        {balance.toSignificant(6)}
                      </span>
                      <span className="text-sm font-medium text-right text-gray-500 dark:text-slate-400">
                        {price && balance
                          ? formatUSD(
                              price *
                                Number(
                                  formatUnits(
                                    balance.amount,
                                    currency?.decimals,
                                  ),
                                ),
                            )
                          : '-'}
                      </span>
                    </div>
                  )
                )}

                <IconButton
                  size="xs"
                  icon={InformationCircleIcon}
                  variant="ghost"
                  name="info"
                  onClick={showInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </TraceEvent>
    )
  },
)

export function TokenSelectorRowLoadingV2() {
  return (
    <div className="block flex-1 py-0.5 h-[64px]">
      <div className="flex items-center w-full h-full px-3 rounded-lg">
        <div className="flex items-center justify-between flex-grow gap-2 rounded">
          <div className="flex flex-row items-center flex-grow gap-4">
            <SkeletonCircle radius={40} />
            <div className="flex flex-col items-start">
              <SkeletonText className="w-full w-[100px]" />
              <SkeletonText fontSize="sm" className="w-full w-[60px]" />
            </div>
          </div>

          <div className="flex flex-col w-full">
            <SkeletonText className="w-[80px]" />
            <SkeletonText fontSize="sm" align="right" className="w-[40px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
