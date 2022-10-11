import { Signature } from '@ethersproject/bytes'
import { Amount, Native } from '@sushiswap/currency'
import { calculateSlippageAmount } from '@sushiswap/exchange'
import { Pair } from '@sushiswap/graph-client/.graphclient'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Percent } from '@sushiswap/math'
import { Button, Dots } from '@sushiswap/ui'
import {
  Approve,
  Checker,
  ConstantProductPoolState,
  getTridentRouterContractConfig,
  StablePoolState,
  useBentoBoxTotals,
  useConstantProductPool,
  useStablePool,
  useTotalSupply,
  useTridentRouterContract,
} from '@sushiswap/wagmi'
import { FC, useCallback, useMemo, useState } from 'react'
import { ProviderRpcError, useAccount, useDeprecatedSendTransaction, useNetwork, UserRejectedRequestError } from 'wagmi'

import {
  approveMasterContractAction,
  batchAction,
  burnLiquidityAction,
  LiquidityOutput,
  sweep,
  unwrapWETHAction,
} from '../../lib/actions'
import { useTokensFromPair, useUnderlyingTokenBalanceFromPair } from '../../lib/hooks'
import { useNotifications, useSettings } from '../../lib/state/storage'
import { usePoolPosition } from '../PoolPositionProvider'
import { RemoveSectionWidget } from './RemoveSectionWidget'

interface RemoveSectionTridentProps {
  pair: Pair
}

