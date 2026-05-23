'use client'

import { nativeFromChainId } from 'src/lib/currency-from-chain-id'
import type { NearIntentsSupportedChainId } from 'src/lib/swap/near-intents/types'
import { Amount } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import { isEvmChainId } from 'sushi/evm'
import { STELLAR_XLM, StellarChainId } from 'sushi/stellar'
import { encodeFunctionData, erc20Abi } from 'viem'
import { useConnection, useEstimateGas, useGasPrice } from 'wagmi'
import { useCurrencyPrice } from '~evm/_common/ui/price-provider/price-provider/use-currency-price'

const NATIVE_TRANSFER_GAS = 21_000n

export const STELLAR_NETWORK_FEE_AMOUNT = 0.1
export const xlm = STELLAR_XLM[StellarChainId.STELLAR]

export function useNearIntentsSourceNetworkFee({
  amountIn,
  chainId,
  enabled,
  token,
}: {
  amountIn: string | undefined
  chainId: NearIntentsSupportedChainId
  enabled: boolean
  token: CurrencyFor<NearIntentsSupportedChainId> | undefined
}) {
  const isEvmSource = isEvmChainId(chainId)
  const evmChainId = isEvmSource ? chainId : undefined
  const { address: sourceAccount } = useConnection()
  const native = evmChainId ? nativeFromChainId(evmChainId) : undefined
  const isNative = Boolean(isEvmSource && token?.type === 'native')
  const tokenAddress =
    isEvmSource && token && token.type !== 'native'
      ? (token.wrap().address as EvmAddress)
      : undefined

  const { data: gasPrice, isLoading: isGasPriceLoading } = useGasPrice({
    chainId: evmChainId,
    query: {
      enabled: enabled && isEvmSource,
    },
  })

  const transferData =
    sourceAccount && amountIn
      ? encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [sourceAccount, BigInt(amountIn)],
        })
      : undefined

  const { data: erc20Gas, isLoading: isErc20GasLoading } = useEstimateGas({
    account: sourceAccount,
    chainId: evmChainId,
    data: transferData,
    to: tokenAddress,
    query: {
      enabled: Boolean(
        enabled &&
          isEvmSource &&
          !isNative &&
          sourceAccount &&
          tokenAddress &&
          transferData,
      ),
    },
  })

  const stellarNetworkFeePrice = useCurrencyPrice({
    currency: xlm,
    enabled: enabled && chainId === StellarChainId.STELLAR,
  })
  const evmNetworkFeePrice = useCurrencyPrice({
    currency: native,
    enabled: enabled && isEvmSource,
  })

  if (chainId === StellarChainId.STELLAR) {
    return {
      amount: `${STELLAR_NETWORK_FEE_AMOUNT}`,
      amountUsd:
        stellarNetworkFeePrice.data === undefined
          ? undefined
          : stellarNetworkFeePrice.data * STELLAR_NETWORK_FEE_AMOUNT,
      isLoading: stellarNetworkFeePrice.isLoading,
      symbol: xlm.symbol,
    }
  }

  const gas = isNative ? NATIVE_TRANSFER_GAS : erc20Gas
  const gasAmount =
    native && gas && gasPrice ? new Amount(native, gas * gasPrice) : undefined
  const amountUsd =
    gasAmount && evmNetworkFeePrice.data !== undefined
      ? Number(gasAmount.toString()) * evmNetworkFeePrice.data
      : undefined

  return {
    amount: gasAmount?.toSignificant(6),
    amountUsd,
    isLoading:
      enabled &&
      (isGasPriceLoading ||
        evmNetworkFeePrice.isLoading ||
        (!isNative && isErc20GasLoading)),
    symbol: native?.symbol,
  }
}
