// import { EVM_APP_BASE_URL } from '@sushiswap/client'
// import { useQuery } from '@tanstack/react-query'
// import { useMemo } from 'react'
// import { isWNativeSupported } from 'sushi/config'
// import { Native, type Type } from 'sushi/currency'
// import { Fraction } from 'sushi/math'
// import { stringify, zeroAddress } from 'viem'
// import { usePrice } from '../prices'
// import { apiAdapter02To01 } from './apiAdapter'
// import type { UseCrossChainTradeParams } from './types'
// import { tradeValidator02 } from './validator02'

// export const useCrossChainTradeQuery = (
//   {
//     srcChainId,
//     dstChainId,
//     fromToken,
//     toToken,
//     amount,
//     gasPrice = 50n,
//     slippagePercentage,
//     recipient,
//     enabled,
//     onError,
//   }: UseCrossChainTradeParams,
//   // select: UseTradeQuerySelect,
// ) => {
//   return useQuery({
//     queryKey: [
//       'getCrossChainTrade',
//       {
//         srcChainId,
//         dstChainId,
//         fromToken,
//         toToken,
//         amount,
//         slippagePercentage,
//         gasPrice,
//         recipient,
//       },
//     ],
//     queryFn: async () => {
//       const params = new URL(`${EVM_APP_BASE_URL}/pool/api/swap/cross-chain`)
//       params.searchParams.set('srcChainId', `${srcChainId}`)
//       params.searchParams.set('dstChainId', `${dstChainId}`)
//       params.searchParams.set(
//         'tokenIn',
//         `${
//           fromToken?.isNative
//             ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
//             : fromToken?.wrapped.address
//         }`,
//       )
//       params.searchParams.set(
//         'tokenOut',
//         `${
//           toToken?.isNative
//             ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
//             : toToken?.wrapped.address
//         }`,
//       )
//       params.searchParams.set('amount', `${amount?.quotient.toString()}`)
//       params.searchParams.set('maxPriceImpact', `${+slippagePercentage / 100}`)
//       params.searchParams.set('gasPrice', `${gasPrice}`)
//       params.searchParams.set('to', `${recipient}`)
//       params.searchParams.set('preferSushi', 'true')

//       const res = await fetch(params.toString())
//       // const json = deserialize(await res.json()) should cause react query error
//       const json = await res.json()
//       const resp2 = tradeValidator02.parse(json)
//       const resp1 = apiAdapter02To01(
//         resp2,
//         fromToken as Type,
//         toToken as Type,
//         recipient,
//       )
//       return resp1
//     },
//     refetchOnWindowFocus: true,
//     refetchInterval: 2500,
//     keepPreviousData: !!amount,
//     cacheTime: 0, // the length of time before inactive data gets removed from the cache
//     retry: false, // dont retry on failure, immediately fallback
//     // select,
//     enabled:
//       enabled &&
//       Boolean(
//         srcChainId && dstChainId && fromToken && toToken && amount && gasPrice,
//       ),
//     onError: (error) => (onError ? onError(error as Error) : undefined),
//     queryKeyHashFn: stringify,
//   })
// }

// export const useCrossChainTrade = (variables: UseCrossChainTradeParams) => {
//   const {
//     srcChainId,
//     dstChainId,
//     toToken,
//     amount,
//     slippagePercentage,
//     gasPrice,
//   } = variables
//   const { data: _price } = usePrice({
//     chainId: srcChainId,
//     address: Native.onChain(srcChainId).wrapped.address,
//     enabled: isWNativeSupported(srcChainId),
//   })

//   const price = useMemo(() => {
//     return Native.onChain(srcChainId).wrapped.address === zeroAddress
//       ? new Fraction(0)
//       : _price
//   }, [_price, srcChainId])

//   // const select: UseCrossChainTradeQuerySelect = useCallback(
//   //   (data) => {
//   //     // console.log('data.args', data?.args)
//   //     if (data && amount && data.route && fromToken && toToken) {
//   //       const amountIn = Amount.fromRawAmount(fromToken, data.route.amountInBI)
//   //       const amountOut = Amount.fromRawAmount(
//   //         toToken,
//   //         new Fraction(data.route.amountOutBI).multiply(
//   //           tokenTax ? new Percent(1).subtract(tokenTax) : 1,
//   //         ).quotient,
//   //       )
//   //       const minAmountOut = Amount.fromRawAmount(
//   //         toToken,
//   //         slippageAmount(
//   //           amountOut,
//   //           new Percent(Math.floor(+slippagePercentage * 100), 10_000),
//   //         )[0],
//   //       )
//   //       const isOffset = chainId === ChainId.POLYGON && carbonOffset

//   //       let writeArgs: UseTradeReturnWriteArgs = data?.args
//   //         ? ([
//   //             data.args.tokenIn as Address,
//   //             BigInt(data.args.amountIn),
//   //             data.args.tokenOut as Address,
//   //             minAmountOut.quotient,
//   //             data.args.to as Address,
//   //             data.args.routeCode as Hex,
//   //           ] as const)
//   //         : undefined
//   //       let value = fromToken.isNative ? writeArgs?.[1] ?? undefined : undefined

//   //       // console.debug(fromToken.isNative, writeArgs, value)

//   //       if (writeArgs && isOffset && chainId === ChainId.POLYGON) {
//   //         writeArgs = [
//   //           '0xbc4a6be1285893630d45c881c6c343a65fdbe278',
//   //           20000000000000000n,
//   //           ...writeArgs,
//   //         ]
//   //         value = (fromToken.isNative ? writeArgs[3] : 0n) + 20000000000000000n
//   //       }

//   //       const gasSpent = gasPrice
//   //         ? Amount.fromRawAmount(
//   //             Native.onChain(chainId),
//   //             gasPrice * BigInt(data.route.gasSpent * 1.2),
//   //           )
//   //         : undefined

//   //       return {
//   //         swapPrice: amountOut.greaterThan(ZERO)
//   //           ? new Price({
//   //               baseAmount: amount,
//   //               quoteAmount: amountOut,
//   //             })
//   //           : undefined,
//   //         priceImpact: data.route.priceImpact
//   //           ? new Percent(Math.round(data.route.priceImpact * 10000), 10000)
//   //           : new Percent(0),
//   //         amountIn,
//   //         amountOut,
//   //         minAmountOut,
//   //         gasSpent: gasSpent?.toSignificant(4),
//   //         gasSpentUsd:
//   //           price && gasSpent
//   //             ? gasSpent.multiply(price.asFraction).toSignificant(4)
//   //             : undefined,
//   //         route: data.route,
//   //         functionName: isOffset
//   //           ? 'transferValueAndprocessRoute'
//   //           : 'processRoute',
//   //         writeArgs,
//   //         value,
//   //         tokenTax,
//   //       }
//   //     }

//   //     return {
//   //       swapPrice: undefined,
//   //       priceImpact: undefined,
//   //       amountIn: undefined,
//   //       amountOut: undefined,
//   //       minAmountOut: undefined,
//   //       gasSpent: undefined,
//   //       gasSpentUsd: undefined,
//   //       writeArgs: undefined,
//   //       route: undefined,
//   //       functionName: 'processRoute',
//   //       value: undefined,
//   //       tokenTax: undefined,
//   //     }
//   //   },
//   //   [
//   //     carbonOffset,
//   //     amount,
//   //     chainId,
//   //     fromToken,
//   //     price,
//   //     slippagePercentage,
//   //     toToken,
//   //     gasPrice,
//   //     tokenTax,
//   //   ],
//   // )

//   return useCrossChainTradeQuery(
//     variables,
//     // select
//   )
// }
