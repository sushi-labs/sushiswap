import { balanceOfAbi, getReservesAbi, getStableReservesAbi, totalsAbi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { BridgeBento, ConstantProductRPool, Rebase, RToken, StableSwapRPool, toShareBN } from '@sushiswap/tines'
import {
  Address,
  readContracts,
  watchBlockNumber,
} from '@wagmi/core'
import { BigNumber } from 'ethers'

import { getPoolsByTokenIds, getTopPools, PoolResponse } from '../lib/api'
import { BentoBridgePoolCode } from '../pools/BentoBridge'
import { BentoPoolCode } from '../pools/BentoPool'
import { ConstantProductPoolCode } from '../pools/ConstantProductPool'
import type { PoolCode } from '../pools/PoolCode'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

// const ConstantProductPoolFactory: Record<string | number, string> = {
//   [ChainId.POLYGON]: '0x05689fCfeE31FCe4a67FbC7Cab13E74F80A4E288',
// }

// const StablePoolFactory: Record<string | number, string> = {
//   [ChainId.POLYGON]: '0x2A0Caa28331bC6a18FF195f06694f90671dE70f2',
// }

export const BentoBox: Record<string | number, string> = {
  [ChainId.POLYGON]: '0x0319000133d3AdA02600f0875d2cf03D442C3367',
}
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
const syncAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'reserve0',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'reserve1',
        type: 'uint256',
      },
    ],
    name: 'Sync',
    type: 'event',
  },
]

function closeValues(a: number, b: number, precision: number) {
  if (a == 0 || b == 0) return Math.abs(a - b) < precision
  return Math.abs(a / b - 1) < precision
}

