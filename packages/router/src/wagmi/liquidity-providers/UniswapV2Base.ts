import { keccak256, pack } from '@ethersproject/solidity'
import { getReservesAbi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@sushiswap/router-config'
import { ConstantProductRPool, RToken } from '@sushiswap/tines'
import { Address, fetchBlockNumber, readContracts, watchBlockNumber, watchContractEvent } from '@wagmi/core'
import { BigNumber } from 'ethers'
import { getCreate2Address } from 'ethers/lib/utils'

import { getPoolsByTokenIds, getTopPools } from '../../lib/api'
import { ConstantProductPoolCode } from '../../pools/ConstantProductPool'
import type { PoolCode } from '../../pools/PoolCode'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

const syncAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint112',
        name: 'reserve0',
        type: 'uint112',
      },
      {
        indexed: false,
        internalType: 'uint112',
        name: 'reserve1',
        type: 'uint112',
      },
    ],
    name: 'Sync',
    type: 'event',
  },
] as const

interface PoolInfo {
  poolCode: PoolCode
  fetchType: 'INITIAL' | 'ON_DEMAND'
  updatedAtBlock: number
}

export abstract class UniswapV2BaseProvider extends LiquidityProvider {
  pools: PoolInfo[] = []
  blockListener?: () => void
  unwatchBlockNumber?: () => void
  unwatchMulticall?: () => void
  unwatchSyncEvents: Map<string, () => void> = new Map()
  fee = 0.003
  isInitialized = false
  abstract factory: { [chainId: number]: string }
  abstract initCodeHash: { [chainId: number]: string }
  constructor(chainId: ChainId) {
    super(chainId)
  }
  readonly TOP_POOL_SIZE = 155
  readonly TOP_POOL_LIQUIDITY_THRESHOLD = 5000
  readonly ON_DEMAND_POOL_SIZE = 20

  async initialize(blockNumber: number) {
    this.isInitialized = true
    const type = this.getType()

    const topPools = await getTopPools(
      this.chainId,
      type === LiquidityProviders.UniswapV2 ? 'Uniswap' : type,
      type === LiquidityProviders.SushiSwap ? 'LEGACY' : 'V2',
      'CONSTANT_PRODUCT_POOL',
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

    const poolAddresses = Array.from(topPools.keys())

    const reserves = await readContracts({
      allowFailure: true,
      contracts: poolAddresses.map((addr) => ({
        address: addr as Address,
        chainId: this.chainId,
        abi: getReservesAbi,
        functionName: 'getReserves',
      })),
    })

    poolAddresses.forEach((addr, i) => {
      const res = reserves[i]
      if (res !== null && res !== undefined) {
        const toks = topPools.get(addr) as [Token, Token]
        const rPool = new ConstantProductRPool(addr, toks[0] as RToken, toks[1] as RToken, this.fee, res[0], res[1])
        const pc = new ConstantProductPoolCode(rPool, this.getPoolProviderName())
        this.pools.push({ poolCode: pc, fetchType: 'INITIAL', updatedAtBlock: blockNumber })
        ++this.stateId
      } else {
        console.error(
          `${this.chainId}~${
            this.lastUpdateBlock
          }~${this.getType()} - ERROR INIT SYNC, Failed to fetch reserves for pool: ${addr}`
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
    this.lastUpdateBlock = blockNumber
  }

  async getPools(t0: Token, t1: Token): Promise<void> {
    if (!(this.chainId in this.factory)) {
      // No sushiswap for this network
      this.lastUpdateBlock = -1
      return
    }
    console.debug(`****** ${this.getType()} POOLS IN MEMORY:`, this.pools.length)

    const type = this.getType()

    const poolsOnDemand = await getPoolsByTokenIds(
      this.chainId,
      type === LiquidityProviders.UniswapV2 ? 'Uniswap' : type,
      type === LiquidityProviders.SushiSwap ? 'LEGACY' : 'V2',
      'CONSTANT_PRODUCT_POOL',
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

    const poolAddresses = Array.from(poolsOnDemand.keys())

    const reserves = await readContracts({
      allowFailure: true,
      contracts: poolAddresses.map((addr) => ({
        address: addr as Address,
        chainId: this.chainId,
        abi: getReservesAbi,
        functionName: 'getReserves',
      })),
    })

    poolAddresses.forEach((addr, i) => {
      const res = reserves[i]
      if (res !== null && res !== undefined) {
        const toks = poolsOnDemand.get(addr) as [Token, Token]
        const rPool = new ConstantProductRPool(addr, toks[0] as RToken, toks[1] as RToken, this.fee, res[0], res[1])
        const pc = new ConstantProductPoolCode(rPool, this.getPoolProviderName())
        this.pools.push({ poolCode: pc, fetchType: 'ON_DEMAND', updatedAtBlock: this.lastUpdateBlock })
        ++this.stateId
      } else {
        console.error(
          `${this.chainId}~${
            this.lastUpdateBlock
          }~${this.getType()} - ERROR ON DEMAND, Failed to fetch reserves for pool: ${addr}`
        )
      }
    })

    if (this.lastUpdateBlock === 0) this.lastUpdateBlock = await fetchBlockNumber()
  }

  _getPoolAddress(t1: Token, t2: Token): string {
    return getCreate2Address(
      this.factory[this.chainId as keyof typeof this.factory],
      keccak256(['bytes'], [pack(['address', 'address'], [t1.address, t2.address])]),
      this.initCodeHash[this.chainId as keyof typeof this.initCodeHash]
    )
  }

  // TODO: Decide if this is worth keeping as fallback in case fetching top pools fails? only used on initial load.
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
    this.pools = []

    // TODO: this could be reused per chain basis, no reason to recreate it. Datafetcher could pass this in
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
    if (this.unwatchMulticall) this.unwatchMulticall()
    if (this.unwatchSyncEvents.size > 0) this.unwatchSyncEvents?.forEach((unwatch) => unwatch())
    // if (this.blockListener) this.chainDataProvider.off('block', this.blockListener)
    this.blockListener = undefined
  }
}
