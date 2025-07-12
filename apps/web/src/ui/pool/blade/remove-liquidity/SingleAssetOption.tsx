import { Currency } from '@sushiswap/ui'
import { forwardRef } from 'react'
import type { Amount, Type } from 'sushi/currency'
import { formatUSD } from 'sushi/format'

interface SingleAssetOptionProps {
  currency: Type
  tokenAmount: Amount<Type>
  estimatedValue: number
  isSelected: boolean
  onSelect: () => void
}

export const SingleAssetOption = forwardRef<
  HTMLDivElement,
  SingleAssetOptionProps
>(({ currency, tokenAmount, estimatedValue, isSelected, onSelect }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-500'
          : 'bg-white dark:bg-gray-800 border border-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect()
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center gap-3">
        <Currency.Icon currency={currency} width={24} height={24} />
        <div>
          <div className="font-semibold text-sm text-gray-900 dark:text-slate-50">
            {currency.symbol}
          </div>
          <div className="text-sm text-muted-foreground">{currency.name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-sm text-gray-900 dark:text-slate-50">
          ~{tokenAmount.toSignificant(4)} {currency.symbol}
        </div>
        <div className="text-sm text-muted-foreground">
          ~{formatUSD(estimatedValue)}
        </div>
      </div>
    </div>
  )
})

SingleAssetOption.displayName = 'SingleAssetOption'
