'use client'

import { Bond } from '@sushiswap/client'
import { SkeletonText, classNames } from '@sushiswap/ui'
import { useBondMarketDetails } from 'src/lib/wagmi/hooks/bonds/use-bond-market-details'
import { formatPercent } from 'sushi/format'

export const BondsMarketPageHeaderDiscount = ({ bond }: { bond: Bond }) => {
  const { discount } = useBondMarketDetails({ bond })

  const isNegativeDiscount = Boolean(discount !== undefined && discount < 0)

  return (
    <div className="flex items-center gap-1.5 w-28">
      <span className="tracking-tighter font-semibold">Discount</span>
      {discount !== undefined ? (
        <span
          className={classNames(isNegativeDiscount ? 'text-red' : 'text-green')}
        >
          {formatPercent(discount)}
        </span>
      ) : (
        <SkeletonText fontSize="default" />
      )}
    </div>
  )
}
