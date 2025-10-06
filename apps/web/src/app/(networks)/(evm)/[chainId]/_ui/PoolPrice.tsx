'use client'

import type { V2Pool, V3Pool } from '@sushiswap/graph-client/data-api'
import {
  CardContent,
  CardGroup,
  CardHeader,
  CardItem,
  CardTitle,
  Currency,
  classNames,
} from '@sushiswap/ui'
import { EvmToken } from 'sushi/evm'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { Wrapper } from '../[trade]/_ui/swap/trade/wrapper'

export const PoolPrice = ({
  pool,
  showRate = false,
}: { pool: V2Pool | V3Pool; showRate?: boolean }) => {
  const reserveToken0 = pool.token0
  const reserveToken1 = pool.token1

  const { data: price0 } = usePrice({
    chainId: pool.chainId,
    address: reserveToken0.address,
  })

  const { data: price1 } = usePrice({
    chainId: pool.chainId,
    address: reserveToken1.address,
  })

  const reserve1To2 = price1
    ? price0
      ? new Decimal(price1).div(price0).toFixed(2)
      : '0.00'
    : '0.00'
  const reserve2To1 = price0
    ? price1
      ? new Decimal(price0).div(price1).toFixed(2)
      : '0.00'
    : '0.00'

  return (
    <Wrapper enableBorder className="!p-4 flex flex-col gap-5">
      <CardHeader className="!p-0 flex flex-col gap-1">
        <CardTitle>Price</CardTitle>
      </CardHeader>
      <CardContent className="!p-0">
        <CardGroup className="lg:!gap-6">
          {reserveToken0 ? (
            <CardItem
              className="!text-sm"
              title={
                <div className="flex gap-2 items-center font-medium text-muted-foreground">
                  <Currency.Icon
                    currency={
                      new EvmToken({
                        ...reserveToken0,
                      })
                    }
                    width={18}
                    height={18}
                  />{' '}
                  {reserveToken0.symbol}
                </div>
              }
            >
              <span className="flex gap-1 font-medium">
                {showRate
                  ? `1 ${reserveToken0.symbol} = ${reserve1To2} ${reserveToken1.symbol}`
                  : null}
                <span
                  className={classNames(
                    'font-normal text-muted-foreground',
                    !showRate &&
                      '!text-slate-900 dark:!text-slate-50 !font-medium',
                  )}
                >
                  ${price0?.toFixed(2) ?? '0.00'}
                </span>
              </span>
            </CardItem>
          ) : null}
          {reserveToken1 ? (
            <CardItem
              title={
                <div className="flex gap-2 items-center font-medium text-muted-foreground">
                  <Currency.Icon
                    currency={
                      new EvmToken({
                        ...reserveToken1,
                      })
                    }
                    width={18}
                    height={18}
                  />{' '}
                  {reserveToken1.symbol}
                </div>
              }
            >
              <span className="flex gap-1 font-medium">
                {showRate
                  ? `1 ${reserveToken1.symbol} = ${reserve2To1} ${reserveToken0.symbol}`
                  : null}
                <span
                  className={classNames(
                    'font-normal text-muted-foreground',
                    !showRate &&
                      '!text-slate-900 dark:!text-slate-50 !font-medium',
                  )}
                >
                  ${price1?.toFixed(2) ?? '0.00'}
                </span>
              </span>
            </CardItem>
          ) : null}
        </CardGroup>
      </CardContent>
    </Wrapper>
  )
}
