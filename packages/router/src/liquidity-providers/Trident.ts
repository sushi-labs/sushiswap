import { balanceOfAbi, getReservesAbi, getStableReservesAbi, totalsAbi } from '@sushiswap/abi'
import {
  BENTOBOX_ADDRESS,
  CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS,
  STABLE_POOL_FACTORY_ADDRESS,
} from '@sushiswap/address'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import {
  BridgeBento,
  ConstantProductRPool,
  Rebase,
  RToken,
  StableSwapRPool,
  toShareBN,
} from '@sushiswap/tines'
import { Address, readContracts, watchBlockNumber } from '@wagmi/core'
import { BigNumber } from 'ethers'

import { getPoolsByTokenIds, getTopPools, PoolResponse } from '../lib/api'
import { BentoBridgePoolCode } from '../pools/BentoBridge'
import { BentoPoolCode } from '../pools/BentoPool'
import type { PoolCode } from '../pools/PoolCode'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

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
  validUntilBlock: number
}

export class TridentProvider extends LiquidityProvider {
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

  blockListener?: () => void
  unwatchBlockNumber?: () => void

  readonly TOP_POOL_SIZE = 155
  readonly TOP_POOL_LIQUIDITY_THRESHOLD = 1000
  readonly ON_DEMAND_POOL_SIZE = 20

  constructor(chainId: ChainId) {
    super(chainId)
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
      console.debug(`${this.getLogPrefix()} - INIT: top pools found: ${topPools.size}`)
    } else {
      console.debug(`${this.getLogPrefix()} - INIT: NO pools found.`)
      return
    }

    await this.initPools(Array.from(topPools.values()))

