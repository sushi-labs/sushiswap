'use client'

import type {
  BladePool,
  TokenWithLiquidity,
} from '@sushiswap/graph-client/data-api'
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
import type { EvmChainId } from 'sushi'
import { Token, unwrapToken } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { Wrapper } from '../swap/trade/wrapper'
import { USDGroupedAmountItem } from './PoolCompositionBlade'

export const BladePoolPrice: FC<{
  pool: BladePool
  showStableTypes: boolean
}> = ({ pool, showStableTypes }) => {
  const token0 = pool.tokens?.[0]

  return (
    <Wrapper enableBorder className="!p-4 flex flex-col gap-5">
      <CardHeader className="!p-0 flex flex-col gap-1">
        <CardTitle>Price</CardTitle>
      </CardHeader>
      <CardContent className="!p-0">
        <CardGroup className="lg:!gap-6">
          {showStableTypes ? (
            <>
              {pool.tokens?.map((token, idx) => (
                <Item key={idx} token={token} />
              ))}
            </>
          ) : (
            <>
              <USDGroupedAmountItem amount="" fiatValue={1} />
              <Item token={token0} />
            </>
          )}
        </CardGroup>
      </CardContent>
    </Wrapper>
  )
}

const Item = ({ token }: { token: TokenWithLiquidity }) => {
  const _token = unwrapToken(
    new Token({
      chainId: token.chainId as EvmChainId,
      address: token.address,
      decimals: token.decimals,
      name: token.name,
      symbol: token.symbol,
    }),
  )

  const { data: price } = usePrice({
    chainId: _token.chainId,
    address: _token.wrapped.address,
  })
  return (
    <CardItem
      title={
        <div className="flex gap-2 items-center font-medium text-muted-foreground">
          <Currency.Icon currency={_token} width={18} height={18} />
          {_token.symbol}
        </div>
      }
    >
      <span className="flex gap-1 font-medium">
        <span className={classNames('font-normal text-muted-foreground')}>
          {formatUSD(price || 0)}
        </span>
      </span>
    </CardItem>
  )
}
