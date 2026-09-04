import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/20/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
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
import type React from 'react'
import { type CSSProperties, memo, useCallback } from 'react'
import { type Amount, type Fraction, ZERO, getChainById } from 'sushi'
import { zeroAddress } from 'viem'
import { NativeAddress } from '../../../../../constants'
import type { TokenSelectorChainId } from '../../config'
import { useTokenSelectorTheme } from '../../token-selector-theme'

export interface TokenSelectorRow<TChainId extends TokenSelectorChainId> {
  currency: CurrencyFor<TChainId>
  style?: CSSProperties
  className?: string
  onSelect(currency: CurrencyFor<TChainId>): void
  balance?: Amount<CurrencyFor<TChainId>> | undefined
  showWarning: boolean
  price?: Fraction
  pin?: {
    isPinned: boolean
    onPin(): void
  }
  selected: boolean
  isBalanceLoading: boolean
  onShowInfo: () => void
}

function TokenSelectorRowBase<TChainId extends TokenSelectorChainId>({
  price,
  balance,
  currency,
  style,
  className,
  onSelect,
  pin,
  selected,
  isBalanceLoading,
  showWarning,
  onShowInfo,
}: TokenSelectorRow<TChainId>) {
  const theme = useTokenSelectorTheme()
  const isPerps = theme === 'perps'
  const domain =
    typeof currency.metadata.domain === 'string'
      ? currency.metadata.domain
      : undefined

  const onClick = useCallback(() => {
    onSelect(currency)
  }, [currency, onSelect])

  const onPin = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      pin?.onPin()
    },
    [pin],
  )

  const showInfo = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onShowInfo()
    },
    [onShowInfo],
  )

  return (
    <TraceEvent
      events={[BrowserEvent.onClick, BrowserEvent.onKeyPress]}
      name={InterfaceEventName.TOKEN_SELECTED}
      properties={{
        token_symbol: currency?.symbol,
        token_address:
          currency?.type === 'native' ? NativeAddress : currency?.address,
        total_balances_usd: balance?.amount,
      }}
      element={InterfaceElementName.TOKEN_SELECTOR_ROW}
    >
      <div className="relative py-0.5 h-[64px]" style={style}>
        <div
          className={classNames(
            selected ? (isPerps ? 'bg-perps-blue/[0.08]' : 'bg-secondary') : '',
            isPerps
              ? 'hover:bg-white/[0.05] focus-within:bg-white/[0.07]'
              : 'hover:bg-muted focus-within:bg-accent',
            'group flex h-full w-full items-center rounded-lg',
          )}
        >
          <button
            type="button"
            aria-label={`Select ${currency.symbol ?? currency.name ?? 'token'}`}
            aria-pressed={selected}
            testdata-id={`token-selector-row-${
              currency.type === 'native'
                ? zeroAddress
                : currency.wrap().address.toLowerCase()
            }`}
            onClick={onClick}
            className={classNames(
              className,
              `flex items-center justify-between flex-grow gap-2 h-full rounded-lg pl-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring token-${currency?.symbol}`,
            )}
          >
            <div className="flex flex-row items-center flex-grow gap-4">
              {selected ? (
                <Badge
                  position="bottom-right"
                  badgeContent={
                    <div
                      className={classNames(
                        'rounded-full',
                        isPerps
                          ? 'bg-perps-background'
                          : 'bg-white dark:bg-slate-800 black:bg-gray-900',
                      )}
                    >
                      <CheckCircleIcon
                        width={20}
                        height={20}
                        className={classNames(
                          'rounded-full',
                          isPerps ? 'text-perps-blue' : 'text-blue',
                        )}
                      />
                    </div>
                  }
                >
                  <div className="w-10 h-10">
                    <Currency.Icon
                      disableLink
                      currency={currency}
                      width={40}
                      height={40}
                    />
                  </div>
                </Badge>
              ) : (
                <div className="w-10 h-10">
                  <Currency.Icon
                    disableLink
                    currency={currency}
                    width={40}
                    height={40}
                  />
                </div>
              )}
              <div className="flex flex-col items-start">
                <div className="flex gap-1">
                  <span
                    className={classNames(
                      'font-semibold',
                      isPerps ? 'text-perps-muted' : 'text-primary',
                    )}
                  >
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
                      <span
                        className={classNames(
                          'text-sm hover:underline',
                          isPerps
                            ? 'text-perps-muted-50'
                            : 'text-muted-foreground',
                        )}
                      >
                        {currency.name ?? currency.symbol}
                        {domain ? ` - ${domain}` : ''}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="flex items-center gap-1"
                    >
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={getChainById(currency.chainId).getTokenUrl(
                          // Chain-specific address types collapse under the union here.
                          currency.wrap().address as never,
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
              {isBalanceLoading ? (
                <div className="flex flex-col min-w-[60px]">
                  <SkeletonText align="right" />
                  <SkeletonText fontSize="sm" align="right" />
                </div>
              ) : (
                balance?.gt(ZERO) && (
                  <div className="flex flex-col max-w-[140px]">
                    <span
                      className={classNames(
                        selected ? 'font-semibold' : 'font-medium',
                        'truncate text-right',
                        isPerps
                          ? 'text-perps-muted'
                          : 'text-gray-900 dark:text-slate-50 black:text-slate-50',
                      )}
                    >
                      {balance?.toSignificant(6)}
                    </span>
                    <span
                      className={classNames(
                        'text-right text-sm font-medium',
                        isPerps
                          ? 'text-perps-muted-50'
                          : 'text-gray-500 dark:text-slate-400',
                      )}
                    >
                      {price
                        ? `$${balance?.mul(price).toString({ fixed: 2 })}`
                        : '-'}
                    </span>
                  </div>
                )
              )}
            </div>
          </button>
          <div className="flex items-center gap-1 pr-3">
            {pin && (
              <IconButton
                size="xs"
                icon="⭐"
                variant="ghost"
                name="pin"
                onClick={onPin}
                onKeyDown={(event) => event.stopPropagation()}
                onKeyPress={(event) => event.stopPropagation()}
                className={classNames(
                  pin.isPinned ? '' : 'grayscale opacity-50',
                  'z-50',
                  isPerps &&
                    'text-perps-muted-50 hover:bg-white/[0.06] hover:text-perps-muted',
                )}
              />
            )}
            <IconButton
              size="xs"
              icon={InformationCircleIcon}
              variant="ghost"
              name="info"
              onClick={showInfo}
              onKeyDown={(event) => event.stopPropagation()}
              onKeyPress={(event) => event.stopPropagation()}
              className={classNames(
                isPerps &&
                  'text-perps-muted-50 hover:bg-white/[0.06] hover:text-perps-muted',
              )}
            />
          </div>
        </div>
      </div>
    </TraceEvent>
  )
}

export const TokenSelectorRow = memo(
  TokenSelectorRowBase,
) as typeof TokenSelectorRowBase

export function TokenSelectorRowLoading() {
  return (
    <div className="block flex-1 py-0.5 h-[64px]">
      <div className="flex items-center w-full h-full px-3 rounded-lg">
        <div className="flex items-center justify-between flex-grow gap-2 rounded">
          <div className="flex flex-row items-center flex-grow gap-4">
            <SkeletonCircle radius={40} />
            <div className="flex flex-col items-start">
              <SkeletonText className="w-full" />
              <SkeletonText fontSize="sm" className="w-full" />
            </div>
          </div>

          <div className="flex flex-col w-full">
            <SkeletonText />
            <SkeletonText fontSize="sm" align="right" />
          </div>
        </div>
      </div>
    </div>
  )
}
