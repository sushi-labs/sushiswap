// @ts-nocheck

import { ChainId } from '@sushiswap/chain'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, Token } from '@sushiswap/currency'
import { BridgeBento, ConstantProductRPool, RToken } from '@sushiswap/tines'
import { BigNumber, Contract, ethers } from 'ethers'

import { BentoBoxABI } from '../abi/BentoBoxABI'
import { ConstantProductPoolABI } from '../abi/ConstantProductPoolABI'
import { ConstantProductPoolFactoryABI } from '../abi/ConstantProductPoolFactoryABI'
import { ERC20ABI } from '../abi/ERC20'
import type { Limited } from '../Limited'
import { BentoBridgePoolCode } from '../pools/BentoBridge'
import { BentoConstantProductPoolCode } from '../pools/BentoconstantProductPool'
import type { PoolCode } from '../pools/PoolCode'
import { LiquidityProvider } from './LiquidityProvider'

const ConstantProductPoolFactory: Record<string | number, string> = {
  [ChainId.POLYGON]: '0x05689fCfeE31FCe4a67FbC7Cab13E74F80A4E288',
}

export const BentoBox: Record<string | number, string> = {
  [ChainId.POLYGON]: '0x0319000133d3AdA02600f0875d2cf03D442C3367',
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

function sortTokens(tokens: Token[]): Token[] {
  const t1: [Token, BigNumber][] = tokens.map((t) => [t, BigNumber.from(t.address)])
  t1.sort(([, a0], [, a1]) => {
    if (a0.lt(a1)) return -1
    if (a0.eq(a1)) return 0
    return 1
  })
  return t1.map(([t]) => t)
}

export class TridentProvider extends LiquidityProvider {
  pools: Map<string, PoolCode>
  poolCodes: PoolCode[]
  lastPoolCodeNumber: number

  constructor(chainDataProvider: ethers.providers.BaseProvider, chainId: ChainId, l: Limited) {
    super(chainDataProvider, chainId, l)
    this.pools = new Map<string, PoolCode>()
    this.poolCodes = []
    this.lastPoolCodeNumber = 0
  }

  getPoolProviderName(): string {
    return 'Trident'
  }

  async getPools(t0: Token, t1: Token): Promise<PoolCode[]> {
    if (ConstantProductPoolFactory[this.chainId] === undefined) {
      // No trident for this network
      return []
    }
    const tokens = this._getAllRouteTokens(t0, t1)
    const tridentPools = await this._getAllPools(tokens)
    const bridges = await this._getAllBridges(tokens, tridentPools)
    const pools = tridentPools.concat(bridges)

    pools.forEach((p) => this.pools.set(p.pool.address, p))
    return pools
  }

  async _getTokenPaiPoolCodes(t0: Token, t1: Token, factory: Contract): Promise<PoolCode[]> {
    const pools: PoolCode[] = []
    const paiPoolCodesCount = await this.limited.call(() => factory.poolsCount(t0.address, t1.address))
    if (paiPoolCodesCount == 0) return []
    const paiPoolCodes: string[] = await this.limited.call(() =>
      factory.getPools(t0.address, t1.address, 0, paiPoolCodesCount)
    )
    for (let k = 0; k < paiPoolCodes.length; ++k) {
      const poolAddress = paiPoolCodes[k]
      const poolContract = await new ethers.Contract(poolAddress, ConstantProductPoolABI, this.chainDataProvider)
      const [res0, res1]: [BigNumber, BigNumber] = await this.limited.call(() => poolContract.getReserves())
      const fee: BigNumber = await this.limited.call(() => poolContract.swapFee())
      const pool = new ConstantProductRPool(
        poolAddress,
        convertTokenToBento(t0),
        convertTokenToBento(t1),
        parseInt(fee.toString()) / 10_000,
        res0,
        res1
      )
      const poolCode = new BentoConstantProductPoolCode(pool, this.getPoolProviderName())
      pools.push(poolCode)
      this.poolCodes.push(poolCode)
    }
    return pools
  }

  async _getAllPools(tokens: Token[]): Promise<PoolCode[]> {
    const factory = await new Contract(
      ConstantProductPoolFactory[this.chainId],
      ConstantProductPoolFactoryABI,
      this.chainDataProvider
    )
    const promises: Promise<PoolCode[]>[] = []
    const tokensSorted = sortTokens(tokens)
    for (let i = 0; i < tokensSorted.length; ++i) {
      for (let j = i + 1; j < tokensSorted.length; ++j) {
        promises.push(this._getTokenPaiPoolCodes(tokensSorted[i], tokensSorted[j], factory))
      }
    }
    const poolArrays = await Promise.all(promises)
    const pools = poolArrays.reduce((a, b) => a.concat(b), [])
    return pools
  }

  _getAllBentoTokens(pools: PoolCode[]): RToken[] {
    const tokenBentoMap = new Map<string, RToken>()
    pools.forEach((p) => {
      tokenBentoMap.set(p.pool.token0.tokenId as string, p.pool.token0)
      tokenBentoMap.set(p.pool.token1.tokenId as string, p.pool.token1)
    })

    return Array.from(tokenBentoMap.values())
  }

  async _getAllBridges(tokens: Token[], poolCodes: PoolCode[]): Promise<PoolCode[]> {
    const tokenBentoMap = new Map<string, RToken>()
    poolCodes.forEach((p) => {
      tokenBentoMap.set(p.pool.token0.tokenId as string, p.pool.token0)
      tokenBentoMap.set(p.pool.token1.tokenId as string, p.pool.token1)
    })

    const tokenOutputMap = new Map<string, Token>()
    tokens.forEach((t) => tokenOutputMap.set(t.address, t))

    const BentoContract = await new Contract(BentoBox[this.chainId], BentoBoxABI, this.chainDataProvider)
    const promises = Array.from(tokenBentoMap.values()).map(async (t) => {
      const totals: { elastic: BigNumber; base: BigNumber } = await this.limited.call(() =>
        BentoContract.totals(t.address)
      )
      const TokenContract = await new Contract(t.address, ERC20ABI, this.chainDataProvider)
      const max: BigNumber = await this.limited.call(() => TokenContract.balanceOf(BentoBox[this.chainId]))
      const pool = new BridgeBento(
        `Bento bridge for ${t.symbol}`,
        tokenOutputMap.get(t.address) as RToken,
        t,
        totals.elastic,
        totals.base,
        max
      )
      const br = new BentoBridgePoolCode(pool, this.getPoolProviderName(), BentoBox[this.chainId])
      this.poolCodes.push(br)
      return br
    })

    return await Promise.all(promises)
  }

  _getAllRouteTokens(t1: Token, t2: Token) {
    const set = new Set<Token>([
      t1,
      t2,
      ...BASES_TO_CHECK_TRADES_AGAINST[this.chainId],
      ...(ADDITIONAL_BASES[this.chainId][t1.address] || []),
      ...(ADDITIONAL_BASES[this.chainId][t2.address] || []),
    ])
    return Array.from(set)
  }

  startGetherData(t0: Token, t1: Token) {
    this.poolCodes = []
    this.lastPoolCodeNumber = 0
    this.getPools(t0, t1) // starting the process
  }
  poolListWereUpdated(): boolean {
    return this.lastPoolCodeNumber !== this.poolCodes.length
  }
  getCurrentPoolList(): PoolCode[] {
    this.lastPoolCodeNumber = this.poolCodes.length
    return this.poolCodes
  }
  stopGetherData() {}
}
