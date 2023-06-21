import { TransactionRequest } from '@ethersproject/providers'
import { calculateSlippageAmount } from '@sushiswap/amm'
import { Amount, Native } from '@sushiswap/currency'
import { Pool, Protocol } from '@sushiswap/client'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Percent } from '@sushiswap/math'
import { Dots } from '@sushiswap/ui'
import {
  ConstantProductPoolState,
  getTridentRouterContractConfig,
  StablePoolState,
  useBentoBoxTotals,
  useConstantProductPool,
  _useSendTransaction as useSendTransaction,
  useStablePool,
  useTotalSupply,
  useTridentRouterContract,
} from '@sushiswap/wagmi'
import { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useAccount, useNetwork } from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Checker } from '@sushiswap/wagmi/future/systems'
import {
  approveMasterContractAction,
  batchAction,
  burnLiquidityAction,
  LiquidityOutput,
  sweep,
  unwrapWETHAction,
} from '../../lib/actions'
import { useTokensFromPool, useUnderlyingTokenBalanceFromPool } from '../../lib/hooks'
import { usePoolPosition } from '../PoolPositionProvider'
import { RemoveSectionWidget } from './RemoveSectionWidget'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { useSlippageTolerance } from '../../lib/hooks/useSlippageTolerance'
import Button from '@sushiswap/ui/future/components/button/Button'
import { useApproved, useSignature, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { APPROVE_TAG_REMOVE_TRIDENT } from '../../lib/constants'
import { ChainId } from '@sushiswap/chain'

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
  const [constantProductPoolState, constantProductPool] = useConstantProductPool(
    _pool.chainId,
    token0,
    token1,
    _pool.swapFee * 10000,
    _pool.twapEnabled
  )

  const [stablePoolState, stablePool] = useStablePool(
    _pool.chainId,
    token0,
    token1,
    _pool.swapFee * 10000,
    _pool.twapEnabled
  )

  const [poolState, pool] = useMemo(() => {
    if (_pool.protocol === Protocol.BENTOBOX_STABLE) return [stablePoolState, stablePool]
    if (_pool.protocol === Protocol.BENTOBOX_CLASSIC) return [constantProductPoolState, constantProductPool]

    return [undefined, undefined]
  }, [_pool.protocol, constantProductPool, constantProductPoolState, stablePool, stablePoolState])

  const totalSupply = useTotalSupply(liquidityToken)

  const underlying = useUnderlyingTokenBalanceFromPool({
    reserve0: pool?.reserve0,
    reserve1: pool?.reserve1,
    totalSupply,
    balance: balance?.[FundSource.WALLET],
  })

  const [underlying0, underlying1] = underlying

  const currencyAToRemove = token0
    ? percentToRemove?.greaterThan('0') && underlying0
      ? Amount.fromRawAmount(token0, percentToRemove.multiply(underlying0.quotient).quotient || '0')
      : Amount.fromRawAmount(token0, '0')
    : undefined

  const currencyBToRemove = token1
    ? percentToRemove?.greaterThan('0') && underlying1
      ? Amount.fromRawAmount(token1, percentToRemove.multiply(underlying1.quotient).quotient || '0')
      : Amount.fromRawAmount(token1, '0')
    : undefined

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
    [address, chain?.id, token0.symbol, token1.symbol]
  )

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      try {
        // console.log('prepare trident')
        const isInvalid =
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
        // console.log({ isInvalid })
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
          return

        const liquidityOutput: LiquidityOutput[] = [
          {
            token: minAmount0.wrapped.currency.address,
            amount: minAmount0.toShare(rebases?.[token0.wrapped.address]).quotient.toString(),
          },
          {
            token: minAmount1.wrapped.currency.address,
            amount: minAmount1.toShare(rebases?.[token1.wrapped.address]).quotient.toString(),
          },
        ]

        let indexOfWETH = -1
        indexOfWETH =
          minAmount0.wrapped.currency.address === Native.onChain(_pool.chainId).wrapped.address ? 0 : indexOfWETH
        indexOfWETH =
          minAmount1.wrapped.currency.address === Native.onChain(_pool.chainId).wrapped.address ? 1 : indexOfWETH

        const actions = [
          approveMasterContractAction({ router: contract, signature }),
          burnLiquidityAction({
            router: contract,
            address: pool.liquidityToken.address,
            amount: slpAmountToRemove.quotient.toString(),
            recipient: indexOfWETH >= 0 ? contract.address : address,
            liquidityOutput,
            receiveToWallet: true,
          }),
        ]

        if (indexOfWETH >= 0) {
          actions.push(
            unwrapWETHAction({
              router: contract,
              recipient: address,
            }),
            sweep({
              router: contract,
              token: liquidityOutput[indexOfWETH === 0 ? 1 : 0].token,
              recipient: address,
              fromBento: false,
            })
          )
        }

        setRequest({
          from: address,
          to: contract.address,
          data: batchAction({
            contract,
            actions,
          }),
        })
      } catch (e: unknown) {
        //
      }
    },
    [
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
    ]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId: _pool.chainId,
    prepare,
    onSettled,
    enabled: approved,
    onSuccess: () => {
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
        <Checker.Connect fullWidth size="xl">
          <Checker.Custom
            showGuardIfTrue={
              isMounted &&
              !!poolState &&
              [
                ConstantProductPoolState.NOT_EXISTS,
                ConstantProductPoolState.INVALID,
                StablePoolState.NOT_EXISTS,
                StablePoolState.INVALID,
              ].includes(poolState)
            }
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
                <Checker.ApproveBentobox
                  tag={APPROVE_TAG_REMOVE_TRIDENT}
                  fullWidth
                  size="xl"
                  chainId={chainId}
                  id="remove-liquidity-trident-approve-bentobox"
                  masterContract={getTridentRouterContractConfig(_pool.chainId).address}
                >
                  <Checker.ApproveERC20
                    fullWidth
                    size="xl"
                    id="approve-remove-liquidity-slp"
                    amount={slpAmountToRemove}
                    contract={getTridentRouterContractConfig(_pool.chainId).address}
                  >
                    <Checker.Success tag={APPROVE_TAG_REMOVE_TRIDENT}>
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
                </Checker.ApproveBentobox>
              </Checker.Custom>
            </Checker.Network>
          </Checker.Custom>
        </Checker.Connect>
      </RemoveSectionWidget>
    </div>
  )
})
