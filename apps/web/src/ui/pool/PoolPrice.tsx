import type { V2Pool, V3Pool } from '@sushiswap/graph-client/data-api'
import {
  CardContent,
  CardDescription,
  CardGroup,
  CardHeader,
  CardItem,
  CardTitle,
  Currency,
} from '@sushiswap/ui'
import { Token } from 'sushi/currency'
import { Wrapper } from '../swap/trade/wrapper'

export const PoolPrice = ({
  pool,
}: {
  pool: V2Pool | V3Pool
}) => {
  const reserveToken0 = pool.token0
  const reserveToken1 = pool.token1
  return (
    <Wrapper enableBorder className="!p-3 flex flex-col gap-5">
      <CardHeader className="!p-0 flex flex-col gap-1">
        <CardTitle>Price</CardTitle>
      </CardHeader>
      <CardContent className="!p-0">
        <CardGroup className="lg:!gap-6">
          {reserveToken0 ? (
            <CardItem
              title={
                <div className="flex gap-2 items-center font-medium text-muted-foreground">
                  <Currency.Icon
                    currency={
                      new Token({
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
                1 USDT = 0.99 USDC.e{' '}
                <span className="font-normal text-muted-foreground">0.99</span>
              </span>
            </CardItem>
          ) : null}
          {reserveToken1 ? (
            <CardItem
              title={
                <div className="flex gap-2 items-center font-medium text-muted-foreground">
                  <Currency.Icon
                    currency={
                      new Token({
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
                1 USDC.e = 1.01 USDT{' '}
                <span className="font-normal text-muted-foreground">1.01</span>
              </span>
            </CardItem>
          ) : null}
        </CardGroup>
      </CardContent>
    </Wrapper>
  )
}
