import {
  Abi,
  Address,
  ContractFunctionArgs,
  ContractFunctionName,
  PublicClient,
  ReadContractParameters,
  ReadContractReturnType,
  parseAbi,
} from 'viem'
import { RPool } from '../tines'

export enum CurvePoolType {
  // the most old
  // 'function balances(int128) pure returns (uint256)',
  TypeA = 'TypeA',
  // 'function balances(uint256) pure returns (uint256)',
  TypeB = 'TypeB',
  // 'function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) payable returns (uint256)'
  TypeC = 'TypeC',
}

// for serialization
export function curvePoolType2Num(t: CurvePoolType): number {
  switch (t) {
    case CurvePoolType.TypeA:
      return 2
    case CurvePoolType.TypeB:
      return 1
    case CurvePoolType.TypeC:
      return 0
  }
}

// for deserialization
export function curvePoolTypeFromNum(n: number): CurvePoolType {
  switch (n) {
    case 0:
      return CurvePoolType.TypeC
    case 1:
      return CurvePoolType.TypeB
    case 2:
      return CurvePoolType.TypeA
    default:
      throw new Error(`Unknown curvePoolType: ${n}`)
  }
}

export const curvePoolABI = {
  [CurvePoolType.TypeA]: parseAbi([
    'function A() pure returns (uint256)',
    'function fee() pure returns (uint256)',
    'function coins(int128) pure returns (address)',
    'function balances(int128) pure returns (uint256)',
    'function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) payable returns ()',
  ] as const),
  [CurvePoolType.TypeB]: parseAbi([
    'function A() pure returns (uint256)',
    'function fee() pure returns (uint256)',
    'function coins(uint256) pure returns (address)',
    'function balances(uint256) pure returns (uint256)',
    'function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) payable returns ()',
  ] as const),
  [CurvePoolType.TypeC]: parseAbi([
    'function A() pure returns (uint256)',
    'function fee() pure returns (uint256)',
    'function coins(uint256) pure returns (address)',
    'function balances(uint256) pure returns (uint256)',
    'function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) payable returns (uint256)',
    'function A_precise() returns (uint256)', // just a test of this type of pool
  ] as const),
}

const axFunctionsABI = parseAbi([
  'function get_virtual_price() pure returns (uint256)',
  'function ratio() pure returns (uint256)',
  'function getExchangeRate() pure returns (uint256)',
  'function exchangeRateCurrent() pure returns (uint256)',
  'function stored_rates() view returns (uint256, uint256)',
])

export const METAPOOL_COIN_TO_BASEPOOL: Record<string, Address> = {
  '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490':
    '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7', // 3-pool
  '0x075b1bb99792c9e1041ba13afef80c91a1e70fb3':
    '0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714', // sBTC
  '0x3175df0976dfa876431c2e9ee6bc45b65d3473cc':
    '0xDcEF968d416a41Cdac0ED8702fAC8128A64241A2', // fraxUSD
  '0x051d7e5609917bd9b73f04bac0ded8dd46a74301':
    '0xf253f83AcA21aAbD2A20553AE0BF7F65C755A07F',
}

export type ReadContract = <
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
  args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
>(
  _args: ReadContractParameters<abi, functionName, args>,
) => Promise<ReadContractReturnType<abi, functionName, args>>

export async function detectCurvePoolType(
  client: PublicClient,
  poolAddress: Address,
): Promise<CurvePoolType> {
  const probe = await Promise.allSettled([
    client.readContract({
      address: poolAddress,
      abi: curvePoolABI[CurvePoolType.TypeB],
      functionName: 'balances',
      args: [0n],
    }),
    client.readContract({
      address: poolAddress,
      abi: curvePoolABI[CurvePoolType.TypeC],
      // @ts-ignore
      functionName: 'A_precise',
    }),
  ])
  if (probe[1].status === 'fulfilled') return CurvePoolType.TypeC
  if (probe[0].status === 'fulfilled') return CurvePoolType.TypeB
  return CurvePoolType.TypeA
}

