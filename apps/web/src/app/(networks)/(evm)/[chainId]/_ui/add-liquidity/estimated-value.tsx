import { SkeletonText } from '@sushiswap/ui'
import { formatUSD } from 'sushi'
export const EstimatedValue = ({
  dollarValue,
  isLoading,
}: { dollarValue: string; isLoading: boolean }) => {
  return (
    <div className="w-full flex items-center justify-between gap-2">
      <p className="dark:text-slate-500 text-slate-450">Estimated Value</p>
      {isLoading ? (
        <div className="w-[70px]">
          <SkeletonText />
        </div>
      ) : (
        <p className="font-semibold text-slate-900 dark:text-pink-100">
          {formatUSD(dollarValue || 0)}
        </p>
      )}
    </div>
  )
}
