import { ConstantProductRPool, RToken } from '@sushiswap/tines'
import { BigNumber, ethers } from 'ethers'
import { LiquidityProvider } from './LiquidityProvider'
import { getCreate2Address } from 'ethers/lib/utils'
import { keccak256, pack } from '@ethersproject/solidity'
import { SushiPoolABI } from '../../ABI/SushiPool'
import { Limited } from '../Limited'
import { PoolCode } from '../pools/PoolCode'
import { ConstantProductPoolCode } from '../pools/ConstantProductPool'
import { ChainId } from '@sushiswap/chain'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, Token } from '@sushiswap/currency'
import { FACTORY_ADDRESS, INIT_CODE_HASH } from '@sushiswap/amm'
import { LiquidityProvider2, LiquidityProviders } from './LiquidityProvider2'

export class SushiProvider2 extends LiquidityProvider2 {
  fetchedPools: Set<string>
  poolCodes: PoolCode[]
  lastPoolCodeNumber: number

  constructor(chainDataProvider: ethers.providers.BaseProvider, chainId: ChainId, l: Limited) {
    super(chainDataProvider, chainId, l)
    this.poolCodes = []
    this.lastPoolCodeNumber = 0
    this.fetchedPools = new Set()
  }

  getType(): LiquidityProviders {
    return LiquidityProviders.Sushiswap
  }

  getPoolProviderName(): string {return 'Sushiswap'}

  async getPools(tokens: Token[]): Promise<PoolCode[]> {
    if (FACTORY_ADDRESS[this.chainId] === undefined) {
      // No sushiswap for this network
      return []
    }
    const pools = await this._getAllPools(tokens)
    return pools
  }

  _getPoolAddress(t1: Token, t2: Token): string {
    const [token0, token1] = t1.address.toLowerCase() < t2.address.toLowerCase() ? [t1, t2] : [t2, t1]
    return getCreate2Address(
      FACTORY_ADDRESS[this.chainId],
      keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])]),
      INIT_CODE_HASH[this.chainId]
    )
  }

  async _getPoolData(t0: Token, t1: Token): Promise<PoolCode | undefined> {
    const [token0, token1] = t0.address.toLowerCase() < t1.address.toLowerCase() ? [t0, t1] : [t1, t0]
    const poolAddress = this._getPoolAddress(token0, token1)
    if (this.fetchedPools.has(poolAddress)) return // not to fetch it again
    this.fetchedPools.add(poolAddress)
    try {
      const pool = await new ethers.Contract(poolAddress, SushiPoolABI, this.chainDataProvider)
      const [reserve0, reserve1]: [BigNumber, BigNumber] = await this.limited.callOnce(() => pool.getReserves())
      const rPool = new ConstantProductRPool(poolAddress, token0 as RToken, token1 as RToken, 0.003, reserve0, reserve1)
      const pc = new ConstantProductPoolCode(rPool, this.getPoolProviderName())
      this.poolCodes.push(pc)
      return pc
    } catch (e) {
      return undefined
    }
  }

  async _getAllPools(tokens: Token[]): Promise<PoolCode[]> {
    const poolData: Promise<PoolCode | undefined>[] = []
    for (let i = 0; i < tokens.length; ++i) {
      for (let j = i + 1; j < tokens.length; ++j) {
        poolData.push(this._getPoolData(tokens[i], tokens[j]))
      }
    }
    const pools = await Promise.all(poolData)
    return pools.filter((p) => p !== undefined) as PoolCode[]
  }

  _getProspectiveTokens(t0: Token, t1:Token) {
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
    this.poolCodes = []
    this.lastPoolCodeNumber = 0
    this.fetchedPools.clear()
    this.getPools(BASES_TO_CHECK_TRADES_AGAINST[this.chainId]) // starting the process
  }
  fetchPoolsForToken(t0: Token, t1: Token): void {
    this.getPools(this._getProspectiveTokens(t0, t1))
  }
  poolListWereUpdated(): boolean {
    return this.lastPoolCodeNumber !== this.poolCodes.length
  }
  getCurrentPoolList(): PoolCode[] {
    this.lastPoolCodeNumber = this.poolCodes.length
    return this.poolCodes
  }
  stopFetchPoolsData() {}
}
