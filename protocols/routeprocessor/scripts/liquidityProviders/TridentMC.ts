import { ChainId } from '@sushiswap/chain'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, Token } from '@sushiswap/currency'
import { BridgeBento, ConstantProductRPool, RToken } from '@sushiswap/tines'
import { BigNumber, Contract, ethers } from 'ethers'

import { BentoBoxABI } from '../../ABI/BentoBoxABI'
import { ConstantProductPoolABI } from '../../ABI/ConstantProductPoolABI'
import { ConstantProductPoolFactoryABI } from '../../ABI/ConstantProductPoolFactoryABI'
import { ERC20ABI } from '../../ABI/ERC20'
import { Limited } from '../Limited'
import { convertToBigNumberPair, convertToNumbers, MultiCallProvider } from '../MulticallProvider'
import { BentoBridgePoolCode } from '../pools/BentoBridge'
import { BentoConstantProductPoolCode } from '../pools/BentoconstantProductPool'
import { PoolCode } from '../pools/PoolCode'
import { LiquidityProviderMC, LiquidityProviders } from './LiquidityProviderMC'

const ConstantProductPoolFactory: Record<string | number, string> = {
  [ChainId.POLYGON]: '0x05689fCfeE31FCe4a67FbC7Cab13E74F80A4E288',
}

export const BentoBox: Record<string | number, string> = {
  [ChainId.POLYGON]: '0x0319000133d3AdA02600f0875d2cf03D442C3367',
}

const poolsCountABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token0',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token1',
        type: 'address',
      },
    ],
    name: 'poolsCount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'count',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const getPoolsABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token0',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token1',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'startIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'count',
        type: 'uint256',
      },
    ],
    name: 'getPools',
    outputs: [
      {
        internalType: 'address[]',
        name: 'pairPools',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const getReservesABI = [
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

const swapFeeABI = [
  {
    inputs: [],
    name: 'swapFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

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

// function sortTokens(tokens: Token[]): Token[] {
//   const t1: [Token, BigNumber][] = tokens.map((t) => [t, BigNumber.from(t.address)])
//   t1.sort(([, a0], [, a1]) => {
//     if (a0.lt(a1)) return -1
//     if (a0.eq(a1)) return 0
//     return 1
//   })
//   return t1.map(([t]) => t)
// }

export class TridentProviderMC extends LiquidityProviderMC {
  fetchedPairs: Set<string> = new Set()

  //pools: Map<string, PoolCode> = new Map()
  poolCodes: PoolCode[] = []

  constructor(
    chainDataProvider: ethers.providers.BaseProvider,
    multiCallProvider: MultiCallProvider,
    chainId: ChainId,
    l: Limited
  ) {
    super(chainDataProvider, multiCallProvider, chainId, l)
  }

  getType(): LiquidityProviders {
    return LiquidityProviders.Trident
  }

  getPoolProviderName(): string {
    return 'Trident'
  }

  getPools(tokens: Token[]) {
    if (ConstantProductPoolFactory[this.chainId] === undefined) {
      // No trident for this network
      return []
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
    const tokensSorted = tok0.sort((a, b) => (b[0] > a[0] ? -1 : 1)).map(([_, t]) => t)

    const tridentPools = this.getAllTridentPools(tokensSorted)
    //const bridges = this.getAllBridges(tokensSorted)
  }

  // async _getTokenPaiPoolCodes(t0: Token, t1: Token, factory: Contract): Promise<PoolCode[]> {
  //   const pools: PoolCode[] = []
  //   const paiPoolCodesCount = await this.limited.call(() => factory.poolsCount(t0.address, t1.address))
  //   if (paiPoolCodesCount == 0) return []
  //   const paiPoolCodes: string[] = await this.limited.call(() =>
  //     factory.getPools(t0.address, t1.address, 0, paiPoolCodesCount)
  //   )
  //   for (let k = 0; k < paiPoolCodes.length; ++k) {
  //     const poolAddress = paiPoolCodes[k]
  //     const poolContract = await new ethers.Contract(poolAddress, ConstantProductPoolABI, this.chainDataProvider)
  //     const [res0, res1]: [BigNumber, BigNumber] = await this.limited.call(() => poolContract.getReserves())
  //     const fee: BigNumber = await this.limited.call(() => poolContract.swapFee())
  //     const pool = new ConstantProductRPool(
  //       poolAddress,
  //       convertTokenToBento(t0),
  //       convertTokenToBento(t1),
  //       parseInt(fee.toString()) / 10_000,
  //       res0,
  //       res1
  //     )
  //     const poolCode = new BentoConstantProductPoolCode(pool, this.getPoolProviderName())
  //     pools.push(poolCode)
  //     this.poolCodes.push(poolCode)
  //   }
  //   return pools
  // }

  async getAllTridentPools(tokensSorted: Token[]): Promise<PoolCode[]> {
    // create token map: token address => token
    const tokenMap: Map<string, Token> = new Map()
    tokensSorted.forEach((t) => tokenMap.set(t.address, t))

    // create tokens pairs that were not fetched before
    const tokenPairs: [string, string][] = []
    for (let i = 0; i < tokensSorted.length; ++i) {
      for (let j = i + 1; j < tokensSorted.length; ++j) {
        const pair = `${tokensSorted[i].address}_${tokensSorted[j].address}`
        if (this.fetchedPairs.has(pair)) continue
        tokenPairs.push([tokensSorted[i].address, tokensSorted[j].address])
        this.fetchedPairs.add(pair)
      }
    }

    // fetch pairs' poolsCount
    const poolCounts = convertToNumbers(
      await this.multiCallProvider.multiDataCall(
        ConstantProductPoolFactory[this.chainId],
        poolsCountABI,
        'poolsCount',
        tokenPairs
      )
    )

    // fetch poolsList for pairs with not-zero poolCount
    const tokenPairs2 = tokenPairs
      .map(([t0, t1], i) => [t0, t1, poolCounts[i] as number])
      .filter(([_t0, _t1, n]) => n > 0) as [string, string, number][]
    const poolLists = await this.multiCallProvider.multiDataCall(
      ConstantProductPoolFactory[this.chainId],
      getPoolsABI,
      'getPools',
      tokenPairs2.map(([t0, t1, n]) => [t0, t1, 0, n])
    )

    // Create poolMap
    const poolMap: Map<string, [Token, Token]> = new Map()
    poolLists.forEach((pools, i) => {
      const tokens: [Token, Token] = [
        tokenMap.get(tokenPairs2[i][0]) as Token,
        tokenMap.get(tokenPairs2[i][1]) as Token,
      ]
      pools.forEach((pool: string) => poolMap.set(pool, tokens))
    })

    // fetch getReserves and swapFee for all pools
    const poolAddr: string[] = Array.from(poolMap.keys())
    const poolReservePromise = this.multiCallProvider.multiContractCall(poolAddr, getReservesABI, 'getReserves', [])
    const swapFeePromise = this.multiCallProvider.multiContractCall(poolAddr, swapFeeABI, 'swapFee', [])
    const [poolRes0, poolFee0] = await Promise.all([poolReservePromise, swapFeePromise])
    const poolRes = convertToBigNumberPair(poolRes0)
    const poolFee = convertToNumbers(poolFee0)

    // create poolCodes
    const poolCodes = poolAddr.map((addr, i) => {
      const tokens = poolMap.get(addr) as [Token, Token]
      const pool = new ConstantProductRPool(
        addr,
        convertTokenToBento(tokens[0]),
        convertTokenToBento(tokens[1]),
        parseInt(poolFee[i].toString()) / 10_000,
        poolRes[i][0],
        poolRes[i][1]
      )
      return new BentoConstantProductPoolCode(pool, this.getPoolProviderName())
    })

    return poolCodes
  }

  /*_getAllBentoTokens(pools: PoolCode[]): RToken[] {
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
  }*/

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
    this.fetchedPairs.clear()
    this.getPools(BASES_TO_CHECK_TRADES_AGAINST[this.chainId]) // starting the process
  }
  fetchPoolsForToken(t0: Token, t1: Token): void {
    this.getPools(this._getProspectiveTokens(t0, t1))
  }
  getCurrentPoolList(): PoolCode[] {
    return this.poolCodes
  }
  stopFetchPoolsData() {}
}
