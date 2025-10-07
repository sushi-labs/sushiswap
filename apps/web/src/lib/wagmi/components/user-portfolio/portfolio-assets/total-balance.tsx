import { SkeletonText, classNames } from '@sushiswap/ui'
import { formatPercent, formatUSD } from 'sushi'
import { useAccount } from 'wagmi'
import { useTotalBalance } from '../hooks/use-total-balance'

export const TotalBalance = () => {
  const { address } = useAccount()
  const { data, isLoading, isError } = useTotalBalance({
    address,
  })
  const amountUSD24Change = data?.amountUSD24Change ?? 0
  const percentageChange24h = data?.percentageChange24h ?? 0
  const totalUSD = data?.totalUSD ?? 0

  return (
    <div className="flex flex-col gap-y-3 dark:bg-slate-800 bg-slate-100 sm:bg-slate-50 rounded-xl px-5 py-3">
      <span className="text-sm text-muted-foreground">Total Balance</span>
      <div className="flex flex-col gap-y-2">
        {isLoading && !isError ? (
          <>
            <SkeletonText fontSize="lg" className="!w-1/3" />
            <SkeletonText className="!w-1/2" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {formatUSD(isError ? 0 : totalUSD)}
            </div>
            <div
              className={classNames(
                'text-sm',
                isError ? 'text-red text-xs' : '',
                amountUSD24Change > 0
                  ? 'text-green'
                  : amountUSD24Change < 0
                    ? 'text-red'
                    : 'text-muted-foreground',
              )}
            >
              {isError
                ? 'Could Not Fetch Balance'
                : `${amountUSD24Change > 0 ? '+' : ''}${formatUSD(amountUSD24Change)} (${formatPercent(
                    percentageChange24h,
                  )})`}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
