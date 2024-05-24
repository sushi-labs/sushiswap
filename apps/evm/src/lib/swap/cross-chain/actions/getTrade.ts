import {
  UseTradeParams,
  getTradeQueryApiVersion,
  tradeValidator02,
} from '@sushiswap/react-query'
import { Address } from 'viem'
import { z } from 'zod'

const API_BASE_URL =
  process.env['API_BASE_URL'] ||
  process.env['NEXT_PUBLIC_API_BASE_URL'] ||
  'https://staging.sushi.com/swap'

export type GetTrade = Pick<
  UseTradeParams,
  'chainId' | 'gasPrice' | 'slippagePercentage' | 'recipient' | 'source'
> & {
  fromToken: Address
  toToken: Address
  amount: bigint
}

export type GetTradeReturn = z.infer<typeof tradeValidator02>

export type SuccessfulTradeReturn = Exclude<GetTradeReturn, { status: 'NoWay' }>

export const getTrade = async ({
  chainId,
  fromToken,
  toToken,
  amount,
  gasPrice = 50n,
  slippagePercentage,
  recipient,
  source,
}: GetTrade) => {
  const params = new URL(
    `${API_BASE_URL}/swap${getTradeQueryApiVersion(chainId)}/${chainId}`,
  )
  params.searchParams.set('chainId', `${chainId}`)
  params.searchParams.set('tokenIn', `${fromToken}`)
  params.searchParams.set('tokenOut', `${toToken}`)
  params.searchParams.set('amount', `${amount.toString()}`)
  params.searchParams.set('maxPriceImpact', `${+slippagePercentage / 100}`)
  params.searchParams.set('gasPrice', `${gasPrice}`)
  recipient && params.searchParams.set('to', `${recipient}`)
  params.searchParams.set('preferSushi', 'true')
  if (source !== undefined) params.searchParams.set('source', `${source}`)

  const res = await fetch(params.toString())
  const json = await res.json()
  const resp = tradeValidator02.parse(json)
  return resp
}
