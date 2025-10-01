import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { Amount, Fraction } from 'sushi'
import type { KvmToken } from 'sushi/kvm'
import { parseUnits } from 'viem'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { useSwapDispatch } from '~kadena/swap/swap-provider'
import { buildGetPoolAddress } from '../pact/pool'
import { buildSwapTxn } from '../pact/swap'
import type { PactNumberReturnType } from '../pact/type'

interface UseSimulateSwapParams {
  token0?: KvmToken
  token1?: KvmToken
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
  const { setAmountOut, setMinAmountOut, setGas, setAmountOutString } =
    useSwapDispatch()

  const query = useQuery({
    queryKey: [
      'kadena-simulate-swap',
      token0?.address,
      token1?.address,
      amountIn ?? null,
      amountOut,
      slippage,
      signerAddress,
    ],
    queryFn: async () => {
      if (!amountIn) {
        return
      }
      if (!token0?.address || !token1?.address || !signerAddress) {
        return
      }

      const getPoolAddressTx = buildGetPoolAddress(
        token0?.address,
        token1?.address,
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

      const poolAddress =
        typeof getPoolAddressRes.result.data === 'object' &&
        'account' in getPoolAddressRes.result.data
          ? (getPoolAddressRes.result.data?.account as string)
          : ''

      if (!poolAddress) {
        throw new Error('Pool address does not exist')
      }

      const tx = buildSwapTxn({
        token0Address: token0?.address,
        token1Address: token1?.address,
        amountIn: amountIn ?? 0,
        amountOut,
        signerAddress: signerAddress,
        poolAddress,
        isSimulate: true,
        chainId: KADENA_CHAIN_ID,
        networkId: KADENA_NETWORK_ID,
      })

      const res = await kadenaClient.local(tx, {
        preflight: false,
        signatureVerification: false,
      })

      if (res.result.status === 'failure') {
        setGas(0)
        setAmountOut(undefined)
        setMinAmountOut(undefined)

        throw new Error(res.result.error?.message || 'Simulation failed')
      }
      const gas: number = res?.gas ?? 0
      setGas(gas)
      const amount =
        Array.isArray(res?.result?.data) &&
        res.result.data[1] &&
        typeof res.result.data[1] === 'object' &&
        'amount' in res.result.data[1]
          ? (res.result.data[1].amount as PactNumberReturnType)
          : 0

      let _amountOutNum = 0
      if (typeof amount === 'object' && 'decimal' in amount) {
        _amountOutNum = Number.parseFloat(amount?.decimal ?? '0')
      } else {
        _amountOutNum = amount ?? 0
      }

      const tokenOut = token1
      const parsedAmountOut = parseUnits(
        _amountOutNum.toString(),
        tokenOut.decimals,
      )
      const slippageFraction = new Fraction((1 - slippage) * 1e6)

      const minAmountOut = new Amount(tokenOut, parsedAmountOut)
        .mul(slippageFraction)
        .div(1e6)

      setMinAmountOut(minAmountOut)

      const formatted = _amountOutNum?.toString() ?? null
      const _amountOut = new Amount(tokenOut, parsedAmountOut)
      setAmountOut(_amountOut)
      setAmountOutString(_amountOut.toString({ fixed: tokenOut.decimals }))

      return {
        data: res,
        computedAmount: formatted,
      }
    },
    enabled: Boolean(token0 && token1 && signerAddress && amountIn),
    refetchInterval: ms('20s'),
    staleTime: 0,
    retry: false,
  })

  return {
    isLoading: query.isFetching,
    error: query.error,
    data: query.data?.data ?? null,
    computedAmount: query.data?.computedAmount,
    refetch: query.refetch,
  }
}
