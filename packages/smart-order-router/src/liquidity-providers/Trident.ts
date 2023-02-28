import { balanceOfAbi, getReservesAbi, getStableReservesAbi, totalsAbi } from '@sushiswap/abi'
import {
  BENTOBOX_ADDRESS,
  CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS,
  STABLE_POOL_FACTORY_ADDRESS,
} from '@sushiswap/address'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { BridgeBento, ConstantProductRPool, Rebase, RToken, StableSwapRPool, toShareBN } from '@sushiswap/tines'
import { add, getUnixTime } from 'date-fns'
import { BigNumber } from 'ethers'
import { Address, PublicClient } from 'viem'

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
  validUntilTimestamp: number
}

export class TridentProvider extends LiquidityProvider {
  readonly TOP_POOL_SIZE = 155
  readonly TOP_POOL_LIQUIDITY_THRESHOLD = 1000
  readonly ON_DEMAND_POOL_SIZE = 20
  readonly REFRESH_INITIAL_POOLS_INTERVAL = 60 // SECONDS

  isInitialized = false
  initialClassicPools: Map<string, PoolCode> = new Map()
  initialStablePools: Map<string, PoolCode> = new Map()

  onDemandClassicPools: Map<string, PoolInfo> = new Map()
  onDemandStablePools: Map<string, PoolInfo> = new Map()
  poolsByTrade: Map<string, string[]> = new Map()

  bridges: Map<string, PoolCode> = new Map()
  bentoBox = BENTOBOX_ADDRESS
  constantProductPoolFactory = CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS
  stablePoolFactory = STABLE_POOL_FACTORY_ADDRESS
  refreshInitialPoolsTimestamp = getUnixTime(add(Date.now(), { seconds: this.REFRESH_INITIAL_POOLS_INTERVAL }))

  blockListener?: () => void
  unwatchBlockNumber?: () => void

