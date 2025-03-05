import type { EstimateGasErrorType, EstimateGasReturnType } from '@wagmi/core'
import { useEffect, useMemo, useRef } from 'react'
import type { UseTradeReturn } from 'src/lib/hooks/react-query'
import { useDerivedStateSimpleSwap } from 'src/ui/swap/simple/derivedstate-simple-swap-context'
import { isRouteProcessor6ChainId } from 'sushi/config'
import type { Hex, RawContractError } from 'viem'
import { useAccount, useEstimateGas } from 'wagmi'
import { getTokenTax } from '../swap/getTokenTax'

const isMinOutError = (_error: EstimateGasErrorType): Hex | false => {
  const error =
    _error.name === 'EstimateGasExecutionError'
      ? (_error.walk() as RawContractError)
      : undefined
  const data = typeof error?.data === 'object' ? error.data?.data : error?.data
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

  const simulateTrade = useEstimateGas({
    chainId: chainId,
    to: trade?.tx?.to,
    data: trade?.tx?.data as Hex | undefined,
    account: address,
    value: trade?.tx?.value || 0n,
    query: {
      retry: (i, error) => {
        if (
          trade &&
          typeof trade.tokenTax === 'undefined' &&
          isMinOutError(error)
        ) {
          return false
        }
        return i < 3
      },
      enabled:
        enabled &&
        Boolean(
          address &&
            trade?.tx &&
            isRouteProcessor6ChainId(chainId) &&
            trade?.route?.status !== 'NoWay',
        ),
    },
  })

  const prevErrorRef = useRef<EstimateGasErrorType>(undefined)
  const prevDataRef = useRef<EstimateGasReturnType>(undefined)

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
            gas: (simulateTrade.data * 120n) / 100n,
            to: trade?.tx?.to,
            data: trade?.tx?.data as Hex | undefined,
            value: trade?.tx?.value || 0n,
            account: address,
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
    [simulateTrade, trade, address],
  )
}
