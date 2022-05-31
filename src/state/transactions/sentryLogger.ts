import { BigNumber } from '@ethersproject/bignumber'
import * as Sentry from '@sentry/browser'
import { Pair, Token } from '@sushiswap/core-sdk'
import { ConstantProductPool, Fee } from '@sushiswap/trident-sdk'
import { PoolUnion } from 'app/features/trident/types'
import { RoutingInfo } from 'app/hooks/useBestTridentTrade'

function serializeRoute(obj: any) {
  return JSON.stringify(
    obj,
    (key, value) => {
      switch (key) {
        case 'fromToken':
        case 'tokenFrom':
        case 'toToken':
        case 'tokenTo':
        case 'tokenInfo':
          return {
            name: value.name,
            address: value.address,
            decimals: value.decimals,
          }
        case 'amountInBN':
        case 'amountOutBN':
        case 'totalAmountOutBN':
          return BigNumber.from(value.hex).toString()
        case 'allowedPools':
          return value.map(getPoolInfo)
        default:
          return value
      }
    },
    '  '
  )
}

function getTokenInfo(t: Token) {
  return {
    name: t.name,
    address: t.address,
    decimals: t.decimals,
  }
}

function getPoolInfo(pool: PoolUnion | Pair) {
  if (pool instanceof ConstantProductPool) {
    return {
      type: 'ConstantProduct',
      address: pool.liquidityToken.address,
      token0: getTokenInfo(pool.assets[0]),
      token1: getTokenInfo(pool.assets[1]),
      fee: pool.fee / 10000,
      reserve0: pool.reserves[0].quotient.toString(),
      reserve1: pool.reserves[1].quotient.toString(),
    }
  } else if (pool instanceof Pair) {
    return {
      type: 'Legacy',
      address: pool.liquidityToken.address,
      token0: getTokenInfo(pool.token0),
      token1: getTokenInfo(pool.token1),
      fee: Fee.DEFAULT / 10000,
      reserve0: pool.reserve0.quotient.toString(),
      reserve1: pool.reserve1.quotient.toString(),
    }
  } else {
    return 'Unsupported type of pool !!!'
  }
}

export async function sendRevertTransactionLog(txHash: string, info: RoutingInfo) {
  Sentry.captureException({ message: 'Reverted Transaction', txHash, route: serializeRoute(info) })
}
