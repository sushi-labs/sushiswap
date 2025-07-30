import type { V2Pool, V3Pool } from '@sushiswap/graph-client/data-api'
import {
  CardContent,
  CardHeader,
  CardTitle,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { formatUSD } from 'sushi/format'
import { Wrapper } from '../swap/trade/wrapper'

export const Pool24HVolume = ({ pool }: { pool: V2Pool | V3Pool }) => {
  return (
    <Wrapper
      enableBorder
      className="!p-4 flex justify-between items-center lg:items-start gap-2 lg:!flex-col"
    >
      <CardHeader className="!p-0">
        <CardTitle>
          <div className="flex flex-col gap-y-4 justify-between lg:flex-row">
            24H Volume
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="!p-0">
        <div className="grid grid-cols-1 gap-3">
          <div>
            {pool ? (
              <div className="flex gap-2 items-center text-sm font-bold lg:font-medium lg:text-2xl">
                {formatUSD(pool.volumeUSD1d ?? 0)}{' '}
                <span
                  className={classNames(
                    'text-sm lg:text-base font-medium',
                    pool['volumeUSD1dChange'] > 0 ? 'text-green' : 'text-red',
                  )}
                >
                  ({pool['volumeUSD1dChange'].toFixed(2)}
                  %)
                </span>
              </div>
            ) : (
              <SkeletonText />
            )}
          </div>
        </div>
      </CardContent>
    </Wrapper>
  )
}
