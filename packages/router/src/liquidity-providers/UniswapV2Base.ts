import { keccak256, pack } from '@ethersproject/solidity'
import { getReservesAbi } from '@sushiswap/abi'
import { ChainId, chainShortName } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@sushiswap/router-config'
import { ConstantProductRPool, RToken } from '@sushiswap/tines'
import { BigNumber } from 'ethers'
import { getCreate2Address } from 'ethers/lib/utils'
import { Address, Client, decodeHex, Hex, multicall, watchBlockNumber, watchEvent } from 'viem'

import { getPoolsByTokenIds, getTopPools } from '../lib/api'
import { ConstantProductPoolCode } from '../pools/ConstantProductPool'
import type { PoolCode } from '../pools/PoolCode'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'
interface PoolInfo {
  poolCode: PoolCode
  fetchType: 'INITIAL' | 'ON_DEMAND'
  updatedAtBlock: number
}

export abstract class UniswapV2BaseProvider extends LiquidityProvider {
  pools: Map<string, PoolInfo> = new Map()
  blockListener?: () => void
  unwatchBlockNumber?: () => void
  unwatchMulticall?: () => void
  unwatchSyncEvents: Map<string, () => void> = new Map()
  fee = 0.003
  isInitialized = false
  factory: { [chainId: number]: Address } = {}
  initCodeHash: { [chainId: number]: string } = {}
  constructor(
    chainId: ChainId,
    client: Client,
    factory: { [chainId: number]: Address },
    initCodeHash: { [chainId: number]: string }
  ) {
    super(chainId, client)
    this.factory = factory
    this.initCodeHash = initCodeHash
    if (!(chainId in this.factory) || !(chainId in this.initCodeHash)) {
      throw new Error(`${this.getType()} cannot be instantiated for chainid ${chainId}, no factory or initCodeHash`)
    }
  }
  readonly TOP_POOL_SIZE = 1000
  readonly TOP_POOL_LIQUIDITY_THRESHOLD = 5000
  readonly ON_DEMAND_POOL_SIZE = 20

