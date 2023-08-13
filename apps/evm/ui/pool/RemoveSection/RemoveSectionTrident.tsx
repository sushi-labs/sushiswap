import { calculateSlippageAmount } from '@sushiswap/amm'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { ChainId } from '@sushiswap/chain'
import { Pool, Protocol } from '@sushiswap/client'
import { Amount, Native } from '@sushiswap/currency'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Percent } from '@sushiswap/math'
import { Button } from '@sushiswap/ui/components/button'
import { Dots } from '@sushiswap/ui/components/dots'
import { createToast } from '@sushiswap/ui/components/toast'
import {
  Address,
  getTridentRouterContractConfig,
  TridentConstantPoolState,
  TridentStablePoolState,
  useAccount,
  useBentoBoxTotals,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
  useTotalSupply,
  useTridentConstantPool,
  useTridentRouterContract,
  useTridentStablePool,
} from '@sushiswap/wagmi'
import { SendTransactionResult, waitForTransaction } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { useApproved, useSignature, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import {
  approveMasterContractAction,
  batchAction,
  burnLiquidityAction,
  LiquidityOutput,
  sweepAction,
  unwrapWETHAction,
} from 'lib/actions'
import { APPROVE_TAG_REMOVE_TRIDENT } from 'lib/constants'
import { useTokensFromPool, useUnderlyingTokenBalanceFromPool } from 'lib/hooks'
import { useSlippageTolerance } from 'lib/hooks/useSlippageTolerance'
import { FC, useCallback, useMemo, useState } from 'react'

import { usePoolPosition } from '../PoolPositionProvider'
import { RemoveSectionWidget } from './RemoveSectionWidget'

interface RemoveSectionTridentProps {
  pool: Pool
}

export const RemoveSectionTrident: FC<RemoveSectionTridentProps> = withCheckerRoot(({ pool: _pool }) => {
  const chainId = _pool.chainId as BentoBoxV1ChainId
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { token0, token1, liquidityToken } = useTokensFromPool(_pool)
  const isMounted = useIsMounted()
  const { approved } = useApproved(APPROVE_TAG_REMOVE_TRIDENT)
  const { signature, setSignature } = useSignature(APPROVE_TAG_REMOVE_TRIDENT)
  const contract = useTridentRouterContract(_pool.chainId)
  const [slippageTolerance] = useSlippageTolerance('removeLiquidity')
  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(+(slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance) * 100), 10_000)
  }, [slippageTolerance])

  const [percentage, setPercentage] = useState<string>('')
  const percentToRemove = useMemo(() => new Percent(percentage, 100), [percentage])
  const tokens = useMemo(() => [token0, token1], [token0, token1])
  const rebases = useBentoBoxTotals(_pool.chainId as BentoBoxV1ChainId, tokens)
  const { balance } = usePoolPosition()

  const slpAmountToRemove = useMemo(() => {
    return balance?.[FundSource.WALLET].multiply(percentToRemove)
  }, [balance, percentToRemove])

  // TODO: Standardize fee format
  const [tridentConstantPoolState, tridentConstantPool] = useTridentConstantPool(
    _pool.chainId,
    token0,
    token1,
    _pool.swapFee * 10000,
    _pool.twapEnabled
  )

  const [tridentStablePoolState, tridentStablePool] = useTridentStablePool(
    _pool.chainId,
    token0,
    token1,
    _pool.swapFee * 10000,
    _pool.twapEnabled
  )

  const [poolState, pool] = useMemo(() => {
    if (_pool.protocol === Protocol.BENTOBOX_STABLE) return [tridentStablePoolState, tridentStablePool]
    if (_pool.protocol === Protocol.BENTOBOX_CLASSIC) return [tridentConstantPoolState, tridentConstantPool]

    return [undefined, undefined]
  }, [_pool.protocol, tridentConstantPool, tridentConstantPoolState, tridentStablePool, tridentStablePoolState])

  const totalSupply = useTotalSupply(liquidityToken)

  const underlying = useUnderlyingTokenBalanceFromPool({
    reserve0: pool?.reserve0,
    reserve1: pool?.reserve1,
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
    [token0, percentToRemove, underlying0]
  )

  const currencyBToRemove = useMemo(
    () =>
      token1
        ? percentToRemove?.greaterThan('0') && underlying1
          ? Amount.fromRawAmount(token1, percentToRemove.multiply(underlying1.quotient).quotient || '0')
          : Amount.fromRawAmount(token1, '0')
        : undefined,
    [token1, percentToRemove, underlying1]
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

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !chain?.id) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'burn',
        chainId: chain.id,
        txHash: data.hash,
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: `Removing liquidity from the ${token0.symbol}/${token1.symbol} pair`,
          completed: `Successfully removed liquidity from the ${token0.symbol}/${token1.symbol} pair`,
          failed: 'Something went wrong when removing liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [address, chain?.id, token0.symbol, token1.symbol]
  )

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    try {
      if (
        !chain?.id ||
        !pool ||
        !token0 ||
        !token1 ||
        !_pool.chainId ||
        !contract ||
        !minAmount0 ||
        !minAmount1 ||
        !address ||
        !minAmount0 ||
        !minAmount1 ||
        !rebases?.[token0.wrapped.address] ||
        !rebases?.[token1.wrapped.address] ||
        !slpAmountToRemove
      )
        return {}

      const liquidityOutput: LiquidityOutput[] = [
        {
          token: minAmount0.wrapped.currency.address as Address,
          amount: minAmount0.toShare(rebases?.[token0.wrapped.address]).quotient,
        },
        {
          token: minAmount1.wrapped.currency.address as Address,
          amount: minAmount1.toShare(rebases?.[token1.wrapped.address]).quotient,
        },
      ]

      let indexOfWETH = -1
      indexOfWETH =
        minAmount0.wrapped.currency.address === Native.onChain(_pool.chainId).wrapped.address ? 0 : indexOfWETH
      indexOfWETH =
        minAmount1.wrapped.currency.address === Native.onChain(_pool.chainId).wrapped.address ? 1 : indexOfWETH

      const actions = [
        approveMasterContractAction({ signature }),
        burnLiquidityAction({
          address: pool.liquidityToken.address as Address,
          amount: slpAmountToRemove.quotient,
          recipient: indexOfWETH >= 0 ? contract.address : address,
          liquidityOutput,
          receiveToWallet: true,
        }),
      ]

      if (indexOfWETH >= 0) {
        actions.push(
          unwrapWETHAction({
            recipient: address,
          }),
          sweepAction({
            token: liquidityOutput[indexOfWETH === 0 ? 1 : 0].token,
            recipient: address,
            fromBento: false,
          })
        )
      }

      return {
        from: address,
        to: contract.address,
        data: batchAction({
          actions,
        }),
      }
    } catch (e: unknown) {
      return {}
    }
  }, [
    chain?.id,
    pool,
    token0,
    token1,
    _pool.chainId,
    contract,
    minAmount0,
    minAmount1,
    address,
    rebases,
    slpAmountToRemove,
    signature,
  ])

  const { config } = usePrepareSendTransaction({
    ...prepare,
    chainId: _pool.chainId,
    enabled: approved,
  })

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    ...config,
    onSettled,
    onSuccess: () => {
      setPercentage('')
      setSignature(undefined)
    },
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
        <Checker.Connect fullWidth>
          <Checker.Guard
            guardText="Pool not found"
            guardWhen={
              isMounted &&
              !!poolState &&
              [
                TridentConstantPoolState.NOT_EXISTS,
                TridentConstantPoolState.INVALID,
                TridentStablePoolState.NOT_EXISTS,
                TridentStablePoolState.INVALID,
              ].includes(poolState)
            }
          >
            <Checker.Network fullWidth chainId={_pool.chainId}>
              <Checker.Guard guardWhen={+percentage <= 0} guardText="Enter amount">
                <Checker.ApproveBentobox
                  tag={APPROVE_TAG_REMOVE_TRIDENT}
                  fullWidth
                  chainId={chainId}
                  id="remove-liquidity-trident-approve-bentobox"
                  masterContract={getTridentRouterContractConfig(_pool.chainId).address}
                >
                  <Checker.ApproveERC20
                    fullWidth
                    id="approve-remove-liquidity-slp"
                    amount={slpAmountToRemove}
                    contract={getTridentRouterContractConfig(_pool.chainId).address}
                  >
                    <Checker.Success tag={APPROVE_TAG_REMOVE_TRIDENT}>
                      <Button
                        size="xl"
                        onClick={() => sendTransaction?.()}
                        fullWidth
                        disabled={!approved || isWritePending || !sendTransaction}
                        testId="remove-liquidity"
                      >
                        {isWritePending ? <Dots>Confirm transaction</Dots> : 'Remove Liquidity'}
                      </Button>
                    </Checker.Success>
                  </Checker.ApproveERC20>
                </Checker.ApproveBentobox>
              </Checker.Guard>
            </Checker.Network>
          </Checker.Guard>
        </Checker.Connect>
      </RemoveSectionWidget>
    </div>
  )
})
