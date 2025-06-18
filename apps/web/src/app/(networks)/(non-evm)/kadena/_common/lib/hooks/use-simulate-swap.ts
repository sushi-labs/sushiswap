import { useQuery } from '@tanstack/react-query'
import { Decimal } from 'sushi'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { useSwapDispatch } from '~kadena/swap/swap-provider'
import { buildGetPoolAddress } from '../pact/pool'
import { buildSwapTxn } from '../pact/swap'

interface UseSimulateSwapParams {
  token0Address?: string
  token1Address?: string
  amountIn?: number | null
  amountOut?: number
  slippage: number
  signerAddress?: string
}

export const useSimulateSwap = ({
  token0Address,
  token1Address,
  amountIn,
  amountOut,
  slippage,
  signerAddress,
}: UseSimulateSwapParams) => {
  const { setAmountOut, setMinAmountOut, setGas } = useSwapDispatch()

  console.log('queryKey', [
    'kadena-simulate-swap',
    token0Address,
    token1Address,
    amountIn ?? null,
    amountOut,
    signerAddress,
  ])

  console.log(
    'enabled',
    !!token0Address && !!token1Address && !!signerAddress && !!amountIn,
  )

  const query = useQuery({
    queryKey: [
      'kadena-simulate-swap',
      token0Address,
      token1Address,
      amountIn ?? null,
      amountOut,
      signerAddress,
    ],
    enabled:
      !!token0Address && !!token1Address && !!signerAddress && !!amountIn,
    refetchInterval: 60 * 1000,
    staleTime: 0,
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

      const tx = buildSwapTxn({
        token0Address: token0Address!,
        token1Address: token1Address!,
        amountIn: amountIn ?? 0,
        amountOut,
        signerAddress: signerAddress!,
        poolAddress,
        isSimulate: true,
      })

      const res = await kadenaClient.local(tx, {
        preflight: false,
        signatureVerification: false,
      })

      if (res.result.status === 'failure') {
        throw new Error(res.result.error?.message || 'Simulation failed')
      }
      console.log(res)
      const gas: number = res?.gas ?? 0
      setGas(gas)

      const _amountOut: number = res?.result?.data?.[1]?.amount ?? 0
      const minAmountOut = new Decimal(_amountOut).mul(1 - slippage).toString()
      setMinAmountOut(minAmountOut)
      const formatted = _amountOut?.toString() ?? null

      setAmountOut(formatted)

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
