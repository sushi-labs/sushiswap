'use client'

import { useRouter } from 'next/navigation'
import { type FC, use, useState } from 'react'
import {
  SUSHISWAP_V4_SUPPORTED_CHAIN_IDS,
  type SushiSwapV4ChainId,
} from 'src/lib/pool/v4'
import { useConcentratedPositionInfoV4 } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionInfoV4'
import { ConcentratedLiquidityProviderV4 } from 'src/ui/pool/ConcentratedLiquidityProviderV4'
import {
  ConcentratedLiquidityURLStateProviderV4,
  useConcentratedLiquidityURLStateV4,
  useDerivedPoolKey,
} from 'src/ui/pool/ConcentratedLiquidityURLStateProviderV4'
import { ConcentratedLiquidityWidgetV4 } from 'src/ui/pool/ConcentratedLiquidityWidgetV4'
import { SelectFeeConcentratedWidgetV4 } from 'src/ui/pool/SelectFeeConcentratedWidgetV4'
import { SelectNetworkWidget } from 'src/ui/pool/SelectNetworkWidget'
import { SelectPricesWidgetV4 } from 'src/ui/pool/SelectPricesWidgetV4'
import { SelectTokensWidget } from 'src/ui/pool/SelectTokensWidget'
import { ChainKey } from 'sushi'
import { isWNativeSupported } from 'sushi/config'
import { useAccount } from 'wagmi'

export default function Page(props: { params: Promise<{ chainId: string }> }) {
  const params = use(props.params)
  return (
    <ConcentratedLiquidityURLStateProviderV4
      chainId={+params.chainId as SushiSwapV4ChainId}
    >
      <ConcentratedLiquidityProviderV4>
        <_Add />
      </ConcentratedLiquidityProviderV4>
    </ConcentratedLiquidityURLStateProviderV4>
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
    tickSpacing,
    setTickSpacing,
    tokensLoading,
    tokenId,
    switchTokens,
  } = useConcentratedLiquidityURLStateV4()

  const poolKey = useDerivedPoolKey()

  const router = useRouter()

  const [_invert, _setInvert] = useState(false)
  const { data: position } = useConcentratedPositionInfoV4({
    chainId,
    token0,
    tokenId,
    token1,
    enabled: false,
  })

  return (
    <>
      <SelectNetworkWidget
        selectedNetwork={chainId}
        onSelect={(chainId) => router.push(`/${ChainKey[chainId]}/pool/v4/add`)}
        networks={SUSHISWAP_V4_SUPPORTED_CHAIN_IDS}
      />
      <SelectTokensWidget
        chainId={chainId}
        token0={token0}
        token1={token1}
        setToken0={setToken0}
        setToken1={setToken1}
        includeNative={isWNativeSupported(chainId)}
        protocol={'SUSHISWAP_V4'}
      />
      <SelectFeeConcentratedWidgetV4
        chainId={chainId}
        feeAmount={feeAmount}
        setFeeAmount={setFeeAmount}
        tickSpacing={tickSpacing}
        setTickSpacing={setTickSpacing}
        token0={token0}
        token1={token1}
      />
      <SelectPricesWidgetV4
        chainId={chainId}
        token0={token0}
        token1={token1}
        poolKey={poolKey}
        tokenId={tokenId}
        switchTokens={switchTokens}
      />
      <ConcentratedLiquidityWidgetV4
        chainId={chainId}
        account={address}
        token0={token0}
        token1={token1}
        poolKey={poolKey}
        setToken0={setToken0}
        setToken1={setToken1}
        tokensLoading={tokensLoading}
        existingPosition={position ?? undefined}
        tokenId={tokenId}
        successLink={`/${ChainKey[chainId]}/pool/v4/${tokenId}`}
      />
    </>
  )
}
