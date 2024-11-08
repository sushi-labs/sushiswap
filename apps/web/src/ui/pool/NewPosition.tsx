'use client'

import {
  SmartPoolChainId,
  isSmartPoolChainId,
} from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@sushiswap/ui'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useVaults } from 'src/lib/hooks'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query'
import { Address, ChainKey } from 'sushi'
import { SushiSwapV3ChainId } from 'sushi/config'
import { unwrapToken } from 'sushi/currency'
import { useAccount } from 'wagmi'
import { ConcentratedLiquidityWidget } from './ConcentratedLiquidityWidget'
import { SelectPricesWidget } from './SelectPricesWidget'
import { SelectSmartPoolStrategyWidget } from './SelectSmartPoolStrategyWidget'
import { PoolType, SelectV3PoolTypeWidget } from './SelectV3PoolTypeWidget'
import { SmartPoolLiquidityWidget } from './SmartPoolLiquidityWidget'

interface NewPositionProps {
  address: Address
  chainId: SushiSwapV3ChainId
}

export const NewPosition: FC<NewPositionProps> = ({ address, chainId }) => {
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

  const { data: _vaults } = useVaults(
    { chainId: chainId as SmartPoolChainId, poolAddress: address },
    Boolean(isSmartPoolChainId(chainId)),
  )

  const vaults = useMemo(
    () =>
      _vaults
        ?.filter((vault) => vault.isEnabled)
        .sort((a, b) => b.apr1d - a.apr1d),
    [_vaults],
  )

  const [vaultIndex, setVaultIndex] = useState(0)

  const [poolType, setPoolType] = useState<PoolType>(PoolType.MANUAL)

  useEffect(() => {
    if (vaults && vaults.length > 0) {
      setPoolType(PoolType.SMART)
    } else {
      setPoolType(PoolType.MANUAL)
    }
  }, [vaults])

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
        <SelectV3PoolTypeWidget
          poolType={poolType}
          setPoolType={setPoolType}
          isSmartPoolSupported={Boolean(vaults?.length)}
        />
        {poolType === PoolType.MANUAL ? (
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
              successLink={`/${ChainKey[chainId]}/pool/v3/${address}/positions`}
            />
          </>
        ) : poolType === PoolType.SMART && vaults ? (
          <>
            <SelectSmartPoolStrategyWidget
              chainId={chainId as SmartPoolChainId}
              poolAddress={address}
              vaults={vaults}
              vaultIndex={vaultIndex}
              setVaultIndex={setVaultIndex}
            />
            <SmartPoolLiquidityWidget vault={vaults[vaultIndex]} />
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
