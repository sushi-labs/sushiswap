import { Fee, Pool } from '@sushiswap/base-sdk'
import { Token } from '@sushiswap/currency'
import { ConstantProductRPool, RPool, RToken, StableSwapRPool } from '@sushiswap/tines'
import { TridentConstantPool, TridentStablePool } from '@sushiswap/trident-sdk'
import { SushiSwapV2Pool } from '@sushiswap/v2-sdk'
import { Address } from 'viem'

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

export function convertPoolOrPairtoRPool(pool: Pool | SushiSwapV2Pool, convertTokensToBento = false): RPool {
  if (pool instanceof SushiSwapV2Pool) {
    return new ConstantProductRPool(
      pool.liquidityToken.address as Address,
      pool.token0 as RToken,
      pool.token1 as RToken,
      Fee.DEFAULT / 10000,
      BigInt(pool.reserve0.quotient.toString()),
      BigInt(pool.reserve1.quotient.toString())
    )
  } else if (pool instanceof TridentConstantPool) {
    return new ConstantProductRPool(
      pool.liquidityToken.address as Address,
      convertTokensToBento ? convertTokenToBento(pool.token0.wrapped) : (pool.assets[0].wrapped as RToken),
      convertTokensToBento ? convertTokenToBento(pool.token1.wrapped) : (pool.assets[1].wrapped as RToken),
      // pool.assets[0].wrapped as RToken,
      // pool.assets[1].wrapped as RToken,
      pool.fee / 10000,
      BigInt(pool.reserves[0].quotient.toString()),
      BigInt(pool.reserves[1].quotient.toString())
    )
  } else if (pool instanceof TridentStablePool) {
    return new StableSwapRPool(
      pool.liquidityToken.address as Address,
      // pool.token0 as RToken,
      // pool.token1 as RToken,
      convertTokensToBento ? convertTokenToBento(pool.token0.wrapped) : (pool.token0 as RToken),
      convertTokensToBento ? convertTokenToBento(pool.token1.wrapped) : (pool.token1 as RToken),
      pool.fee / 10000,
      BigInt(
        pool.reserve0
          .toShare({
            elastic: pool.total0.elastic,
            base: pool.total0.base,
          })
          .quotient.toString()
      ),
      BigInt(
        pool.reserve1
          .toShare({
            elastic: pool.total1.elastic,
            base: pool.total1.base,
          })
          .quotient.toString()
      ),
      // BigNumber.from(pool.reserve0.quotient.toString()),
      // BigNumber.from(pool.reserve1.quotient.toString()),
      pool.token0.decimals,
      pool.token1.decimals,
      {
        elastic: BigInt(pool.total0.elastic.toString()),
        base: BigInt(pool.total0.base.toString()),
      },
      {
        elastic: BigInt(pool.total1.elastic.toString()),
        base: BigInt(pool.total1.base.toString()),
      }
    )
  } else {
    throw new Error('Unknown pool type')
  }
}
