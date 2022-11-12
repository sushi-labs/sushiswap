import { Token } from '@sushiswap/currency'
import { BigintIsh } from '@sushiswap/math'
import { MultiRoute } from '@sushiswap/tines'

enum LiquidityProviders {
    Sushiswap = 'Sushiswap',
    UniswapV2 = 'UniswapV2',
    Trident = 'Trident',
    Quickswap = 'Quickswap'
}

class RouteCreator {
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
}