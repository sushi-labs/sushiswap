import { Currency } from '@sushiswap/ui'
import { type FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { Amount, type Type } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import type { PriceMap } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { SingleAssetOption } from './SingleAssetOption'

export type RemoveOptionType = 'multiple' | Type

export interface RemoveOptionsSelectorProps {
  tokensToReceive: Array<{
    usdValue: number
    weight: number
    amount: Amount<Type>
  }>
  selectedOption: RemoveOptionType
  setSelectedOption: (option: RemoveOptionType) => void
  prices?: PriceMap
  estimatedValue: number
  isSingleAssetWithdrawEnabled?: boolean
}

export const RemoveOptionsSelector: FC<RemoveOptionsSelectorProps> = ({
  tokensToReceive,
  selectedOption,
  setSelectedOption,
  prices,
  estimatedValue,
  isSingleAssetWithdrawEnabled = true,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const multipleAssetsRef = useRef<HTMLDivElement>(null)
  const tokenRefs = useRef<Map<Type, HTMLDivElement | null>>(new Map())

  const scrollToSelectedOption = useCallback(() => {
    if (selectedOption === 'multiple') {
      multipleAssetsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
      return
    }
    const tokenRef = tokenRefs.current.get(selectedOption)
    if (tokenRef) {
      tokenRef.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [selectedOption])

  useEffect(() => {
    scrollToSelectedOption()
  }, [scrollToSelectedOption])

  const allSymbolsCombined = useMemo(() => {
    return tokensToReceive
      .map((tokenData) => tokenData.amount.currency.wrapped.symbol)
      .join('/')
  }, [tokensToReceive])

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-1 flex-col gap-3 overflow-y-auto"
    >
      {isSingleAssetWithdrawEnabled && (
        <div className="flex flex-col gap-2">
          <h3 className="font-medium text-sm">Receive single asset</h3>
          <p className="text-sm text-muted-foreground">
            Choose your preferred token
          </p>
          {tokensToReceive.flatMap((tokenData) => {
            const originalCurrency = tokenData.amount.currency
            const tokenPrice =
              prices?.get(originalCurrency.wrapped.address) || 0
            const tokenAmountValue =
              tokenPrice > 0 ? estimatedValue / tokenPrice : 0

            const currenciesToShow = originalCurrency.isNative
              ? [originalCurrency, originalCurrency.wrapped]
              : [originalCurrency]

            return currenciesToShow.map((currency) => {
              const isSelected =
                selectedOption !== 'multiple' &&
                selectedOption?.equals(currency)

              const tokenAmount =
                tokenAmountValue > 0
                  ? Amount.fromRawAmount(
                      currency,
                      BigInt(
                        Math.floor(tokenAmountValue * 10 ** currency.decimals),
                      ),
                    )
                  : Amount.fromRawAmount(currency, 0n)

              return (
                <SingleAssetOption
                  ref={(el) => {
                    tokenRefs.current.set(currency, el)
                  }}
                  key={
                    currency.isNative
                      ? currency.symbol
                      : currency.wrapped.address
                  }
                  currency={currency}
                  tokenAmount={tokenAmount}
                  estimatedValue={estimatedValue}
                  isSelected={!!isSelected}
                  onSelect={() => setSelectedOption(currency)}
                />
              )
            })
          })}
        </div>
      )}

      <div ref={multipleAssetsRef} className="flex flex-col gap-2">
        <h3 className="font-medium text-sm">Receive multiple assets</h3>

        <div
          className={`p-4 rounded-xl cursor-pointer transition-all ${
            selectedOption === 'multiple'
              ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-500'
              : 'bg-white dark:bg-gray-800 border border-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          onClick={() => setSelectedOption('multiple')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setSelectedOption('multiple')
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex -space-x-1">
                <Currency.IconList iconWidth={30} iconHeight={30}>
                  {tokensToReceive.map((tokenData, index) => (
                    <Currency.Icon
                      key={index}
                      currency={tokenData.amount.currency}
                    />
                  ))}
                </Currency.IconList>
              </div>
              <div className="font-semibold text-sm text-gray-900 break-all">
                {allSymbolsCombined}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-semibold text-sm text-gray-900">
                ~{formatUSD(estimatedValue)}
              </div>
              <div className="text-sm text-muted-foreground">In Total</div>
            </div>
          </div>

          {selectedOption === 'multiple' && (
            <div className="mt-4 space-y-3">
              <div className="text-sm text-gray-400">Composition</div>
              {tokensToReceive.map((tokenData, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Currency.Icon
                      currency={tokenData.amount.currency.wrapped}
                      width={18}
                      height={18}
                    />
                    <span className="text-sm font-medium text-gray-500">
                      {tokenData.amount.currency.wrapped.symbol}
                    </span>
                  </div>
                  <div className="text-right flex gap-1">
                    <div className="text-sm font-semibold text-gray-900">
                      ~{tokenData.amount.toSignificant(4)}{' '}
                      {tokenData.amount.currency.wrapped.symbol}
                    </div>
                    <div className="text-sm text-gray-400">
                      ~{formatUSD(tokenData.usdValue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
