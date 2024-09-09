'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@sushiswap/ui'
import React, { FC, useMemo, useState } from 'react'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query'
import { ConcentratedLiquidityWidget } from 'src/ui/pool/ConcentratedLiquidityWidget'
import { Address, ChainKey } from 'sushi'
import { SushiSwapV3ChainId } from 'sushi/config'
import { unwrapToken } from 'sushi/currency'
import { useAccount } from 'wagmi'
import { SelectPricesWidget } from './SelectPricesWidget'

interface ManualProps {
  address: Address
  chainId: SushiSwapV3ChainId
}

export const CreatePositionManual: FC<ManualProps> = ({ address, chainId }) => {
  const { address: account } = useAccount()

  const [invertTokens, setInvertTokens] = useState(false)

  const { data: poolStats } = useConcentratedLiquidityPoolStats({
    chainId,
    address,
  })
  const [_token0, _token1] = useMemo(() => {
    const tokens = [
      poolStats?.token0 ? unwrapToken(poolStats.token0) : undefined,
      poolStats?.token1 ? unwrapToken(poolStats.token1) : undefined,
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
          successLink={`/${ChainKey[chainId]}/pool/v3/${address}/positions`}
        />
      </CardContent>
    </Card>
  )
}
