import { defaultAbiCoder } from '@ethersproject/abi'
import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import {
  computeConstantProductPoolAddress,
  computeStablePoolAddress,
  ConstantProductPool,
  StablePool,
} from '@sushiswap/amm'
import { Amount } from '@sushiswap/currency'
import { Percent } from '@sushiswap/math'
import {
  PoolFinderType,
  useBentoBoxTotals,
  useConstantProductPoolFactoryContract,
  useSendTransaction,
  useStablePoolFactoryContract,
  useTridentRouterContract,
} from '@sushiswap/wagmi'
import { FC, useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'

import {
  approveMasterContractAction,
  batchAction,
  deployNewPoolAction,
  getAsEncodedAction,
  LiquidityInput,
} from '../../lib/actions'
import { useNotifications, useSettings } from '../../lib/state/storage'
import { CreateSectionReviewModalTridentProps } from './CreateSectionReviewModalTrident'

interface ExecuteProvider extends Omit<CreateSectionReviewModalTridentProps, 'children'> {
  signature: Signature | undefined
  onSuccess(): void
  children({ execute, isWritePending }: { execute: (() => void) | undefined; isWritePending: boolean })
}

export const ExecuteProvider: FC<ExecuteProvider> = ({
  token0,
  token1,
  input0,
  input1,
  fee,
  poolType,
  chainId,
  children,
  signature,
  onSuccess,
}) => {
  const { address } = useAccount()
  const contract = useTridentRouterContract(chainId)
  const constantProductPoolFactory = useConstantProductPoolFactoryContract(chainId)
  const stablePoolFactory = useStablePoolFactoryContract(chainId)
  const [, { createNotification }] = useNotifications(address)

  const [{ slippageTolerance }] = useSettings()

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const totals = useBentoBoxTotals(
    chainId,
    useMemo(() => [token0, token1], [token0, token1])
  )

  const pool = useMemo(() => {
    if (!token0 || !token1 || !fee) return
    if (poolType === PoolFinderType.Classic) {
      return new ConstantProductPool(
        Amount.fromRawAmount(token0.wrapped, 0),
        Amount.fromRawAmount(token1.wrapped, 0),
        fee,
        false
      )
    } else if (
      poolType === PoolFinderType.Stable &&
      totals &&
      token0.wrapped.address in totals &&
      token1.wrapped.address in totals
    ) {
      return new StablePool(
        Amount.fromRawAmount(token0.wrapped, 0),
        Amount.fromRawAmount(token1.wrapped, 0),
        fee,
        totals[token0.wrapped.address],
        totals[token1.wrapped.address]
      )
    }
  }, [fee, token0, token1, poolType, totals])

  const totalSupply = useMemo(() => (pool ? Amount.fromRawAmount(pool?.liquidityToken, 0) : undefined), [pool])

  const factory = useMemo(() => {
    if (poolType === PoolFinderType.Classic) {
      return constantProductPoolFactory
    } else if (poolType === PoolFinderType.Stable) {
      return stablePoolFactory
    }
  }, [constantProductPoolFactory, poolType, stablePoolFactory])

  const poolAddress = useMemo(() => {
    // !poolType === 0, don't guared against it
    if (!factory || !token0 || !token1 || !fee) return
    if (poolType === PoolFinderType.Classic) {
      return computeConstantProductPoolAddress({
        factoryAddress: factory.address,
        tokenA: token0.wrapped,
        tokenB: token1.wrapped,
        fee: fee,
        twap: false,
      })
    } else if (poolType === PoolFinderType.Stable) {
      return computeStablePoolAddress({
        factoryAddress: factory.address,
        tokenA: token0.wrapped,
        tokenB: token1.wrapped,
        fee: fee,
      })
    }
  }, [factory, fee, token0, token1, poolType])

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !chainId || !token0 || !token1) return
      const ts = new Date().getTime()
      createNotification({
        type: 'mint',
        chainId: chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Adding liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          completed: `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          failed: 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, token0, token1]
  )

  const prepare = useCallback(
    async (setRequest) => {
      try {
        if (
          !chainId ||
          !factory ||
          !token0 ||
          !token1 ||
          !poolAddress ||
          !input0 ||
          !input1 ||
          !totalSupply ||
          !pool ||
          !contract ||
          !totals?.[token0.wrapped.address] ||
          !totals?.[token1.wrapped.address]
        ) {
          return
        }

        let value
        const liquidityInput: LiquidityInput[] = []
        const encoded = defaultAbiCoder.encode(['address'], [address])

        if (input0) {
          if (input0.currency.isNative) {
            value = input0.quotient.toString()
          }

          liquidityInput.push({
            token: input0.currency.isNative ? AddressZero : input0.currency.wrapped.address,
            native: true,
            amount: input0.quotient.toString(),
          })
        }

        if (input1) {
          if (input1.currency.isNative) {
            value = input1.quotient.toString()
          }

          liquidityInput.push({
            token: input1.currency.isNative ? AddressZero : input1.currency.wrapped.address,
            native: true,
            amount: input1.quotient.toString(),
          })
        }

        setRequest({
          from: address,
          to: contract.address,
          data: batchAction({
            contract,
            actions: [
              approveMasterContractAction({ router: contract, signature }),
              deployNewPoolAction({
                assets: [input0.currency, input1.currency],
                factory: factory.address,
                router: contract,
                feeTier: fee,
                twap: false,
              }),
              getAsEncodedAction({
                contract,
                fn: 'addLiquidity',
                args: [
                  liquidityInput,
                  poolAddress,
                  pool
                    .getLiquidityMinted(
                      totalSupply,
                      input0.wrapped.toShare(totals?.[token0.wrapped.address]),
                      input1.wrapped.toShare(totals?.[token1.wrapped.address])
                    )
                    .quotient.toString(),
                  encoded,
                ],
              }),
            ],
          }),
          ...(value && { value }),
        })
      } catch (e: unknown) {
        //
      }
    },
    [
      address,
      chainId,
      contract,
      factory,
      fee,
      input0,
      input1,
      pool,
      poolAddress,
      signature,
      token0,
      token1,
      totalSupply,
      totals,
    ]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess,
  })

  return children({ execute: sendTransaction, isWritePending })
}
