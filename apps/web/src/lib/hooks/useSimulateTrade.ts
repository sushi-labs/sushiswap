import { UseTradeReturn } from '@sushiswap/react-query'
import { useMemo } from 'react'
import { useDerivedStateSimpleSwap } from 'src/ui/swap/simple/derivedstate-simple-swap-provider'
import {
  ROUTE_PROCESSOR_4_ADDRESS,
  isRouteProcessor4ChainId,
} from 'sushi/config'
import { CallErrorType, Hex, RawContractError } from 'viem'
import { useCall } from 'wagmi'
import { getTokenTax } from '../swap/getTokenTax'

const isMinOutError = (_error: CallErrorType): Hex | false => {
  const error = _error.walk() as RawContractError
  const data = typeof error?.data === 'object' ? error.data?.data : error.data
  return data?.includes('0x963b34a5') ? data : false
}

export function useSimulateTrade({
  trade,
  enabled = true,
}: {
  trade: UseTradeReturn | undefined
  enabled?: boolean
}) {
  const {
    state: { chainId },
    mutate: { setTokenTax },
  } = useDerivedStateSimpleSwap()

  const simulateTrade = useCall({
    chainId: chainId,
    to: isRouteProcessor4ChainId(chainId)
      ? ROUTE_PROCESSOR_4_ADDRESS[chainId]
      : undefined,
    data: trade?.txdata as Hex | undefined,
    value: trade?.value || 0n,
    query: {
      retry: (i, error) => {
        if (
          trade &&
          typeof trade.tokenTax === 'undefined' &&
          isMinOutError(error)
        )
          return false
        return i < 3
      },
      enabled:
        enabled &&
        Boolean(
          trade?.writeArgs &&
            isRouteProcessor4ChainId(chainId) &&
            trade?.route?.status !== 'NoWay',
        ),
      onError: (error) => {
        const errorData = isMinOutError(error)
        if (errorData) {
          if (trade?.amountOut && typeof trade.tokenTax === 'undefined') {
            const _tokenTax = getTokenTax({
              data: errorData,
              expectedAmountOut: trade.amountOut,
            })

            setTokenTax(_tokenTax)
          } else if (trade && trade.tokenTax !== false) {
            setTokenTax(false)
          }
        }
      },
      onSuccess: () => {
        if (trade && typeof trade.tokenTax === 'undefined') {
          setTokenTax(false)
        }
      },
    },
  })

  return useMemo(
    () => ({
      ...simulateTrade,
      data: simulateTrade.data
        ? {
            ...simulateTrade.data,
            request: {
              to: isRouteProcessor4ChainId(chainId)
                ? ROUTE_PROCESSOR_4_ADDRESS[chainId]
                : undefined,
              data: trade?.txdata as Hex | undefined,
              value: trade?.value || 0n,
            },
          }
        : undefined,
      isError:
        trade &&
        typeof trade.tokenTax === 'undefined' &&
        simulateTrade.error &&
        isMinOutError(simulateTrade.error)
          ? false
          : simulateTrade.isError,
      error:
        trade &&
        typeof trade.tokenTax === 'undefined' &&
        simulateTrade.error &&
        isMinOutError(simulateTrade.error)
          ? null
          : simulateTrade.error,
    }),
    [simulateTrade, trade, chainId],
  )
}
