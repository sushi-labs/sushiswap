import { Signature } from '@ethersproject/bytes'
import { Chain } from '@sushiswap/chain'
import { Amount, Native } from '@sushiswap/currency'
import { calculateSlippageAmount } from '@sushiswap/exchange'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Percent } from '@sushiswap/math'
import { Button, createToast, Dots } from '@sushiswap/ui'
import {
  Approve,
  getV3RouterContractConfig,
  PairState,
  useBalance,
  useBentoBoxTotals,
  usePair,
  useTotalSupply,
  useV3RouterContract,
  Wallet,
} from '@sushiswap/wagmi'
import { FC, useCallback, useMemo, useState } from 'react'
import {
  ProviderRpcError,
  useAccount,
  useNetwork,
  UserRejectedRequestError,
  useSendTransaction,
  useSwitchNetwork,
} from 'wagmi'

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
import { useSettings } from '../../lib/state/storage'
import { Layout } from '../Layout'
import { RemoveSectionWidget } from './RemoveSectionWidget'

interface RemoveSectionTridentProps {
  pair: Pair
}

export const RemoveSectionTrident: FC<RemoveSectionTridentProps> = ({ pair }) => {
  const { address } = useAccount()
  const { token0, token1, liquidityToken } = useTokensFromPair(pair)
  const { chain } = useNetwork()
  const isMounted = useIsMounted()
  const contract = useV3RouterContract(pair.chainId)
  const { switchNetwork } = useSwitchNetwork()
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction({ chainId: pair.chainId })
  const [{ slippageTolerance }] = useSettings()
  const [error, setError] = useState<string>()
  const [permit, setPermit] = useState<Signature>()
  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const [percentage, setPercentage] = useState<number>(0)
  const percentageEntity = useMemo(() => new Percent(percentage, 10_000), [percentage])
  const rebases = useBentoBoxTotals(pair.chainId, [token0, token1])
  const { data: balance } = useBalance({ chainId: pair.chainId, account: address, currency: liquidityToken })

  const slpAmountToRemove = useMemo(() => {
    return balance?.[FundSource.WALLET].multiply(percentageEntity)
  }, [balance, percentageEntity])

  const [poolState, pool] = usePair(pair.chainId, token0, token1)
  const totalSupply = useTotalSupply(liquidityToken)

  const underlying = useUnderlyingTokenBalanceFromPair({
    reserve0: pool?.reserve0,
    reserve1: pool?.reserve1,
    totalSupply,
    balance: balance?.[FundSource.WALLET].wrapped,
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

      createToast({
        txHash: data.hash,
        href: Chain.from(pool.chainId).getTxUrl(data.hash),
        promise: data.wait(),
        summary: {
          pending: (
            <Dots>
              Removing liquidity from the {token0.symbol}/{token1.symbol} pair
            </Dots>
          ),
          completed: `Successfully removed liquidity from the ${token0.symbol}/${token1.symbol} pair`,
          failed: 'Something went wrong when removing liquidity',
        },
      })
    } catch (e: unknown) {
      if (!(e instanceof UserRejectedRequestError)) {
        setError((e as ProviderRpcError).message)
      }

      console.log(e)
    }
  }, [
    pool,
    token0,
    token1,
    pair.chainId,
    contract,
    minAmount0,
    minAmount1,
    address,
    rebases,
    permit,
    slpAmountToRemove,
    sendTransactionAsync,
  ])

  return (
    <Layout>
      <div className="flex flex-col gap-6 pb-40">
        <RemoveSectionWidget
          chainId={pair.chainId}
          percentage={percentage}
          liquidityToken={liquidityToken}
          token0={token0}
          token1={token1}
          reserve0={pool?.reserve0}
          reserve1={pool?.reserve1}
          setPercentage={setPercentage}
          error={error}
        >
          {isMounted && !address ? (
            <Wallet.Button appearOnMount={false} fullWidth color="blue" size="md">
              Connect Wallet
            </Wallet.Button>
          ) : isMounted && [PairState.NOT_EXISTS, PairState.INVALID].includes(poolState) ? (
            <Button size="md" color="gray" fullWidth disabled={true}>
              Pool Not Found
            </Button>
          ) : chain && chain.id !== pair.chainId ? (
            <Button size="md" fullWidth onClick={() => switchNetwork && switchNetwork(pair.chainId)}>
              Switch to {Chain.from(pair.chainId).name}
            </Button>
          ) : percentage <= 0 ? (
            <Button size="md" fullWidth disabled={true}>
              Enter Amount
            </Button>
          ) : (
            <Approve
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
                  <Button onClick={execute} fullWidth size="md" variant="filled" disabled={!approved || isWritePending}>
                    {isWritePending ? <Dots>Confirm transaction</Dots> : 'Remove Liquidity'}
                  </Button>
                )
              }}
            />
          )}
        </RemoveSectionWidget>
      </div>
    </Layout>
  )
}