  async initialize(blockNumber: number) {
    this.isInitialized = true
    const type = this.getType()

    const topPools = await getTopPools(
      this.chainId,
      type === LiquidityProviders.UniswapV2 ? 'Uniswap' : type,
      type === LiquidityProviders.SushiSwap ? 'LEGACY' : 'V2',
      ['CONSTANT_PRODUCT_POOL'],
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

    const pools = Array.from(topPools.values())

    // const reserves = await readContracts({
    //   allowFailure: true,
    //   contracts: pools.map((pool) => ({
    //     address: pool.address as Address,
    //     chainId: this.chainId,
    //     abi: getReservesAbi,
    //     functionName: 'getReserves',
    //   })),
    // })

    const results = await multicall(this.client, {
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

    pools.map((pool, i) => {
      // const res = reserves[i]

      // results[i].error && console.error(results[i].error)

      const res0 = results?.[i]?.result?.[0]
      const res1 = results?.[i]?.result?.[1]

      if (res0 && res1) {
        const toks = [pool.token0, pool.token1]

        const rPool = new ConstantProductRPool(
          pool.address,
          toks[0] as RToken,
          toks[1] as RToken,
          this.fee,
          BigNumber.from(res0),
          BigNumber.from(res1)
        )
        const pc = new ConstantProductPoolCode(rPool, this.getPoolProviderName())
        this.pools.set(pool.address, { poolCode: pc, fetchType: 'INITIAL', updatedAtBlock: blockNumber })
        ++this.stateId
      } else {
        console.error(
          `${chainShortName[this.chainId]}/${this.chainId}~${
            this.lastUpdateBlock
          }~${this.getType()} - ERROR INIT SYNC, Failed to fetch reserves for pool: ${pool.address}`
        )
      }
    })

    this.pools.forEach((p) => {
      const pool = p.poolCode.pool
      if (this.unwatchSyncEvents.has(pool.address)) return
      console.log('Set watch event for pool: ', pool.address)
      this.unwatchSyncEvents.set(
        pool.address,
        watchEvent(this.client, {
          batch: true,
          pollingInterval: 1_000,
          address: pool.address as Address,
          event: 'Sync(uint112 reserve0, uint112 reserve1)',
          onLogs: (logs) => {
            logs.forEach((log) => {
              const res0 = BigNumber.from(decodeHex(log.data.slice(0, 66) as Hex, 'bigint'))
              const res1 = BigNumber.from(
                decodeHex(log.data.slice(0, 2).concat(log.data.slice(66, 130)) as Hex, 'bigint')
              )
              console.debug(
                `${chainShortName[this.chainId]}/${this.chainId}~${log.blockNumber}~${type} - SYNC ${
                  p.poolCode.poolName
                }, ${pool.token0.symbol}/${pool.token1.symbol}.`
              )

              pool.updateReserves(res0, res1)
              p.updatedAtBlock = Number(log.blockNumber)
            })
          },
          onError: (error) => {
            console.log('LOGS ERROR', error)
          },
        })

        // watchContractEvent(
        //   {
        //     address: pool.address as Address,
        //     abi: syncAbi,
        //     eventName: 'Sync',
        //     chainId: this.chainId,
        //   },
        //   (reserve0, reserve1) => {
        //     const res0 = BigNumber.from(reserve0)
        //     const res1 = BigNumber.from(reserve1)
        //     console.debug(
        //       `${chainShortName[this.chainId]}/${this.chainId}~${this.lastUpdateBlock}~${type} - SYNC ${
        //         p.poolCode.poolName
        //       }, ${pool.token0.symbol}/${pool.token1.symbol}.`
        //     )
        //     pool.updateReserves(res0, res1)
        //     p.updatedAtBlock = blockNumber
        //   }
        // )
      )
    })

    console.debug(
      `${chainShortName[this.chainId]}/${this.chainId}~${this.lastUpdateBlock}~${this.getType()} - INIT, WATCHING ${
        this.pools.size
      } POOLS`
    )
  }

  async getPools(t0: Token, t1: Token): Promise<void> {
    // if (!(this.chainId in this.factory)) {
    //   // No sushiswap for this network
    //   this.lastUpdateBlock = -1
    //   return
    // }
    console.debug(`****** ${this.getType()} POOLS IN MEMORY:`, this.pools.size)

    const type = this.getType()

    const poolsOnDemand = await getPoolsByTokenIds(
      this.chainId,
      type === LiquidityProviders.UniswapV2 ? 'Uniswap' : type,
      type === LiquidityProviders.SushiSwap ? 'LEGACY' : 'V2',
      ['CONSTANT_PRODUCT_POOL'],
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

    // const reserves = await readContracts({
    //   allowFailure: true,
    //   contracts: pools.map((pool) => ({
    //     address: pool.address as Address,
    //     chainId: this.chainId,
    //     abi: getReservesAbi,
    //     functionName: 'getReserves',
    //   })),
    // })

    const results = await multicall(this.client, {
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

    pools.map((pool, i) => {
      const res0 = results?.[i]?.result?.[0]
      const res1 = results?.[i]?.result?.[1]

      if (res0 && res1) {
        const toks = [pool.token0, pool.token1]
        const rPool = new ConstantProductRPool(
          pool.address,
          toks[0] as RToken,
          toks[1] as RToken,
          this.fee,
          BigNumber.from(res0),
          BigNumber.from(res1)
        )
        const pc = new ConstantProductPoolCode(rPool, this.getPoolProviderName())
        this.pools.set(pool.address, { poolCode: pc, fetchType: 'ON_DEMAND', updatedAtBlock: this.lastUpdateBlock })
        ++this.stateId
      } else {
        console.error(
          `${chainShortName[this.chainId]}/${this.chainId}~${
            this.lastUpdateBlock
          }~${this.getType()} - ERROR ON DEMAND, Failed to fetch reserves for pool: ${pool.address}`
        )
      }
    })
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
    this.pools = new Map()

    this.unwatchBlockNumber = watchBlockNumber(this.client, {
      onBlockNumber: (blockNumber) => {
        this.lastUpdateBlock = Number(blockNumber)
        this.removeStalePools(Number(blockNumber))

        if (!this.isInitialized) {
          this.initialize(Number(blockNumber))
        }
      },
    })
  }

  private removeStalePools(blockNumber: number) {
    // TODO: move this to a per-chain config?
    const blockThreshold = blockNumber - 75
    let removed = 0

    for (const [k, v] of this.pools) {
      if (v.updatedAtBlock < blockThreshold && v.fetchType === 'ON_DEMAND') {
        removed++
        this.pools.delete(k)
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
    return [...this.pools.values()].map((p) => p.poolCode)
  }

  stopFetchPoolsData() {
    if (this.unwatchBlockNumber) this.unwatchBlockNumber()
    if (this.unwatchSyncEvents.size > 0) this.unwatchSyncEvents?.forEach((unwatch) => unwatch())
    // if (this.blockListener) this.chainDataProvider.off('block', this.blockListener)
    this.blockListener = undefined
  }
}