    console.debug(
      `${this.getLogPrefix()} - INIT, WATCHING ${this.initialClassicPools.size} CLASSIC AND ${
        this.initialStablePools.size
      } STABLE POOLS`
    )
  }

  async initPools(pools: PoolResponse[]): Promise<void> {
    const cppPools = pools.filter((p) => p.type === 'CONSTANT_PRODUCT_POOL')
    const stablePools = pools.filter((p) => p.type === 'STABLE_POOL')
    const sortedTokens = this.poolResponseToSortedTokens(pools)

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
            address: this.bentoBox[this.chainId] as Address,
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
      const res = cppReserves[i]
      if (res === undefined || res === null) return
      const tokens = [convertTokenToBento(pr.token0), convertTokenToBento(pr.token1)]
      const rPool = new ConstantProductRPool(pr.address, tokens[0], tokens[1], pr.swapFee, res[0], res[1])
      const pc = new BentoPoolCode(rPool, this.getType(), this.getPoolProviderName())
      this.initialClassicPools.set(pr.address, pc)
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
      this.bridges.set(
        t.address,
        new BentoBridgePoolCode(pool, this.getType(), this.getPoolProviderName(), this.bentoBox[this.chainId])
      )
      ++this.stateId
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
      this.initialStablePools.set(pr.address, new BentoPoolCode(stablePool, this.getType(), this.getPoolProviderName()))
      ++this.stateId
    })
  }

  async updatePools(): Promise<void> {
    this.removeStalePools()
    const initialClassicPools = Array.from(this.initialClassicPools.values())
    const initialStablePools = Array.from(this.initialStablePools.values())

    const onDemandClassicPools = Array.from(this.onDemandClassicPools.values()).map((p) => p.poolCode)
    const onDemandStablePools = Array.from(this.onDemandStablePools.values()).map((p) => p.poolCode)

    const bridges = Array.from(this.bridges.values())

    const initClassicReservePromise = readContracts({
      allowFailure: true,
      contracts: initialClassicPools.map((pc) => ({
        address: pc.pool.address as Address,
        chainId: this.chainId,
        abi: getReservesAbi,
        functionName: 'getReserves',
      })),
    })

    const onDemandClassicReservePromise = readContracts({
      allowFailure: true,
      contracts: onDemandClassicPools.map((pc) => ({
        address: pc.pool.address as Address,
        chainId: this.chainId,
        abi: getReservesAbi,
        functionName: 'getReserves',
      })),
    })

    const initStableReservePromise = readContracts({
      allowFailure: true,
      contracts: initialStablePools.map((pc) => ({
        address: pc.pool.address as Address,
        chainId: this.chainId,
        abi: getStableReservesAbi,
        functionName: 'getReserves',
      })),
    })

    const onDemandStableReservePromise = readContracts({
      allowFailure: true,
      contracts: onDemandStablePools.map((pc) => ({
        address: pc.pool.address as Address,
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
            args: [b.pool.token0.address as Address],
            address: this.bentoBox[this.chainId] as Address,
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
            args: [this.bentoBox[this.chainId] as Address],
            address: b.pool.token0.address as Address,
            chainId: this.chainId,
            abi: balanceOfAbi,
            functionName: 'balanceOf',
          } as const)
      ),
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
      const total = totals[i]
      const balance = balances[i]
      if (
        total === undefined ||
        total === null ||
        balance === undefined ||
        balance === null ||
        !bridge.reserve0.eq(total.elastic) ||
        !bridge.reserve1.eq(total.base)
      ) {
        return
      }
      bridge.updateReserves(total.elastic, total.base)
      rebases.set(t.address, total)
    })

    this.updateStablePools(initialStablePools, rebases, initStableReserves)
    this.updateStablePools(onDemandStablePools, rebases, onDemandStableReserves)

    console.debug(`${this.getLogPrefix()} - UPDATED POOLS`)
  }

  async getOnDemandPools(t0: Token, t1: Token): Promise<void> {
    console.debug(
      `****** MEM - ${this.getType()} init classic pools: ${this.initialClassicPools.size} 
      on demand classic pools: ${this.onDemandClassicPools.size} 
      init stable pools: ${this.initialStablePools.size} 
      on demand stable pools: ${this.onDemandStablePools.size} 
      bridges: ${this.bridges.size}`
    )
    console.log("TRADES:", this.poolsByTrade.size)
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
    const onDemandClassicPools = pools.filter((p) => p.type === 'CONSTANT_PRODUCT_POOL')
    const onDemandStablePools = pools.filter((p) => p.type === 'STABLE_POOL')

    
    this.poolsByTrade.set(this.getTradeId(t0, t1), pools.map((pool) => pool.address))
    const validUntilBlock = this.lastUpdateBlock + this.ON_DEMAND_POOLS_BLOCK_LIFETIME

    const sortedTokens = this.poolResponseToSortedTokens(pools)

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
        ++this.stateId
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

        this.onDemandClassicPools.set(pr.address, { poolCode: pc, validUntilBlock })
      } else {
        existingPool.validUntilBlock = validUntilBlock
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
        this.onDemandStablePools.set(pr.address, { poolCode: pc, validUntilBlock })
      } else {
        existingPool.validUntilBlock = validUntilBlock
      }
    })
  }

  startFetchPoolsData() {
    this.stopFetchPoolsData()
    this.initialClassicPools = new Map()
    this.initialStablePools = new Map()
    this.bridges = new Map()

    this.unwatchBlockNumber = watchBlockNumber(
      {
        listen: true,
      },
      (blockNumber) => {
        this.lastUpdateBlock = blockNumber
        if (!this.isInitialized) {
          this.initialize(blockNumber)
        } else {
          this.updatePools()
        }
      }
    )
  }

  private removeStalePools() {
    let removed = 0

    for (const poolInfo of this.onDemandClassicPools.values()) {
      if (poolInfo.validUntilBlock < this.lastUpdateBlock) {
        this.onDemandClassicPools.delete(poolInfo.poolCode.pool.address)
        removed++
      }
    }

    for (const poolInfo of this.onDemandStablePools.values()) {
      if (poolInfo.validUntilBlock < this.lastUpdateBlock) {
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
        ? [Array.from(this.onDemandClassicPools), Array.from(this.onDemandStablePools)].flat()
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
    reserves: (readonly [BigNumber, BigNumber, number] & {
      _reserve0: BigNumber
      _reserve1: BigNumber
      _blockTimestampLast: number
    })[]
  ) {
    poolCodes.forEach((pc, i) => {
      const res = reserves[i]
      const pool = pc.pool
      if (res === undefined || res === null) {
        return
      }
      if (!pool.reserve0.eq(res[0]) || !pool.reserve1.eq(res[1])) {
        pool.updateReserves(res[0], res[1])
        ++this.stateId
        console.info(
          `${this.getLogPrefix()} - SYNC, classic pool: ${pool.address} ${pool.token0.symbol}/${
            pool.token1.symbol
          } ${res[0].toString()} ${res[1].toString()}`
        )
      }
    })
  }

  private updateStablePools(
    poolCodes: PoolCode[],
    rebases: Map<string, Rebase>,
    reserves: (readonly [BigNumber, BigNumber] & { _reserve0: BigNumber; _reserve1: BigNumber })[]
  ) {
    poolCodes.forEach((pc, i) => {
      const pool = pc.pool as StableSwapRPool
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

      const res = reserves[i]

      if (res === undefined || res === null) {
        return
      }

      // Always updating stable pool
      pool.updateReserves(toShareBN(res[0], pool.getTotal0()), toShareBN(res[1], pool.getTotal1()))
      ++this.stateId
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
