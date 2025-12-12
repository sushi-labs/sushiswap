import { Currency, List, classNames } from '@sushiswap/ui'
import type { Ref } from 'react'
import { type Amount, formatUSD } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'

interface SingleAssetOptionProps {
  currency: EvmCurrency
  tokenAmount: Amount<EvmCurrency> | null
  estimatedValue: number
  isSelected: boolean
  onSelect: () => void
  ref: Ref<HTMLDivElement>
}

export const SingleAssetOption = ({
  currency,
  tokenAmount,
  estimatedValue,
  isSelected,
  onSelect,
  ref,
}: SingleAssetOptionProps) => {
  return (
    <List.Control
      ref={ref}
      onClick={onSelect}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect()
        }
      }}
      role="button"
      tabIndex={0}
      className={classNames(
        'cursor-pointer transition-all',
        isSelected
          ? '!bg-blue-50 dark:!bg-blue-950/20 border !border-blue-500'
          : 'hover:!bg-gray-50 dark:hover:!bg-gray-700',
      )}
    >
      <List.Item
        as="div"
        className="p-0 justify-between"
        iconProps={{}}
        title={
          <div className="flex items-center gap-3">
            <Currency.Icon currency={currency} width={24} height={24} />
            <div>
              <div className="font-semibold text-sm">{currency.symbol}</div>
              <div className="text-sm text-muted-foreground">
                {currency.name}
              </div>
            </div>
          </div>
        }
        value={
          <div className="text-right">
            <div className="font-semibold text-sm">
              {tokenAmount
                ? `${tokenAmount.toSignificant(4)} ${currency.symbol}`
                : '-'}
            </div>
            <div className="text-sm text-muted-foreground">
              ~{formatUSD(estimatedValue)}
            </div>
          </div>
        }
      />
    </List.Control>
  )
}
