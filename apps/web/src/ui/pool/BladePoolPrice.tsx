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
import { formatUSD } from 'sushi'
import {
  type BladeChainId,
  type EvmAddress,
  EvmToken,
  unwrapEvmToken,
} from 'sushi/evm'
import { Wrapper } from '~evm/[chainId]/[trade]/_ui/swap/trade/wrapper'
import { USDGroupedAmountItem } from '~evm/[chainId]/_ui/PoolCompositionBlade'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'

export const BladePoolPrice: FC<{
  pool: BladePool
  showStableTypes: boolean
}> = ({ pool, showStableTypes }) => {
  const token0 = pool?.tokens?.[0]

  return (
    <Wrapper enableBorder className="!p-4 flex flex-col gap-5">
      <CardHeader className="!p-0 flex flex-col gap-1">
        <CardTitle>Price</CardTitle>
      </CardHeader>
      <CardContent className="!p-0">
        <CardGroup className="lg:!gap-6">
          {showStableTypes ? (
            <>
              {pool?.tokens?.map((token, idx) => (
                <Item key={idx} token={token} chainId={pool.chainId} />
              ))}
            </>
          ) : (
            <>
              <USDGroupedAmountItem amount="" fiatValue={1} />
              <Item token={token0} chainId={pool.chainId} />
            </>
          )}
        </CardGroup>
      </CardContent>
    </Wrapper>
  )
}

const Item = ({
  token,
  chainId,
}: { token: BladePool['tokens'][number]; chainId: BladeChainId }) => {
  const _token = unwrapEvmToken(
    new EvmToken({
      chainId: chainId,
      address: token?.token.address as EvmAddress,
      decimals: token?.token.decimals,
      name: token?.token.name,
      symbol: token?.token.symbol,
    }),
  )

  const { data: price } = usePrice({
    chainId: _token?.chainId,
    address: _token?.wrap().address,
  })
  return (
    <CardItem
      title={
        <div className="flex gap-2 items-center font-medium text-muted-foreground">
          <Currency.Icon currency={_token} width={18} height={18} />
          {_token?.symbol}
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
