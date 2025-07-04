import type { ReactElement } from 'react'
import type {
  EvmCurrency,
  SushiSwapV2ChainId,
  SushiSwapV2Pool,
} from 'sushi/evm'
import type { SushiSwapV2PoolState } from '../../hooks/pools/hooks/useSushiSwapV2Pools'

export type ComponentsWrapperProps<T> = {
  children:
    | ReactElement<T>
    | Array<ReactElement<T> | undefined>
    | Array<ReactElement<T>[] | ReactElement<T> | undefined>
    | undefined
}

interface PoolFinderProps {
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  index?: number
  dispatch?(payload: PoolExistenceStateAction): void
  enabled: boolean
}

export interface SushiSwapV2PoolFinderProps extends PoolFinderProps {
  chainId: SushiSwapV2ChainId
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  index?: number
  dispatch?(payload: PoolExistenceStateAction): void
  enabled: boolean
}

export type PoolStateUnion = [SushiSwapV2PoolState, SushiSwapV2Pool | null]

export enum PoolFinderType {
  Classic = 'Classic',
  Stable = 'Stable',
  ConcentratedLiquidity = 'Concentrated Liquidity',
}

export type PoolExistenceStateAction = {
  type: 'update'
  payload: { state: PoolStateUnion; index: number; poolType: PoolFinderType }
}
