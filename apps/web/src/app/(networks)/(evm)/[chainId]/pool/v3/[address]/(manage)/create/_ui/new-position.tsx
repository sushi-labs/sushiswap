'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@sushiswap/ui'
import { type FC, useMemo, useState } from 'react'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query/pools/use-concentrated-liquidity-pool-stats'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { getChainById } from 'sushi'
import {
  type EvmAddress,
  type SushiSwapV3ChainId,
  unwrapEvmToken,
} from 'sushi/evm'
import {
  type LiquidityFormMode,
  LiquidityFormModeToggle,
} from '~evm/[chainId]/_ui/select-prices-widget/liquidity-form-mode-toggle'
import { LiquidityPriceRange } from '~evm/[chainId]/_ui/select-prices-widget/liquidity-price-range'
import { ConcentratedLiquidityWidget } from '~evm/[chainId]/pool/v3/_ui/concentrated-liquidity-widget'

interface NewPositionProps {
  address: EvmAddress
  chainId: SushiSwapV3ChainId
}

export const NewPosition: FC<NewPositionProps> = ({ address, chainId }) => {
  const account = useAccount('evm')

  const [invertTokens, setInvertTokens] = useState(false)
  const [formMode, setFormMode] = useState<LiquidityFormMode>('simple')

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle>New position</CardTitle>
            <CardDescription>
              Create a new concentrated liquidity position
            </CardDescription>
          </div>
          <LiquidityFormModeToggle mode={formMode} onModeChange={setFormMode} />
        </div>
      </CardHeader>
      <div className="px-6">
        <Separator />
      </div>
      <CardContent>
        <>
          <LiquidityPriceRange
            mode={formMode}
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
