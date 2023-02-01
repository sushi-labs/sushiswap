import { balanceOfAbi, bentoBoxV1Abi, getReservesAbi, getStableReservesAbi, totalsAbi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { BridgeBento, ConstantProductRPool, Rebase, RToken, StableSwapRPool, toShareBN } from '@sushiswap/tines'
import {
  Address,
  fetchBlockNumber,
  readContracts,
  watchBlockNumber,
  watchContractEvent,
  watchReadContracts,
} from '@wagmi/core'
import { BigNumber } from 'ethers'

import { getPoolsByTokenIds, getTopPools, PoolResponse } from '../lib/api'
import { convertToBigNumber, convertToRebase } from '../MulticallProvider'
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
  pools: PoolInfo[] = []

  blockListener?: () => void
  unwatchBlockNumber?: () => void
  unwatchSyncEvents: Map<string, () => void> = new Map()
  unwatchBalanceReads?: () => void
  unwatchDepositEvent?: () => void
  unwatchWithdrawEvent?: () => void

  fetchedPairsCP: Set<string> = new Set()
  fetchedPairsStable: Set<string> = new Set()
  fetchedTokens: Set<string> = new Set()
  lastFetchedTotals: Map<string, Rebase> = new Map()
  poolCodes: PoolCode[] = []

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

    const tokenMap = new Map<string, Token>()
    topPools.forEach((pool) => {
      tokenMap.set(pool.token0.address, pool.token0)
      tokenMap.set(pool.token1.address, pool.token1)
    })
    const tokensDedup = Array.from(tokenMap.values())
    // tokens sorting
    const tok0: [string, Token][] = tokensDedup.map((t) => [
      t.address.toLocaleLowerCase().substring(2).padStart(40, '0'),
      t,
    ])
    const tokensSorted = tok0.sort((a, b) => (b[0] > a[0] ? -1 : 1)).map(([, t]) => t)

    const pools = Array.from(topPools.values())

    const readReserves = readContracts({
      allowFailure: true,
      contracts: pools.map(
        (pool) =>
          ({
            address: pool.address as Address,
            chainId: this.chainId,
            abi: pool.type === 'CONSTANT_PRODUCT_POOL' ? getReservesAbi : getStableReservesAbi,
            functionName: 'getReserves',
          } as const)
      ),
    })

    const [reserves] = await Promise.all([readReserves, this.getAllBridges(tokensSorted)])

    pools.forEach((pool, i) => {
      const res = reserves[i]
      if (res !== null && res !== undefined) {
        if (pool.type === 'CONSTANT_PRODUCT_POOL') {
          const tokens = [convertTokenToBento(pool.token0), convertTokenToBento(pool.token1)]
          const rPool = new ConstantProductRPool(pool.address, tokens[0], tokens[1], pool.swapFee, res[0], res[1])
          const pc = new ConstantProductPoolCode(rPool, this.getPoolProviderName())
          this.pools.push({ poolCode: pc, fetchType: 'INITIAL', updatedAtBlock: blockNumber })
          ++this.stateId
        } else if (pool.type === 'STABLE_POOL') {
          const tokens = [pool.token0, pool.token1]
          const totals0 = this.lastFetchedTotals.get(tokens[0].address.toLowerCase())
          const totals1 = this.lastFetchedTotals.get(tokens[1].address.toLowerCase())

          if (totals0 && totals1) {
            const stablePool = new StableSwapRPool(
              pool.address,
              convertTokenToBento(tokens[0]),
              convertTokenToBento(tokens[1]),
              pool.swapFee,
              toShareBN(res[0], totals0),
              toShareBN(res[1], totals1),
              tokens[0].decimals,
              tokens[1].decimals,
              totals0,
              totals1
            )
            this.pools.push({
              poolCode: new BentoPoolCode(stablePool, this.getPoolProviderName()),
              fetchType: 'INITIAL',
              updatedAtBlock: blockNumber,
            })
          }
        }
      } else {
        console.error(
          `${this.chainId}~${
            this.lastUpdateBlock
          }~${this.getType()} - ERROR INIT SYNC, Failed to fetch reserves for pool: ${pool.address}`
        )
      }
    })

    this.pools.forEach((p) => {
      const pool = p.poolCode.pool
      if (this.unwatchSyncEvents.has(pool.address)) return
      this.unwatchSyncEvents.set(
        pool.address,
        watchContractEvent(
          {
            address: pool.address as Address,
            abi: syncAbi,
            eventName: 'Sync',
            chainId: this.chainId,
          },
          (reserve0, reserve1) => {
            const res0 = BigNumber.from(reserve0)
            const res1 = BigNumber.from(reserve1)
            console.debug(
              `${this.chainId}~${this.lastUpdateBlock} - SYNC ${p.poolCode.poolName}, ${pool.token0.symbol}/${pool.token1.symbol}.`
            )
            pool.updateReserves(res0, res1)
            p.updatedAtBlock = blockNumber
          }
        )
      )
    })

    const BentoBoxAddr = BentoBox[this.chainId]
    this.unwatchDepositEvent = watchContractEvent(
      {
        address: BentoBoxAddr as Address,
        abi: bentoBoxV1Abi,
        eventName: 'LogDeposit',
        chainId: this.chainId,
      },
      (token, from, to, amount, share) => {
        const tokenAddress = token.toLowerCase()
        if (this.lastFetchedTotals.has(tokenAddress)) {
          const newBase = this.lastFetchedTotals.get(tokenAddress)?.base.add(share)
          const newElastic = this.lastFetchedTotals.get(tokenAddress)?.elastic.add(amount)
          if (newBase && newElastic) {
            this.lastFetchedTotals.set(tokenAddress, {
              base: newBase,
              elastic: newElastic,
            })
            console.debug(
              `${this.chainId}~${
                this.lastUpdateBlock
              } - REBASE DEPOSIT ${tokenAddress}, new elastic: ${this.lastFetchedTotals
                .get(tokenAddress)
                ?.elastic.toString()}, new base: ${this.lastFetchedTotals.get(tokenAddress)?.base.toString()}.`
            )
          } else {
            console.debug(`${this.chainId}~${this.lastUpdateBlock} - REBASE DEPOSIT Unknown error.`)
          }
        } else {
          console.debug(`${this.chainId}~${this.lastUpdateBlock} - IGNORE REBASE DEPOSIT ${tokenAddress}, not tracked.`)
        }
      }
    )

    this.unwatchWithdrawEvent = watchContractEvent(
      {
        address: BentoBoxAddr as Address,
        abi: bentoBoxV1Abi,
        eventName: 'LogWithdraw',
        chainId: this.chainId,
      },
      (token, from, to, amount, share) => {
        const tokenAddress = token.toLowerCase()
        if (this.lastFetchedTotals.has(tokenAddress)) {
          const newBase = this.lastFetchedTotals.get(tokenAddress)?.base.sub(share)
          const newElastic = this.lastFetchedTotals.get(tokenAddress)?.elastic.sub(amount)
          if (newBase && newElastic) {
            this.lastFetchedTotals.set(tokenAddress, {
              base: newBase,
              elastic: newElastic,
            })
            console.debug(
              `${this.chainId}~${
                this.lastUpdateBlock
              } - REBASE WITHDRAW ${tokenAddress}, new elastic: ${this.lastFetchedTotals
                .get(tokenAddress)
                ?.elastic.toString()}, new base: ${this.lastFetchedTotals.get(tokenAddress)?.base.toString()}.`
            )
          } else {
            console.debug(`${this.chainId}~${this.lastUpdateBlock} - REBASE WITHDRAW Unknown error.`)
          }
        } else {
          console.debug(
            `${this.chainId}~${this.lastUpdateBlock} - IGNORE REBASE WITHDRAW ${tokenAddress}, not tracked.`
          )
        }
      }
    )

    //
    // const pool = p.poolCode.pool
    const bridges: BridgeBento[] = this.pools
    .map((pi) => pi.poolCode.pool)
    .filter((p) => p instanceof BridgeBento) as BridgeBento[]

    this.unwatchBalanceReads = watchReadContracts(
      {
        contracts: tokensSorted.map((token) => ({
          args: [BentoBoxAddr as Address],
          address: token.address as Address,
          chainId: this.chainId,
          abi: balanceOfAbi,
          functionName: 'balanceOf',
        } as const)),
      },
      (result) => {
        // TODO: 
        // const eee = result.map((r, i) => (
        //   {[tokensSorted[i].address]: r}
        // ))

        // bridges.forEach(p => p.freeLiquidity = result)
      }
    )

    console.debug(
      `${this.chainId}~${this.lastUpdateBlock}${this.getType()} - INIT, WATCHING ${this.pools.length} POOLS`
    )
  }

  async getPools(t0: Token, t1: Token): Promise<void> {
    console.debug(`****** ${this.getType()} POOLS IN MEMORY:`, this.pools.length)

    const poolsOnDemand = await getPoolsByTokenIds(
      this.chainId,
      'SushiSwap',
      'TRIDENT',
      ['CONSTANT_PRODUCT_POOL', 'STABLE_POOL'],
      t0.address,
      t1.address,
      this.TOP_POOL_SIZE,
      this.TOP_POOL_LIQUIDITY_THRESHOLD,
      this.ON_DEMAND_POOL_SIZE
    )

    console.debug(
      `${this.chainId}~${this.lastUpdateBlock}~${this.getType()} - ON DEMAND: Begin fetching reserves for ${
        poolsOnDemand.size
      } pools`
    )

    const pools = Array.from(poolsOnDemand.values())

    const reserves = await readContracts({
      allowFailure: true,
      contracts: pools.map((pool) => ({
        address: pool.address as Address,
        chainId: this.chainId,
        abi: pool.type === 'CONSTANT_PRODUCT_POOL' ? getReservesAbi : getStableReservesAbi,
        functionName: 'getReserves',
      })),
    })
    const blockNumber = this.lastUpdateBlock
    pools.forEach((pool, i) => {
      const res = reserves[i]

      if (res !== null && res !== undefined) {
        if (pool.type === 'CONSTANT_PRODUCT_POOL') {
          const tokens = [convertTokenToBento(pool.token0), convertTokenToBento(pool.token1)]
          const rPool = new ConstantProductRPool(pool.address, tokens[0], tokens[1], pool.swapFee, res[0], res[1])
          const pc = new ConstantProductPoolCode(rPool, this.getPoolProviderName())
          this.pools.push({ poolCode: pc, fetchType: 'INITIAL', updatedAtBlock: blockNumber })
          ++this.stateId
        } else if (pool.type === 'STABLE_POOL') {
          const tokens = [pool.token0, pool.token1]
          console.log('tokens', [tokens[0].address, tokens[1].address])
          const totals0 = this.lastFetchedTotals.get(tokens[0].address)
          const totals1 = this.lastFetchedTotals.get(tokens[1].address)
          if (totals0 && totals1) {
            const stablePool = new StableSwapRPool(
              pool.address,
              convertTokenToBento(tokens[0]),
              convertTokenToBento(tokens[1]),
              pool.swapFee,
              toShareBN(res[0], totals0),
              toShareBN(res[1], totals1),
              tokens[0].decimals,
              tokens[1].decimals,
              totals0,
              totals1
            )
            this.pools.push({
              poolCode: new BentoPoolCode(stablePool, this.getPoolProviderName()),
              fetchType: 'INITIAL',
              updatedAtBlock: blockNumber,
            })
            ++this.stateId
          }
        }
      } else {
        console.error(
          `${this.chainId}~${blockNumber}~${this.getType()} - ERROR INIT SYNC, Failed to fetch reserves for pool: ${
            pool.address
          }`
        )
      }
    })
  }

  async getAllBridges(tokensSorted: Token[]) {
    const tokens: Token[] = []
    tokensSorted.forEach((t) => {
      if (this.fetchedTokens.has(t.address.toLowerCase())) return
      tokens.push(t)
      this.fetchedTokens.add(t.address.toLowerCase())
    })

    const BentoBoxAddr = BentoBox[this.chainId]

    const totalsPromise = readContracts({
      allowFailure: true,
      contracts: tokens.map(
        (t) =>
          ({
            args: [t.address as Address],
            address: BentoBoxAddr as Address,
            chainId: this.chainId,
            abi: totalsAbi,
            functionName: 'totals',
          } as const)
      ),
    })

    const balancesPromise = readContracts({
      allowFailure: true,
      contracts: tokens.map(
        (t) =>
          ({
            args: [BentoBoxAddr as Address],
            address: t.address as Address,
            chainId: this.chainId,
            abi: balanceOfAbi,
            functionName: 'balanceOf',
          } as const)
      ),
    })

    const [totals0, balances] = await Promise.all([totalsPromise, balancesPromise])
    const totals = totals0.map((t) => ({ elastic: t.elastic, base: t.base }))
    // TODO: BALANCE?
    // const poolCodes: PoolCode[] = []
    tokens.forEach((t, i) => {
      const total = totals[i]
      const balance = balances[i]
      if (total !== undefined && balance !== undefined) {
        // const pool = new BridgeBento(
        //   `Bento bridge for ${t.symbol}`,
        //   t as RToken,
        //   convertTokenToBento(t),
        //   total.elastic,
        //   total.base,
        //   balance
        // )
        // poolCodes.push(new BentoBridgePoolCode(pool, this.getPoolProviderName(), BentoBoxAddr))
        this.lastFetchedTotals.set(t.address.toLowerCase(), total)
      }
    })

    // return poolCodes
  }

  startFetchPoolsData() {
    this.stopFetchPoolsData()
    this.pools = []

    this.unwatchBlockNumber = watchBlockNumber(
      {
        listen: true,
      },
      (blockNumber) => {
        this.lastUpdateBlock = blockNumber
        this.removeStalePools(blockNumber)

        if (!this.isInitialized) {
          this.initialize(blockNumber)
        }
      }
    )
  }

  private removeStalePools(blockNumber: number) {
    const before = this.pools.length
    // TODO: move this to a per-chain config?
    const blockThreshold = blockNumber - 100
    this.pools = this.pools.filter(
      (p) => (p.updatedAtBlock < blockThreshold && p.fetchType === 'ON_DEMAND') || p.fetchType === 'INITIAL'
    )
    if (before !== this.pools.length) {
      console.debug(
        `${this.chainId}~${this.lastUpdateBlock}~${this.getType()} Stale pools removed: ${before - this.pools.length}`
      )
    }
  }

  fetchPoolsForToken(t0: Token, t1: Token): void {
    this.getPools(t0, t1)
  }

  getCurrentPoolList(): PoolCode[] {
    return this.pools.map((p) => p.poolCode)
  }

  stopFetchPoolsData() {
    if (this.unwatchBlockNumber) this.unwatchBlockNumber()
    if (this.unwatchSyncEvents.size > 0) this.unwatchSyncEvents?.forEach((unwatch) => unwatch())
    if (this.unwatchBalanceReads) this.unwatchBalanceReads()
    if (this.unwatchDepositEvent) this.unwatchDepositEvent()
    if (this.unwatchWithdrawEvent) this.unwatchWithdrawEvent()
    this.blockListener = undefined
  }
}
