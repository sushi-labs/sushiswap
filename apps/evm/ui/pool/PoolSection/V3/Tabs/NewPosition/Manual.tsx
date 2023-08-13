import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'
import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useAccount } from '@sushiswap/wagmi'
import { unwrapToken } from 'lib/functions'
import React, { FC, useMemo, useState } from 'react'
import { ContentBlock } from 'ui/pool/AddPage/ContentBlock'
import { ConcentratedLiquidityWidget } from 'ui/pool/ConcentratedLiquidityWidget'
import { SelectPricesWidget } from 'ui/pool/NewPositionSection'

interface ManualProps {
  address: string
  chainId: SushiSwapV3ChainId
}

export const Manual: FC<ManualProps> = ({ address, chainId }) => {
  const { address: account } = useAccount()

  const [invertTokens, setInvertTokens] = useState(false)

  const { data: poolStats } = useConcentratedLiquidityPoolStats({ chainId, address })
  const [_token0, _token1] = useMemo(() => {
    const tokens = [
      poolStats?.token0 ? unwrapToken(poolStats.token0) : undefined,
      poolStats?.token1 ? unwrapToken(poolStats.token1) : undefined,
    ]

    return invertTokens ? tokens.reverse() : tokens
  }, [invertTokens, poolStats?.token0, poolStats?.token1])

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="flex">
        <SelectPricesWidget
          chainId={chainId}
          token0={_token0}
          token1={_token1}
          feeAmount={poolStats?.feeAmount}
          tokenId={undefined}
          switchTokens={() => setInvertTokens((prev) => !prev)}
        />
      </div>
      <div className="flex flex-col gap-3">
        <ContentBlock
          title={
            <>
              How much <span className="text-gray-900 dark:text-white">liquidity</span> do you want to provide?
            </>
          }
        >
          <ConcentratedLiquidityWidget
            chainId={chainId}
            account={account}
            token0={_token0}
            token1={_token1}
            feeAmount={poolStats?.feeAmount}
            tokensLoading={false}
            existingPosition={undefined}
            tokenId={undefined}
            successLink={`/pools/${chainId}:${address}?activeTab=myPositions`}
          />
        </ContentBlock>
      </div>
    </div>
  )
}
