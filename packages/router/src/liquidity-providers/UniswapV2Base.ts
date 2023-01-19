import { keccak256, pack } from '@ethersproject/solidity'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@sushiswap/router-config'
import { ConstantProductRPool, RPool, RToken } from '@sushiswap/tines'
import type { ethers } from 'ethers'
import { getCreate2Address } from 'ethers/lib/utils'

import type { Limited } from '../Limited'
import { convertToBigNumberPair, MultiCallProvider } from '../MulticallProvider'
import { ConstantProductPoolCode } from '../pools/ConstantProductPool'
import type { PoolCode } from '../pools/PoolCode'
import { LiquidityProvider } from './LiquidityProvider'

const getReservesAbi = [
  {
    inputs: [],
    name: 'getReserves',
    outputs: [
      {
        internalType: 'uint112',
        name: '_reserve0',
        type: 'uint112',
      },
      {
        internalType: 'uint112',
        name: '_reserve1',
        type: 'uint112',
      },
      {
        internalType: 'uint32',
        name: '_blockTimestampLast',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export abstract class UniswapV2BaseProvider extends LiquidityProvider {
  fetchedPools: Map<string, number> = new Map()
  poolCodes: PoolCode[] = []
  blockListener?: () => void
  abstract factory: { [chainId: number]: string }
  abstract initCodeHash: { [chainId: number]: string }
  constructor(
    chainDataProvider: ethers.providers.BaseProvider,
    multiCallProvider: MultiCallProvider,
    chainId: ChainId,
    l: Limited
  ) {
    super(chainDataProvider, multiCallProvider, chainId, l)
  }
  async getPools(tokens: Token[]): Promise<void> {
    if (!(this.chainId in this.factory)) {
      // No sushiswap for this network
      this.lastUpdateBlock = -1
      return
    }

    // tokens deduplication
    const tokenMap = new Map<string, Token>()
    tokens.forEach((t) => tokenMap.set(t.address.toLocaleLowerCase().substring(2).padStart(40, '0'), t))
    const tokensDedup = Array.from(tokenMap.values())
    // tokens sorting
    const tok0: [string, Token][] = tokensDedup.map((t) => [
      t.address.toLocaleLowerCase().substring(2).padStart(40, '0'),
      t,
    ])
    tokens = tok0.sort((a, b) => (b[0] > a[0] ? -1 : 1)).map(([_, t]) => t)

    const poolAddr: Map<string, [Token, Token]> = new Map()
    for (let i = 0; i < tokens.length; ++i) {
      const t0 = tokens[i]
      for (let j = i + 1; j < tokens.length; ++j) {
        const t1 = tokens[j]

        const addr = this._getPoolAddress(t0, t1)
        if (this.fetchedPools.get(addr) === undefined) {
          poolAddr.set(addr, [t0, t1])
          this.fetchedPools.set(addr, 1)
        }
      }
    }

    const addrs = Array.from(poolAddr.keys())
    const reserves = convertToBigNumberPair(
      await this.multiCallProvider.multiContractCall(addrs, getReservesAbi, 'getReserves', [])
    )

    addrs.forEach((addr, i) => {
      const res = reserves[i]
      if (res !== undefined) {
        const toks = poolAddr.get(addr) as [Token, Token]
        const rPool = new ConstantProductRPool(addr, toks[0] as RToken, toks[1] as RToken, 0.003, res[0], res[1])
        const pc = new ConstantProductPoolCode(rPool, this.getPoolProviderName())
        this.poolCodes.push(pc)
        ++this.stateId
      }
    })

    // if it is the first obtained pool list
    if (this.lastUpdateBlock == 0) this.lastUpdateBlock = this.multiCallProvider.lastCallBlockNumber
  }
  // TODO: remove too often updates if the network generates too many blocks
  async updatePoolsData() {
    if (this.poolCodes.length == 0) return

    const poolAddr = new Map<string, RPool>()
    this.poolCodes.forEach((p) => poolAddr.set(p.pool.address, p.pool))
    const addrs = this.poolCodes.map((p) => p.pool.address)

    const reserves = convertToBigNumberPair(
      await this.multiCallProvider.multiContractCall(addrs, getReservesAbi, 'getReserves', [])
    )

    addrs.forEach((addr, i) => {
      const res = reserves[i]
      if (res !== undefined) {
        const pool = poolAddr.get(addr) as RPool
        if (!res[0].eq(pool.reserve0) || !res[1].eq(pool.reserve1)) {
          pool.updateReserves(res[0], res[1])
          ++this.stateId
        }
      }
    })

    this.lastUpdateBlock = this.multiCallProvider.lastCallBlockNumber
  }
  _getPoolAddress(t1: Token, t2: Token): string {
    return getCreate2Address(
      this.factory[this.chainId as keyof typeof this.factory],
      keccak256(['bytes'], [pack(['address', 'address'], [t1.address, t2.address])]),
      this.initCodeHash[this.chainId as keyof typeof this.initCodeHash]
    )
  }
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
    this.poolCodes = []
    this.fetchedPools.clear()
    this.getPools(BASES_TO_CHECK_TRADES_AGAINST[this.chainId]) // starting the process
    this.blockListener = () => {
      this.updatePoolsData()
    }
    this.chainDataProvider.on('block', this.blockListener)
  }
  fetchPoolsForToken(t0: Token, t1: Token): void {
    this.getPools(this._getProspectiveTokens(t0, t1))
  }
  getCurrentPoolList(): PoolCode[] {
    return this.poolCodes
  }
  stopFetchPoolsData() {
    if (this.blockListener) this.chainDataProvider.off('block', this.blockListener)
    this.blockListener = undefined
  }
}