export const RemoveSectionTrident: FC<RemoveSectionTridentProps> = ({ pair }) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { token0, token1, liquidityToken } = useTokensFromPair(pair)
  const isMounted = useIsMounted()
  const contract = useTridentRouterContract(pair.chainId)
  const { sendTransactionAsync, isLoading: isWritePending } = useDeprecatedSendTransaction({ chainId: pair.chainId })
  const [{ slippageTolerance }] = useSettings()
  const [error, setError] = useState<string>()
  const [permit, setPermit] = useState<Signature>()
  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const [percentage, setPercentage] = useState<string>('')
  const percentToRemove = useMemo(() => new Percent(percentage, 100), [percentage])
  const tokens = useMemo(() => [token0, token1], [token0, token1])
  const rebases = useBentoBoxTotals(pair.chainId, tokens)
  const { balance } = usePoolPosition()

  const slpAmountToRemove = useMemo(() => {
    return balance?.[FundSource.WALLET].multiply(percentToRemove)
  }, [balance, percentToRemove])

  const [constantProductPoolState, constantProductPool] = useConstantProductPool(
    pair.chainId,
    token0,
    token1,
    pair.swapFee,
    pair.twapEnabled
  )

  const [stablePoolState, stablePool] = useStablePool(pair.chainId, token0, token1, pair.swapFee, pair.twapEnabled)

  const [poolState, pool] = useMemo(() => {
    if (pair.type === 'STABLE_POOL') return [stablePoolState, stablePool]
    if (pair.type === 'CONSTANT_PRODUCT_POOL') return [constantProductPoolState, constantProductPool]

    return [undefined, undefined]
  }, [constantProductPool, constantProductPoolState, pair.type, stablePool, stablePoolState])

  const totalSupply = useTotalSupply(liquidityToken)

  const [, { createNotification }] = useNotifications(address)

  const underlying = useUnderlyingTokenBalanceFromPair({
    reserve0: pool?.reserve0,
    reserve1: pool?.reserve1,
    totalSupply,
    balance: balance?.[FundSource.WALLET],
  })

  const [underlying0, underlying1] = underlying

  const currencyAToRemove = token0
    ? percentToRemove && percentToRemove.greaterThan('0') && underlying0
      ? Amount.fromRawAmount(token0, percentToRemove.multiply(underlying0.quotient).quotient || '0')
      : Amount.fromRawAmount(token0, '0')
    : undefined

  const currencyBToRemove = token1
    ? percentToRemove && percentToRemove.greaterThan('0') && underlying1
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

  const execute = useCallback(async () => {
    if (
      !chain?.id ||
      !pool ||
      !token0 ||
      !token1 ||
      !pair.chainId ||
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
    indexOfWETH = minAmount0.wrapped.currency.address === Native.onChain(pair.chainId).wrapped.address ? 0 : indexOfWETH
    indexOfWETH = minAmount1.wrapped.currency.address === Native.onChain(pair.chainId).wrapped.address ? 1 : indexOfWETH

    const actions = [
      approveMasterContractAction({ router: contract, signature: permit }),
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
          chainId: pair.chainId,
          router: contract,
          amountMinimum: indexOfWETH === 0 ? minAmount0.quotient.toString() : minAmount1.quotient.toString(),
          recipient: address,
        }),
        sweep({
          router: contract,
          token: liquidityOutput[indexOfWETH === 0 ? 1 : 0].token,
          recipient: address,
          amount: indexOfWETH === 0 ? minAmount1.quotient.toString() : minAmount0.quotient.toString(),
          fromBento: false,
        })
      )
    }

    try {
      const data = await sendTransactionAsync({
        request: {
          from: address,
          to: contract.address,
          data: batchAction({
            contract,
            actions,
          }),
        },
      })

      const ts = new Date().getTime()
      createNotification({
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
    } catch (e: unknown) {
      if (!(e instanceof UserRejectedRequestError)) {
        setError((e as ProviderRpcError).message)
      }

      console.log(e)
    }
  }, [
    chain?.id,
    pool,
    token0,
    token1,
    pair.chainId,
    contract,
    minAmount0,
    minAmount1,
    address,
    rebases,
    slpAmountToRemove,
    permit,
    sendTransactionAsync,
    createNotification,
  ])

  return useMemo(
    () => (
      <div>
        <RemoveSectionWidget
          isFarm={!!pair.farm}
          chainId={pair.chainId}
          percentage={percentage}
          token0={token0}
          token1={token1}
          token0Minimum={minAmount0}
          token1Minimum={minAmount1}
          setPercentage={setPercentage}
          error={error}
        >
          <Checker.Connected>
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
                <Button size="md" fullWidth disabled={true}>
                  Pool Not Found
                </Button>
              }
            >
              <Checker.Network chainId={pair.chainId}>
                <Checker.Custom
                  showGuardIfTrue={+percentage <= 0}
                  guard={
                    <Button size="md" fullWidth disabled={true}>
                      Enter Amount
                    </Button>
                  }
                >
                  <Approve
                    onSuccess={createNotification}
                    className="flex-grow !justify-end"
                    components={
                      <Approve.Components>
                        <Approve.Bentobox
                          size="md"
                          className="whitespace-nowrap"
                          fullWidth
                          address={getTridentRouterContractConfig(pair.chainId).addressOrName}
                          onSignature={setPermit}
                        />
                        <Approve.Token
                          size="md"
                          className="whitespace-nowrap"
                          fullWidth
                          amount={slpAmountToRemove}
                          address={getTridentRouterContractConfig(pair.chainId).addressOrName}
                        />
                      </Approve.Components>
                    }
                    render={({ approved }) => {
                      return (
                        <Button
                          onClick={execute}
                          fullWidth
                          size="md"
                          variant="filled"
                          disabled={!approved || isWritePending}
                        >
                          {isWritePending ? <Dots>Confirm transaction</Dots> : 'Remove Liquidity'}
                        </Button>
                      )
                    }}
                  />
                </Checker.Custom>
              </Checker.Network>
            </Checker.Custom>
          </Checker.Connected>
        </RemoveSectionWidget>
      </div>
    ),
    [
      createNotification,
      error,
      execute,
      isMounted,
      isWritePending,
      minAmount0,
      minAmount1,
      pair.chainId,
      pair.farm,
      percentage,
      poolState,
      slpAmountToRemove,
      token0,
      token1,
    ]
  )
}