// is needed to predict pool output
export async function getPoolRatio(
  client: PublicClient | { readContract: ReadContract },
  poolAddress: Address,
  tokens: Address[],
): Promise<number[]> {
  if (tokens.length > 2) return tokens.map((_t) => 1)

  const basePoolAddress =
    METAPOOL_COIN_TO_BASEPOOL[(tokens[1] as Address).toLowerCase()]
  if (basePoolAddress !== undefined) {
    const price = await client.readContract({
      address: basePoolAddress,
      abi: axFunctionsABI,
      functionName: 'get_virtual_price',
    })
    // 1e18 is not always appropriate, but there is no way to find self.rate_multiplier value
    return [1, Number(price) / 1e18]
  }

  try {
    const [r0, r1] = await client.readContract({
      address: poolAddress,
      abi: axFunctionsABI,
      functionName: 'stored_rates',
    })
    return [1, Number(r1) / Number(r0)]
  } catch (_e) {}

  // collection of freaks
  switch (poolAddress.toLowerCase()) {
    case '0xa96a65c051bf88b4095ee1f2451c2a9d43f53ae2': {
      //ankrETH pool
      const ratio = await client.readContract({
        address: '0xE95A203B1a91a908F9B9CE46459d101078c2c3cb' as const,
        abi: axFunctionsABI,
        functionName: 'ratio',
      })
      return [1, 1e18 / Number(ratio)]
    }
    case '0xf9440930043eb3997fc70e1339dbb11f341de7a8': {
      // rETH pool
      const ratio = await client.readContract({
        address: '0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593' as const,
        abi: axFunctionsABI,
        functionName: 'getExchangeRate',
      })
      return [1, Number(ratio) / 1e18]
    }
    case '0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56': {
      // compound pool cUSDC-cDAI
      // cUSDC
      const ratio0 = await client.readContract({
        address: '0x39aa39c021dfbae8fac545936693ac917d5e7563' as const,
        abi: axFunctionsABI,
        functionName: 'exchangeRateCurrent',
      })
      // cDAI
      const ratio1 = await client.readContract({
        address: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643' as const,
        abi: axFunctionsABI,
        functionName: 'exchangeRateCurrent',
      })
      return [Number(ratio1), Number(ratio0) * 1e12]
    }
    default:
      return [1, 1]
  }
}

// should a pool or not participate in routing
export function curvePoolFilterByAddress(pool: Address): {
  routable: boolean
  reason: string
} {
  const check = _curvePoolFilterByAddress(pool)
  return {
    routable: check === '',
    reason: check,
  }
}

// should a pool or not participate in routing
export function curvePoolFilter(pool: RPool): {
  routable: boolean
  reason: string
} {
  const check = _curvePoolFilter(pool)
  return {
    routable: check === '',
    reason: check,
  }
}

// should or not a pool participate in routing
function _curvePoolFilterByAddress(pool: Address): string {
  switch (pool) {
    case '0x707EAe1CcFee0B8fef07D3F18EAFD1246762d587':
      return 'STBT token - exclusively designed for accredited investors https://stbt.matrixdock.com/'
    case '0x064841157BadDcB2704cA38901D7d754a59b80E8':
      return 'MBTC token(0xcfc013B416bE0Bd4b3bEdE35659423B796f8Dcf0) has been paused'
  }
  return ''
}

// should a pool or not participate in routing
function _curvePoolFilter(pool: RPool): string {
  const addrCheck = _curvePoolFilterByAddress(pool.address)
  if (addrCheck !== '') return addrCheck
  const res0 = Number(pool.reserve0) / 10 ** pool.token0.decimals
  const res1 = Number(pool.reserve1) / 10 ** pool.token1.decimals
  if (res0 < 1 || res1 < 1) return 'low liquidity'
  return ''
}

export interface APIPoolInfo {
  poolList: string
  address: Address
  symbol: string
  usdTotal: number
  coins: {
    address: Address
    decimals: string
    usdPrice: number
    poolBalance: string
  }[]
}

export async function gatherPoolsFromCurveAPI(
  poolLists: string[],
  apiUrl: string,
  blackList?: string[],
): Promise<APIPoolInfo[]> {
  const urlPrefix = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`
  const _blackList = blackList ?? []

  const poolMap = new Map<string, APIPoolInfo>()
  for (const l in poolLists) {
    const url = urlPrefix + poolLists[l]
    // @ts-ignore
    const dataResp = await fetch(url)
    const data = (await dataResp.json()) as {
      data?: { poolData?: APIPoolInfo[] }
    }
    const poolList = data?.data?.poolData
    if (poolList === undefined) continue
    poolList.forEach((p) => {
      p.poolList = poolLists[l] as string
      if (!_blackList.includes(p.address)) poolMap.set(p.address, p)
    })
  }

  return Array.from(poolMap.values())
}
