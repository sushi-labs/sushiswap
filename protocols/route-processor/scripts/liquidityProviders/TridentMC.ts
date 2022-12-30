import { ChainId } from '@sushiswap/chain'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, Token } from '@sushiswap/currency'
import { BridgeBento, ConstantProductRPool, RToken } from '@sushiswap/tines'
import { ethers } from 'ethers'

import { Limited } from '../Limited'
import { convertToBigNumber, convertToBigNumberPair, convertToNumbers, MultiCallProvider } from '../MulticallProvider'
import { BentoBridgePoolCode } from '../pools/BentoBridge'
import { BentoConstantProductPoolCode } from '../pools/BentoconstantProductPool'
import { PoolCode } from '../pools/PoolCode'
import { LiquidityProviderMC, LiquidityProviders } from './LiquidityProviderMC'

const ConstantProductPoolFactory: Record<string | number, string> = {
  [ChainId.POLYGON]: '0x05689fCfeE31FCe4a67FbC7Cab13E74F80A4E288',
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

const getReservesABI = [
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

export class TridentProviderMC extends LiquidityProviderMC {
  fetchedPairs: Set<string> = new Set()
  fetchedTokens: Set<string> = new Set()
  poolCodes: PoolCode[] = []
  blockListener: any

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
    if (ConstantProductPoolFactory[this.chainId] === undefined) {
      // No trident for this network
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
    const tokensSorted = tok0.sort((a, b) => (b[0] > a[0] ? -1 : 1)).map(([_, t]) => t)

    const [pools, bridges] = await Promise.all([
      this.getAllTridentPools(tokensSorted),
      this.getAllBridges(tokensSorted),
    ])
    if (pools.length || bridges.length) {
      this.poolCodes = [...this.poolCodes, ...pools, ...bridges]
      ++this.stateId
    }
  }

  async getAllTridentPools(tokensSorted: Token[]): Promise<PoolCode[]> {
    // create token map: token address => token
    const tokenMap: Map<string, Token> = new Map()
    tokensSorted.forEach((t) => tokenMap.set(t.address, t))

    // create tokens pairs that were not fetched before
    const tokenPairs: [string, string][] = []
    for (let i = 0; i < tokensSorted.length; ++i) {
      for (let j = i + 1; j < tokensSorted.length; ++j) {
        const pair = `${tokensSorted[i].address}_${tokensSorted[j].address}`
        if (this.fetchedPairs.has(pair)) continue
        tokenPairs.push([tokensSorted[i].address, tokensSorted[j].address])
        this.fetchedPairs.add(pair)
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
      .filter(([_t0, _t1, n]) => n > 0) as [string, string, number][]
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
    const poolReservePromise = this.multiCallProvider.multiContractCall(poolAddr, getReservesABI, 'getReserves', [])
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
        poolCodes.push(new BentoConstantProductPoolCode(pool, this.getPoolProviderName()))
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
    const totals = convertToBigNumberPair(totals0)
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
          total[0], // elastic
          total[1], // base
          balance
        )
        poolCodes.push(new BentoBridgePoolCode(pool, this.getPoolProviderName(), BentoBoxAddr))
      }
    })

    return poolCodes
  }

  async updatePoolsData() {
    if (this.poolCodes.length == 0) return

    const BentoBoxAddr = BentoBox[this.chainId]
    const pools: PoolCode[] = []
    const bridges: PoolCode[] = []
    this.poolCodes.forEach((pc) => (pc instanceof BentoConstantProductPoolCode ? pools.push(pc) : bridges.push(pc)))

    const reservesPromise = this.multiCallProvider.multiContractCall(
      pools.map((pc) => pc.pool.address),
      getReservesABI,
      'getReserves',
      []
    )
    const totalsPromise = this.multiCallProvider.multiDataCall(
      BentoBoxAddr,
      totalsABI,
      'totals',
      bridges.map((b) => [b.pool.token0.address])
    )
    const balancesPromise = this.multiCallProvider.multiContractCall(
      bridges.map((b) => b.pool.token0.address),
      balanceOfABI,
      'balanceOf',
      [BentoBoxAddr]
    )

    const [reserves0, totals0, balances0] = await Promise.all([reservesPromise, totalsPromise, balancesPromise])
    const reserves = convertToBigNumberPair(reserves0)
    const totals = convertToBigNumberPair(totals0)
    const balances = convertToNumbers(balances0)

    pools.forEach((pc, i) => {
      const res = reserves[i]
      if (res === undefined) return
      if (!pc.pool.reserve0.eq(res[0]) || !pc.pool.reserve1.eq(res[1])) {
        pc.pool.updateReserves(res[0], res[1])
        ++this.stateId
      }
    })

    bridges.forEach((pc, i) => {
      const total = totals[i]
      if (total == undefined) return
      if (!pc.pool.reserve0.eq(total[0]) || !pc.pool.reserve1.eq(total[1])) {
        pc.pool.updateReserves(total[0], total[1])
        ++this.stateId
      }
      const balance = balances[i]
      if (balance === undefined) return
      const freeLiquidity = (pc.pool as BridgeBento).freeLiquidity || 0
      if (!closeValues(freeLiquidity, balance, 1e-6)) {
        ;(pc.pool as BridgeBento).freeLiquidity = balance
        ++this.stateId
      }
    })
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
    this.fetchedPairs.clear()
    this.fetchedTokens.clear()
    this.getPools(BASES_TO_CHECK_TRADES_AGAINST[this.chainId]) // starting the process
    this.blockListener = (_blockNumber: number) => {
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
