import { BigNumber } from '@ethersproject/bignumber'

interface RToken {
  name: string
  address: string
}

export enum PoolType {
  ConstantProduct = 'ConstantProduct',
  Weighted = 'Weighted',
  Hybrid = 'Hybrid',
  ConcentratedLiquidity = 'ConcentratedLiquidity',
}

export interface PoolInfo {
  address: string
  token0: RToken
  token1: RToken
  type: PoolType
  reserve0: BigNumber
  reserve1: BigNumber
  fee: number
  minLiquidity: number
  swapGasCost: number
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type PoolInfoWithDefaults = PartialBy<PoolInfo, 'minLiquidity' | 'swapGasCost'>

export class Pool {
  address: string
  token0: RToken
  token1: RToken
  type: PoolType
  reserve0: BigNumber
  reserve1: BigNumber
  fee: number
  minLiquidity: number
  swapGasCost: number

  constructor(_info: PoolInfoWithDefaults) {
    const info = {
      minLiquidity: 1000,
      swapGasCost: 40_000,
      ..._info,
    }
    this.address = info.address
    this.token0 = info.token0
    this.token1 = info.token1
    this.type = info.type
    this.reserve0 = info.reserve0
    this.reserve1 = info.reserve1
    this.fee = info.fee
    this.minLiquidity = info.minLiquidity
    this.swapGasCost = info.swapGasCost
  }
}

type PoolInfoNoType = Omit<PoolInfoWithDefaults, 'type'>

export class RConstantProductPool extends Pool {
  constructor(info: PoolInfoNoType) {
    super({
      type: PoolType.ConstantProduct,
      ...info,
    })
  }
}

type HybridPoolInfo = PoolInfoNoType & { A: number }

export class RHybridPool extends Pool {
  A: number
  constructor(info: HybridPoolInfo) {
    super({
      type: PoolType.Hybrid,
      ...info,
    })
    this.A = info.A
  }
}

type WeightedPoolInfo = PoolInfoNoType & { weight0: number; weight1: number }

export class RWeightedPool extends Pool {
  weight0: number
  weight1: number
  constructor(info: WeightedPoolInfo) {
    super({
      type: PoolType.Weighted,
      ...info,
    })
    this.weight0 = info.weight0
    this.weight1 = info.weight1
  }
}

interface CLTick {
  index: number
  DLiquidity: number
}

interface CLSpecific {
  liquidity: number
  sqrtPrice: number
  nearestTick: number
  ticks: CLTick[]
}

type CLPoolInfo = Omit<PoolInfoNoType, 'reserve0' | 'reserve1'> & CLSpecific

export class RConcentratedLiquidityPool extends Pool {
  liquidity: number
  sqrtPrice: number
  nearestTick: number
  ticks: CLTick[]
  constructor(info: CLPoolInfo) {
    super({
      type: PoolType.ConcentratedLiquidity,
      reserve0: BigNumber.from(0),
      reserve1: BigNumber.from(0),
      ...info,
    })
    this.liquidity = info.liquidity
    this.sqrtPrice = info.sqrtPrice
    this.nearestTick = info.nearestTick
    this.ticks = info.ticks
  }
}

