import { Token } from '@sushiswap/currency'
import { BigintIsh } from '@sushiswap/math'
import { MultiRoute } from '@sushiswap/tines'
import { ethers } from 'ethers'
import { Limited } from './Limited'
import { SushiProvider } from './liquidityProviders/Sushi'

enum LiquidityProviders {
    Sushiswap = 'Sushiswap',
    UniswapV2 = 'UniswapV2',
    Trident = 'Trident',
    Quickswap = 'Quickswap'
}

class RouteCreator {
  minUpdateDelay: number
  chainDataProvider: ethers.providers.BaseProvider
  limited: Limited

  constructor(chainDataProvider: ethers.providers.BaseProvider, minUpdateDelay = 1000) {
    this.minUpdateDelay = minUpdateDelay
    this.chainDataProvider = chainDataProvider
    this.limited = new Limited(10, 1000)
  }

  startRouting(
    tokenFrom: Token, 
    amountIn: BigintIsh, 
    toToken: Token, 
    liquidity: LiquidityProviders[]
  ) {
  }

  onRouteUpdate(f: (r: MultiRoute) => void) {}

  stopRouting() {}

  makeRouteProcessorCode(route: MultiRoute, to: string, maxSlippage: number): string {
    return 'unimplemented'
  }

  printRoute(route: MultiRoute): string {
    return 'unimplemented'
  }
}