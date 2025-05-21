import { SkeletonText, classNames } from '@sushiswap/ui'
import { formatPercent, formatUSD } from 'sushi/format'
import { useAccount } from 'wagmi'
import { useTotalBalance } from '../hooks/use-total-balance'

export const TotalBalance = () => {
  const { address } = useAccount()
  const { data, isLoading, isError } = useTotalBalance(address)

  return (
    <div className="flex flex-col gap-y-3 dark:bg-slate-800 sm:dark:bg-slate-900 bg-slate-100 sm:bg-slate-50 rounded-xl px-5 py-3">
      <span className="text-sm text-muted-foreground">Total Balance</span>
      <div className="flex flex-col gap-y-2">
        {isLoading || !data?.totalUSD ? (
          <>
            <SkeletonText fontSize="lg" className="!w-1/3" />
            <SkeletonText className="!w-1/2" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {formatUSD(isError ? 0 : data?.totalUSD)}
            </div>
            <div
              className={classNames(
                'text-sm',
                isError ? 'text-red text-xs' : '',
                data?.amountUSD24Change > 0
                  ? 'text-green'
                  : data?.amountUSD24Change < 0
                    ? 'text-red'
                    : 'text-muted-foreground',
              )}
            >
              {isError
                ? 'Could Not Fetch Balance'
                : `${data?.amountUSD24Change > 0 ? '+' : ''}${formatUSD(
                    data?.amountUSD24Change,
                  )} (${formatPercent(data?.percentageChange24h)})`}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
