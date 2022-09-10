import { Signature } from '@ethersproject/bytes'
import { Amount, Native } from '@sushiswap/currency'
import { calculateSlippageAmount } from '@sushiswap/exchange'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Percent } from '@sushiswap/math'
import { Button, Dots } from '@sushiswap/ui'
import {
  Approve,
  Checker,
  getV3RouterContractConfig,
  PoolState,
  useBentoBoxTotals,
  useConstantProductPool,
  useTotalSupply,
  useV3RouterContract,
} from '@sushiswap/wagmi'
import { FC, useCallback, useMemo, useState } from 'react'
import { ProviderRpcError, useAccount, useNetwork, UserRejectedRequestError, useSendTransaction } from 'wagmi'

import { Pair } from '../../.graphclient'
import {
  approveMasterContractAction,
  batchAction,
  burnLiquidityAction,
  LiquidityOutput,
  sweepNativeTokenAction,
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
  const contract = useV3RouterContract(pair.chainId)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction({ chainId: pair.chainId })
  const [{ slippageTolerance }] = useSettings()
  const [error, setError] = useState<string>()
  const [permit, setPermit] = useState<Signature>()
  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const [percentage, setPercentage] = useState<string>('')
  const percentageEntity = useMemo(() => new Percent(percentage, 100), [percentage])
  const tokens = useMemo(() => [token0, token1], [token0, token1])
  const rebases = useBentoBoxTotals(pair.chainId, tokens)
  const { balance } = usePoolPosition()

  const slpAmountToRemove = useMemo(() => {
    return balance?.[FundSource.WALLET].multiply(percentageEntity)
  }, [balance, percentageEntity])

  const [poolState, pool] = useConstantProductPool(pair.chainId, token0, token1, pair.swapFee, pair.twapEnabled)
  const totalSupply = useTotalSupply(liquidityToken)

  const [, { createNotification }] = useNotifications(address)
  const underlying = useUnderlyingTokenBalanceFromPair({
    reserve0: pool?.reserve0,
    reserve1: pool?.reserve1,
    totalSupply,
    balance: balance?.[FundSource.WALLET],
  })

  const [underlying0, underlying1] = underlying

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      underlying0
        ? Amount.fromRawAmount(underlying0.currency, calculateSlippageAmount(underlying0, slippagePercent)[0])
        : undefined,
      underlying1
        ? Amount.fromRawAmount(underlying1.currency, calculateSlippageAmount(underlying1, slippagePercent)[0])
        : undefined,
    ]
  }, [slippagePercent, underlying0, underlying1])

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
          amountMinimum: liquidityOutput[indexOfWETH].amount,
          recipient: address,
        }),
        sweepNativeTokenAction({
          router: contract,
          token: liquidityOutput[indexOfWETH === 0 ? 1 : 0].token,
          recipient: address,
          amount: liquidityOutput[indexOfWETH === 0 ? 1 : 0].amount,
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
          setPercentage={setPercentage}
          error={error}
        >
          <Checker.Connected>
            <Checker.Custom
              showGuardIfTrue={isMounted && [PoolState.NOT_EXISTS, PoolState.INVALID].includes(poolState)}
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
                          address={getV3RouterContractConfig(pair.chainId).addressOrName}
                          onSignature={setPermit}
                        />
                        <Approve.Token
                          size="md"
                          className="whitespace-nowrap"
                          fullWidth
                          amount={slpAmountToRemove}
                          address={getV3RouterContractConfig(pair.chainId).addressOrName}
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
