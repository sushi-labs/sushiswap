'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@sushiswap/ui'
import React, { type FC, useMemo, useState } from 'react'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query'
import { getChainById } from 'sushi'
import {
  type EvmAddress,
  type SushiSwapV3ChainId,
  unwrapEvmToken,
} from 'sushi/evm'
import { useConnection } from 'wagmi'
import { SelectPricesWidget } from '~evm/[chainId]/_ui/select-prices-widget'
import { ConcentratedLiquidityWidget } from '~evm/[chainId]/pool/v3/_ui/concentrated-liquidity-widget'

interface NewPositionProps {
  address: EvmAddress
  chainId: SushiSwapV3ChainId
}

export const NewPosition: FC<NewPositionProps> = ({ address, chainId }) => {
  const { address: account } = useConnection()

  const [invertTokens, setInvertTokens] = useState(false)

  const { data: poolStats } = useConcentratedLiquidityPoolStats({
    chainId,
    address,
  })
  const [_token0, _token1] = useMemo(() => {
    const tokens = [
      poolStats?.token0 ? unwrapEvmToken(poolStats.token0) : undefined,
      poolStats?.token1 ? unwrapEvmToken(poolStats.token1) : undefined,
    ]

    return invertTokens ? tokens.reverse() : tokens
  }, [invertTokens, poolStats])

  return (
    <Card>
      <CardHeader>
        <CardTitle>New position</CardTitle>
        <CardDescription>
          Create a new concentrated liquidity position
        </CardDescription>
      </CardHeader>
      <div className="px-6">
        <Separator />
      </div>
      <CardContent>
        <>
          <SelectPricesWidget
            chainId={chainId}
            token0={_token0}
            token1={_token1}
            poolAddress={address}
            feeAmount={poolStats?.feeAmount}
            tokenId={undefined}
            switchTokens={() => setInvertTokens((prev) => !prev)}
          />
          <ConcentratedLiquidityWidget
            chainId={chainId}
            account={account}
            token0={_token0}
            token1={_token1}
            feeAmount={poolStats?.feeAmount}
            tokensLoading={false}
            existingPosition={undefined}
            tokenId={undefined}
            successLink={`/${getChainById(chainId).key}/pool/v3/${address}/positions`}
          />
        </>
      </CardContent>
    </Card>
  )
}
