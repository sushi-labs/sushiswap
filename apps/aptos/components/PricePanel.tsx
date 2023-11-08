import { SkeletonText } from '@sushiswap/ui'
import React from 'react'
interface Props {
  isLoading: boolean
  error?: string
}
export const PricePanel = ({ isLoading, error }: Props) => {
  if (isLoading) {
    return (
      <div className="w-[90px] flex items-center">
        <SkeletonText fontSize="lg" className="w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <p className="font-medium text-lg py-1 select-none text-red">{error}</p>
    )
  }

  return (
    <p className="font-medium text-lg flex items-baseline select-none text-gray-500 dark:text-slate-400">
      $ 0.<span className="text-sm font-semibold">00</span>
    </p>
  )
}
