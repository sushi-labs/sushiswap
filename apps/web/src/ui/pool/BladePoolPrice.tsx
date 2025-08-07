'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import {
  CardContent,
  CardGroup,
  CardHeader,
  CardItem,
  CardTitle,
  Currency,
  classNames,
} from '@sushiswap/ui'
import type { FC } from 'react'
import { Decimal, type EvmChainId } from 'sushi'
import { Token } from 'sushi/currency'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { Wrapper } from '../swap/trade/wrapper'
import { USDGroupedAmountItem } from './PoolCompositionBlade'

export const BladePoolPrice: FC<{
  pool: BladePool
}> = ({ pool }) => {
  const token = pool.tokens[0]

  const tokenObj = new Token({
    chainId: pool.chainId as EvmChainId,
    address: token.address,
    decimals: token.decimals,
    name: token.name,
    symbol: token.symbol,
  })

  const { data: price0 } = usePrice({
    chainId: pool.chainId,
    address: pool.tokens[0].address,
  })

  return (
    <Wrapper enableBorder className="!p-4 flex flex-col gap-5">
      <CardHeader className="!p-0 flex flex-col gap-1">
        <CardTitle>Price</CardTitle>
      </CardHeader>
      <CardContent className="!p-0">
        <CardGroup className="lg:!gap-6">
          <USDGroupedAmountItem amount="" fiatValue={1} />

          <CardItem
            title={
              <div className="flex gap-2 items-center font-medium text-muted-foreground">
                <Currency.Icon currency={tokenObj} width={18} height={18} />
                {token.symbol}
              </div>
            }
          >
            <span className="flex gap-1 font-medium">
              <span className={classNames('font-normal text-muted-foreground')}>
                ${price0?.toFixed(2) ?? '0.00'}
              </span>
            </span>
          </CardItem>
        </CardGroup>
      </CardContent>
    </Wrapper>
  )
}
