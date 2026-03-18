'use client'

import {
  type SmartPoolChainId,
  isSmartPoolChainId,
} from '@sushiswap/graph-client/data-api'
import { useRouter } from 'next/navigation'
import { type FC, use, useEffect, useMemo, useState } from 'react'
import { SelectSmartPoolStrategyWidget } from 'src/lib/steer/components/select-smart-pool-strategy-widget'
import { SmartPoolLiquidityWidget } from 'src/lib/steer/components/smart-pool-liquidity-widget'
import { useVaults } from 'src/lib/steer/hooks'
import { useConcentratedPositionInfo } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionInfo'
import {
  type EvmAddress,
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
  type SushiSwapV3ChainId,
  computeSushiSwapV3PoolAddress,
  getEvmChainById,
  isEvmWNativeSupported,
} from 'sushi/evm'
import { useConnection } from 'wagmi'
import { ConcentratedLiquidityProvider } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { SelectPricesWidget } from '~evm/[chainId]/_ui/select-prices-widget'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from '../../_ui/concentrated-liquidity-url-state-provider'
import { SelectFeeConcentratedWidget } from '../../_ui/select-fee-concentrated-widget'
import { SelectNetworkWidget } from '../../_ui/select-network-widget'
import { SelectTokensWidget } from '../../_ui/select-tokens-widget'
import { ConcentratedLiquidityWidget } from '../_ui/concentrated-liquidity-widget'
import {
  SelectV3PoolTypeWidget,
  V3PoolType,
} from '../_ui/select-v3-pool-type-widget'

export default function Page(props: { params: Promise<{ chainId: string }> }) {
  const params = use(props.params)
  return (
    <ConcentratedLiquidityURLStateProvider
      chainId={+params.chainId as SushiSwapV3ChainId}
    >
      <ConcentratedLiquidityProvider>
        <_Add />
      </ConcentratedLiquidityProvider>
    </ConcentratedLiquidityURLStateProvider>
  )
}

const _Add: FC = () => {
  const { address } = useConnection()
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
      token0 && token1 && feeAmount
        ? computeSushiSwapV3PoolAddress({
            factoryAddress: SUSHISWAP_V3_FACTORY_ADDRESS[chainId],
            tokenA: token0.wrap(),
            tokenB: token1.wrap(),
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
        onSelect={(chainId) =>
          router.push(`/${getEvmChainById(chainId).key}/pool/v3/add`)
        }
        networks={SUSHISWAP_V3_SUPPORTED_CHAIN_IDS}
      />
      <SelectTokensWidget
        chainId={chainId}
        token0={token0}
        token1={token1}
        setToken0={setToken0}
        setToken1={setToken1}
        includeNative={isEvmWNativeSupported(chainId)}
      />
      <SelectFeeConcentratedWidget
        chainId={chainId}
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
            successLink={`/${getEvmChainById(chainId).key}/pool/v3/${poolAddress}/${tokenId ?? 'positions'}`}
          />
        </>
      ) : poolType === V3PoolType.SMART && vaults ? (
        <>
          <SelectSmartPoolStrategyWidget
            chainId={chainId as SmartPoolChainId}
            poolAddress={poolAddress as EvmAddress}
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
