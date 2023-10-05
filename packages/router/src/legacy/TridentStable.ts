// import { getStableReservesAbi } from 'sushi/abi'
// import { ChainId } from '@sushiswap/chain'
// import { Token } from '@sushiswap/currency'
// import { StableSwapRPool, toShareBI } from '@sushiswap/tines'
// import { Address, readContracts, watchBlockNumber } from '@wagmi/core'
// import { Client } from 'viem'

// import { getPoolsByTokenIds, getTopPools, PoolResponse } from '../lib/api'
// import { LiquidityProviders } from '../liquidity-providers'
// import { BentoPoolCode } from '../pools/BentoPool'
// import type { PoolCode } from '../pools/PoolCode'
// import { convertTokenToBento, TridentBase } from './TridentBase'

// export const BentoBox: Record<string | number, string> = {
//   [ChainId.POLYGON]: '0x0319000133d3AdA02600f0875d2cf03D442C3367',
// }

// interface PoolInfo {
//   poolCode: PoolCode
//   fetchType: 'INITIAL' | 'ON_DEMAND'
//   updatedAtBlock: number
// }

// export class TridentStableProvider extends TridentBase {
//   isInitialized = false
//   pools: Map<string, PoolInfo> = new Map()

//   blockListener?: () => void
//   unwatchBlockNumber?: () => void

//   constructor(chainId: ChainId, client: PublicClient) {
//     super(chainId, client)
//     if (!(chainId in STABLE_POOL_FACTORY_ADDRESS)) {
//       throw new Error(
//         `${this.getType()} cannot be instantiated for chainId ${chainId}, no constant product pool factory address found`
//       )
//     }
//   }

//   getType(): LiquidityProviders {
//     return LiquidityProviders.TridentStable
//   }

//   getPoolProviderName(): string {
//     return 'Trident'
//   }

//   async initialize() {
//     this.isInitialized = true

//     const topPools = await getTopPools(
//       this.chainId,
//       'SushiSwap',
//       'TRIDENT',
//       ['STABLE_POOL'],
//       this.TOP_POOL_SIZE,
//       this.TOP_POOL_LIQUIDITY_THRESHOLD
//     )

//     if (topPools.size > 0) {
//       console.debug(
//         `${this.chainId}~${this.lastUpdateBlock}~${this.getType()} - INIT: top pools found: ${topPools.size}`
//       )
//     } else {
//       console.debug(`${this.chainId}~${this.lastUpdateBlock}~${this.getType()} - INIT: NO pools found.`)
//       return
//     }

//     await this.initPools(Array.from(topPools.values()), 'INITIAL')

//     console.debug(
//       `${this.chainId}~${this.lastUpdateBlock}${this.getType()} - INIT, WATCHING ${
//         this.getCurrentPoolList().length
//       } POOLS`
//     )
//   }

//   async initPools(pools: PoolResponse[], fetchType: 'INITIAL' | 'ON_DEMAND'): Promise<void> {
//     const tokenMap = new Map<string, Token>()
//     pools.forEach((pool) => {
//       tokenMap.set(pool.token0.address, pool.token0)
//       tokenMap.set(pool.token1.address, pool.token1)
//     })

//     const reservePromise = readContracts({
//       allowFailure: true,
//       contracts: pools.map((p) => ({
//         address: p.address as Address,
//         chainId: this.chainId,
//         abi: getStableReservesAbi,
//         functionName: 'getReserves',
//       })),
//     })

//     const [stableReserves] = await Promise.all([reservePromise, this.initBridges(pools)])

//     pools.forEach((pr, i) => {
//       const res = stableReserves[i]
//       const totals0 = this.rebases.get(pr.token0.address)
//       const totals1 = this.rebases.get(pr.token1.address)
//       if (res === undefined || res === null || totals0 === undefined || totals1 === undefined) return

//       const pool = new StableSwapRPool(
//         pr.address,
//         convertTokenToBento(pr.token0),
//         convertTokenToBento(pr.token1),
//         pr.swapFee,
//         toShareBI(res[0], totals0),
//         toShareBI(res[1], totals1),
//         pr.token0.decimals,
//         pr.token1.decimals,
//         totals0,
//         totals1
//       )
//       this.pools.set(pr.address, {
//         poolCode: new BentoPoolCode(pool, this.getPoolProviderName()),
//         fetchType,
//         updatedAtBlock: this.lastUpdateBlock,
//       })
//       ++this.stateId
//     })
//   }

