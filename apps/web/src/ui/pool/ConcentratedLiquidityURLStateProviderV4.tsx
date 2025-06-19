'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  DYNAMIC_FEE_FLAG,
  type HookData,
  SUSHISWAP_V4_SUPPORTED_CHAIN_IDS,
  type SushiSwapV4ChainId,
  getLpFeeFromTotalFee,
} from 'src/lib/pool/v4'
import { getPoolKey } from 'src/lib/pool/v4/sdk/utils/getPoolKey'
import type { EvmChainId } from 'sushi/chain'
import {
  SushiSwapV3FeeAmount,
  TICK_SPACINGS as V3_TICK_SPACINGS,
} from 'sushi/config'
import { z } from 'zod'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from './ConcentratedLiquidityURLStateProviderV3'

const queryParamsSchema = z.object({
  tickSpacing: z.coerce
    .number()
    .int()
    .default(V3_TICK_SPACINGS[SushiSwapV3FeeAmount.MEDIUM]),
  hook: z.string().default(''),
})

type State = Omit<
  ReturnType<typeof useConcentratedLiquidityURLState>,
  'chainId' | 'feeAmount' | 'setFeeAmount'
> & {
  chainId: SushiSwapV4ChainId
  feeAmount: number
  setFeeAmount: (value: number) => void
  tickSpacing: number
  setTickSpacing: (value: number) => void
  hookString: string
  setHookString: (value: string) => void
  hooks: HookData | undefined
  setHooks: (value: HookData) => void
}

export const ConcentratedLiquidityUrlStateContextV4 = createContext<State>(
  {} as State,
)

interface ConcentratedLiquidityURLStateProviderV4 {
  children: ReactNode | ((state: State) => ReactNode)
  chainId: SushiSwapV4ChainId
  supportedNetworks?: EvmChainId[]
}

export const ConcentratedLiquidityURLStateProviderV4: FC<
  ConcentratedLiquidityURLStateProviderV4
> = ({
  children,
  chainId,
  supportedNetworks = SUSHISWAP_V4_SUPPORTED_CHAIN_IDS,
}) => {
  return (
    <ConcentratedLiquidityURLStateProvider
      chainId={chainId}
      supportedNetworks={supportedNetworks as EvmChainId[]}
    >
      <_ConcentratedLiquidityURLStateProviderV4
        chainId={chainId}
        supportedNetworks={supportedNetworks as EvmChainId[]}
      >
        {children}
      </_ConcentratedLiquidityURLStateProviderV4>
    </ConcentratedLiquidityURLStateProvider>
  )
}

const _ConcentratedLiquidityURLStateProviderV4: FC<
  ConcentratedLiquidityURLStateProviderV4
> = ({ children }) => {
  const baseState = useConcentratedLiquidityURLState()
  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [hookData, setHookData] = useState<HookData | undefined>(undefined)

  const state = useMemo(() => {
    const { hook: hookString, tickSpacing } = queryParamsSchema.parse({
      fromCurrency: searchParams.get('hook'),
      toCurrency: searchParams.get('tickSpacing'),
    })

    const setTickSpacing = (tickSpacing: number) => {
      const _searchParams = new URLSearchParams(
        Array.from(searchParams.entries()),
      )
      _searchParams.set('tickSpacing', tickSpacing.toString())
      void push(`${pathname}?${_searchParams.toString()}`, { scroll: false })
    }

    const setFeeAmount = (feeAmount: number) => {
      const _searchParams = new URLSearchParams(
        Array.from(searchParams.entries()),
      )
      _searchParams.set('feeAmount', feeAmount.toString())
      feeAmount in V3_TICK_SPACINGS &&
        _searchParams.set(
          'tickSpacing',
          V3_TICK_SPACINGS[
            feeAmount as keyof typeof V3_TICK_SPACINGS
          ].toString(),
        )
      void push(`${pathname}?${_searchParams.toString()}`, { scroll: false })
    }

    const setHookString = (hook: string) => {
      const _searchParams = new URLSearchParams(
        Array.from(searchParams.entries()),
      )
      _searchParams.set('hook', hook)
      void push(`${pathname}?${_searchParams.toString()}`, { scroll: false })
    }

    return {
      ...baseState,
      chainId: baseState.chainId as SushiSwapV4ChainId,
      feeAmount: baseState.feeAmount as number,
      setFeeAmount,
      tickSpacing,
      setTickSpacing,
      hookString,
      setHookString,
      hooks: hookData,
      setHooks: (value: HookData) => setHookData(value),
    }
  }, [baseState, searchParams, push, pathname, hookData])

  return (
    <ConcentratedLiquidityUrlStateContextV4.Provider value={state}>
      {typeof children === 'function' ? children(state) : children}
    </ConcentratedLiquidityUrlStateContextV4.Provider>
  )
}

export const useConcentratedLiquidityURLStateV4 = () => {
  const context = useContext(ConcentratedLiquidityUrlStateContextV4)
  if (!context) {
    throw new Error(
      'Hook can only be used inside ConcentratedLiquidityUrlStateContextV4',
    )
  }

  return context
}

export const useDerivedPoolKey = () => {
  const { chainId, token0, token1, feeAmount, tickSpacing, hooks } =
    useConcentratedLiquidityURLStateV4()

  return useMemo(() => {
    if (!token0 || !token1) return undefined
    const lpFeeAmount =
      feeAmount === DYNAMIC_FEE_FLAG
        ? feeAmount
        : getLpFeeFromTotalFee(feeAmount)
    return getPoolKey({
      chainId,
      currency0: token0,
      currency1: token1,
      feeAmount: Number(lpFeeAmount),
      tickSpacing,
      hooks,
    })
  }, [chainId, token0, token1, feeAmount, tickSpacing, hooks])
}
