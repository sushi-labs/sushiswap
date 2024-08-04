import { UseTradeReturn } from '@sushiswap/react-query'
import { useEffect, useMemo, useRef } from 'react'
import { useDerivedStateSimpleSwap } from 'src/ui/swap/simple/derivedstate-simple-swap-provider'
import {
  ROUTE_PROCESSOR_5_ADDRESS,
  isRouteProcessor5ChainId,
} from 'sushi/config'
import { CallErrorType, CallReturnType, Hex, RawContractError } from 'viem'
import { useAccount, useCall } from 'wagmi'
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

  const { address } = useAccount()

  const simulateTrade = useCall({
    chainId: chainId,
    to: isRouteProcessor5ChainId(chainId)
      ? ROUTE_PROCESSOR_5_ADDRESS[chainId]
      : undefined,
    data: trade?.txdata as Hex | undefined,
    account: address,
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
          address &&
            trade?.txdata &&
            isRouteProcessor5ChainId(chainId) &&
            trade?.route?.status !== 'NoWay',
        ),
    },
  })

  const prevErrorRef = useRef<CallErrorType>()
  const prevDataRef = useRef<CallReturnType>()

  // onSuccess
  useEffect(() => {
    if (simulateTrade.data && simulateTrade.data !== prevDataRef.current) {
      prevDataRef.current = simulateTrade.data

      if (trade && typeof trade.tokenTax === 'undefined') {
        setTokenTax(false)
      }
    }
  }, [simulateTrade.data, trade, setTokenTax])

  // onError
  useEffect(() => {
    if (simulateTrade.error && simulateTrade.error !== prevErrorRef.current) {
      prevErrorRef.current = simulateTrade.error

      const errorData = isMinOutError(simulateTrade.error)
      if (errorData) {
        if (trade?.amountOut && typeof trade.tokenTax === 'undefined') {
          const _tokenTax = getTokenTax({
            data: errorData,
            expectedAmountOut: trade.amountOut,
          })
          setTokenTax(_tokenTax)
        } else if (trade?.tokenTax !== false) {
          setTokenTax(false)
        }
      }
    }
  }, [simulateTrade.error, setTokenTax, trade?.amountOut, trade?.tokenTax])

  return useMemo(
    () => ({
      ...simulateTrade,
      data: simulateTrade.data
        ? {
            ...simulateTrade.data,
            request: {
              to: isRouteProcessor5ChainId(chainId)
                ? ROUTE_PROCESSOR_5_ADDRESS[chainId]
                : undefined,
              data: trade?.txdata as Hex | undefined,
              value: trade?.value || 0n,
              account: address,
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
    [simulateTrade, trade, chainId, address],
  )
}
