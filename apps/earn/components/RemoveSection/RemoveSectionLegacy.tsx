import { BigNumber } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/providers'
import { calculateSlippageAmount } from '@sushiswap/amm'
import { Amount, Native } from '@sushiswap/currency'
import { calculateGasMargin } from '@sushiswap/gas'
import { Pool } from '@sushiswap/client'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Percent } from '@sushiswap/math'
import { SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { Dots } from '@sushiswap/ui'
import {
  getSushiSwapRouterContractConfig,
  PairState,
  usePair,
  _useSendTransaction as useSendTransaction,
  useSushiSwapRouterContract,
  useTotalSupply,
} from '@sushiswap/wagmi'
import { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'
import { Address, useAccount, useNetwork } from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'

import { useTokensFromPool, useTransactionDeadline, useUnderlyingTokenBalanceFromPool } from '../../lib/hooks'
import { usePoolPosition } from '../PoolPositionProvider'
import { RemoveSectionWidget } from './RemoveSectionWidget'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { useSlippageTolerance } from '../../lib/hooks/useSlippageTolerance'
import { Button } from '@sushiswap/ui/future/components/button'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { useApproved, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { APPROVE_TAG_REMOVE_LEGACY } from '../../lib/constants'
import { ChainId } from '@sushiswap/chain'

interface RemoveSectionLegacyProps {
  pool: Pool
}

export const RemoveSectionLegacy: FC<RemoveSectionLegacyProps> = withCheckerRoot(({ pool: _pool }) => {
  const { token0, token1, liquidityToken } = useTokensFromPool(_pool)
  const { chain } = useNetwork()
  const { approved } = useApproved(APPROVE_TAG_REMOVE_LEGACY)
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const deadline = useTransactionDeadline(_pool.chainId)
  const contract = useSushiSwapRouterContract(_pool.chainId as SushiSwapV2ChainId)
  const [slippageTolerance] = useSlippageTolerance('removeLiquidity')
  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(+(slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance) * 100), 10_000)
  }, [slippageTolerance])

  const [percentage, setPercentage] = useState<string>('')
  const percentToRemove = useMemo(() => new Percent(percentage, 100), [percentage])

  const {
    data: [poolState, pool],
  } = usePair(_pool.chainId as SushiSwapV2ChainId, token0, token1)
  const { balance } = usePoolPosition()
  const totalSupply = useTotalSupply(liquidityToken)

  const [reserve0, reserve1] = useMemo(() => {
    return [pool?.reserve0, pool?.reserve1]
  }, [pool?.reserve0, pool?.reserve1])

  const underlying = useUnderlyingTokenBalanceFromPool({
    reserve0,
    reserve1,
    totalSupply,
    balance: balance?.[FundSource.WALLET],
  })

  const [underlying0, underlying1] = underlying

  const currencyAToRemove = useMemo(
    () =>
      token0
        ? percentToRemove?.greaterThan('0') && underlying0
          ? Amount.fromRawAmount(token0, percentToRemove.multiply(underlying0.quotient).quotient || '0')
          : Amount.fromRawAmount(token0, '0')
        : undefined,
    [percentToRemove, token0, underlying0]
  )

  const currencyBToRemove = useMemo(
    () =>
      token1
        ? percentToRemove?.greaterThan('0') && underlying1
          ? Amount.fromRawAmount(token1, percentToRemove.multiply(underlying1.quotient).quotient || '0')
          : Amount.fromRawAmount(token1, '0')
        : undefined,
    [percentToRemove, token1, underlying1]
  )

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      currencyAToRemove
        ? Amount.fromRawAmount(
            currencyAToRemove.currency,
            calculateSlippageAmount(currencyAToRemove, slippagePercent)[0]
          )
        : undefined,
      currencyBToRemove
        ? Amount.fromRawAmount(
            currencyBToRemove.currency,
            calculateSlippageAmount(currencyBToRemove, slippagePercent)[0]
          )
        : undefined,
    ]
  }, [slippagePercent, currencyAToRemove, currencyBToRemove])

  const amountToRemove = useMemo(
    () => balance?.[FundSource.WALLET].multiply(percentToRemove),
    [balance, percentToRemove]
  )

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !chain?.id) return
      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'burn',
        chainId: chain.id,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Removing liquidity from the ${token0.symbol}/${token1.symbol} pair`,
          completed: `Successfully removed liquidity from the ${token0.symbol}/${token1.symbol} pair`,
          failed: 'Something went wrong when removing liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chain?.id, token0.symbol, token1.symbol, address]
  )

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      try {
        if (
          !token0 ||
          !token1 ||
          !chain?.id ||
          !contract ||
          !underlying0 ||
          !underlying1 ||
          !address ||
          !pool ||
          !balance?.[FundSource.WALLET] ||
          !minAmount0 ||
          !minAmount1 ||
          !deadline
        ) {
          return
        }

        const withNative =
          Native.onChain(_pool.chainId).wrapped.address === pool.token0.address ||
          Native.onChain(_pool.chainId).wrapped.address === pool.token1.address

        let methodNames
        let args: any

        if (withNative) {
          const token1IsNative = Native.onChain(_pool.chainId).wrapped.address === pool.token1.wrapped.address
          methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
          args = [
            token1IsNative ? pool.token0.wrapped.address : pool.token1.wrapped.address,
            balance[FundSource.WALLET].multiply(percentToRemove).quotient.toString(),
            token1IsNative ? minAmount0.quotient.toString() : minAmount1.quotient.toString(),
            token1IsNative ? minAmount1.quotient.toString() : minAmount0.quotient.toString(),
            address,
            deadline.toHexString(),
          ]
        } else {
          methodNames = ['removeLiquidity']
          args = [
            pool.token0.wrapped.address,
            pool.token1.wrapped.address,
            balance[FundSource.WALLET].multiply(percentToRemove).quotient.toString(),
            minAmount0.quotient.toString(),
            minAmount1.quotient.toString(),
            address,
            deadline.toHexString(),
          ]
        }

        const safeGasEstimates = await Promise.all(
          methodNames.map((methodName) =>
            contract.estimateGas[methodName](...args)
              .then(calculateGasMargin)
              .catch(() => undefined)
          )
        )

        const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
          BigNumber.isBigNumber(safeGasEstimate)
        )

        if (indexOfSuccessfulEstimation !== -1) {
          const methodName = methodNames[indexOfSuccessfulEstimation]
          const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

          setRequest({
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData(methodName, args),
            gasLimit: safeGasEstimate,
          })
        }
      } catch (e: unknown) {
        //
        console.log({ e })
      }
    },
    [
      token0,
      token1,
      chain?.id,
      contract,
      underlying0,
      underlying1,
      address,
      pool,
      balance,
      minAmount0,
      minAmount1,
      deadline,
      _pool.chainId,
      percentToRemove,
    ]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId: _pool.chainId,
    prepare,
    onSettled,
    enabled: approved,
  })

  return (
    <div>
      <RemoveSectionWidget
        isFarm={!!_pool.incentives && _pool.incentives.length > 0}
        chainId={_pool.chainId as ChainId}
        percentage={percentage}
        token0={token0}
        token1={token1}
        token0Minimum={minAmount0}
        token1Minimum={minAmount1}
        setPercentage={setPercentage}
      >
        <Checker.Connect fullWidth size="xl">
          <Checker.Custom
            showGuardIfTrue={isMounted && [PairState.NOT_EXISTS, PairState.INVALID].includes(poolState)}
            guard={
              <Button size="xl" fullWidth disabled={true}>
                Pool Not Found
              </Button>
            }
          >
            <Checker.Network fullWidth size="xl" chainId={_pool.chainId}>
              <Checker.Custom
                showGuardIfTrue={+percentage <= 0}
                guard={
                  <Button size="xl" fullWidth disabled={true}>
                    Enter Amount
                  </Button>
                }
              >
                <Checker.ApproveERC20
                  fullWidth
                  size="xl"
                  id="approve-remove-liquidity-slp"
                  amount={amountToRemove}
                  contract={getSushiSwapRouterContractConfig(_pool.chainId as SushiSwapV2ChainId).address as Address}
                >
                  <Checker.Success tag={APPROVE_TAG_REMOVE_LEGACY}>
                    <Button
                      onClick={() => sendTransaction?.()}
                      fullWidth
                      size="xl"
                      variant="filled"
                      disabled={!approved || isWritePending}
                      testId="remove-liquidity"
                    >
                      {isWritePending ? <Dots>Confirm transaction</Dots> : 'Remove Liquidity'}
                    </Button>
                  </Checker.Success>
                </Checker.ApproveERC20>
              </Checker.Custom>
            </Checker.Network>
          </Checker.Custom>
        </Checker.Connect>
      </RemoveSectionWidget>
    </div>
  )
})
