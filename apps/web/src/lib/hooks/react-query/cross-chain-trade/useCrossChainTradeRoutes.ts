import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { XSwapSupportedChainId } from 'src/config'
import { type Amount, type Percent, getNativeAddress } from 'sushi'
import type { CrossChainRoutesResponse } from '~evm/api/cross-chain/routes/route'

export interface UseCrossChainTradeRoutesParms<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
> {
  fromAmount?: Amount<CurrencyFor<TChainId0>>
  toToken?: CurrencyFor<TChainId1>
  fromAddress?: AddressFor<TChainId0>
  toAddress?: AddressFor<TChainId1>
  slippage: Percent
  order?: 'CHEAPEST' | 'FASTEST'
}

export function useCrossChainTradeRoutes<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
>(params: UseCrossChainTradeRoutesParms<TChainId0, TChainId1>) {
  return useQuery({
    queryKey: ['cross-chain/routes', params],
    queryFn: async () => {
      const { fromAmount, toToken, slippage, toAddress } = params

      if (!fromAmount || !toToken || !toAddress) throw new Error()

      const url = new URL('/api/cross-chain/routes', window.location.origin)

      url.searchParams.set(
        'fromChainId',
        fromAmount.currency.chainId.toString(),
      )
      url.searchParams.set('toChainId', toToken.chainId.toString())
      url.searchParams.set(
        'fromTokenAddress',
        fromAmount.currency.type === 'native'
          ? getNativeAddress(fromAmount.currency.chainId)
          : fromAmount.currency.address,
      )
      url.searchParams.set(
        'toTokenAddress',
        toToken.type === 'native'
          ? getNativeAddress(toToken.chainId)
          : toToken.address,
      )
      url.searchParams.set('fromAmount', fromAmount.amount.toString())
      url.searchParams.set(
        'slippage',
        `${+slippage.toString({ fixed: 2 }) / 100}`,
      )
      params.fromAddress &&
        url.searchParams.set('fromAddress', params.fromAddress)
      params.toAddress && url.searchParams.set('toAddress', params.toAddress)
      params.order && url.searchParams.set('order', params.order)

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const json = await response.json()

      const { routes } = json as CrossChainRoutesResponse<TChainId0, TChainId1>

      return routes
    },
    refetchInterval: ms('20s'),
    enabled: Boolean(
      params.toToken && params.fromAmount?.gt(0n) && params.toAddress,
    ),
  })
}
