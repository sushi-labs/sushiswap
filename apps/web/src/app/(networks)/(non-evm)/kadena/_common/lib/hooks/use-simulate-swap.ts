import { useQuery } from '@tanstack/react-query'
import { Amount, Fraction } from 'sushi'
import { KvmChainId, KvmToken, type KvmTokenAddress } from 'sushi/kvm'
import { parseUnits } from 'viem'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import type { KadenaToken } from '~kadena/_common/types/token-type'
import { useSwapDispatch } from '~kadena/swap/swap-provider'
import { buildGetPoolAddress } from '../pact/pool'
import { buildSwapTxn } from '../pact/swap'
import type { PactNumberReturnType } from '../pact/type'
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

      const poolAddress =
        typeof getPoolAddressRes.result.data === 'object' &&
        'account' in getPoolAddressRes.result.data
          ? (getPoolAddressRes.result.data?.account as string)
          : ''

      if (!poolAddress) {
        throw new Error('Pool address does not exist')
      }

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
      const amount =
        Array.isArray(res?.result?.data) &&
        res.result.data[1] &&
        typeof res.result.data[1] === 'object' &&
        'amount' in res.result.data[1]
          ? (res.result.data[1].amount as PactNumberReturnType)
          : 0

      let _amountOut = 0
      if (typeof amount === 'object' && 'decimal' in amount) {
        _amountOut = Number.parseFloat(amount?.decimal ?? '0')
      } else {
        _amountOut = amount ?? 0
      }

      const tokenOut = new KvmToken({
        chainId: KvmChainId.KADENA,
        address: token1.tokenAddress as KvmTokenAddress,
        decimals: token1.tokenDecimals,
        symbol: token1.tokenSymbol,
        name: token1.tokenName,
      })
      const parsedAmountOut = parseUnits(
        _amountOut.toString(),
        tokenOut.decimals,
      )
      const slippageFraction = new Fraction((1 - slippage) * 1e6)

      const minAmountOut = new Amount(tokenOut, parsedAmountOut)
        .mul(slippageFraction)
        .div(1e6)
        .toString()

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
    isLoading: query.isFetching,
    error: query.error as Error | null,
    data: query.data?.data ?? null,
    computedAmount: query.data?.computedAmount ?? null,
    refetch: query.refetch,
  }
}
