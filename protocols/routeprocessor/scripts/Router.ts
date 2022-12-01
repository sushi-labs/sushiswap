import { Token, WNATIVE } from '@sushiswap/currency'
import { findMultiRouteExactIn, MultiRoute, NetworkInfo, RouteStatus, RToken } from '@sushiswap/tines'
import { BigNumber } from 'ethers'
import { DataFetcher } from './DataFetcher'
import { convertTokenToBento, getBentoChainId } from './liquidityProviders/Trident'

enum LiquidityProviders {
  Sushiswap = 'Sushiswap',
  UniswapV2 = 'UniswapV2',
  Trident = 'Trident',
  Quickswap = 'Quickswap'
}

type RouteCallBack = (r: MultiRoute) => void

export class Router {
  dataFetcher: DataFetcher
  fromToken: Token
  amountIn: BigNumber
  toToken: Token
  gasPrice: number
  liquidity?: LiquidityProviders[]    // all providers if undefined
  minUpdateDelay: number

  dataFetcherPreviousState = 0
  routeCallBack?: RouteCallBack
  currentBestRoute?: MultiRoute
  timer?: any  // timer from setInterval

  constructor(
    dataFetcher: DataFetcher,
    fromToken: Token,
    amountIn: BigNumber,
    toToken: Token,
    gasPrice: number,
    liquidity?: LiquidityProviders[],    // all providers if undefined
    minUpdateDelay = 1000   // Minimal delay between routing update
  ) {
    this.dataFetcher = dataFetcher
    this.fromToken = fromToken
    this.amountIn = amountIn
    this.toToken = toToken
    this.gasPrice = gasPrice
    this.liquidity = liquidity,
    this.minUpdateDelay = minUpdateDelay
  }

  startRouting(p: RouteCallBack) {
    this.stopRouting()
    this.routeCallBack = p
    this.currentBestRoute = undefined
    this.dataFetcherPreviousState = 0
    this._checkRouteUpdate()    // Maybe a route is ready
    this.timer = setInterval(() => this._checkRouteUpdate(), this.minUpdateDelay)
  }

  // To stop gather pool data and routing calculation
  stopRouting() {
    if (this.timer)
      clearInterval(this.timer)
    this.timer = undefined
  }

  getBestRoute() {
    return this.currentBestRoute
  }

  _checkRouteUpdate() {    
    const currentDataFetcherStateId = this.dataFetcher.getCurrentPoolStateId()
    if (this.dataFetcherPreviousState != currentDataFetcherStateId) {
      this.dataFetcherPreviousState = currentDataFetcherStateId
      
      const networks: NetworkInfo[] = [{
        chainId: this.dataFetcher.chainId,
        baseToken: WNATIVE[this.dataFetcher.chainId] as RToken, 
        gasPrice: this.gasPrice as number
      }, {
        chainId: getBentoChainId(this.dataFetcher.chainId),
        baseToken: convertTokenToBento(WNATIVE[this.dataFetcher.chainId]), 
        gasPrice: this.gasPrice as number
      }]
  
      const route = findMultiRouteExactIn(
        this.fromToken as RToken, 
        this.toToken as RToken, 
        this.amountIn,
        this.dataFetcher.getCurrentPoolCodeList().map(pc => pc.pool), 
        networks,
        this.gasPrice
      )
      
      if (route.status != RouteStatus.NoWay) {
        this.currentBestRoute = route
        if (this.routeCallBack)
          this.routeCallBack(route)
      }
    }    
  }

  // Human-readable route printing
  routeToString(route: MultiRoute, fromToken: Token, toToken: Token, shiftPrimary = '', shiftSub = '    '): string {
    const poolCodesMap = this.dataFetcher.getCurrentPoolCodeMap()
    let res = ''
    res += shiftPrimary + 'Route Status: ' + route.status + '\n'
    res += shiftPrimary + `Input: ${route.amountIn/Math.pow(10, fromToken.decimals)} ${fromToken.symbol}\n`  
    route.legs.forEach((l, i) => {
      res += shiftSub + shiftSub + 
        `${i+1}. ${l.tokenFrom.name} ${Math.round(l.absolutePortion*100)}%`
        + ` -> [${poolCodesMap.get(l.poolAddress)?.poolName}] -> ${l.tokenTo.name}\n`
      //console.log(l.poolAddress, l.assumedAmountIn, l.assumedAmountOut)
    })
    const output = parseInt(route.amountOutBN.toString())/Math.pow(10, toToken.decimals)
    res += shiftPrimary + `Output: ${output} ${route.toToken.name}\n`

    return res
  }
}