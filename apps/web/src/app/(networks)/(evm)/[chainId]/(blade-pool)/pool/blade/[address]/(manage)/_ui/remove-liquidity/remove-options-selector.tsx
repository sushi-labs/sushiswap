import type { BladePool } from '@sushiswap/graph-client/data-api'
import { Currency, List, classNames } from '@sushiswap/ui'
import { type FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { getOnchainPriceFromPool } from 'src/lib/pool/blade/utils'
import { Amount, formatUSD } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import type { PriceMap } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { SingleAssetOption } from './single-asset-option'

export type RemoveOptionType = 'multiple' | EvmCurrency

export interface RemoveOptionsSelectorProps {
  pool: BladePool
  tokensToReceive: Array<{
    usdValue: number
    weight: number
    token: EvmCurrency
    amount: Amount<EvmCurrency> | null
  }>
  selectedOption: RemoveOptionType
  setSelectedOption: (option: RemoveOptionType) => void
  prices?: PriceMap
  estimatedValue: number
  isSingleAssetWithdrawEnabled?: boolean
}

export const RemoveOptionsSelector: FC<RemoveOptionsSelectorProps> = ({
  pool,
  tokensToReceive,
  selectedOption,
  setSelectedOption,
  prices,
  estimatedValue,
  isSingleAssetWithdrawEnabled = true,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const multipleAssetsRef = useRef<HTMLDivElement>(null)
  const tokenRefs = useRef<Map<EvmCurrency, HTMLDivElement | null>>(new Map())

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
      .map((tokenData) => tokenData.token.wrap().symbol)
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
            const originalCurrency = tokenData.token
            const tokenPrice =
              prices?.getForToken(originalCurrency) ??
              getOnchainPriceFromPool(originalCurrency, pool)
            const tokenAmountValue =
              tokenPrice !== null && tokenPrice > 0
                ? estimatedValue / tokenPrice
                : null

            const currenciesToShow = originalCurrency.isNative
              ? [originalCurrency, originalCurrency.wrap()]
              : [originalCurrency]

            return currenciesToShow.map((currency) => {
              const isSelected =
                selectedOption !== 'multiple' &&
                selectedOption?.id === currency.id

              const tokenAmount = tokenAmountValue
                ? Amount.fromHuman(currency, tokenAmountValue)
                : null
              return (
                <SingleAssetOption
                  ref={(el) => {
                    tokenRefs.current.set(currency, el)
                  }}
                  key={currency.id}
                  currency={currency}
                  tokenAmount={tokenAmount}
                  estimatedValue={estimatedValue}
                  isSelected={isSelected}
                  onSelect={() => setSelectedOption(currency)}
                />
              )
            })
          })}
        </div>
      )}

      <div ref={multipleAssetsRef} className="flex flex-col gap-2">
        <h3 className="font-medium text-sm">Receive multiple assets</h3>

        <List.Control
          onClick={() => setSelectedOption('multiple')}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setSelectedOption('multiple')
            }
          }}
          role="button"
          tabIndex={0}
          className={classNames(
            'cursor-pointer transition-all',
            selectedOption === 'multiple'
              ? '!bg-blue-50 dark:!bg-blue-950/20 border !border-blue-500'
              : 'hover:!bg-gray-50 dark:hover:!bg-gray-700',
          )}
        >
          <List.Item
            as="div"
            className="justify-between"
            iconProps={{}}
            title={
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex -space-x-1">
                  <Currency.IconList iconWidth={30} iconHeight={30}>
                    {tokensToReceive.map((tokenData, index) => (
                      <Currency.Icon key={index} currency={tokenData.token} />
                    ))}
                  </Currency.IconList>
                </div>
                <span className="font-semibold text-sm break-all">
                  {allSymbolsCombined}
                </span>
              </div>
            }
            value={
              <div className="text-right flex-shrink-0">
                <div className="font-semibold text-sm">
                  ~{formatUSD(estimatedValue)}
                </div>
                <div className="text-sm text-muted-foreground">In Total</div>
              </div>
            }
          />

          {selectedOption === 'multiple' && (
            <div className="space-y-3 px-3 pb-3">
              <div className="text-sm text-gray-500 dark:text-slate-500">
                Composition
              </div>
              {tokensToReceive.map((tokenData, index) => {
                const wrappedCurrency = tokenData.token.wrap()
                return (
                  <List.Item
                    key={index}
                    as="div"
                    className="!p-0 !justify-between"
                    iconProps={{}}
                    title={
                      <div className="flex items-center gap-2">
                        <Currency.Icon
                          currency={wrappedCurrency}
                          width={18}
                          height={18}
                        />
                        <span className="text-sm font-medium">
                          {wrappedCurrency.symbol}
                        </span>
                      </div>
                    }
                    value={
                      <div className="text-right flex gap-1">
                        <div className="text-sm font-semibold">
                          {tokenData.amount
                            ? `${tokenData.amount.toSignificant(4)} ${wrappedCurrency.symbol}`
                            : '-'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {tokenData.usdValue !== null
                            ? formatUSD(tokenData.usdValue)
                            : '-'}
                        </div>
                      </div>
                    }
                  />
                )
              })}
            </div>
          )}
        </List.Control>
      </div>
    </div>
  )
}
