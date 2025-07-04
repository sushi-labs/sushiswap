'use client'

import { useMemo } from 'react'
import { Amount, ZERO } from 'sushi'
import {
  type EvmCurrency,
  type EvmToken,
  SUSHISWAP_V2_FACTORY_ADDRESS,
  type SushiSwapV2ChainId,
  SushiSwapV2Pool,
  sushiSwapV2FactoryAbi_feeTo,
  uniswapV2PairAbi_kLast,
} from 'sushi/evm'
import { zeroAddress } from 'viem'
import { useReadContracts } from 'wagmi'

interface Params {
  totalSupply: Amount<EvmToken> | undefined | null
  reserve0: Amount<EvmCurrency> | undefined | null
  reserve1: Amount<EvmCurrency> | undefined | null
  balance: Amount<EvmCurrency> | undefined | null
}

type UseUnderlyingTokenBalanceFromPairParams = (
  params: Params,
) => [Amount<EvmCurrency> | undefined, Amount<EvmCurrency> | undefined]

export const useUnderlyingTokenBalanceFromPool: UseUnderlyingTokenBalanceFromPairParams =
  ({ balance, totalSupply, reserve1, reserve0 }) => {
    const { data } = useReadContracts({
      contracts: [
        {
          address: totalSupply
            ? SUSHISWAP_V2_FACTORY_ADDRESS[
                totalSupply.currency.chainId as SushiSwapV2ChainId
              ]
            : undefined,
          abi: sushiSwapV2FactoryAbi_feeTo,
          functionName: 'feeTo',
          chainId: totalSupply?.currency?.chainId,
        },
        {
          address: totalSupply?.currency.address,
          abi: uniswapV2PairAbi_kLast,
          functionName: 'kLast',
          chainId: totalSupply?.currency?.chainId,
        },
      ],
      query: {
        enabled: Boolean(totalSupply),
      },
    })

    return useMemo(() => {
      if (
        !balance ||
        !totalSupply ||
        !reserve0 ||
        !reserve1 ||
        !data?.every((data) => data.status === 'success') ||
        // this condition is a short-circuit in the case where balance updates sooner than totalSupply
        totalSupply.lt(balance.amount)
      ) {
        return [undefined, undefined]
      }

      if (totalSupply.eq(ZERO)) {
        return [
          new Amount(reserve0.wrap().currency, '0'),
          new Amount(reserve1.wrap().currency, '0'),
        ]
      }

      const feeEnabled = data[0].result !== zeroAddress
      const kLast = data[1].result

      const _reserve0 = reserve0.wrap()
      const _reserve1 = reserve1.wrap()

      const pool = new SushiSwapV2Pool(_reserve0, _reserve1)

      return [
        pool.getLiquidityValue(
          _reserve0.currency,
          totalSupply,
          balance as Amount<EvmToken>,
          feeEnabled,
          kLast,
        ),
        pool.getLiquidityValue(
          _reserve1.currency,
          totalSupply,
          balance as Amount<EvmToken>,
          feeEnabled,
          kLast,
        ),
      ]
    }, [balance, reserve0, reserve1, totalSupply, data])
  }
