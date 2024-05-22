import { ReactElement } from 'react'
import { SushiSwapV2ChainId, TridentChainId } from 'sushi/config'
import { Type } from 'sushi/currency'
import { Fee } from 'sushi/dex'
import {
  SushiSwapV2Pool,
  TridentConstantPool,
  TridentStablePool,
} from 'sushi/pool'
import { TridentConstantPoolState } from '../../hooks/pools/actions/getTridentConstantPools'
import { TridentStablePoolState } from '../../hooks/pools/actions/getTridentStablePools'
import { SushiSwapV2PoolState } from '../../hooks/pools/hooks/useSushiSwapV2Pools'

export type ComponentsWrapperProps<T> = {
  children:
    | ReactElement<T>
    | Array<ReactElement<T> | undefined>
    | Array<ReactElement<T>[] | ReactElement<T> | undefined>
    | undefined
}

interface PoolFinderProps {
  token0: Type | undefined
  token1: Type | undefined
  index?: number
  dispatch?(payload: PoolExistenceStateAction): void
  enabled: boolean
}

export interface SushiSwapV2PoolFinderProps extends PoolFinderProps {
  chainId: SushiSwapV2ChainId
  token0: Type | undefined
  token1: Type | undefined
  index?: number
  dispatch?(payload: PoolExistenceStateAction): void
  enabled: boolean
}

export interface TridentPoolFinderProps extends PoolFinderProps {
  chainId: TridentChainId
  fee?: Fee
  twap?: boolean
}

export type PoolStateUnion = [
  SushiSwapV2PoolState | TridentConstantPoolState | TridentStablePoolState,
  SushiSwapV2Pool | TridentConstantPool | TridentStablePool | null,
]

export enum PoolFinderType {
  Classic = 'Classic',
  Stable = 'Stable',
  ConcentratedLiquidity = 'Concentrated Liquidity',
}

export type PoolExistenceStateAction = {
  type: 'update'
  payload: { state: PoolStateUnion; index: number; poolType: PoolFinderType }
}