  constructor(chainId: ChainId, client: PublicClient) {
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

  async initialize() {
    this.isInitialized = true
    const pools = await this.getInitialPools()
    if (pools.length > 0) {
      console.debug(`${this.getLogPrefix()} - INIT: top pools found: ${pools.length}`)
    } else {
      console.debug(`${this.getLogPrefix()} - INIT: NO pools found.`)
      return []
    }

    await this.initPools(pools)

    // TODO: generate pools from a list of tokens, exclude if they are included in the list above, multicall to see if the rest exist, keep the pools that exist.

    console.debug(
      `${this.getLogPrefix()} - INIT, WATCHING ${this.initialClassicPools.size} CLASSIC AND ${
        this.initialStablePools.size
      } STABLE POOLS`
    )
  }

  private async getInitialPools(): Promise<PoolResponse[]> {
    const topPools = await getTopPools(
      this.chainId,
      'SushiSwap',
      'TRIDENT',
      ['CONSTANT_PRODUCT_POOL', 'STABLE_POOL'],
      this.TOP_POOL_SIZE,
      this.TOP_POOL_LIQUIDITY_THRESHOLD
    )

    return Array.from(topPools.values())
  }

  async initPools(pools: PoolResponse[]): Promise<void> {
    const classicPools = pools.filter((p) => p.type === 'CONSTANT_PRODUCT_POOL')
    const stablePools = pools.filter((p) => p.type === 'STABLE_POOL')
    const sortedTokens = this.poolResponseToSortedTokens(pools)

    const classicReservePromise = this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
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
      .catch((e) => {
        console.warn(`${this.getLogPrefix()} - INIT: multicall failed, message: ${e.message}`)
      })

    const stableReservePromise = this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
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
      .catch((e) => {
        console.warn(`${this.getLogPrefix()} - INIT: multicall failed, message: ${e.message}`)
      })

    const totalsPromise = this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
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
      .catch((e) => {
        console.warn(`${this.getLogPrefix()} - INIT: multicall failed, message: ${e.message}`)
      })

    const balancesPromise = this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
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
      .catch((e) => {
        console.warn(`${this.getLogPrefix()} - INIT: multicall failed, message: ${e.message}`)
      })

    const [classicReserves, stableReserves, totals, balances] = await Promise.all([
      classicReservePromise,
      stableReservePromise,
      totalsPromise,
      balancesPromise,
    ])

    classicPools.forEach((pr, i) => {
      const res0 = classicReserves?.[i]?.result?.[0]
      const res1 = classicReserves?.[i]?.result?.[1]
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
      const pc = new BentoPoolCode(rPool, this.getType(), this.getPoolProviderName())
      this.initialClassicPools.set(pr.address, pc)
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
      this.bridges.set(
        t.address,
        new BentoBridgePoolCode(pool, this.getType(), this.getPoolProviderName(), this.bentoBox[this.chainId])
      )
      rebases.set(t.address, {
        elastic: BigNumber.from(elastic),
        base: BigNumber.from(base),
      })
    })

    stablePools.forEach((pr, i) => {
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
      this.initialStablePools.set(pr.address, new BentoPoolCode(stablePool, this.getType(), this.getPoolProviderName()))
    })
  }

  async updatePools(): Promise<void> {
    this.removeStalePools()

    this.refreshInitialPools()

    const initialClassicPools = Array.from(this.initialClassicPools.values())
    const initialStablePools = Array.from(this.initialStablePools.values())

    const onDemandClassicPools = Array.from(this.onDemandClassicPools.values()).map((p) => p.poolCode)
    const onDemandStablePools = Array.from(this.onDemandStablePools.values()).map((p) => p.poolCode)

    if (
      initialClassicPools.length === 0 &&
      initialStablePools.length === 0 &&
      onDemandClassicPools.length === 0 &&
      onDemandStablePools.length === 0
    ) {
      return
    }

    const bridges = Array.from(this.bridges.values())

    const initClassicReservePromise = this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
        allowFailure: true,
        contracts: initialClassicPools.map(
          (pc) =>
            ({
              address: pc.pool.address as Address,
              chainId: this.chainId,
              abi: getReservesAbi,
              functionName: 'getReserves',
            } as const)
        ),
      })
      .catch((e) => {
        console.warn(`${this.getLogPrefix()} - UPDATE: multicall failed, message: ${e.message}`)
        return undefined
      })
    const onDemandClassicReservePromise = this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
        allowFailure: true,
        contracts: onDemandClassicPools.map(
          (pc) =>
            ({
              address: pc.pool.address as Address,
              chainId: this.chainId,
              abi: getReservesAbi,
              functionName: 'getReserves',
            } as const)
        ),
      })
      .catch((e) => {
        console.warn(`${this.getLogPrefix()} - UPDATE: multicall failed, message: ${e.message}`)
        return undefined
      })

    const initStableReservePromise = this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
        allowFailure: true,
        contracts: initialStablePools.map(
          (pc) =>
            ({
              address: pc.pool.address as Address,
              chainId: this.chainId,
              abi: getStableReservesAbi,
              functionName: 'getReserves',
            } as const)
        ),
      })
      .catch((e) => {
        console.warn(`${this.getLogPrefix()} - UPDATE: multicall failed, message: ${e.message}`)
        return undefined
      })

    const onDemandStableReservePromise = this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
        allowFailure: true,
        contracts: onDemandStablePools.map(
          (pc) =>
            ({
              address: pc.pool.address as Address,
              chainId: this.chainId,
              abi: getStableReservesAbi,
              functionName: 'getReserves',
            } as const)
        ),
      })
      .catch((e) => {
        console.warn(`${this.getLogPrefix()} - UPDATE: multicall failed, message: ${e.message}`)
        return undefined
      })

    const totalsPromise = this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
        allowFailure: true,
        contracts: bridges.map(
          (b) =>
            ({
              args: [b.pool.token0.address as Address],
              address: this.bentoBox[this.chainId] as Address,
              chainId: this.chainId,
              abi: totalsAbi,
              functionName: 'totals',
            } as const)
        ),
      })
      .catch((e) => {
        console.warn(`${this.getLogPrefix()} - UPDATE: multicall failed, message: ${e.message}`)
        return undefined
      })

    const balancesPromise = this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
        allowFailure: true,
        contracts: bridges.map(
          (b) =>
            ({
              args: [this.bentoBox[this.chainId] as Address],
              address: b.pool.token0.address as Address,
              chainId: this.chainId,
              abi: balanceOfAbi,
              functionName: 'balanceOf',
            } as const)
        ),
      })
      .catch((e) => {
        console.warn(`${this.getLogPrefix()} - UPDATE: multicall failed, message: ${e.message}`)
        return undefined
      })

    const [initClassicReserves, onDemandClassicReserves, initStableReserves, onDemandStableReserves, totals, balances] =
      await Promise.all([
        initClassicReservePromise,
        onDemandClassicReservePromise,
        initStableReservePromise,
        onDemandStableReservePromise,
        totalsPromise,
        balancesPromise,
      ])

    this.updateClassicReserves(initialClassicPools, initClassicReserves)
    this.updateClassicReserves(onDemandClassicPools, onDemandClassicReserves)

    const rebases: Map<string, Rebase> = new Map()

    bridges.forEach((b, i) => {
      const bridge = b.pool as BridgeBento
      const t = bridge.token0
      const elastic = totals?.[i]?.result?.[0]
      const base = totals?.[i]?.result?.[1]
      const balance = balances?.[i]?.result
      if (!elastic || !base || !balance) {
        return
      }
      const elasticBN = BigNumber.from(elastic)
      const baseBN = BigNumber.from(base)
      rebases.set(t.address, {
        elastic: elasticBN,
        base: baseBN,
      })
      if (!bridge.reserve0.eq(elasticBN) || !bridge.reserve1.eq(baseBN)) {
        bridge.updateReserves(elasticBN, baseBN)
        console.debug(
          `${this.getLogPrefix()} - BRIDGE REBASE UPDATE: ${bridge.token0.symbol} ${bridge.reserve0} ${bridge.reserve1}`
        )
      }

      if (bridge.freeLiquidity !== Number(balance)) {
        bridge.freeLiquidity = Number(balance)
        console.debug(`${this.getLogPrefix()} - BRIDGE BALANCE UPDATE: ${bridge.token0.symbol} ${bridge.freeLiquidity}`)
      }
    })

    this.updateStablePools(initialStablePools, rebases, initStableReserves)
    this.updateStablePools(onDemandStablePools, rebases, onDemandStableReserves)

    console.debug(`${this.getLogPrefix()} - UPDATED POOLS`)
  }

  async getOnDemandPools(t0: Token, t1: Token): Promise<void> {
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
    console.debug(`${this.getLogPrefix()} - ON DEMAND: Begin fetching reserves for ${poolsOnDemand.size} pools`)
    const pools = Array.from(poolsOnDemand.values())
    const onDemandClassicPools = pools.filter(
      (p) => p.type === 'CONSTANT_PRODUCT_POOL' && !this.initialClassicPools.has(p.address)
    )
    const onDemandStablePools = pools.filter((p) => p.type === 'STABLE_POOL' && this.initialStablePools.has(p.address))

    this.poolsByTrade.set(
      this.getTradeId(t0, t1),
      pools.map((pool) => pool.address)
    )
    const validUntilTimestamp = getUnixTime(add(Date.now(), { seconds: this.ON_DEMAND_POOLS_LIFETIME_IN_SECONDS }))

    const sortedTokens = this.poolResponseToSortedTokens(pools)
    let newBridges = 0
    let updated = 0
    let created = 0
    sortedTokens.forEach((t, i) => {
      if (!this.bridges.has(t.address)) {
        const pool = new BridgeBento(
          `Bento bridge for ${t.symbol}`,
          t as RToken,
          convertTokenToBento(t),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0)
        )
        this.bridges.set(
          t.address,
          new BentoBridgePoolCode(pool, this.getType(), this.getPoolProviderName(), this.bentoBox[this.chainId])
        )
        ++newBridges
      }
    })

    onDemandClassicPools.forEach((pr) => {
      const existingPool = this.onDemandClassicPools.get(pr.address)
      if (existingPool === undefined) {
        const tokens = [convertTokenToBento(pr.token0), convertTokenToBento(pr.token1)]
        const rPool = new ConstantProductRPool(
          pr.address,
          tokens[0],
          tokens[1],
          pr.swapFee,
          BigNumber.from(0),
          BigNumber.from(0)
        )
        const pc = new BentoPoolCode(rPool, this.getType(), this.getPoolProviderName())

        this.onDemandClassicPools.set(pr.address, { poolCode: pc, validUntilTimestamp })
        ++created
      } else {
        existingPool.validUntilTimestamp = validUntilTimestamp
        ++updated
      }
    })

    onDemandStablePools.forEach((pr) => {
      const existingPool = this.onDemandStablePools.get(pr.address)
      if (existingPool === undefined) {
        const stablePool = new StableSwapRPool(
          pr.address,
          convertTokenToBento(pr.token0),
          convertTokenToBento(pr.token1),
          pr.swapFee,
          BigNumber.from(0),
          BigNumber.from(0),
          pr.token0.decimals,
          pr.token1.decimals,
          { elastic: BigNumber.from(0), base: BigNumber.from(0) },
          { elastic: BigNumber.from(0), base: BigNumber.from(0) }
        )

        const pc = new BentoPoolCode(stablePool, this.getType(), this.getPoolProviderName())
        this.onDemandStablePools.set(pr.address, { poolCode: pc, validUntilTimestamp: validUntilTimestamp })
        ++created
      } else {
        existingPool.validUntilTimestamp = validUntilTimestamp
        ++updated
      }
    })

    console.debug(
      `${this.getLogPrefix()} - ON DEMAND: Created ${created} pools, extended 'lifetime' for ${updated} pools and added ${newBridges} bridges`
    )
  }

  private async refreshInitialPools() {
    if (this.refreshInitialPoolsTimestamp > getUnixTime(Date.now())) {
      return
    }

    this.refreshInitialPoolsTimestamp = getUnixTime(add(Date.now(), { seconds: this.REFRESH_INITIAL_POOLS_INTERVAL }))
    const pools = await this.getInitialPools()

    const poolsToAdd = pools.filter(
      (pool) => !this.initialClassicPools.has(pool.address) || !this.initialStablePools.has(pool.address)
    )
    if (poolsToAdd.length === 0) {
      return
    }

    const initClassicPools = poolsToAdd.filter(
      (p) => p.type === 'CONSTANT_PRODUCT_POOL' && !this.initialClassicPools.has(p.address)
    )
    const initStablePools = poolsToAdd.filter((p) => p.type === 'STABLE_POOL' && this.initialStablePools.has(p.address))

    const sortedTokens = this.poolResponseToSortedTokens(poolsToAdd)

    sortedTokens.forEach((t, i) => {
      if (!this.bridges.has(t.address)) {
        const pool = new BridgeBento(
          `Bento bridge for ${t.symbol}`,
          t as RToken,
          convertTokenToBento(t),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0)
        )
        this.bridges.set(
          t.address,
          new BentoBridgePoolCode(pool, this.getType(), this.getPoolProviderName(), this.bentoBox[this.chainId])
        )
        console.log(`${this.getLogPrefix()} - REFRESH INITIAL POOLS: Added bridge (${pool.token0.symbol})`)
      }
    })

    initClassicPools.forEach((pr) => {
      const existingPool = this.initialClassicPools.get(pr.address)
      if (existingPool === undefined) {
        const tokens = [convertTokenToBento(pr.token0), convertTokenToBento(pr.token1)]
        const rPool = new ConstantProductRPool(
          pr.address,
          tokens[0],
          tokens[1],
          pr.swapFee,
          BigNumber.from(0),
          BigNumber.from(0)
        )
        const pc = new BentoPoolCode(rPool, this.getType(), this.getPoolProviderName())
        this.initialClassicPools.set(pr.address, pc)
        console.log(
          `${this.getLogPrefix()} - REFRESH INITIAL POOLS: Added classic pool ${rPool.address} (${
            rPool.token0.symbol
          }/${rPool.token1.symbol})`
        )
      }
    })

    initStablePools.forEach((pr) => {
      const existingPool = this.initialStablePools.get(pr.address)
      if (existingPool === undefined) {
        const stablePool = new StableSwapRPool(
          pr.address,
          convertTokenToBento(pr.token0),
          convertTokenToBento(pr.token1),
          pr.swapFee,
          BigNumber.from(0),
          BigNumber.from(0),
          pr.token0.decimals,
          pr.token1.decimals,
          { elastic: BigNumber.from(0), base: BigNumber.from(0) },
          { elastic: BigNumber.from(0), base: BigNumber.from(0) }
        )
        this.initialStablePools.set(
          pr.address,
          new BentoPoolCode(stablePool, this.getType(), this.getPoolProviderName())
        )
        console.log(
          `${this.getLogPrefix()} - REFRESH INITIAL POOLS: Added stable pool ${stablePool.address} (${
            stablePool.token0.symbol
          }/${stablePool.token1.symbol})`
        )
      }
    })

    console.debug(
      `****** MEM - ${this.getLogPrefix()} 
      init classic pools: ${this.initialClassicPools.size} 
      on demand classic pools: ${this.onDemandClassicPools.size} 
      init stable pools: ${this.initialStablePools.size} 
      on demand stable pools: ${this.onDemandStablePools.size} 
      bridges: ${this.bridges.size}`
    )
  }

  startFetchPoolsData() {
    this.stopFetchPoolsData()
    this.initialClassicPools = new Map()
    this.initialStablePools = new Map()
    this.bridges = new Map()

    this.unwatchBlockNumber = this.client.watchBlockNumber({
      onBlockNumber: (blockNumber) => {
        this.lastUpdateBlock = Number(blockNumber)
        if (!this.isInitialized) {
          this.initialize()
        } else {
          this.updatePools()
        }
      },
      onError: (error) => {
        console.error(`${this.getLogPrefix()} - Error watching block number: ${error.message}`)
      },
    })
  }

  private removeStalePools() {
    let removed = 0
    const now = getUnixTime(Date.now())
    for (const poolInfo of this.onDemandClassicPools.values()) {
      if (poolInfo.validUntilTimestamp < now) {
        this.onDemandClassicPools.delete(poolInfo.poolCode.pool.address)
        removed++
      }
    }

    for (const poolInfo of this.onDemandStablePools.values()) {
      if (poolInfo.validUntilTimestamp < now) {
        this.onDemandStablePools.delete(poolInfo.poolCode.pool.address)
        removed++
      }
    }

    if (removed > 0) {
      console.log(`${this.getLogPrefix()} -Removed ${removed} stale pools`)
    }
  }

  fetchPoolsForToken(t0: Token, t1: Token): void {
    this.getOnDemandPools(t0, t1)
  }

  getCurrentPoolList(t0: Token, t1: Token): PoolCode[] {
    const tradeId = this.getTradeId(t0, t1)
    const poolsByTrade = this.poolsByTrade.get(tradeId) ?? []
    const onDemandPoolCodes = poolsByTrade
      ? [Array.from(this.onDemandClassicPools), Array.from(this.onDemandStablePools)]
          .flat()
          .filter(([poolAddress]) => poolsByTrade.includes(poolAddress))
          .map(([, p]) => p.poolCode)
      : []

    return [
      ...this.initialClassicPools.values(),
      ...this.initialStablePools.values(),
      ...onDemandPoolCodes,
      ...this.bridges.values(),
    ]
  }

  stopFetchPoolsData() {
    if (this.unwatchBlockNumber) this.unwatchBlockNumber()
    this.blockListener = undefined
  }

  private updateClassicReserves(
    poolCodes: PoolCode[],
    reserves:
      | (
          | {
              error: Error
              result?: undefined
              status: 'error'
            }
          | {
              error?: undefined
              result: readonly [bigint, bigint, number]
              status: 'success'
            }
        )[]
      | undefined
  ) {
    if (!reserves) return
    poolCodes.forEach((pc, i) => {
      const pool = pc.pool
      const res0 = reserves?.[i]?.result?.[0]
      const res1 = reserves?.[i]?.result?.[1]

      const res0BN = BigNumber.from(res0)
      const res1BN = BigNumber.from(res1)
      if (!res0 || !res1) {
        return
      }
      if (pool.reserve0.eq(res0BN) && pool.reserve1.eq(res1BN)) {
        return
      }

      pool.updateReserves(res0BN, res1BN)
      console.info(
        `${this.getLogPrefix()} - SYNC, classic pool: ${pool.address} ${pool.token0.symbol}/${
          pool.token1.symbol
        } ${res0BN.toString()} ${res1BN.toString()}`
      )
    })
  }

  private updateStablePools(
    poolCodes: PoolCode[],
    rebases: Map<string, Rebase>,
    reserves:
      | (
          | {
              error: Error
              result?: undefined
              status: 'error'
            }
          | {
              error?: undefined
              result: readonly [bigint, bigint]
              status: 'success'
            }
        )[]
      | undefined
  ) {
    if (!reserves) return
    poolCodes.forEach((pc, i) => {
      const pool = pc.pool as StableSwapRPool
      const total0 = rebases.get(pool.token0.address)
      if (total0) {
        const current = pool.getTotal0()
        if (!total0.elastic.eq(current.elastic) || !total0.base.eq(current.base)) {
          pool.updateTotal0(total0)
        }
      }
      const total1 = rebases.get(pool.token1.address)
      if (total1) {
        const current = pool.getTotal1()
        if (!total1.elastic.eq(current.elastic) || !total1.base.eq(current.base)) {
          pool.updateTotal1(total1)
        }
      }
      const res0 = reserves?.[i]?.result?.[0]
      const res1 = reserves?.[i]?.result?.[1]

      const res0BN = BigNumber.from(res0)
      const res1BN = BigNumber.from(res1)
      if (!res0 || !res1 || !pool.reserve0.eq(res0BN) || !pool.reserve1.eq(res1BN)) {
        return
      }
      // Always updating because reserve0 and 1 is being converted to amount and adjusted to wei using realReservesToAdjusted()
      // but the res0 and res1 are not adjusted.
      pool.updateReserves(toShareBN(res0BN, pool.getTotal0()), toShareBN(res1BN, pool.getTotal1()))
    })
  }

  private poolResponseToSortedTokens(poolResults: PoolResponse[]) {
    const tokenMap = new Map<string, Token>()
    poolResults.forEach((pool) => {
      tokenMap.set(pool.token0.address, pool.token0)
      tokenMap.set(pool.token1.address, pool.token1)
    })
    const tokensDedup = Array.from(tokenMap.values())
    // tokens sorting
    const tok0: [string, Token][] = tokensDedup.map((t) => [
      t.address.toLocaleLowerCase().substring(2).padStart(40, '0'),
      t,
    ])
    return tok0.sort((a, b) => (b[0] > a[0] ? -1 : 1)).map(([, t]) => t)
  }
}
