import { UseTradeReturn } from '@sushiswap/react-query'
import {
  SimulateContractErrorType,
  useSimulateContract,
} from '@sushiswap/wagmi'
import { useDerivedStateSimpleSwap } from 'src/ui/swap/simple/derivedstate-simple-swap-provider'
import {
  routeProcessor3Abi,
  routeProcessor4Abi,
  routeProcessorAbi,
} from 'sushi/abi'
import {
  ROUTE_PROCESSOR_3_1_ADDRESS,
  ROUTE_PROCESSOR_3_2_ADDRESS,
  ROUTE_PROCESSOR_3_ADDRESS,
  ROUTE_PROCESSOR_4_ADDRESS,
  ROUTE_PROCESSOR_ADDRESS,
  isRouteProcessor3ChainId,
  isRouteProcessor3_1ChainId,
  isRouteProcessor3_2ChainId,
  isRouteProcessor4ChainId,
  isRouteProcessorChainId,
} from 'sushi/config'
import { BaseError } from 'viem'
import { getTokenTax } from '../swap/getTokenTax'

const isMinOutError = (error: SimulateContractErrorType | null) =>
  error instanceof BaseError &&
  (error.message.includes('MinimalOutputBalanceViolation') ||
    error.message.includes('0x963b34a5'))

export function useSimulateTrade({
  trade,
  enabled = true,
}: {
  trade: UseTradeReturn | undefined
  enabled?: boolean
}) {
  const {
    state: { tokenTax, chainId },
    mutate: { setTokenTax },
  } = useDerivedStateSimpleSwap()

  const simulateTrade = useSimulateContract({
    chainId: chainId,
    address: isRouteProcessor4ChainId(chainId)
      ? ROUTE_PROCESSOR_4_ADDRESS[chainId]
      : isRouteProcessor3_2ChainId(chainId)
        ? ROUTE_PROCESSOR_3_2_ADDRESS[chainId]
        : isRouteProcessor3_1ChainId(chainId)
          ? ROUTE_PROCESSOR_3_1_ADDRESS[chainId]
          : isRouteProcessor3ChainId(chainId)
            ? ROUTE_PROCESSOR_3_ADDRESS[chainId]
            : isRouteProcessorChainId(chainId)
              ? ROUTE_PROCESSOR_ADDRESS[chainId]
              : undefined,
    abi: (isRouteProcessor4ChainId(chainId)
      ? routeProcessor4Abi
      : isRouteProcessor3_2ChainId(chainId) ||
          isRouteProcessor3_1ChainId(chainId) ||
          isRouteProcessor3ChainId(chainId)
        ? routeProcessor3Abi
        : isRouteProcessorChainId(chainId)
          ? routeProcessorAbi
          : undefined) as any,
    functionName: trade?.functionName,
    args: trade?.writeArgs as any,
    value: trade?.value || 0n,
    query: {
      retry: (i, error) => {
        if (typeof tokenTax === 'undefined' && isMinOutError(error))
          return false
        return i < 3
      },
      enabled:
        enabled &&
        Boolean(
          trade?.writeArgs &&
            (isRouteProcessorChainId(chainId) ||
              isRouteProcessor3ChainId(chainId) ||
              isRouteProcessor3_1ChainId(chainId) ||
              isRouteProcessor3_2ChainId(chainId) ||
              isRouteProcessor4ChainId(chainId)) &&
            trade?.route?.status !== 'NoWay',
        ),
      onError: (error: SimulateContractErrorType) => {
        if (isMinOutError(error)) {
          if (trade?.amountOut && typeof tokenTax === 'undefined') {
            const _tokenTax = getTokenTax({
              error,
              expectedAmountOut: trade.amountOut,
            })

            setTokenTax(_tokenTax)
          } else if (tokenTax !== false) {
            setTokenTax(false)
          }
        }
      },
      onSuccess: () => {
        if (typeof tokenTax === 'undefined') {
          setTokenTax(false)
        }
      },
    },
  })

  return {
    ...simulateTrade,
    isError:
      typeof tokenTax === 'undefined' && isMinOutError(simulateTrade.error)
        ? false
        : simulateTrade.isError,
    error:
      typeof tokenTax === 'undefined' && isMinOutError(simulateTrade.error)
        ? null
        : simulateTrade.error,
  }
}
