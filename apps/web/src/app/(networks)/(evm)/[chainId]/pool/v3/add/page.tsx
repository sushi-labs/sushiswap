'use client'

import { useRouter } from 'next/navigation'
import { type FC, use, useMemo } from 'react'
import { useConcentratedPositionInfo } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionInfo'
import {
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
  type SushiSwapV3ChainId,
  computeSushiSwapV3PoolAddress,
  getEvmChainById,
  isWNativeSupported,
} from 'sushi/evm'
import { useAccount } from 'wagmi'
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
        includeNative={isWNativeSupported(chainId)}
      />
      <SelectFeeConcentratedWidget
        feeAmount={feeAmount}
        setFeeAmount={setFeeAmount}
        token1={token1}
        token0={token0}
      />
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
  )
}
