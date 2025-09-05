import { useQuery } from '@tanstack/react-query'
import { Decimal, withoutScientificNotation } from 'sushi'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import type { KadenaToken } from '~kadena/_common/types/token-type'
import { useSwapDispatch } from '~kadena/swap/swap-provider'
import { buildGetPoolAddress } from '../pact/pool'
import { buildSwapTxn } from '../pact/swap'
import { formatToMaxDecimals } from '../utils/formatters'

interface UseSimulateSwapParams {
  token0?: KadenaToken
  token1?: KadenaToken
  amountIn?: number | null
  amountOut?: number
  slippage: number
  signerAddress?: string
}

export const useSimulateSwap = ({
  token0,
  token1,
  amountIn,
  amountOut,
  slippage,
  signerAddress,
}: UseSimulateSwapParams) => {
  const { setAmountOut, setMinAmountOut, setGas } = useSwapDispatch()

  const query = useQuery({
    queryKey: [
      'kadena-simulate-swap',
      token0?.tokenAddress,
      token1?.tokenAddress,
      amountIn ?? null,
      amountOut,
      signerAddress,
    ],
    enabled: !!token0 && !!token1 && !!signerAddress && !!amountIn,
    refetchInterval: 20 * 1000,
    staleTime: 0,
    retry: false,

    queryFn: async () => {
      if (!amountIn) {
        return
      }
      if (!token0?.tokenAddress || !token1?.tokenAddress || !signerAddress) {
        return
      }

      const getPoolAddressTx = buildGetPoolAddress(
        token0?.tokenAddress,
        token1?.tokenAddress,
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

      //@ts-expect-error - type mismatch, but we know this is correct
      const poolAddress = getPoolAddressRes.result.data.account

      const tx = buildSwapTxn({
        token0Address: token0?.tokenAddress,
        token1Address: token1?.tokenAddress,
        amountIn: amountIn ?? 0,
        amountOut,
        signerAddress: signerAddress,
        poolAddress,
        isSimulate: true,
      })

      const res = await kadenaClient.local(tx, {
        preflight: false,
        signatureVerification: false,
      })

      // console.log(res);
      if (res.result.status === 'failure') {
        setGas(0)
        setAmountOut('')
        setMinAmountOut('')

        throw new Error(res.result.error?.message || 'Simulation failed')
      }
      const gas: number = res?.gas ?? 0
      setGas(gas)
      const amount: number | { decimal: string } =
        //@ts-expect-error - type mismatch, but we know this is correct
        res?.result?.data?.[1]?.amount
      let _amountOut = 0
      if (typeof amount === 'object' && 'decimal' in amount) {
        _amountOut = Number.parseFloat(amount?.decimal ?? '0')
      } else {
        _amountOut = amount ?? 0
      }
      const minAmountOut = new Decimal(_amountOut).mul(1 - slippage).toString()
      setMinAmountOut(minAmountOut)

      const formatted = _amountOut?.toString() ?? null

      setAmountOut(formatToMaxDecimals(formatted, token1?.tokenDecimals))

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
