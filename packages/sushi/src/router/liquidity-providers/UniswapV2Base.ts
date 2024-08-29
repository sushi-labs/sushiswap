import type { Address, Hex, PublicClient } from 'viem'
import { encodePacked, keccak256 } from 'viem/utils'
import { getReservesAbi } from '../../abi/index.js'
import { getCreate2Address } from '../../address/getCreate2Address.js'
import { ChainId } from '../../chain/index.js'
import { Token } from '../../currency/index.js'
import { ConstantProductRPool, type RToken } from '../../tines/index.js'
import { getCurrencyCombinations } from '../get-currency-combinations.js'
import { ConstantProductPoolCode, type PoolCode } from '../pool-codes/index.js'
import { baseAgainstTokensForPair } from '../routingBases.js'
import { LiquidityProvider } from './LiquidityProvider.js'

interface StaticPool {
  address: Address
  token0: Token
  token1: Token
  fee: number
}

export abstract class UniswapV2BaseProvider extends LiquidityProvider {
  pools: Map<Address, PoolCode> = new Map()

  blockListener?: (() => void) | undefined
  unwatchBlockNumber?: () => void

  fee = 0.003
  factory: Record<number, Address> = {}
  initCodeHash: Record<number, Hex> = {}

  constructor(
    chainId: ChainId,
    web3Client: PublicClient,
    factory: Record<number, Address>,
    initCodeHash: Record<number, Hex>,
    isTest = false,
  ) {
    super(chainId, web3Client, isTest)
    this.factory = factory
    this.initCodeHash = initCodeHash
    if (!(chainId in this.factory) || !(chainId in this.initCodeHash)) {
      throw new Error(
        `${this.getType()} cannot be instantiated for chainid ${chainId}, no factory or initCodeHash`,
      )
    }
  }

  _getPoolAddress(t1: Token, t2: Token): Address {
    return getCreate2Address({
      from: this.factory[this.chainId as keyof typeof this.factory]!,
      salt: keccak256(
        encodePacked(
          ['address', 'address'],
          [t1.address as Address, t2.address as Address],
        ),
      ),
      bytecodeHash:
        this.initCodeHash[this.chainId as keyof typeof this.initCodeHash]!,
      chainId: this.chainId,
    })
  }

  _getProspectiveTokens(t0: Token, t1: Token) {
    return [...baseAgainstTokensForPair(t0, t1, false), t0, t1]
  }

  getStaticPools(t1: Token, t2: Token): StaticPool[] {
    const currencyCombination = getCurrencyCombinations(
      this.chainId,
      t1,
      t2,
    ).map(([c0, c1]) => (c0.sortsBefore(c1) ? [c0, c1] : [c1, c0]))
    return currencyCombination.map((combination) => ({
      address: this._getPoolAddress(combination[0]!, combination[1]!),
      token0: combination[0]!,
      token1: combination[1]!,
      fee: this.fee,
    }))
  }

  startFetchPoolsData() {
    this.stopFetchPoolsData()
    this.unwatchBlockNumber = this.client.watchBlockNumber({
      onBlockNumber: (blockNumber) => {
        this.lastUpdateBlock = Number(blockNumber)
      },
      onError: (error) => {
        console.error(
          `${this.getLogPrefix()} - Error watching block number: ${
            error.message
          }`,
        )
      },
    })
  }

  async fetchPoolsForToken(
    t0: Token,
    t1: Token,
    excludePools?: Set<string>,
  ): Promise<void> {
    let pools = this.getStaticPools(t0, t1)
    if (excludePools)
      pools = (pools as StaticPool[]).filter(
        (p) => !excludePools.has(p.address),
      )
    if (pools.length === 0) {
      return
    }

    const poolCodesToCreate: PoolCode[] = []
    pools.forEach((pool) => {
      const existingPool = this.pools.get(pool.address)
      if (existingPool === undefined) {
        const token0 = pool.token0 as RToken
        const token1 = pool.token1 as RToken

        const rPool = new ConstantProductRPool(
          pool.address,
          token0,
          token1,
          this.fee,
          0n,
          0n,
        )
        const pc = new ConstantProductPoolCode(
          rPool,
          this.getType(),
          this.getPoolProviderName(),
        )
        poolCodesToCreate.push(pc)
      }
    })

    const reserves = await this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3
          ?.address as Address,
        allowFailure: true,
        contracts: poolCodesToCreate.map(
          (poolCode) =>
            ({
              address: poolCode.pool.address as Address,
              chainId: this.chainId,
              abi: getReservesAbi,
              functionName: 'getReserves',
            }) as const,
        ),
      })
      .catch((e) => {
        console.warn(
          `${this.getLogPrefix()} - UPDATE: on-demand pools multicall failed, message: ${
            e.message
          }`,
        )
        return undefined
      })

    poolCodesToCreate.forEach((poolCode, i) => {
      const pool = poolCode.pool
      const res0 = reserves?.[i]?.result?.[0]
      const res1 = reserves?.[i]?.result?.[1]

      if (res0 !== undefined && res1 !== undefined) {
        pool.updateReserves(res0, res1)
        this.pools.set(pool.address, poolCode)
      } else {
        // Pool doesn't exist?
        // console.error(`${this.getLogPrefix()} - ERROR FETCHING RESERVES, initialize on demand pool: ${pool.address}`)
      }
    })
  }

  getCurrentPoolList(): PoolCode[] {
    return Array.from(this.pools.values())
  }

  stopFetchPoolsData() {
    if (this.unwatchBlockNumber) this.unwatchBlockNumber()
    this.blockListener = undefined
  }
}
