'use client'

import {
  type SmartPoolChainId,
  isSmartPoolChainId,
} from '@sushiswap/graph-client/data-api'
import { Button, Card, Currency, classNames } from '@sushiswap/ui'
import { ArrowRight, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FC, use, useEffect, useMemo, useRef, useState } from 'react'
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
    <ConcentratedLiquidityURLStateProvider
      chainId={+params.chainId as SushiSwapV3ChainId}
      requireExplicitSelections
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
    selectedFeeAmount: feeAmount,
    setFeeAmount,
    tokensLoading,
    tokenId,
    switchTokens,
  } = useConcentratedLiquidityURLState()

  const router = useRouter()

  const [step, setStep] = useState<1 | 2>(1)
  const progressRef = useRef<HTMLOListElement>(null)
  const canContinue = Boolean(token0 && token1 && feeAmount)

  function goToStep(nextStep: 1 | 2) {
    setStep(nextStep)
    progressRef.current?.focus({ preventScroll: true })
    progressRef.current?.scrollIntoView({ block: 'start' })
  }

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

  const steps = [
    { number: 1, label: 'Select pair and fee' },
    {
      number: 2,
      label:
        poolType === V3PoolType.SMART
          ? 'Set strategy and deposit'
          : 'Set range and deposit',
    },
  ] as const

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
      <ol
        ref={progressRef}
        tabIndex={-1}
        aria-label="Position setup progress"
        className="grid grid-cols-2 gap-4 rounded-2xl border border-accent p-4 scroll-mt-24 lg:grid-cols-1 lg:gap-6 lg:p-6"
      >
        {steps.map(({ number, label }) => (
          <li key={number}>
            <button
              type="button"
              aria-current={step === number ? 'step' : undefined}
              disabled={number === 2 && !canContinue}
              className="flex w-full items-center gap-3 rounded-lg text-left disabled:cursor-not-allowed"
              onClick={() => goToStep(number)}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                  number <= step
                    ? 'bg-primary text-background'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {number < step ? <Check size={16} /> : number}
              </span>
              <span>
                <span className="block text-xs text-muted-foreground">
                  Step {number}
                </span>
                <span
                  className={classNames(
                    'text-sm font-medium',
                    number > step && 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <section hidden={step !== 1} aria-label="Select pair and fee">
        <Card className="divide-y divide-accent px-4 sm:px-6">
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
          <div className="py-4">
            <Button
              type="button"
              fullWidth
              size="lg"
              icon={ArrowRight}
              iconPosition="end"
              disabled={!canContinue}
              onClick={() => goToStep(2)}
            >
              Continue
            </Button>
          </div>
        </Card>
      </section>
      <section hidden={step !== 2} aria-label="Configure position">
        <Card className="divide-y divide-accent px-4 sm:px-6">
          <div className="flex items-center gap-3 py-4">
            {token0 && token1 && (
              <Currency.IconList iconWidth={28} iconHeight={28}>
                <Currency.Icon disableLink currency={token0} />
                <Currency.Icon disableLink currency={token1} />
              </Currency.IconList>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">
                {token0?.symbol} / {token1?.symbol}
              </div>
              <div className="text-sm text-muted-foreground">
                {getEvmChainById(chainId).name} · V3
                {feeAmount && ` · ${feeAmount / 10000}% fee`}
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              aria-label="Edit pool setup"
              onClick={() => goToStep(1)}
            >
              Edit
            </Button>
          </div>
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
        </Card>
      </section>
    </div>
  )
}
