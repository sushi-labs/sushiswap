'use client'

import {
  type SushiSwapV4ChainId,
  SushiSwapV4ChainIds,
} from '@sushiswap/graph-client/data-api'
import { LinkInternal, Message } from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import { type ReactElement, use, useCallback, useMemo, useState } from 'react'
import { SelectTokensWidget } from 'src/lib/components/select-tokens-widget'
import { isV4NativeCurrencyEnabled, useV4PoolByKey } from 'src/lib/pool/v4'
import {
  type EvmCurrency,
  SUSHISWAP_V4_CL_POOL_MANAGER,
  getEvmChainById,
  getSushiSwapV4PoolKey,
} from 'sushi/evm'
import { ConcentratedLiquidityProvider } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { SelectNetworkWidget } from '../../_ui/select-network-widget'
import { useV4DerivedMintInfo } from '../_ui/use-v4-derived-mint-info'
import { V4LiquidityWidget } from '../_ui/v4-liquidity-widget'
import { V4SelectPricesWidget } from '../_ui/v4-select-prices-widget'
import {
  SelectV4PoolConfigWidget,
  type V4FeeConfig,
} from './_ui/select-v4-pool-config-widget'

export default function Page(props: {
  params: Promise<{ chainId: string }>
}): ReactElement {
  const params = use(props.params)
  // The V4 layout only renders for indexed V4 chains
  const chainId = +params.chainId as SushiSwapV4ChainId

  return (
    <ConcentratedLiquidityProvider>
      <AddV4Liquidity key={chainId} chainId={chainId} />
    </ConcentratedLiquidityProvider>
  )
}

function AddV4Liquidity({
  chainId,
}: {
  chainId: SushiSwapV4ChainId
}): ReactElement {
  const router = useRouter()

  const [currencyA, setCurrencyA] = useState<EvmCurrency>()
  const [currencyB, setCurrencyB] = useState<EvmCurrency>()
  const [feeConfig, setFeeConfig] = useState<V4FeeConfig>()

  const switchTokens = useCallback(() => {
    setCurrencyA(currencyB)
    setCurrencyB(currencyA)
  }, [currencyA, currencyB])

  const poolManager = SUSHISWAP_V4_CL_POOL_MANAGER[chainId]

  // Hooks are not configurable yet; pools are created without one
  const poolConfig = useMemo(
    () => (feeConfig ? { ...feeConfig, poolManager } : undefined),
    [feeConfig, poolManager],
  )

  const poolKey = useMemo(() => {
    if (
      !currencyA ||
      !currencyB ||
      !poolConfig ||
      currencyA.isSame(currencyB)
    ) {
      return undefined
    }
    return getSushiSwapV4PoolKey({ currencyA, currencyB, ...poolConfig })
  }, [currencyA, currencyB, poolConfig])

  const {
    data: pool,
    poolId,
    isLoading: isPoolLoading,
  } = useV4PoolByKey({ chainId, poolKey, currencyA, currencyB })

  const derived = useV4DerivedMintInfo({
    currencyA,
    currencyB,
    pool,
    isPoolLoading,
    poolConfig,
  })

  const chainKey = getEvmChainById(chainId).key

  return (
    <>
      <SelectNetworkWidget
        selectedNetwork={chainId}
        onSelect={(chainId) =>
          router.push(`/${getEvmChainById(chainId).key}/pool/v4/add`)
        }
        networks={SushiSwapV4ChainIds}
      />
      <SelectTokensWidget
        chainId={chainId}
        token0={currencyA}
        token1={currencyB}
        setToken0={setCurrencyA}
        setToken1={setCurrencyB}
        includeNative={isV4NativeCurrencyEnabled(chainId)}
      />
      <SelectV4PoolConfigWidget
        config={feeConfig}
        setConfig={setFeeConfig}
        disabled={!currencyA || !currencyB}
      />
      {pool && poolId ? (
        <Message size="sm" variant="muted" className="text-center">
          This pool already exists. You will add a position to it.{' '}
          <LinkInternal
            className="text-blue"
            href={`/${chainKey}/pool/v4/${poolId}`}
          >
            View pool
          </LinkInternal>
        </Message>
      ) : null}
      <V4SelectPricesWidget
        chainId={chainId}
        currencyA={currencyA}
        currencyB={currencyB}
        poolId={pool ? poolId : undefined}
        derived={derived}
        switchTokens={switchTokens}
      />
      <V4LiquidityWidget
        chainId={chainId}
        currencyA={currencyA}
        currencyB={currencyB}
        setCurrencyA={setCurrencyA}
        setCurrencyB={setCurrencyB}
        derived={derived}
        // A pool created just now is not indexed yet, so has no page
        successLink={`/${chainKey}/pool?tab=v4`}
      />
    </>
  )
}