//   async getPools(t0: Token, t1: Token): Promise<void> {
//     console.debug(`****** ${this.getType()} POOLS IN MEMORY:`, this.getCurrentPoolList().length)
//     const poolsOnDemand = await getPoolsByTokenIds(
//       this.chainId,
//       'SushiSwap',
//       'TRIDENT',
//       ['STABLE_POOL'],
//       t0.address,
//       t1.address,
//       this.TOP_POOL_SIZE,
//       this.TOP_POOL_LIQUIDITY_THRESHOLD,
//       this.ON_DEMAND_POOL_SIZE
//     )
//     console.debug(
//       `${this.chainId}~${this.lastUpdateBlock}~${this.getType()} - ON DEMAND: Begin fetching reserves for ${
//         poolsOnDemand.size
//       } pools`
//     )
//     const pools = Array.from(poolsOnDemand.values())

//     // TODO: refactor this, unnecessary to fetch reserves for all pools, then update them again after
//     await this.initPools(pools, 'ON_DEMAND')
//     await this.updatePools('ALL')
//   }

//   async updatePools(type: 'ALL' | 'INITIAL'): Promise<void> {
//     this.removeStalePools()
//     let pools = Array.from(this.pools.values())

//     if (type === 'INITIAL') {
//       pools = pools.filter((p) => p.fetchType === 'INITIAL')
//     }

//     const reservePromise = readContracts({
//       allowFailure: true,
//       contracts: pools.map((p) => ({
//         address: p.poolCode.pool.address as Address,
//         chainId: this.chainId,
//         abi: getStableReservesAbi,
//         functionName: 'getReserves',
//       })),
//     })

//     const [reserves] = await Promise.all([reservePromise, this.updateBridges(type)])

//     pools.forEach((pi, i) => {
//       const pool = pi.poolCode.pool as StableSwapRPool
//       const total0 = this.rebases.get(pool.token0.address)
//       if (total0) {
//         const current = pool.getTotal0()
//         if (!total0.elastic.eq(current.elastic) || !total0.base.eq(current.base)) {
//           pool.updateTotal0(total0)
//           ++this.stateId
//         }
//       }
//       const total1 = this.rebases.get(pool.token1.address)
//       if (total1) {
//         const current = pool.getTotal1()
//         if (!total1.elastic.eq(current.elastic) || !total1.base.eq(current.base)) {
//           pool.updateTotal1(total1)
//           ++this.stateId
//         }
//       }

//       const res = reserves[i]
//       // TODO: Fix criteria below or always update?
//       // unless res is undefined, the criteria below will always be true,
//       //  because reserve0 and 1 is being converted to amount and adjusted to wei using realReservesToAdjusted()
//       // but the res[0] and res[1] are not adjusted.
//       if (res !== undefined && res !== null && (!pool.reserve0.eq(res[0]) || !pool.reserve1.eq(res[1]))) {
//         pool.updateReserves(toShareBI(res[0], pool.getTotal0()), toShareBI(res[1], pool.getTotal1()))
//         this.pools.set(pool.address, {
//           poolCode: pi.poolCode,
//           fetchType: pi.fetchType,
//           updatedAtBlock: this.lastUpdateBlock,
//         })
//         ++this.stateId
//       }
//     })
//     console.debug(`${this.chainId}~${this.lastUpdateBlock}~${this.getType()} - UPDATED POOLS`)
//   }

//   startFetchPoolsData() {
//     this.stopFetchPoolsData()
//     this.pools = new Map()
//     this.bridges = new Map()

//     this.unwatchBlockNumber = watchBlockNumber(
//       {
//         listen: true,
//       },
//       (blockNumber) => {
//         this.lastUpdateBlock = blockNumber
//         if (!this.isInitialized) {
//           this.initialize()
//         } else {
//           this.updatePools('INITIAL')
//         }
//       }
//     )
//   }

//   private removeStalePools() {
//     // TODO: move this to a per-chain config?
//     this.removeStaleBridges()
//     const blockThreshold = this.lastUpdateBlock - this.BLOCKS_TO_KEEP_ON_DEMAND_POOLS
//     let removed = 0

//     for (const [k, v] of this.pools) {
//       if (v.updatedAtBlock < blockThreshold && v.fetchType === 'ON_DEMAND') {
//         removed++
//         this.pools.delete(k)
//       }
//     }
//     if (removed > 0) {
//       console.log(`${this.chainId}~${this.lastUpdateBlock}~${this.getType()} -Removed ${removed} stale pools`)
//     }
//   }

//   fetchPoolsForToken(t0: Token, t1: Token): void {
//     this.getPools(t0, t1)
//   }

//   getCurrentPoolList(): PoolCode[] {
//     return [...this.pools.values(), ...this.bridges.values()].map((p) => p.poolCode)
//   }

//   stopFetchPoolsData() {
//     if (this.unwatchBlockNumber) this.unwatchBlockNumber()
//     this.blockListener = undefined
//   }
// }
export {}
