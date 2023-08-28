import { Fee, SushiSwapV2Pool, TridentConstantPool, TridentStablePool } from '@sushiswap/amm'
import { BentoBoxChainId } from '@sushiswap/bentobox-sdk'
import { Type } from '@sushiswap/currency'
import { SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { ReactElement } from 'react'

import { SushiSwapV2PoolState, TridentConstantPoolState, TridentStablePoolState } from '../../hooks'

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

export interface SushiSwapV2PoolFinderProps extends PoolFinderProps {
  chainId: SushiSwapV2ChainId
  token0: Type | undefined
  token1: Type | undefined
  index?: number
  dispatch?(payload: PoolExistenceStateAction): void
  enabled: boolean
}

export interface TridentPoolFinderProps extends PoolFinderProps {
  chainId: BentoBoxChainId
  fee?: Fee
  twap?: boolean
}

export type PoolStateUnion = [
  SushiSwapV2PoolState | TridentConstantPoolState | TridentStablePoolState,
  SushiSwapV2Pool | TridentConstantPool | TridentStablePool | null
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
