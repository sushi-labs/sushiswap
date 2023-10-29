enum PoolType {
  CONSTANT_PRODUCT_POOL = 'CONSTANT_PRODUCT_POOL',
  STABLE_POOL = 'STABLE_POOL',
  CONCENTRATED_LIQUIDITY_POOL = 'CONCENTRATED_LIQUIDITY_POOL',
}

enum PoolVersion {
  LEGACY = 'LEGACY',
  TRIDENT = 'TRIDENT',
}

enum RewarderType {
  Primary = 'Primary',
  Secondary = 'Secondary',
}

type PartialWithUndefined<T extends object> = Partial<{
  [K in keyof T]: T[K] | undefined
}>

export type GetPoolsArgs = PartialWithUndefined<{
  take: number
  ids: string[]
  chainIds: number[]
  poolTypes: PoolType[]
  isIncentivized: boolean
  isWhitelisted: boolean
  cursor: string
  orderBy: string
  orderDir: 'asc' | 'desc'
  count: boolean
}>

interface Token {
  address: string
  decimals: number
  id: string
  name: string
  symbol: string
}

export interface Pool {
  address: string
  feeApr: number
  incentiveApr: number
  chainId: number
  fees1d: string
  fees1w: string
  id: string
  incentives: {
    apr: number
    chainId: number
    id: string
    pid: number
    rewarderAddress: string
    rewarderType: RewarderType
    rewardPerDay: number
    rewardToken: Token
    chefType: string
  }[]
  isBlacklisted: boolean
  isIncentivized: boolean
  liquidityUSD: string
  totalSupply: string
  name: string
  swapFee: number
  token0: Token
  token1: Token
  totalApr: number
  twapEnabled: boolean
  type: PoolType
  version: PoolVersion
  volume1d: string
  volume1w: string
  volumeUSD: string
}

export const POOL_API =
  process.env['POOLS_API_V0_BASE_URL'] ||
  process.env['NEXT_PUBLIC_POOLS_API_V0_BASE_URL'] ||
  'https://pools.sushi.com'

export function parseArgs<T>(args?: Partial<T>) {
  if (!args) return ''

  return Object.entries(args).reduce((acc, [key, value]) => {
    if (value === undefined) return acc

    return `${acc}&${key}=${Array.isArray(value) ? value.join(',') : value}`
  }, '?')
}

export const getPool = async (poolId: string): Promise<Pool> => {
  return import('node-fetch').then(({ default: fetch }) =>
    fetch(`${POOL_API}/api/v0?ids=${poolId}`)
      .then((data: any) => data.json())
      .then((data: any) => data[0]),
  )
}

export const getPools = async (args?: GetPoolsArgs): Promise<Pool[]> => {
  return import('node-fetch').then(({ default: fetch }) =>
    fetch(`${POOL_API}/api/v0${parseArgs(args)}`).then((data: any) =>
      data.json(),
    ),
  )
}

export const getPoolCount = async (args?: GetPoolsArgs): Promise<number> =>
  import('node-fetch').then(({ default: fetch }) =>
    fetch(`${POOL_API}/api/v0/count${parseArgs(args)}`)
      .then((data: any) => data.json())
      .then((data: any) => data.count),
  )
