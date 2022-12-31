export interface Trade {
  getCurrentRouteHumanString: string
  getBestRoute: GetBestRoute
}

export interface GetBestRoute {
  status: string
  fromToken: FromToken
  toToken: FromToken
  primaryPrice: number
  swapPrice: number
  priceImpact: number
  amountIn: number
  amountInBN: Bn
  amountOut: number
  amountOutBN: Bn
  legs: Leg[]
  gasSpent: number
  totalAmountOut: number
  totalAmountOutBN: Bn
}

export interface Bn {
  type: string
  hex: string
}

export interface FromToken {
  chainId: number
  decimals: number
  symbol: string
  name: string
  rebase: Rebase
  isNative: boolean
  isToken: boolean
  address: string
  tokenId: string
}

export interface Rebase {
  base: number[]
  elastic: number[]
}

export interface Leg {
  poolAddress: string
  poolType: PoolType
  poolFee: number
  tokenFrom: FromToken
  tokenTo: FromToken
  assumedAmountIn: number
  assumedAmountOut: number
  swapPortion: number
  absolutePortion: number
}

export enum PoolType {
  Classic = 'Classic',
}
