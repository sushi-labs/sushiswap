import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { ConstantProductPool, Fee, Pair, StablePool } from '@sushiswap/amm'
import { ReactElement } from 'react'

import { ConstantProductPoolState, PairState, StablePoolState } from '../../hooks'

export type ComponentsWrapperProps<T> = {
  children:
    | ReactElement<T>
    | Array<ReactElement<T> | undefined>
    | Array<Array<ReactElement<T>> | ReactElement<T> | undefined>
    | undefined
}

export interface LegacyPoolFinderProps {
  chainId: ChainId
  token0: Type | undefined
  token1: Type | undefined
  index?: number
  dispatch?(payload: PoolExistenceStateAction): void
  enabled: boolean
}

export interface TridentPoolFinderProps extends LegacyPoolFinderProps {
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
  // ConcentratedLiquidity,
}

export type PoolExistenceStateAction = {
  type: 'update'
  payload: { state: PoolStateUnion; index: number; poolType: PoolFinderType }
}
