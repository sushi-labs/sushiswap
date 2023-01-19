import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@sushiswap/router-config'
import { BridgeBento, ConstantProductRPool, Rebase, RToken, StableSwapRPool, toShareBN } from '@sushiswap/tines'
import type { ethers } from 'ethers'

import type { Limited } from '../Limited'
import {
  convertToBigNumber,
  convertToBigNumberPair,
  convertToNumbers,
  convertToRebase,
  MultiCallProvider,
} from '../MulticallProvider'
import { BentoBridgePoolCode } from '../pools/BentoBridge'
import { BentoPoolCode } from '../pools/BentoPool'
import type { PoolCode } from '../pools/PoolCode'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

const ConstantProductPoolFactory: Record<string | number, string> = {
  [ChainId.POLYGON]: '0x05689fCfeE31FCe4a67FbC7Cab13E74F80A4E288',
}

const StablePoolFactory: Record<string | number, string> = {
  [ChainId.POLYGON]: '0x2A0Caa28331bC6a18FF195f06694f90671dE70f2',
}

export const BentoBox: Record<string | number, string> = {
  [ChainId.POLYGON]: '0x0319000133d3AdA02600f0875d2cf03D442C3367',
}

const poolsCountABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token0',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token1',
        type: 'address',
      },
    ],
    name: 'poolsCount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'count',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const getPoolsABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token0',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token1',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'startIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'count',
        type: 'uint256',
      },
    ],
    name: 'getPools',
    outputs: [
      {
        internalType: 'address[]',
        name: 'pairPools',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const getReservesCPABI = [
  {
    inputs: [],
    name: 'getReserves',
    outputs: [
      {
        internalType: 'uint112',
        name: '_reserve0',
        type: 'uint112',
      },
      {
        internalType: 'uint112',
        name: '_reserve1',
        type: 'uint112',
      },
      {
        internalType: 'uint32',
        name: '_blockTimestampLast',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const getReservesStableABI = [
  {
    inputs: [],
    name: 'getReserves',
    outputs: [
      {
        internalType: 'uint256',
        name: '_reserve0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_reserve1',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const swapFeeABI = [
  {
    inputs: [],
    name: 'swapFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const totalsABI = [
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    name: 'totals',
    outputs: [
      {
        internalType: 'uint128',
        name: 'elastic',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'base',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const balanceOfABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]

function closeValues(a: number, b: number, precision: number) {
  if (a == 0 || b == 0) return Math.abs(a - b) < precision
  return Math.abs(a / b - 1) < precision
}

export function getBentoChainId(chainId: string | number | undefined): string {
  return `Bento ${chainId}`
}

export function convertTokenToBento(token: Token): RToken {
  const t: RToken = { ...token } as RToken
  t.chainId = getBentoChainId(token.chainId)
  t.name = getBentoChainId(token.name)
  t.symbol = getBentoChainId(token.symbol)
  delete t.tokenId
  return t
}

export class TridentProvider extends LiquidityProvider {
  fetchedPairsCP: Set<string> = new Set()
  fetchedPairsStable: Set<string> = new Set()
  fetchedTokens: Set<string> = new Set()
  lastFetchedTotals: Map<string, Rebase> = new Map()
  poolCodes: PoolCode[] = []
  blockListener?: () => void

  constructor(
    chainDataProvider: ethers.providers.BaseProvider,
    multiCallProvider: MultiCallProvider,
    chainId: ChainId,
    l: Limited
  ) {
    super(chainDataProvider, multiCallProvider, chainId, l)
  }

  getType(): LiquidityProviders {
    return LiquidityProviders.Trident
  }

  getPoolProviderName(): string {
    return 'Trident'
  }

  async getPools(tokens: Token[]) {
    if (ConstantProductPoolFactory[this.chainId] === undefined && StablePoolFactory[this.chainId] === undefined) {
      // No trident for this network
      this.lastUpdateBlock = -1
      return []
    }

    // tokens deduplication
    const tokenMap = new Map<string, Token>()
    tokens.forEach((t) => tokenMap.set(t.address.toLocaleLowerCase().substring(2).padStart(40, '0'), t))
    const tokensDedup = Array.from(tokenMap.values())
    // tokens sorting
    const tok0: [string, Token][] = tokensDedup.map((t) => [
      t.address.toLocaleLowerCase().substring(2).padStart(40, '0'),
      t,
    ])
    const tokensSorted = tok0.sort((a, b) => (b[0] > a[0] ? -1 : 1)).map(([, t]) => t)

    const totalsPromise = this.getAllBridges(tokensSorted)
    const [poolsCP, poolsStable, bridges] = await Promise.all([
      this.getAllTridentCPPools(tokensSorted),
      this.getAllTridentStablePools(tokensSorted, totalsPromise),
      totalsPromise,
    ])
    if (poolsCP.length || poolsStable.length || bridges.length) {
      this.poolCodes = [...this.poolCodes, ...poolsCP, ...poolsStable, ...bridges]
      ++this.stateId
    }

    // if it is the first obtained pool list
    if (this.lastUpdateBlock == 0) this.lastUpdateBlock = this.multiCallProvider.lastCallBlockNumber
  }

  async getAllTridentCPPools(tokensSorted: Token[]): Promise<PoolCode[]> {
    // create token map: token address => token
    const tokenMap: Map<string, Token> = new Map()
    tokensSorted.forEach((t) => tokenMap.set(t.address, t))

    // create tokens pairs that were not fetched before
    const tokenPairs: [string, string][] = []
    for (let i = 0; i < tokensSorted.length; ++i) {
      for (let j = i + 1; j < tokensSorted.length; ++j) {
        const pair = `${tokensSorted[i].address}_${tokensSorted[j].address}`
        if (this.fetchedPairsCP.has(pair)) continue
        tokenPairs.push([tokensSorted[i].address, tokensSorted[j].address])
        this.fetchedPairsCP.add(pair)
      }
    }

    // fetch pairs' poolsCount
    const poolCounts = convertToNumbers(
      await this.multiCallProvider.multiDataCall(
        ConstantProductPoolFactory[this.chainId],
        poolsCountABI,
        'poolsCount',
        tokenPairs
      )
    )

    // fetch poolsList for pairs with not-zero poolCount
    const tokenPairs2 = tokenPairs
      .map(([t0, t1], i) => [t0, t1, poolCounts[i] as number])
      .filter(([, , n]) => n > 0) as [string, string, number][]
    const poolLists = await this.multiCallProvider.multiDataCall(
      ConstantProductPoolFactory[this.chainId],
      getPoolsABI,
      'getPools',
      tokenPairs2.map(([t0, t1, n]) => [t0, t1, 0, n])
    )

    // Create poolMap
    const poolMap: Map<string, [Token, Token]> = new Map()
    poolLists.forEach((pools, i) => {
      const tokens: [Token, Token] = [
        tokenMap.get(tokenPairs2[i][0]) as Token,
        tokenMap.get(tokenPairs2[i][1]) as Token,
      ]
      pools.forEach((pool: string) => poolMap.set(pool, tokens))
    })

    // fetch getReserves and swapFee for all pools
    const poolAddr: string[] = Array.from(poolMap.keys())
    const poolReservePromise = this.multiCallProvider.multiContractCall(poolAddr, getReservesCPABI, 'getReserves', [])
    const swapFeePromise = this.multiCallProvider.multiContractCall(poolAddr, swapFeeABI, 'swapFee', [])
    const [poolRes0, poolFee0] = await Promise.all([poolReservePromise, swapFeePromise])
    const poolRes = convertToBigNumberPair(poolRes0)
    const poolFee = convertToNumbers(poolFee0)

    // create poolCodes
    const poolCodes: PoolCode[] = []
    poolAddr.forEach((addr, i) => {
      const res = poolRes[i]
      const fee = poolFee[i]
      if (res !== undefined && fee !== undefined) {
        const tokens = poolMap.get(addr) as [Token, Token]
        const pool = new ConstantProductRPool(
          addr,
          convertTokenToBento(tokens[0]),
          convertTokenToBento(tokens[1]),
          parseInt(fee.toString()) / 10_000,
          res[0],
          res[1]
        )
        poolCodes.push(new BentoPoolCode(pool, this.getPoolProviderName()))
      }
    })

    return poolCodes
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getAllTridentStablePools(tokensSorted: Token[], totalsPromise: Promise<any>): Promise<PoolCode[]> {
    // create token map: token address => token
    const tokenMap: Map<string, Token> = new Map()
    tokensSorted.forEach((t) => tokenMap.set(t.address, t))

    // create tokens pairs that were not fetched before
    const tokenPairs: [string, string][] = []
    for (let i = 0; i < tokensSorted.length; ++i) {
      for (let j = i + 1; j < tokensSorted.length; ++j) {
        const pair = `${tokensSorted[i].address}_${tokensSorted[j].address}`
        if (this.fetchedPairsStable.has(pair)) continue
        tokenPairs.push([tokensSorted[i].address, tokensSorted[j].address])
        this.fetchedPairsStable.add(pair)
      }
    }

    // fetch pairs' poolsCount
    const poolCounts = convertToNumbers(
      await this.multiCallProvider.multiDataCall(
        StablePoolFactory[this.chainId],
        poolsCountABI,
        'poolsCount',
        tokenPairs
      )
    )

    // fetch poolsList for pairs with not-zero poolCount
    const tokenPairs2 = tokenPairs
      .map(([t0, t1], i) => [t0, t1, poolCounts[i] as number])
      .filter(([, , n]) => n > 0) as [string, string, number][]
    const poolLists = await this.multiCallProvider.multiDataCall(
      StablePoolFactory[this.chainId],
      getPoolsABI,
      'getPools',
      tokenPairs2.map(([t0, t1, n]) => [t0, t1, 0, n])
    )

    // Create poolMap
    const poolMap: Map<string, [Token, Token]> = new Map()
    poolLists.forEach((pools, i) => {
      const tokens: [Token, Token] = [
        tokenMap.get(tokenPairs2[i][0]) as Token,
        tokenMap.get(tokenPairs2[i][1]) as Token,
      ]
      pools.forEach((pool: string) => poolMap.set(pool, tokens))
    })

    // fetch getReserves and swapFee for all pools
    const poolAddr: string[] = Array.from(poolMap.keys())
    const poolReservePromise = this.multiCallProvider.multiContractCall(
      poolAddr,
      getReservesStableABI,
      'getReserves',
      []
    )
    const swapFeePromise = this.multiCallProvider.multiContractCall(poolAddr, swapFeeABI, 'swapFee', [])
    const [poolRes0, poolFee0] = await Promise.all([poolReservePromise, swapFeePromise, totalsPromise])
    const poolRes = convertToBigNumberPair(poolRes0)
    const poolFee = convertToNumbers(poolFee0)

    // create poolCodes
    const poolCodes: PoolCode[] = []
    poolAddr.forEach((addr, i) => {
      const res = poolRes[i]
      const fee = poolFee[i]
      if (res !== undefined && fee !== undefined) {
        const tokens = poolMap.get(addr) as [Token, Token]
        const totals0 = this.lastFetchedTotals.get(tokens[0].address)
        const totals1 = this.lastFetchedTotals.get(tokens[1].address)
        if (totals0 && totals1) {
          const pool = new StableSwapRPool(
            addr,
            convertTokenToBento(tokens[0]),
            convertTokenToBento(tokens[1]),
            parseInt(fee.toString()) / 10_000,
            toShareBN(res[0], totals0),
            toShareBN(res[1], totals1),
            tokens[0].decimals,
            tokens[1].decimals,
            totals0,
            totals1
          )
          poolCodes.push(new BentoPoolCode(pool, this.getPoolProviderName()))
        }
      }
    })

    return poolCodes
  }

  async getAllBridges(tokensSorted: Token[]): Promise<PoolCode[]> {
    const tokens: Token[] = []
    tokensSorted.forEach((t) => {
      if (this.fetchedTokens.has(t.address)) return
      tokens.push(t)
      this.fetchedTokens.add(t.address)
    })

    const BentoBoxAddr = BentoBox[this.chainId]
    const totalsPromise = this.multiCallProvider.multiDataCall(
      BentoBoxAddr,
      totalsABI,
      'totals',
      tokens.map((t) => [t.address])
    )
    const balancesPromise = this.multiCallProvider.multiContractCall(
      tokens.map((t) => t.address),
      balanceOfABI,
      'balanceOf',
      [BentoBoxAddr]
    )
    const [totals0, balances0] = await Promise.all([totalsPromise, balancesPromise])
    const totals = convertToRebase(totals0)
    const balances = convertToBigNumber(balances0)

    const poolCodes: PoolCode[] = []
    tokens.forEach((t, i) => {
      const total = totals[i]
      const balance = balances[i]
      if (total !== undefined && balance !== undefined) {
        const pool = new BridgeBento(
          `Bento bridge for ${t.symbol}`,
          t as RToken,
          convertTokenToBento(t),
          total.elastic,
          total.base,
          balance
        )
        poolCodes.push(new BentoBridgePoolCode(pool, this.getPoolProviderName(), BentoBoxAddr))
        this.lastFetchedTotals.set(t.address, total)
      }
    })

    return poolCodes
  }

  async updateCPPools() {
    const pools = this.poolCodes.map((pc) => pc.pool).filter((p) => p instanceof ConstantProductRPool)
    const reserves = convertToBigNumberPair(
      await this.multiCallProvider.multiContractCall(
        pools.map((p) => p.address),
        getReservesCPABI,
        'getReserves',
        []
      )
    )
    pools.forEach((pool, i) => {
      const res = reserves[i]
      if (res === undefined) return
      if (!pool.reserve0.eq(res[0]) || !pool.reserve1.eq(res[1])) {
        pool.updateReserves(res[0], res[1])
        ++this.stateId
      }
    })
  }

  async updateStablePools(totalsPromise: Promise<void>) {
    const pools = this.poolCodes.map((pc) => pc.pool).filter((p) => p instanceof StableSwapRPool) as StableSwapRPool[]
    const reserves = convertToBigNumberPair(
      await this.multiCallProvider.multiContractCall(
        pools.map((p) => p.address),
        getReservesStableABI,
        'getReserves',
        []
      )
    )
    await totalsPromise
    pools.forEach((pool, i) => {
      const total0 = this.lastFetchedTotals.get(pool.token0.address)
      if (total0) {
        const current = pool.getTotal0()
        if (!total0.elastic.eq(current.elastic) || !total0.base.eq(current.base)) {
          pool.updateTotal0(total0)
          ++this.stateId
        }
      }
      const total1 = this.lastFetchedTotals.get(pool.token1.address)
      if (total1) {
        const current = pool.getTotal1()
        if (!total1.elastic.eq(current.elastic) || !total1.base.eq(current.base)) {
          pool.updateTotal1(total1)
          ++this.stateId
        }
      }

      const res = reserves[i]
      if (res !== undefined && (!pool.reserve0.eq(res[0]) || !pool.reserve1.eq(res[1]))) {
        pool.updateReserves(toShareBN(res[0], pool.getTotal0()), toShareBN(res[1], pool.getTotal1()))
        ++this.stateId
      }
    })
  }

  async updateBridges(): Promise<void> {
    const BentoBoxAddr = BentoBox[this.chainId]
    const bridges: BridgeBento[] = this.poolCodes
      .map((pc) => pc.pool)
      .filter((p) => p instanceof BridgeBento) as BridgeBento[]
    const totalsPromise = this.multiCallProvider.multiDataCall(
      BentoBoxAddr,
      totalsABI,
      'totals',
      bridges.map((b) => [b.token0.address])
    )
    const balancesPromise = this.multiCallProvider.multiContractCall(
      bridges.map((b) => b.token0.address),
      balanceOfABI,
      'balanceOf',
      [BentoBoxAddr]
    )
    const [totals0, balances0] = await Promise.all([totalsPromise, balancesPromise])
    const totals = convertToRebase(totals0)
    const balances = convertToNumbers(balances0)

    totals.forEach((t, i) => {
      if (t === undefined) return
      this.lastFetchedTotals.set(bridges[i].token0.address, t)
    })

    bridges.forEach((br, i) => {
      const total = totals[i]
      if (total == undefined) return
      if (!br.reserve0.eq(total.elastic) || !br.reserve1.eq(total.base)) {
        br.updateReserves(total.elastic, total.base)
        ++this.stateId
      }
      const balance = balances[i]
      if (balance === undefined) return
      const freeLiquidity = br.freeLiquidity || 0
      if (!closeValues(freeLiquidity, balance, 1e-6)) {
        br.freeLiquidity = balance
        ++this.stateId
      }
    })
  }

  async updatePoolsData() {
    if (this.poolCodes.length == 0) return

    const totalsPromise = this.updateBridges()
    await Promise.all([this.updateCPPools(), this.updateStablePools(totalsPromise), totalsPromise])

    this.lastUpdateBlock = this.multiCallProvider.lastCallBlockNumber
  }

  _getProspectiveTokens(t0: Token, t1: Token) {
    const set = new Set<Token>([
      t0,
      t1,
      ...BASES_TO_CHECK_TRADES_AGAINST[this.chainId],
      ...(ADDITIONAL_BASES[this.chainId][t0.address] || []),
      ...(ADDITIONAL_BASES[this.chainId][t1.address] || []),
    ])
    return Array.from(set)
  }

  startFetchPoolsData() {
    this.stopFetchPoolsData()
    this.poolCodes = []
    this.fetchedPairsCP.clear()
    this.fetchedPairsStable.clear()
    this.fetchedTokens.clear()
    this.getPools(BASES_TO_CHECK_TRADES_AGAINST[this.chainId]) // starting the process
    this.blockListener = () => {
      this.updatePoolsData()
    }
    this.chainDataProvider.on('block', this.blockListener)
  }
  fetchPoolsForToken(t0: Token, t1: Token): void {
    this.getPools(this._getProspectiveTokens(t0, t1))
  }
  getCurrentPoolList(): PoolCode[] {
    return this.poolCodes
  }
  stopFetchPoolsData() {
    if (this.blockListener) this.chainDataProvider.off('block', this.blockListener)
    this.blockListener = undefined
  }
}
