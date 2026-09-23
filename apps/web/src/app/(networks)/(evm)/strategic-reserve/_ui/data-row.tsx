'use client'
import { classNames } from '@sushiswap/ui'
import { useBuybackReserve } from 'src/lib/hooks/react-query/buyback/use-buyback-reserve'
import { formatNumber, formatUSD } from 'sushi'
import { DataItem } from './data-item'

export const DataRow = () => {
  const { data, isLoading, isError } = useBuybackReserve({
    enabled: true,
  })

  return (
    <div className="grid grid-cols-1 gap-2 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DataItem
        label={'SUSHI in reserve'}
        value={formatNumber(data?.amount || '0')}
        subLabel={formatUSD(data?.amountUSD || '0')}
        isLoading={isLoading}
        isError={isError}
      />
      <DataItem
        label={'Average buy price'}
        value={formatUSD(data?.averageBuyPriceUSD || '0')}
        subLabel={
          <div className="flex items-center gap-1">
            <div
              className={classNames(
                'flex items-center gap-0.5',
                data?.percentageDifference && data?.percentageDifference > 0
                  ? 'text-green-500'
                  : data?.percentageDifference === 0
                    ? 'text-muted-foreground'
                    : 'text-red-500',
              )}
            >
              {`${Number(data?.percentageDifference || 0)?.toFixed(2)}%`}
            </div>

            <span className="text-muted-foreground">vs spot</span>
          </div>
        }
        isLoading={isLoading}
        isError={isError}
      />
      <DataItem
        label={'SUSHI holders'}
        value={data?.holderCount}
        subLabel={'On Ethereum'}
        isLoading={isLoading}
        isError={isError}
        className="col-span-1 sm:col-span-2 lg:col-span-1"
      />
    </div>
  )
}
