'use client'

import { useMemo } from 'react'
import { sushiSwapV2FactoryAbi_feeTo, uniswapV2PairAbi_kLast } from 'sushi/abi'
import { SUSHISWAP_V2_FACTORY_ADDRESS, SushiSwapV2ChainId } from 'sushi/config'
import { Amount, Token, Type } from 'sushi/currency'
import { ZERO } from 'sushi/math'
import { SushiSwapV2Pool } from 'sushi/pool'
import { zeroAddress } from 'viem'
import { useReadContracts } from 'wagmi'

interface Params {
  totalSupply: Amount<Token> | undefined | null
  reserve0: Amount<Type> | undefined | null
  reserve1: Amount<Type> | undefined | null
  balance: Amount<Type> | undefined | null
}

type UseUnderlyingTokenBalanceFromPairParams = (
  params: Params,
) => [Amount<Type> | undefined, Amount<Type> | undefined]

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
        totalSupply.lessThan(balance)
      ) {
        return [undefined, undefined]
      }

      if (totalSupply.equalTo(ZERO)) {
        return [
          Amount.fromRawAmount(reserve0.wrapped.currency, '0'),
          Amount.fromRawAmount(reserve1.wrapped.currency, '0'),
        ]
      }

      const feeEnabled = data[0].result !== zeroAddress
      const kLast = data[1].result

      const _reserve0 = reserve0.currency.isNative
        ? Amount.fromRawAmount(reserve0.currency.wrapped, reserve0.quotient)
        : (reserve0 as Amount<Token>)
      const _reserve1 = reserve1.currency.isNative
        ? Amount.fromRawAmount(reserve1.currency.wrapped, reserve1.quotient)
        : (reserve1 as Amount<Token>)

      const pool = new SushiSwapV2Pool(_reserve0, _reserve1)

      return [
        pool.getLiquidityValue(
          _reserve0.currency,
          totalSupply,
          balance as Amount<Token>,
          feeEnabled,
          kLast,
        ),
        pool.getLiquidityValue(
          _reserve1.currency,
          totalSupply,
          balance as Amount<Token>,
          feeEnabled,
          kLast,
        ),
      ]
    }, [balance, reserve0, reserve1, totalSupply, data])
  }
