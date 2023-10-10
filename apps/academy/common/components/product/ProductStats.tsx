import { classNames } from '@sushiswap/ui'
import { FC } from 'react'

export interface ProductStat {
  name: string
  value: string
}

interface ProductStats {
  productStats: ProductStat[]
  isCentered?: boolean
}

export const ProductStats: FC<ProductStats> = ({
  productStats,
  isCentered,
}) => {
  return (
    <div
      className={classNames(
        'grid grid-cols-[repeat(auto-fit,minmax(120px,max-content))] gap-6 sm:gap-[60px] mt-10 sm:mt-[70px]',
        isCentered && 'justify-center',
      )}
    >
      {productStats.map(({ name, value }) => (
        <div
          key={name}
          className="grid grid-rows-[repeat(2,max-content)] gap-2"
        >
          <p className="text-xl sm:text-3xl font-bold text-slate-50">{value}</p>
          <p className="text-xs sm:text-base text-slate-300">{name}</p>
        </div>
      ))}
    </div>
  )
}
