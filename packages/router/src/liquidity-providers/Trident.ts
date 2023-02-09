import { balanceOfAbi, getReservesAbi, getStableReservesAbi, totalsAbi } from '@sushiswap/abi'
import {
  BENTOBOX_ADDRESS,
  CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS,
  STABLE_POOL_FACTORY_ADDRESS,
} from '@sushiswap/address'
import { ChainId, chainShortName } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { BridgeBento, ConstantProductRPool, Rebase, RToken, StableSwapRPool, toShareBN } from '@sushiswap/tines'
import { BigNumber } from 'ethers'
import { Address, Client, multicall, watchBlockNumber } from 'viem'

import { getPoolsByTokenIds, getTopPools, PoolResponse } from '../lib/api'
import { LiquidityProvider, LiquidityProviders } from '../liquidity-providers/LiquidityProvider'
import { BentoBridgePoolCode } from '../pools/BentoBridge'
import { BentoPoolCode } from '../pools/BentoPool'
import type { PoolCode } from '../pools/PoolCode'

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
  bentoBox = BENTOBOX_ADDRESS
  constantProductPoolFactory = CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS
  stablePoolFactory = STABLE_POOL_FACTORY_ADDRESS

  blockListener?: () => void
  unwatchBlockNumber?: () => void

  readonly TOP_POOL_SIZE = 155
  readonly TOP_POOL_LIQUIDITY_THRESHOLD = 1000
  readonly ON_DEMAND_POOL_SIZE = 20

  constructor(chainId: ChainId, client: Client) {
    super(chainId, client)
    if (
      !(chainId in this.bentoBox) ||
      !(chainId in this.constantProductPoolFactory) ||
      !(chainId in this.stablePoolFactory)
    ) {
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
        `${chainShortName[this.chainId]}/${this.chainId}~${
          this.lastUpdateBlock
        }~${this.getType()} - INIT: top pools found: ${topPools.size}`
      )
    } else {
      console.debug(
        `${chainShortName[this.chainId]}/${this.chainId}~${
          this.lastUpdateBlock
        }~${this.getType()} - INIT: NO pools found.`
      )
      return
    }

    await this.initPools(Array.from(topPools.values()), 'INITIAL')

    console.debug(
      `${chainShortName[this.chainId]}/${this.chainId}~${this.lastUpdateBlock}${this.getType()} - INIT, WATCHING ${
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

    const cppReservePromise = await multicall(this.client, {
      multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      allowFailure: true,
      contracts: pools.map(
        (pool) =>
          ({
            address: pool.address as Address,
            chainId: this.chainId,
            abi: getReservesAbi,
            functionName: 'getReserves',
          } as const)
      ),
    })

    const stableReservePromise = multicall(this.client, {
      multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      allowFailure: true,
      contracts: stablePools.map(
        (p) =>
          ({
            address: p.address as Address,
            chainId: this.chainId,
            abi: getStableReservesAbi,
            functionName: 'getReserves',
          } as const)
      ),
    })

    const totalsPromise = multicall(this.client, {
      multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      allowFailure: true,
      contracts: sortedTokens.map(
        (t) =>
          ({
            args: [t.address as Address],
            address: this.bentoBox[this.chainId] as Address,
            chainId: this.chainId,
            abi: totalsAbi,
            functionName: 'totals',
          } as const)
      ),
    })

    const balancesPromise = multicall(this.client, {
      multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      allowFailure: true,
      contracts: sortedTokens.map(
        (t) =>
          ({
            args: [this.bentoBox[this.chainId] as Address],
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

    cppPools.forEach((pr, i) => {
      const res0 = cppReserves?.[i]?.result?.[0]
      const res1 = cppReserves?.[i]?.result?.[1]
      if (!res0 || !res1) return
      const tokens = [convertTokenToBento(pr.token0), convertTokenToBento(pr.token1)]
      const rPool = new ConstantProductRPool(
        pr.address,
        tokens[0],
        tokens[1],
        pr.swapFee,
        BigNumber.from(res0),
        BigNumber.from(res1)
      )
      const pc = new BentoPoolCode(rPool, this.getPoolProviderName())
      this.cPPools.set(pr.address, { poolCode: pc, fetchType, updatedAtBlock: this.lastUpdateBlock })
      ++this.stateId
    })

    const rebases: Map<string, Rebase> = new Map()

    sortedTokens.forEach((t, i) => {
      const elastic = totals?.[i]?.result?.[0]
      const base = totals?.[i]?.result?.[1]
      const balance = balances?.[i]?.result
      if (!elastic || !base || !balance) return
      const pool = new BridgeBento(
        `Bento bridge for ${t.symbol}`,
        t as RToken,
        convertTokenToBento(t),
        BigNumber.from(elastic),
        BigNumber.from(base),
        BigNumber.from(balance)
      )
      this.bridges.set(t.address, {
        poolCode: new BentoBridgePoolCode(pool, this.getPoolProviderName(), this.bentoBox[this.chainId]),
        fetchType: 'INITIAL', // Better to always keep bridges as INITIAL, can't be ON_DEMAND because those will eventually removed.
        updatedAtBlock: this.lastUpdateBlock,
      })
      rebases.set(t.address, {
        elastic: BigNumber.from(elastic),
        base: BigNumber.from(base),
      })
    })

    stablePools.forEach((pr, i) => {
      //   const res = stableReserves[i]
      const res0 = stableReserves?.[i]?.result?.[0]
      const res1 = stableReserves?.[i]?.result?.[1]
      const totals0 = rebases.get(pr.token0.address)
      const totals1 = rebases.get(pr.token1.address)
      if (!res0 || !res1 || totals0 === undefined || totals1 === undefined) return

      const stablePool = new StableSwapRPool(
        pr.address,
        convertTokenToBento(pr.token0),
        convertTokenToBento(pr.token1),
        pr.swapFee,
        toShareBN(BigNumber.from(res0), totals0),
        toShareBN(BigNumber.from(res1), totals1),
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
    this.removeStalePools()
    let cppPools = Array.from(this.cPPools.values())
    let stablePools = Array.from(this.stablePools.values())
    let bridges = Array.from(this.bridges.values())

    if (type === 'INITIAL') {
      cppPools = cppPools.filter((p) => p.fetchType === 'INITIAL')
      stablePools = stablePools.filter((p) => p.fetchType === 'INITIAL')
      bridges = bridges.filter((p) => p.fetchType === 'INITIAL')
    }

    const cppReservePromise = await multicall(this.client, {
      multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      allowFailure: true,
      contracts: cppPools.map(
        (p) =>
          ({
            address: p.poolCode.pool.address as Address,
            chainId: this.chainId,
            abi: getReservesAbi,
            functionName: 'getReserves',
          } as const)
      ),
    })

    const stableReservePromise = multicall(this.client, {
      multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      allowFailure: true,
      contracts: stablePools.map(
        (p) =>
          ({
            address: p.poolCode.pool.address as Address,
            chainId: this.chainId,
            abi: getStableReservesAbi,
            functionName: 'getReserves',
          } as const)
      ),
    })

    const totalsPromise = multicall(this.client, {
      multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      allowFailure: true,
      contracts: bridges.map(
        (b) =>
          ({
            args: [b.poolCode.pool.token0.address as Address],
            address: this.bentoBox[this.chainId] as Address,
            chainId: this.chainId,
            abi: totalsAbi,
            functionName: 'totals',
          } as const)
      ),
    })

    const balancesPromise = multicall(this.client, {
      multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11' as Address,
      allowFailure: true,
      contracts: bridges.map(
        (b) =>
          ({
            args: [this.bentoBox[this.chainId] as Address],
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
      //   const res = cppReserves[i]

      const res0 = cppReserves?.[i]?.result?.[0]
      const res1 = cppReserves?.[i]?.result?.[1]

      if (
        !res0 ||
        !res1 ||
        !pi.poolCode.pool.reserve0.eq(BigNumber.from(res0)) ||
        !pi.poolCode.pool.reserve1.eq(BigNumber.from(res1))
      ) {
        return
      }

      pi.poolCode.pool.updateReserves(BigNumber.from(res0), BigNumber.from(res1))
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
      const elastic = totals?.[i]?.result?.[0]
      const base = totals?.[i]?.result?.[1]
      const balance = balances?.[i]?.result
      if (
        !elastic ||
        !base ||
        !balance ||
        !pool.reserve0.eq(BigNumber.from(elastic)) ||
        !pool.reserve1.eq(BigNumber.from(base))
      ) {
        return
      }

      pool.updateReserves(BigNumber.from(elastic), BigNumber.from(base))

      this.bridges.set(t.address, {
        poolCode: new BentoBridgePoolCode(pool, this.getPoolProviderName(), this.bentoBox[this.chainId]),
        fetchType: 'INITIAL', // Better to always keep bridges as INITIAL, can't be ON_DEMAND because those will eventually removed.
        updatedAtBlock: this.lastUpdateBlock,
      })
      rebases.set(t.address, {
        elastic: BigNumber.from(elastic),
        base: BigNumber.from(base),
      })
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

      //   const res = stableReserves[i]
      const res0 = stableReserves?.[i]?.result?.[0]
      const res1 = stableReserves?.[i]?.result?.[1]

      // TODO: Fix criteria below or always update?
      // unless res is undefined, the criteria below will always be true,
      //  because reserve0 and 1 is being converted to amount and adjusted to wei using realReservesToAdjusted()
      // but the res[0] and res[1] are not adjusted.
      if (res0 && res1 && (!pool.reserve0.eq(BigNumber.from(res0)) || !pool.reserve1.eq(BigNumber.from(res1)))) {
        pool.updateReserves(
          toShareBN(BigNumber.from(res0), pool.getTotal0()),
          toShareBN(BigNumber.from(res1), pool.getTotal1())
        )
        this.stablePools.set(pool.address, {
          poolCode: pi.poolCode,
          fetchType: pi.fetchType,
          updatedAtBlock: this.lastUpdateBlock,
        })
        ++this.stateId
      }
    })
    console.debug(
      `${chainShortName[this.chainId]}/${this.chainId}~${this.lastUpdateBlock}~${this.getType()} - UPDATED POOLS`
    )
  }

  async getPools(t0: Token, t1: Token): Promise<void> {
    console.debug(`****** ${this.getType()} POOLS IN MEMORY:`, this.getCurrentPoolList().length)
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
      `${chainShortName[this.chainId]}/${this.chainId}~${
        this.lastUpdateBlock
      }~${this.getType()} - ON DEMAND: Begin fetching reserves for ${poolsOnDemand.size} pools`
    )
    const pools = Array.from(poolsOnDemand.values())

    // TODO: refactor this, unnecessary to fetch reserves for all pools, then update them again after
    await this.initPools(pools, 'ON_DEMAND')
    await this.updatePools('ALL')
  }

  startFetchPoolsData() {
    this.stopFetchPoolsData()
    this.cPPools = new Map()
    this.stablePools = new Map()
    this.bridges = new Map()

    this.unwatchBlockNumber = watchBlockNumber(this.client, {
      onBlockNumber: (blockNumber) => {
        this.lastUpdateBlock = Number(blockNumber)
        if (!this.isInitialized) {
          this.initialize(Number(blockNumber))
        } else {
          this.updatePools('INITIAL')
        }
      },
    })
  }

  private removeStalePools() {
    // TODO: move this to a per-chain config?

    const blockThreshold = this.lastUpdateBlock - 75
    let removed = 0

    for (const [k, v] of this.cPPools) {
      if (v.updatedAtBlock < blockThreshold && v.fetchType === 'ON_DEMAND') {
        removed++
        this.cPPools.delete(k)
      }
    }

    for (const [k, v] of this.stablePools) {
      if (v.updatedAtBlock < blockThreshold && v.fetchType === 'ON_DEMAND') {
        removed++
        this.stablePools.delete(k)
      }
    }

    for (const [k, v] of this.bridges) {
      if (v.updatedAtBlock < blockThreshold && v.fetchType === 'ON_DEMAND') {
        removed++
        this.bridges.delete(k)
      }
    }
    if (removed > 0) {
      console.log(
        `${chainShortName[this.chainId]}/${this.chainId}~${
          this.lastUpdateBlock
        }~${this.getType()} -Removed ${removed} stale pools`
      )
    }
  }

  fetchPoolsForToken(t0: Token, t1: Token): void {
    this.getPools(t0, t1)
  }

  getCurrentPoolList(): PoolCode[] {
    return [...this.cPPools.values(), ...this.stablePools.values(), ...this.bridges.values()].map((p) => p.poolCode)
  }

  stopFetchPoolsData() {
    if (this.unwatchBlockNumber) this.unwatchBlockNumber()
    this.blockListener = undefined
  }
}
