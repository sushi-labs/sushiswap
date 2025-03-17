import {
  Card,
  Currency,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@sushiswap/ui'
import type { FC, ReactNode } from 'react'
import type { Amount, Type } from 'sushi/currency'
import { formatUSD } from 'sushi/format'

interface FeesBreakdownPopoverProps {
  amounts: { amount: Amount<Type>; usdValue: number }[]
  totalUsd: number
  children: ReactNode
}

export const FeesBreakdownPopover: FC<FeesBreakdownPopoverProps> = ({
  amounts,
  totalUsd,
  children,
}) => {
  const content = (
    <Card className="w-[379px]">
      <div className="flex flex-col gap-4 p-5">
        <span className="text-xs leading-4 font-medium text-muted-foreground">
          Fees Breakdown
        </span>
        <div className="flex flex-col gap-3 rounded-xl bg-background p-4">
          {amounts.map(({ amount, usdValue }, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Currency.Icon
                  width={20}
                  height={20}
                  currency={amount.currency}
                />
                <span className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-50">
                  {amount.toSignificant(6)} {amount.currency.symbol}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatUSD(usdValue)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 dark:text-slate-50">
              Total
            </span>
            <span className="font-medium text-gray-900 dark:text-slate-50">
              {formatUSD(totalUsd)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="!p-0">{content}</PopoverContent>
    </Popover>
  )
}
