// import { balanceOfAbi, totalsAbi } from 'sushi/abi'
// import { ChainId } from 'sushi/chain'
// import { Token } from 'sushi/currency'
// import { BridgeBento, Rebase, RToken } from '@sushiswap/tines'
// import { Address, readContracts } from '@wagmi/core'
// import { BigNumber } from 'ethers'
// import { Client } from 'viem'

// import { PoolResponse } from '../lib/api'
// import { LiquidityProvider } from '../liquidity-providers/LiquidityProvider'
// import { BentoBridgePoolCode } from '../pools/BentoBridge'
// import type { PoolCode } from '../pools/PoolCode'

// export function convertToNumbers(arr: BigNumber[]): (number | undefined)[] {
//   return arr.map((a) => {
//     if (a === undefined) return undefined
//     return parseInt(a._hex, 16)
//   })
// }

// export function getBentoChainId(chainId: string | number | undefined): string {
//   return `Bento ${chainId}`
// }

// export function convertTokenToBento(token: Token): RToken {
//   const t: RToken = { ...token } as RToken
//   t.chainId = getBentoChainId(token.chainId)
//   t.name = getBentoChainId(token.name)
//   t.symbol = getBentoChainId(token.symbol)
//   delete t.tokenId
//   return t
// }

// interface PoolInfo {
//   poolCode: PoolCode
//   fetchType: 'INITIAL' | 'ON_DEMAND'
//   updatedAtBlock: number
// }

// export abstract class TridentBase extends LiquidityProvider {
//   isInitialized = false
//   bridges: Map<string, PoolInfo> = new Map()
//   bentoBox = BENTOBOX_ADDRESS
//   rebases = new Map<string, Rebase>()

//   blockListener?: () => void
//   unwatchBlockNumber?: () => void

//   readonly TOP_POOL_SIZE = 155
//   readonly TOP_POOL_LIQUIDITY_THRESHOLD = 1000
//   readonly ON_DEMAND_POOL_SIZE = 20
//   readonly BLOCKS_TO_KEEP_ON_DEMAND_POOLS = 75

//   constructor(chainId: ChainId, client: PublicClient) {
//     super(chainId, client)
//     if (!(chainId in BENTOBOX_ADDRESS)) {
//       throw new Error(`${this.getType()} cannot be instantiated for chainId ${chainId}, no bentobox address found`)
//     }
//   }

//   async initBridges(pools: PoolResponse[]): Promise<void> {
//     const tokenMap = new Map<string, Token>()
//     pools.forEach((pool) => {
//       tokenMap.set(pool.token0.address, pool.token0)
//       tokenMap.set(pool.token1.address, pool.token1)
//     })
//     const tokensDedup = Array.from(tokenMap.values())
//     // tokens sorting
//     const tok0: [string, Token][] = tokensDedup.map((t) => [
//       t.address.toLocaleLowerCase().substring(2).padStart(40, '0'),
//       t,
//     ])
//     const sortedTokens = tok0.sort((a, b) => (b[0] > a[0] ? -1 : 1)).map(([, t]) => t)

//     const totalsPromise = readContracts({
//       allowFailure: true,
//       contracts: sortedTokens.map(
//         (t) =>
//           ({
//             args: [t.address as Address],
//             address: this.bentoBox[this.chainId] as Address,
//             chainId: this.chainId,
//             abi: totalsAbi,
//             functionName: 'totals',
//           } as const)
//       ),
//     })

//     const balancesPromise = readContracts({
//       allowFailure: true,
//       contracts: sortedTokens.map(
//         (t) =>
//           ({
//             args: [this.bentoBox[this.chainId] as Address],
//             address: t.address as Address,
//             chainId: this.chainId,
//             abi: balanceOfAbi,
//             functionName: 'balanceOf',
//           } as const)
//       ),
//     })

//     const [totals, balances] = await Promise.all([totalsPromise, balancesPromise])

//     sortedTokens.forEach((t, i) => {
//       const total = totals[i]
//       const balance = balances[i]
//       if (total === undefined || total === null || balance === undefined || balance === null) return
//       const pool = new BridgeBento(
//         `Bento bridge for ${t.symbol}`,
//         t as RToken,
//         convertTokenToBento(t),
//         total.elastic,
//         total.base,
//         balance
//       )
//       this.bridges.set(t.address, {
//         poolCode: new BentoBridgePoolCode(pool, this.getPoolProviderName(), this.bentoBox[this.chainId] as Address),
//         fetchType: 'INITIAL', // Better to always keep bridges as INITIAL, can't be ON_DEMAND because those will eventually removed.
//         updatedAtBlock: this.lastUpdateBlock,
//       })
//       this.rebases.set(t.address, total)
//     })
//   }

//   async updateBridges(type: 'ALL' | 'INITIAL'): Promise<void> {
//     this.removeStaleBridges()
//     let bridges = Array.from(this.bridges.values())

//     if (type === 'INITIAL') {
//       bridges = bridges.filter((p) => p.fetchType === 'INITIAL')
//     }

//     const totalsPromise = readContracts({
//       allowFailure: true,
//       contracts: bridges.map(
//         (b) =>
//           ({
//             args: [b.poolCode.pool.token0.address as Address],
//             address: this.bentoBox[this.chainId] as Address,
//             chainId: this.chainId,
//             abi: totalsAbi,
//             functionName: 'totals',
//           } as const)
//       ),
//     })

//     const balancesPromise = readContracts({
//       allowFailure: true,
//       contracts: bridges.map(
//         (b) =>
//           ({
//             args: [this.bentoBox[this.chainId] as Address],
//             address: b.poolCode.pool.token0.address as Address,
//             chainId: this.chainId,
//             abi: balanceOfAbi,
//             functionName: 'balanceOf',
//           } as const)
//       ),
//     })

//     const [totals, balances] = await Promise.all([totalsPromise, balancesPromise])

//     bridges.forEach((b, i) => {
//       const pool = b.poolCode.pool as BridgeBento
//       const t = pool.token0
//       const total = totals[i]
//       const balance = balances[i]
//       if (
//         total === undefined ||
//         total === null ||
//         balance === undefined ||
//         balance === null ||
//         !pool.reserve0.eq(total.elastic) ||
//         !pool.reserve1.eq(total.base)
//       ) {
//         return
//       }

//       pool.updateReserves(total.elastic, total.base)

//       this.bridges.set(t.address, {
//         poolCode: new BentoBridgePoolCode(pool, this.getPoolProviderName(), this.bentoBox[this.chainId] as Address),
//         fetchType: 'INITIAL', // Better to always keep bridges as INITIAL, can't be ON_DEMAND because those will eventually removed.
//         updatedAtBlock: this.lastUpdateBlock,
//       })
//       this.rebases.set(t.address, total)
//     })

//     console.debug(`${this.chainId}~${this.lastUpdateBlock}~${this.getType()} - UPDATED BRIDGES`)
//   }

//   removeStaleBridges() {
//     // TODO: move this to a per-chain config?

//     const blockThreshold = this.lastUpdateBlock - this.BLOCKS_TO_KEEP_ON_DEMAND_POOLS
//     let removed = 0

//     for (const [k, v] of this.bridges) {
//       if (v.updatedAtBlock < blockThreshold && v.fetchType === 'ON_DEMAND') {
//         removed++
//         this.bridges.delete(k)
//       }
//     }
//     if (removed > 0) {
//       console.log(`${this.chainId}~${this.lastUpdateBlock}~${this.getType()} -Removed ${removed} stale bridges`)
//     }
//   }
// }
export {}
