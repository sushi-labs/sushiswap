import { Type } from '@sushiswap/currency'
import { Currency } from '@sushiswap/ui'
import { FC } from 'react'

interface IconListVariableSizesProps {
  token0: Type
  token1: Type
}
export const IconListVariableSizes: FC<IconListVariableSizesProps> = ({ token0, token1 }) => {
  return (
    <div className="flex items-center min-w-[54px] min-h-[40px]">
      <div className="flex items-baseline">
        <div className="z-[1] w-[32px] h-[32px]">
          <Currency.Icon currency={token0} width={32} height={32} />
        </div>
        <div className="-ml-2.5 w-[20px] h-[20px]">
          <Currency.Icon currency={token1} width={20} height={20} />
        </div>
      </div>
    </div>
  )
}
