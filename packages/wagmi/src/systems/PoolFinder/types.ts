import { ConstantProductPool, Fee, Pair, StablePool } from '@sushiswap/amm'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Type } from '@sushiswap/currency'
import { SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { ReactElement } from 'react'

import { ConstantProductPoolState, PairState, StablePoolState } from '../../hooks'

export type ComponentsWrapperProps<T> = {
  children:
    | ReactElement<T>
    | Array<ReactElement<T> | undefined>
    | Array<Array<ReactElement<T>> | ReactElement<T> | undefined>
    | undefined
}

interface PoolFinderProps {
  token0: Type | undefined
  token1: Type | undefined
  index?: number
  dispatch?(payload: PoolExistenceStateAction): void
  enabled: boolean
}

export interface LegacyPoolFinderProps extends PoolFinderProps {
  chainId: SushiSwapV2ChainId
  token0: Type | undefined
  token1: Type | undefined
  index?: number
  dispatch?(payload: PoolExistenceStateAction): void
  enabled: boolean
}

export interface TridentPoolFinderProps extends PoolFinderProps {
  chainId: BentoBoxV1ChainId
  fee?: Fee
  twap?: boolean
}

export type PoolStateUnion = [
  PairState | ConstantProductPoolState | StablePoolState,
  Pair | ConstantProductPool | StablePool | null
]

export enum PoolFinderType {
  Classic,
  Stable,
  ConcentratedLiquidity,
}

export type PoolExistenceStateAction = {
  type: 'update'
  payload: { state: PoolStateUnion; index: number; poolType: PoolFinderType }
}
