import { Pact } from '@kadena/client'
import { useQuery } from '@tanstack/react-query'
import { kadenaClient } from '~kadena/_common/constants/client'
import { KADENA_CONTRACT } from '~kadena/_common/constants/contracts'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { useSwapDispatch } from '~kadena/swap/swap-provider'
import { buildGetPoolAddress } from '../pact/pool'
import { buildSwapTxn } from '../pact/swap'
import { formatPactDecimal } from '../utils/formatters'

interface UseSimulateSwapParams {
  token0Address?: string
  token1Address?: string
  amountIn?: number
  amountOut?: number
  slippage: number
  isSwapIn: boolean
  signerAddress?: string
}

export const useSimulateSwap = ({
  token0Address,
  token1Address,
  amountIn,
  amountOut,
  slippage = 0.005,
  isSwapIn,
  signerAddress,
}: UseSimulateSwapParams) => {
  const { setAmountIn, setAmountOut } = useSwapDispatch()

  console.log('slippage', slippage)

  const shouldSimulate =
    !!token0Address &&
    !!token1Address &&
    !!signerAddress &&
    ((isSwapIn && amountIn !== null) || (!isSwapIn && amountOut !== null))

  console.log('shouldSimulate', shouldSimulate)

  const queryKey = [
    'simulate-swap',
    token0Address,
    token1Address,
    amountIn,
    amountOut,
    isSwapIn,
    signerAddress,
  ]

  const query = useQuery({
    queryKey,
    enabled: shouldSimulate && !!signerAddress,
    refetchInterval: 60 * 1000,
    retry: false,
    queryFn: async () => {
      const getPoolAddressTx = buildGetPoolAddress(
        token0Address!,
        token1Address!,
        KADENA_CHAIN_ID,
        KADENA_NETWORK_ID,
      )

      const getPoolAddressRes = await kadenaClient.local(getPoolAddressTx, {
        preflight: false,
        signatureVerification: false,
      })

      if (getPoolAddressRes.result.status !== 'success') {
        throw new Error(
          getPoolAddressRes.result.error?.message ??
            'Failed to fetch pool address',
        )
      }

      const poolAddress = getPoolAddressRes.result.data.account

      console.log('poolAddress', poolAddress)

      const tx = buildSwapTxn({
        token0Address: token0Address!,
        token1Address: token1Address!,
        amountIn,
        amountOut,
        isSwapIn,
        signerAddress: signerAddress!,
        poolAddress,
      })

      const res = await kadenaClient.local(tx, {
        preflight: false,
        signatureVerification: false,
      })

      console.log('res', res)

      if (res.result.status === 'failure') {
        throw new Error(res.result.error?.message || 'Simulation failed')
      }

      const computed = isSwapIn
        ? res.result.data?.[1]?.amount
        : res.result.data?.[0]?.amount

      const formatted = computed?.toString() ?? null

      if (isSwapIn) setAmountOut(formatted)
      else setAmountIn(formatted)

      return {
        data: res,
        computedAmount: formatted,
      }
    },
  })

  return {
    isLoading: query.isLoading || query.isFetching || query.isRefetching,
    error: query.error as Error | null,
    data: query.data?.data ?? null,
    computedAmount: query.data?.computedAmount ?? null,
    refetch: query.refetch,
  }
}
