'use client'

import {
  type SmartPoolChainId,
  isSmartPoolChainId,
} from '@sushiswap/graph-client/data-api'
import { MultiStepForm } from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import { type FC, use, useEffect, useMemo, useState } from 'react'
import { SelectTokensWidget } from 'src/lib/components/select-tokens-widget'
import { SelectSmartPoolStrategyWidget } from 'src/lib/steer/components/select-smart-pool-strategy-widget'
import { SmartPoolLiquidityWidget } from 'src/lib/steer/components/smart-pool-liquidity-widget'
import { useVaults } from 'src/lib/steer/hooks'
import { useConcentratedPositionInfo } from 'src/lib/wagmi/hooks/positions/hooks/use-concentrated-position-info'
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
import { PoolFormSession } from '../../_ui/pool-form-session'
import { PoolSetupSummary } from '../../_ui/pool-setup-summary'
import { SelectFeeConcentratedWidget } from '../../_ui/select-fee-concentrated-widget'
import { SelectNetworkWidget } from '../../_ui/select-network-widget'
import { SelectPositionType } from '../../_ui/select-position-type'
import { ConcentratedLiquidityWidget } from '../_ui/concentrated-liquidity-widget'
import {
  SelectV3PoolTypeWidget,
  V3PoolType,
} from '../_ui/select-v3-pool-type-widget'

export default function Page(props: { params: Promise<{ chainId: string }> }) {
  const params = use(props.params)
  return (
    <PoolFormSession>
      <ConcentratedLiquidityURLStateProvider
        chainId={+params.chainId as SushiSwapV3ChainId}
        requireExplicitSelections
      >
        <ConcentratedLiquidityProvider>
          <_Add />
        </ConcentratedLiquidityProvider>
      </ConcentratedLiquidityURLStateProvider>
    </PoolFormSession>
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
    selectedFeeAmount: feeAmount,
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
    <MultiStepForm
      progressLabel="Position setup progress"
      steps={[
        {
          id: 'pool',
          label: 'Select pair and fee',
          canContinue: Boolean(token0 && token1 && feeAmount),
          editLabel: 'Edit pool setup',
          summary: (
            <PoolSetupSummary
              version="V3"
              token0={token0}
              token1={token1}
              chainId={chainId}
              feeAmount={feeAmount}
            />
          ),
          content: (
            <>
              <div className="grid gap-x-6 py-3 sm:grid-cols-2">
                <SelectPositionType chainId={chainId} positionType="v3" />
                <SelectNetworkWidget
                  selectedNetwork={chainId}
                  onSelect={(chainId) =>
                    router.push(`/${getEvmChainById(chainId).key}/pool/v3/add`)
                  }
                  networks={SUSHISWAP_V3_SUPPORTED_CHAIN_IDS}
                />
              </div>
              <div className="py-3">
                <SelectTokensWidget
                  chainId={chainId}
                  token0={token0}
                  token1={token1}
                  setToken0={setToken0}
                  setToken1={setToken1}
                  includeNative={isEvmWNativeSupported(chainId)}
                />
              </div>
              <div className="py-3">
                <SelectFeeConcentratedWidget
                  chainId={chainId}
                  feeAmount={feeAmount}
                  setFeeAmount={setFeeAmount}
                  token1={token1}
                  token0={token0}
                />
              </div>
            </>
          ),
        },
        {
          id: 'position',
          label:
            poolType === V3PoolType.SMART
              ? 'Set strategy and deposit'
              : 'Set range and deposit',
          ariaLabel: 'Configure position',
          content: (
            <>
              <div className="py-3">
                <SelectV3PoolTypeWidget
                  poolType={poolType}
                  setPoolType={setPoolType}
                  isSmartPoolSupported={Boolean(vaults?.length)}
                />
              </div>
              {poolType === V3PoolType.MANUAL ? (
                <>
                  <div className="py-3">
                    <SelectPricesWidget
                      chainId={chainId}
                      token0={token0}
                      token1={token1}
                      poolAddress={poolAddress}
                      tokenId={tokenId}
                      feeAmount={feeAmount}
                      switchTokens={switchTokens}
                    />
                  </div>
                  <div className="py-3">
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
                  </div>
                </>
              ) : poolType === V3PoolType.SMART && vaults ? (
                <>
                  <div className="py-3">
                    <SelectSmartPoolStrategyWidget
                      chainId={chainId as SmartPoolChainId}
                      poolAddress={poolAddress as EvmAddress}
                      vaults={vaults}
                      vaultIndex={vaultIndex}
                      setVaultIndex={setVaultIndex}
                    />
                  </div>
                  <div className="py-3">
                    <SmartPoolLiquidityWidget vault={vaults[vaultIndex]} />
                  </div>
                </>
              ) : null}
            </>
          ),
        },
      ]}
    />
  )
}
