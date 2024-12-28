'use client'

import {
  SmartPoolChainId,
  isSmartPoolChainId,
} from '@sushiswap/graph-client/data-api'
import { useRouter } from 'next/navigation'
import React, { FC, useEffect, useMemo, useState, use } from 'react'
import { useVaults } from 'src/lib/hooks'
import { useConcentratedPositionInfo } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionInfo'
import { ConcentratedLiquidityProvider } from 'src/ui/pool/ConcentratedLiquidityProvider'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from 'src/ui/pool/ConcentratedLiquidityURLStateProvider'
import { ConcentratedLiquidityWidget } from 'src/ui/pool/ConcentratedLiquidityWidget'
import { SelectFeeConcentratedWidget } from 'src/ui/pool/SelectFeeConcentratedWidget'
import { SelectNetworkWidget } from 'src/ui/pool/SelectNetworkWidget'
import { SelectPricesWidget } from 'src/ui/pool/SelectPricesWidget'
import { SelectSmartPoolStrategyWidget } from 'src/ui/pool/SelectSmartPoolStrategyWidget'
import { SelectTokensWidget } from 'src/ui/pool/SelectTokensWidget'
import {
  SelectV3PoolTypeWidget,
  V3PoolType,
} from 'src/ui/pool/SelectV3PoolTypeWidget'
import { SmartPoolLiquidityWidget } from 'src/ui/pool/SmartPoolLiquidityWidget'
import { ChainKey, computeSushiSwapV3PoolAddress } from 'sushi'
import {
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
  SushiSwapV3ChainId,
  isWNativeSupported,
} from 'sushi/config'
import { SWRConfig } from 'swr'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

export default function Page(props: { params: Promise<{ chainId: string }> }) {
  const params = use(props.params)
  return (
    <ConcentratedLiquidityURLStateProvider
      chainId={+params.chainId as SushiSwapV3ChainId}
    >
      <SWRConfig>
        <ConcentratedLiquidityProvider>
          <_Add />
        </ConcentratedLiquidityProvider>
      </SWRConfig>
    </ConcentratedLiquidityURLStateProvider>
  )
}

const _Add: FC = () => {
  const { address } = useAccount()
  const {
    chainId,
    token0,
    token1,
    setToken1,
    setToken0,
    feeAmount,
    setFeeAmount,
    tokensLoading,
    tokenId,
    switchTokens,
  } = useConcentratedLiquidityURLState()

  const router = useRouter()

  const [_invert, _setInvert] = useState(false)
  const { data: position } = useConcentratedPositionInfo({
    chainId,
    token0,
    tokenId,
    token1,
  })

  const poolAddress = useMemo(
    () =>
      token0 && token1 && feeAmount && chainId
        ? computeSushiSwapV3PoolAddress({
            factoryAddress: SUSHISWAP_V3_FACTORY_ADDRESS[chainId],
            tokenA: token0.wrapped,
            tokenB: token1.wrapped,
            fee: feeAmount,
          })
        : undefined,
    [chainId, feeAmount, token0, token1],
  )

  const { data: _vaults } = useVaults(
    { chainId: chainId as SmartPoolChainId, poolAddress },
    Boolean(isSmartPoolChainId(chainId) && poolAddress),
  )

  const vaults = useMemo(
    () =>
      _vaults
        ?.filter((vault) => vault.isEnabled)
        .sort((a, b) => b.apr1d - a.apr1d),
    [_vaults],
  )

  const [vaultIndex, setVaultIndex] = useState(0)

  const [poolType, setPoolType] = useState<V3PoolType>(V3PoolType.MANUAL)

  useEffect(() => {
    if (vaults && vaults.length > 0) {
      setPoolType(V3PoolType.SMART)
    } else {
      setPoolType(V3PoolType.MANUAL)
    }
  }, [vaults])

  return (
    <>
      <SelectNetworkWidget
        selectedNetwork={chainId}
        onSelect={(chainId) => router.push(`/${ChainKey[chainId]}/pool/v3/add`)}
        networks={SUSHISWAP_V3_SUPPORTED_CHAIN_IDS}
      />
      <SelectTokensWidget
        chainId={chainId}
        token0={token0}
        token1={token1}
        setToken0={setToken0}
        setToken1={setToken1}
        includeNative={isWNativeSupported(chainId)}
      />
      <SelectFeeConcentratedWidget
        feeAmount={feeAmount}
        setFeeAmount={setFeeAmount}
        token1={token1}
        token0={token0}
      />
      <SelectV3PoolTypeWidget
        poolType={poolType}
        setPoolType={setPoolType}
        isSmartPoolSupported={Boolean(vaults?.length)}
      />
      {poolType === V3PoolType.MANUAL ? (
        <>
          <SelectPricesWidget
            chainId={chainId}
            token0={token0}
            token1={token1}
            poolAddress={poolAddress}
            tokenId={tokenId}
            feeAmount={feeAmount}
            switchTokens={switchTokens}
          />
          <ConcentratedLiquidityWidget
            chainId={chainId}
            account={address}
            token0={token0}
            token1={token1}
            setToken0={setToken0}
            setToken1={setToken1}
            feeAmount={feeAmount}
            tokensLoading={tokensLoading}
            existingPosition={position ?? undefined}
            tokenId={tokenId}
            successLink={`/${ChainKey[chainId]}/pool/v3/${poolAddress}/${tokenId}`}
          />
        </>
      ) : poolType === V3PoolType.SMART && vaults ? (
        <>
          <SelectSmartPoolStrategyWidget
            chainId={chainId as SmartPoolChainId}
            poolAddress={poolAddress as Address}
            vaults={vaults}
            vaultIndex={vaultIndex}
            setVaultIndex={setVaultIndex}
          />
          <SmartPoolLiquidityWidget vault={vaults[vaultIndex]} />
        </>
      ) : null}
    </>
  )
}
