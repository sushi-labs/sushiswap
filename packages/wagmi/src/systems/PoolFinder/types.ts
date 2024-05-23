import { ReactElement } from 'react'
import { SushiSwapV2ChainId } from 'sushi/config'
import { Type } from 'sushi/currency'
import {
  SushiSwapV2Pool,
} from 'sushi/pool'

import { SushiSwapV2PoolState } from '../../hooks'

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