export function convertToNumbers(arr: BigNumber[]): (number | undefined)[] {
  return arr.map((a) => {
    if (a === undefined) return undefined
    return parseInt(a._hex, 16)
  })
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

interface PoolInfo {
  poolCode: PoolCode
  fetchType: 'INITIAL' | 'ON_DEMAND'
  updatedAtBlock: number
}

export class TridentProvider extends LiquidityProvider {
  isInitialized = false
  cPPools: Map<string, PoolInfo> = new Map()
  stablePools: Map<string, PoolInfo> = new Map()
  bridges: Map<string, PoolInfo> = new Map()

  blockListener?: () => void
  unwatchBlockNumber?: () => void

  readonly TOP_POOL_SIZE = 155
  readonly TOP_POOL_LIQUIDITY_THRESHOLD = 1000
  readonly ON_DEMAND_POOL_SIZE = 20

  constructor(chainId: ChainId) {
    super(chainId)
    if (!(chainId in BentoBox)) {
      throw new Error(`${this.getType()} cannot be instantiated for chainId ${chainId}, no bentobox address found`)
    }
  }

  getType(): LiquidityProviders {
    return LiquidityProviders.Trident
  }

  getPoolProviderName(): string {
    return 'Trident'
  }

  async initialize(blockNumber: number) {
    this.isInitialized = true

    const topPools = await getTopPools(
      this.chainId,
      'SushiSwap',
      'TRIDENT',
      ['CONSTANT_PRODUCT_POOL', 'STABLE_POOL'],
      this.TOP_POOL_SIZE,
      this.TOP_POOL_LIQUIDITY_THRESHOLD
    )

    if (topPools.size > 0) {
      console.debug(
        `${this.chainId}~${this.lastUpdateBlock}~${this.getType()} - INIT: top pools found: ${topPools.size}`
      )
    } else {
      console.debug(`${this.chainId}~${this.lastUpdateBlock}~${this.getType()} - INIT: NO pools found.`)
      return
    }

    await this.initPools(Array.from(topPools.values()), 'INITIAL')

    console.debug(
      `${this.chainId}~${this.lastUpdateBlock}${this.getType()} - INIT, WATCHING ${
        this.getCurrentPoolList().length
      } POOLS`
    )
    // for (const pool of this.getCurrentPoolList()) {
    //   console.log(`${pool.poolName} ${pool.pool.address} ${pool.pool.token0.symbol}/${pool.pool.token1.symbol} ${pool.pool.reserve0} ${pool.pool.reserve1}`)
    // }
  }

  async initPools(pools: PoolResponse[], fetchType: 'INITIAL' | 'ON_DEMAND'): Promise<void> {
    const cppPools = pools.filter((p) => p.type === 'CONSTANT_PRODUCT_POOL')
    const stablePools = pools.filter((p) => p.type === 'STABLE_POOL')

    const tokenMap = new Map<string, Token>()
    pools.forEach((pool) => {
      tokenMap.set(pool.token0.address, pool.token0)
      tokenMap.set(pool.token1.address, pool.token1)
    })
    const tokensDedup = Array.from(tokenMap.values())
    // tokens sorting
    const tok0: [string, Token][] = tokensDedup.map((t) => [
      t.address.toLocaleLowerCase().substring(2).padStart(40, '0'),
      t,
    ])
    const sortedTokens = tok0.sort((a, b) => (b[0] > a[0] ? -1 : 1)).map(([, t]) => t)

    const cppReservePromise = readContracts({
      allowFailure: true,
      contracts: cppPools.map((p) => ({
        address: p.address as Address,
        chainId: this.chainId,
        abi: getReservesAbi,
        functionName: 'getReserves',
      })),
    })

    const stableReservePromise = readContracts({
      allowFailure: true,
      contracts: stablePools.map((p) => ({
        address: p.address as Address,
        chainId: this.chainId,
        abi: getStableReservesAbi,
        functionName: 'getReserves',
      })),
    })

    const totalsPromise = readContracts({
      allowFailure: true,
      contracts: sortedTokens.map(
        (t) =>
          ({
            args: [t.address as Address],
            address: BentoBox[this.chainId] as Address,
            chainId: this.chainId,
            abi: totalsAbi,
            functionName: 'totals',
          } as const)
      ),
    })

    const balancesPromise = readContracts({
      allowFailure: true,
      contracts: sortedTokens.map(
        (t) =>
          ({
            args: [BentoBox[this.chainId] as Address],
            address: t.address as Address,
            chainId: this.chainId,
            abi: balanceOfAbi,
            functionName: 'balanceOf',
          } as const)
      ),
    })

    const [cppReserves, stableReserves, totals, balances] = await Promise.all([
      cppReservePromise,
      stableReservePromise,
      totalsPromise,
      balancesPromise,
    ])
    // console.log(`${cppReserves.length} ${stableReserves.length} ${totals.length} ${balances.length}`)

    cppPools.forEach((pr, i) => {
      const res = cppReserves[i]
      if (res === undefined || res === null) return
      const tokens = [convertTokenToBento(pr.token0), convertTokenToBento(pr.token1)]
      const rPool = new ConstantProductRPool(pr.address, tokens[0], tokens[1], pr.swapFee, res[0], res[1])
      const pc = new BentoPoolCode(rPool, this.getPoolProviderName())
      this.cPPools.set(pr.address, { poolCode: pc, fetchType, updatedAtBlock: this.lastUpdateBlock })
      ++this.stateId
    })

    const rebases: Map<string, Rebase> = new Map()

    sortedTokens.forEach((t, i) => {
      const total = totals[i]
      const balance = balances[i]
      if (total === undefined || total === null || balance === undefined || balance === null) return
      const pool = new BridgeBento(
        `Bento bridge for ${t.symbol}`,
        t as RToken,
        convertTokenToBento(t),
        total.elastic,
        total.base,
        balance
      )
      this.bridges.set(t.address, {
        poolCode: new BentoBridgePoolCode(pool, this.getPoolProviderName(), BentoBox[this.chainId]),
        fetchType: 'INITIAL', // Better to always keep bridges as INITIAL, can't be ON_DEMAND because those will eventually removed.
        updatedAtBlock: this.lastUpdateBlock,
      })
      rebases.set(t.address, total)
    })

    stablePools.forEach((pr, i) => {
      const res = stableReserves[i]
      const totals0 = rebases.get(pr.token0.address)
      const totals1 = rebases.get(pr.token1.address)
      if (res === undefined || res === null || totals0 === undefined || totals1 === undefined) return

      const stablePool = new StableSwapRPool(
        pr.address,
        convertTokenToBento(pr.token0),
        convertTokenToBento(pr.token1),
        pr.swapFee,
        toShareBN(res[0], totals0),
        toShareBN(res[1], totals1),
        pr.token0.decimals,
        pr.token1.decimals,
        totals0,
        totals1
      )
      this.stablePools.set(pr.address, {
        poolCode: new BentoPoolCode(stablePool, this.getPoolProviderName()),
        fetchType,
        updatedAtBlock: this.lastUpdateBlock,
      })
      ++this.stateId
    })
  }

  async updatePools(type: 'ALL' | 'INITIAL'): Promise<void> {
    // this.removeStalePools()
    let cppPools = Array.from(this.cPPools.values())
    let stablePools = Array.from(this.stablePools.values())
    let bridges = Array.from(this.bridges.values())

    if (type === 'INITIAL') {
      cppPools = cppPools.filter((p) => p.fetchType === 'INITIAL')
      stablePools = stablePools.filter((p) => p.fetchType === 'INITIAL')
      bridges = bridges.filter((p) => p.fetchType === 'INITIAL')
    }

    const cppReservePromise = readContracts({
      allowFailure: true,
      contracts: cppPools.map((p) => ({
        address: p.poolCode.pool.address as Address,
        chainId: this.chainId,
        abi: getReservesAbi,
        functionName: 'getReserves',
      })),
    })

    const stableReservePromise = readContracts({
      allowFailure: true,
      contracts: stablePools.map((p) => ({
        address: p.poolCode.pool.address as Address,
        chainId: this.chainId,
        abi: getStableReservesAbi,
        functionName: 'getReserves',
      })),
    })

    const totalsPromise = readContracts({
      allowFailure: true,
      contracts: bridges.map(
        (b) =>
          ({
            args: [b.poolCode.pool.token0.address as Address],
            address: BentoBox[this.chainId] as Address,
            chainId: this.chainId,
            abi: totalsAbi,
            functionName: 'totals',
          } as const)
      ),
    })

    const balancesPromise = readContracts({
      allowFailure: true,
      contracts: bridges.map(
        (b) =>
          ({
            args: [BentoBox[this.chainId] as Address],
            address: b.poolCode.pool.token0.address as Address,
            chainId: this.chainId,
            abi: balanceOfAbi,
            functionName: 'balanceOf',
          } as const)
      ),
    })

    const [cppReserves, stableReserves, totals, balances] = await Promise.all([
      cppReservePromise,
      stableReservePromise,
      totalsPromise,
      balancesPromise,
    ])
    // console.log(`${cppReserves.length} ${stableReserves.length} ${totals.length} ${balances.length}`)

    cppPools.forEach((pi, i) => {
      const res = cppReserves[i]
      if (res === undefined || res === null) return
      pi.poolCode.pool.updateReserves(res[0], res[1])
      this.cPPools.set(pi.poolCode.pool.address, {
        poolCode: pi.poolCode,
        fetchType: pi.fetchType,
        updatedAtBlock: this.lastUpdateBlock,
      })
      ++this.stateId
    })

    const rebases: Map<string, Rebase> = new Map()

    bridges.forEach((b, i) => {
      const pool = b.poolCode.pool as BridgeBento
      const t = pool.token0
      const total = totals[i]
      const balance = balances[i]
      if (total === undefined || total === null || balance === undefined || balance === null) return
      pool.updateReserves(total.elastic, total.base)

      this.bridges.set(t.address, {
        poolCode: new BentoBridgePoolCode(pool, this.getPoolProviderName(), BentoBox[this.chainId]),
        fetchType: 'INITIAL', // Better to always keep bridges as INITIAL, can't be ON_DEMAND because those will eventually removed.
        updatedAtBlock: this.lastUpdateBlock,
      })
      rebases.set(t.address, total)
    })

    stablePools.forEach((pi, i) => {
      const pool = pi.poolCode.pool as StableSwapRPool
      const total0 = rebases.get(pool.token0.address)
      if (total0) {
        const current = pool.getTotal0()
        if (!total0.elastic.eq(current.elastic) || !total0.base.eq(current.base)) {
          pool.updateTotal0(total0)
          ++this.stateId
        }
      }
      const total1 = rebases.get(pool.token1.address)
      if (total1) {
        const current = pool.getTotal1()
        if (!total1.elastic.eq(current.elastic) || !total1.base.eq(current.base)) {
          pool.updateTotal1(total1)
          ++this.stateId
        }
      }

      const res = stableReserves[i]
      if (res !== undefined && (!pool.reserve0.eq(res[0]) || !pool.reserve1.eq(res[1]))) {
        pool.updateReserves(toShareBN(res[0], pool.getTotal0()), toShareBN(res[1], pool.getTotal1()))
        this.stablePools.set(pool.address, {
          poolCode: pi.poolCode,
          fetchType: pi.fetchType,
          updatedAtBlock: this.lastUpdateBlock,
        })
        ++this.stateId
      }
    })

    console.log('updated pools', this.stateId)
  }

  async getPools(t0: Token, t1: Token): Promise<void> {
    // console.debug(`****** ${this.getType()} POOLS IN MEMORY:`, this.getCurrentPoolList().length)
    // const poolsOnDemand = await getPoolsByTokenIds(
    //   this.chainId,
    //   'SushiSwap',
    //   'TRIDENT',
    //   ['CONSTANT_PRODUCT_POOL', 'STABLE_POOL'],
    //   t0.address,
    //   t1.address,
    //   this.TOP_POOL_SIZE,
    //   this.TOP_POOL_LIQUIDITY_THRESHOLD,
    //   this.ON_DEMAND_POOL_SIZE
    // )
    // console.debug(
    //   `${this.chainId}~${this.lastUpdateBlock}~${this.getType()} - ON DEMAND: Begin fetching reserves for ${
    //     poolsOnDemand.size
    //   } pools`
    // )
    // const pools = Array.from(poolsOnDemand.values())
    // updatePools()
    // this.initPools(pools, 'ON_DEMAND')
    // this.updatePools('ALL')
  }

  startFetchPoolsData() {
    this.stopFetchPoolsData()
    this.cPPools = new Map()
    this.stablePools = new Map()
    this.bridges = new Map()

    this.unwatchBlockNumber = watchBlockNumber(
      {
        listen: true,
      },
      (blockNumber) => {
        this.lastUpdateBlock = blockNumber
        // this.removeStalePools(blockNumber)
        if (!this.isInitialized) {
          this.initialize(blockNumber)
        } else {
          // this.updatePools('INITIAL')
        }

        // for (const p of this.getCurrentPoolList()) {
        //   console.log(`${p.poolName} ${p.pool.address} ${p.pool.reserve0} ${p.pool.reserve1}`)
        // }
      }
    )
  }

  private removeStalePools() {
    // TODO: move this to a per-chain config?

    const blockThreshold = this.lastUpdateBlock - 100

    for (const [k, v] of this.cPPools) {
      if (v.updatedAtBlock > blockThreshold && v.fetchType === 'ON_DEMAND') {
        console.log(
          `Removing stale pool ${v.poolCode.pool.address} ${v.poolCode.pool.token0.symbol}/${v.poolCode.pool.token1.symbol}`
        )
        this.cPPools.delete(k)
      }
    }

    for (const [k, v] of this.stablePools) {
      if (v.updatedAtBlock > blockThreshold && v.fetchType === 'ON_DEMAND') {
        console.log(
          `Removing stale pool ${v.poolCode.pool.address} ${v.poolCode.pool.token0.symbol}/${v.poolCode.pool.token1.symbol}`
        )
        this.stablePools.delete(k)
      }
    }

    for (const [k, v] of this.bridges) {
      if (v.updatedAtBlock > blockThreshold && v.fetchType === 'ON_DEMAND') {
        console.log(
          `Removing stale pool ${v.poolCode.pool.address} ${v.poolCode.pool.token0.symbol}/${v.poolCode.pool.token1.symbol}`
        )
        this.bridges.delete(k)
      }
    }
  }

  fetchPoolsForToken(t0: Token, t1: Token): void {
    this.getPools(t0, t1)
  }

  getCurrentPoolList(): PoolCode[] {
    return [
      ...this.cPPools.values(), 
      ...this.stablePools.values(),
       ...this.bridges.values()
      ].map((p) => p.poolCode)
  }

  stopFetchPoolsData() {
    if (this.unwatchBlockNumber) this.unwatchBlockNumber()
    this.blockListener = undefined
  }
}
