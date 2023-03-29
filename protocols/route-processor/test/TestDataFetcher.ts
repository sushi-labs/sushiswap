import { ChainId, Type } from '@sushiswap/chain'
import { Currency, Native, Token } from '@sushiswap/currency'
import { PoolCode } from '@sushiswap/router/dist/pools/PoolCode'
import { computePairAddress, FACTORY_ADDRESS } from '@sushiswap/amm'
import { uniswapV2FactoryAddress, UniswapV2FactoryChainId, UniswapV2Router02ChainId } from '@sushiswap/sushiswap'
import { constantProductPoolAbi, uniswapV2PairAbi } from '@sushiswap/abi'
import { ethers } from 'hardhat'
import { BridgeUnlimited, ConstantProductRPool, RToken } from '@sushiswap/tines'
import { ConstantProductPoolCode } from '@sushiswap/router/dist/pools/ConstantProductPool'
import { BigNumber } from 'ethers'
import { LiquidityProviders } from '@sushiswap/router'
import { NativeWrapBridgePoolCode } from '@sushiswap/router/dist/pools/NativeWrapBridge'
import {
  constantProductPoolFactoryAbi,
  constantProductPoolFactoryAddress,
  ConstantProductPoolFactoryChainId,
} from '@sushiswap/trident'

interface PoolData {
  address: string
  token0: Token
  token1: Token
}

export class TestDataFetcher {
  static async getPairs(
    chainId: ChainId,
    provider: any,
    liquidityProvider: LiquidityProviders,
    currencies: [Currency, Currency][]
  ) {
    // Native wrap bridge is always included
    const nativeWrapBridge = new BridgeUnlimited(
      Native.onChain(chainId).wrapped.address,
      {
        address: '',
        name: Native.onChain(chainId).name,
        symbol: Native.onChain(chainId).symbol,
        chainId: chainId,
      } as RToken,
      Native.onChain(chainId).wrapped as RToken,
      0,
      50_000
    )

    if (liquidityProvider === LiquidityProviders.SushiSwap) {
      const result = await this.getV2Pairs(chainId, provider, liquidityProvider, currencies)
      result.set(
        nativeWrapBridge.address,
        new NativeWrapBridgePoolCode(nativeWrapBridge, LiquidityProviders.NativeWrap)
      )
      return result
    } else if (liquidityProvider === LiquidityProviders.Trident) {
      const result = await this.getTridentPairs(chainId, provider, liquidityProvider, currencies)
      result.set(
        nativeWrapBridge.address,
        new NativeWrapBridgePoolCode(nativeWrapBridge, LiquidityProviders.NativeWrap)
      )
      return result
      // }
      //  else if (liquidityProvider === LiquidityProviders.UniswapV3) {
      //   return
    } else {
      throw new Error(`liquidity provider: ${liquidityProvider} is not supported.`)
    }
  }

  private static async getV2Pairs(
    chainId: ChainId,
    provider: any,
    liquidityProvider: LiquidityProviders,
    currencies: [Currency, Currency][]
  ): Promise<Map<string, PoolCode>> {
    const filtered = currencies.filter((currencies): currencies is [Currency, Currency] => {
      const [currencyA, currencyB] = currencies
      return Boolean(
        currencyA &&
          currencyB &&
          currencyA.chainId === currencyB.chainId &&
          !currencyA.wrapped.equals(currencyB.wrapped)
      )
    })

    const poolData = filtered.map(([currencyA, currencyB]) => {
      const address = computePairAddress({
        factoryAddress: FACTORY_ADDRESS[chainId],
        tokenA: currencyA.wrapped,
        tokenB: currencyB.wrapped,
      })
      return {
        address,
        token0: currencyA.wrapped,
        token1: currencyB.wrapped,
      }
    })

    const contracts = poolData.map((pool) => new ethers.Contract(pool.address, uniswapV2PairAbi, provider))
    // console.log(contracts[0].address)
    const reserves = await Promise.all(
      contracts.map((contract) => contract.getReserves().catch(() => [BigNumber.from(0), BigNumber.from(0)]))
    )
    // console.log({reserves})

    // console.log(contracts[0].interface.functions)
    // const reserves = await contracts[0].getReserves()
    const poolCodesMap = new Map<string, PoolCode>()
    poolData.forEach((pool, i) => {
      const [_reserve0, _reserve1] = reserves[i]
      if (_reserve0.isZero() || _reserve1.isZero()) return
      const rPool = new ConstantProductRPool(
        pool.address,
        pool.token0 as RToken,
        pool.token1 as RToken,
        0.003,
        _reserve0,
        _reserve1
      )
      const pc = new ConstantProductPoolCode(rPool, liquidityProvider, liquidityProvider)
      poolCodesMap.set(rPool.address, pc)
    })

    return poolCodesMap
  }

  private static async getTridentPairs(
    chainId: ChainId,
    provider: any,
    liquidityProvider: LiquidityProviders,
    currencies: [Currency, Currency][]
  ): Promise<Map<string, PoolCode>> {
    const contract = new ethers.Contract(
      constantProductPoolFactoryAddress?.[chainId as ConstantProductPoolFactoryChainId],
      constantProductPoolFactoryAbi?.[chainId as ConstantProductPoolFactoryChainId],
      provider
    )

    const _pairsUnique = pairsUnique(currencies)
    const _pairsUniqueAddr = _pairsUnique.map(([t0, t1]) => [t0.address, t1.address])

    const callStatePoolsCount = await Promise.all(_pairsUniqueAddr.map((el) => contract.poolsCount(el[0], el[1])))

    const callStatePoolsCountProcessed =
      callStatePoolsCount
        ?.map((s, i) => [i, s ? parseInt(s.toString()) : 0] as [number, number])
        .filter(([, length]) => length)
        .map(
          ([i, length]) =>
            [_pairsUniqueAddr[i][0], _pairsUniqueAddr[i][1], BigNumber.from(0), BigNumber.from(length)] as const
        ) ?? []

    const pairsUniqueProcessed = callStatePoolsCount
      ?.map((s, i) => [i, s ? parseInt(s.toString()) : 0] as [number, number])
      .filter(([, length]) => length)
      .map(([i]) => [_pairsUnique[i][0], _pairsUnique[i][1]])
    // console.log({ callStatePoolsCountProcessed })

    const getPools = await Promise.all(callStatePoolsCountProcessed.map((args) => contract.getPools(...args)))

    const poolData: PoolData[] = []
    getPools?.forEach((s, i) => {
      if (s !== undefined)
        s?.forEach((address: string) => {
          poolData.push({
            address: address,
            token0: pairsUniqueProcessed?.[i][0] as Token,
            token1: pairsUniqueProcessed?.[i][1] as Token,
          })
        })
    })

    const poolContracts = poolData.map((pool) => new ethers.Contract(pool.address, constantProductPoolAbi, provider))

    const [reserves, fee] = await Promise.all([
      Promise.all(poolContracts.map((contract) => contract.getReserves())),
      Promise.all(poolContracts.map((contract) => contract.swapFee())),
    ])

    const poolCodesMap = new Map<string, PoolCode>()
    poolData.forEach((pool, i) => {
      const [_reserve0, _reserve1] = reserves[i]

      if (_reserve0.lt(BigNumber.from(1000)) || _reserve1.lt(BigNumber.from(1000)) || !fee[i]) return
      const rPool = new ConstantProductRPool(
        pool.address,
        convertTokenToBento(pool.token0) as RToken,
        convertTokenToBento(pool.token1) as RToken,
        fee[i] / 10_000,
        _reserve0,
        _reserve1
      )
      const pc = new ConstantProductPoolCode(rPool, liquidityProvider, liquidityProvider)
      poolCodesMap.set(rPool.address, pc)
    })


    // STABLES

    return poolCodesMap
  }
}

const pairsUnique = (currencies: [Currency | undefined, Currency | undefined][]) => {
  const pairsMap = new Map<string, [Token, Token]>()
  currencies.map(([c1, c2]) => {
    if (c1 && c2) {
      const addr1 = c1.wrapped.address as string | undefined
      const addr2 = c2.wrapped.address as string | undefined
      if (addr1 !== undefined && addr2 !== undefined) {
        if (addr1.toLowerCase() < addr2.toLowerCase()) pairsMap.set(addr1 + addr2, [c1, c2] as [Token, Token])
        else pairsMap.set(addr2 + addr1, [c2, c1] as [Token, Token])
      }
    }
  })
  return Array.from(pairsMap.values())
}

function convertTokenToBento(token: Token): RToken {
  const t: RToken = { ...token } as RToken
  t.chainId = getBentoChainId(token.chainId)
  t.name = getBentoChainId(token.name)
  t.symbol = getBentoChainId(token.symbol)
  delete t.tokenId
  return t
}

function getBentoChainId(chainId: string | number | undefined): string {
  return `Bento ${chainId}`
}
