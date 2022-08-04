import { BigNumber } from '@ethersproject/bignumber'
import { Transition } from '@headlessui/react'
import { Chain, ChainId } from '@sushiswap/chain'
import { Amount, Native, SUSHI, SUSHI_ADDRESS } from '@sushiswap/currency'
import { calculateSlippageAmount } from '@sushiswap/exchange'
import { formatUSD } from '@sushiswap/format'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Percent } from '@sushiswap/math'
import {
  Button,
  classNames,
  createToast,
  Currency as UICurrency,
  DEFAULT_INPUT_UNSTYLED,
  Dots,
  Input,
  Typography,
} from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { Approve, calculateGasMargin, useBalance, usePair, usePairTotalSupply, Wallet } from '@sushiswap/wagmi'
import { getV2RouterContractConfig, useV2RouterContract } from '@sushiswap/wagmi/hooks/useV2Router'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import {
  ProviderRpcError,
  useAccount,
  useNetwork,
  UserRejectedRequestError,
  useSendTransaction,
  useSwitchNetwork,
} from 'wagmi'

import { Layout } from '../components'
import { useTokenAmountDollarValues, useTransactionDeadline } from '../lib/hooks'
import { useSettings } from '../lib/state/storage'
import { useTokens } from '../lib/state/token-lists'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { token0, token1, chainId } = query

  const _token0 = token0 ?? Native.onChain(Number(chainId as string) || ChainId.ETHEREUM).symbol
  const _chainId = chainId ?? ChainId.ETHEREUM
  const _token1 = token1 ?? SUSHI_ADDRESS[Number(chainId as string) || ChainId.ETHEREUM]

  const redirect = {
    permanent: false,
    destination: `/remove?token0=${_token0}&token1=${_token1}&chainId=${_chainId}`,
  }

  return {
    ...((!token0 || !token1 || !chainId) && { redirect: { ...redirect } }),
    props: {
      token0: _token0,
      token1: _token1,
      chainId: _chainId,
    },
  }
}

const RemovePage = ({
  token0: _token0,
  token1: _token1,
  chainId: _chainId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const chainId = Number(_chainId)
  const { chain } = useNetwork()
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const tokens = useTokens(chainId)
  const deadline = useTransactionDeadline()
  const contract = useV2RouterContract(chainId)
  const { switchNetwork } = useSwitchNetwork()
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction({ chainId })
  const [{ slippageTolerance }] = useSettings()
  const [error, setError] = useState<string>()

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const [percentage, setPercentage] = useState<number>(0)
  const percentageEntity = useMemo(() => new Percent(percentage, 10_000), [percentage])

  const token0 = _token0 in tokens ? tokens[_token0] : Native.onChain(chainId)
  const token1 =
    _token1 === SUSHI_ADDRESS[chainId] ? SUSHI[chainId] : _token1 in tokens ? tokens[_token1] : Native.onChain(chainId)

  const [, pair] = usePair(chainId, token0, token1)
  const { data: balance } = useBalance({ chainId, account: address, currency: pair?.liquidityToken })
  const totalSupply = usePairTotalSupply(pair?.liquidityToken.address, chainId)

  const underlying = useMemo(() => {
    if (!pair || !totalSupply || !balance?.[FundSource.WALLET]) return [undefined, undefined]
    return [
      pair.getLiquidityValue(pair.token0, totalSupply, balance?.[FundSource.WALLET].wrapped).multiply(percentageEntity),
      pair.getLiquidityValue(pair.token1, totalSupply, balance?.[FundSource.WALLET].wrapped).multiply(percentageEntity),
    ]
  }, [balance, pair, percentageEntity, totalSupply])

  const [underlying0, underlying1] = underlying
  const [value0, value1] = useTokenAmountDollarValues({ chainId, amounts: underlying })

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
    if (!chain?.id || !contract || !underlying0 || !underlying1 || !address || !pair || !balance?.[FundSource.WALLET]) {
      return
    }

    const withNative =
      Native.onChain(chainId).wrapped === pair.token0 || Native.onChain(chainId).wrapped === pair.token1
    let methodNames
    let args

    try {
      if (withNative) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          Native.onChain(chainId).wrapped === pair.token1 ? pair.token0.address : pair.token1.address,
          balance[FundSource.WALLET].multiply(percentageEntity).quotient.toString(),
          minAmount0.quotient.toString(),
          minAmount1.quotient.toString(),
          address,
          deadline.toHexString(),
        ]
      } else {
        methodNames = ['removeLiquidity']
        args = [
          pair.token0.address,
          pair.token1.address,
          balance[FundSource.WALLET].multiply(percentageEntity).quotient.toString(),
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
            .catch((error) => {
              console.error(`estimateGas failed`, methodName, args, error)
              return undefined
            })
        )
      )

      const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
        BigNumber.isBigNumber(safeGasEstimate)
      )

      if (indexOfSuccessfulEstimation === -1) {
        console.error('This transaction would fail. Please contact support.')
      } else {
        const methodName = methodNames[indexOfSuccessfulEstimation]
        const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]
        const data = await sendTransactionAsync({
          request: {
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData(methodName, args),
            gasLimit: calculateGasMargin(safeGasEstimate),
          },
        })

        createToast({
          txHash: data.hash,
          href: Chain.from(chain.id).getTxUrl(data.hash),
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
      }
    } catch (e: unknown) {
      if (!(e instanceof UserRejectedRequestError)) {
        setError((e as ProviderRpcError).message)
      }

      console.log(e)
    }
  }, [
    chain.id,
    contract,
    underlying0,
    underlying1,
    address,
    pair,
    balance,
    percentageEntity,
    minAmount0,
    minAmount1,
    deadline,
    sendTransactionAsync,
    token0.symbol,
    token1.symbol,
  ])

  useEffect(() => {
    if (
      chainId === Number(router.query.chainId) &&
      (token0.symbol === router.query.token0 || token0.wrapped.address === router.query.token0) &&
      (token1.symbol === router.query.token1 || token1.wrapped.address === router.query.token1)
    ) {
      return
    }

    void router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          chainId,
          token0: token0 && token0.isToken ? token0.address : token0.symbol,
          token1: token1 && token1.isToken ? token1.address : token1.symbol,
        },
      },
      undefined,
      { shallow: true }
    )
  }, [router, chainId, token0, token1])

  return (
    <Layout>
      <div className="flex flex-col gap-6 pb-40">
        <Widget id="addLiquidity" maxWidth={400} className="bg-slate-800">
          <Widget.Content>
            <Widget.Header title="Remove Liquidity" />
            <div className="flex flex-col gap-2 p-3">
              <div className="flex items-center gap-2">
                <div className="flex flex-grow justify-between items-center">
                  <Input.Numeric
                    onUserInput={(val) => setPercentage(Number(val))}
                    value={percentage}
                    placeholder="0"
                    variant="unstyled"
                    className={classNames(DEFAULT_INPUT_UNSTYLED, '!text-2xl')}
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="xs" onClick={() => setPercentage(25)}>
                    25%
                  </Button>
                  <Button size="xs" onClick={() => setPercentage(50)}>
                    50%
                  </Button>
                  <Button size="xs" onClick={() => setPercentage(75)}>
                    75%
                  </Button>
                  <Button size="xs" onClick={() => setPercentage(100)}>
                    MAX
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 pb-2 justify-between items-center">
                <Transition
                  appear
                  as={Fragment}
                  show={Boolean(balance?.[FundSource.WALLET])}
                  enter="transition duration-300 origin-center ease-out"
                  enterFrom="transform scale-90 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform opacity-100"
                  leaveTo="transform opacity-0"
                >
                  <Typography variant="sm" weight={500} className="text-slate-300 hover:text-slate-20">
                    {formatUSD((value0 + value1) * (percentage / 100))}
                  </Typography>
                </Transition>
                <Transition
                  appear
                  show={Boolean(balance?.[FundSource.WALLET])}
                  as={Fragment}
                  enter="transition duration-300 origin-center ease-out"
                  enterFrom="transform scale-90 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform opacity-100"
                  leaveTo="transform opacity-0"
                >
                  <Typography
                    onClick={() => setPercentage(100)}
                    as="button"
                    variant="sm"
                    weight={500}
                    className="col-span-2 justify-end flex text-slate-300 hover:text-slate-200 truncate"
                  >
                    Balance: {balance?.[FundSource.WALLET].toSignificant(6)}
                  </Typography>
                </Transition>
              </div>
              <Transition
                show={percentage > 0}
                unmount={false}
                className="transition-[max-height] overflow-hidden"
                enter="duration-300 ease-in-out"
                enterFrom="transform max-h-0"
                enterTo="transform max-h-[380px]"
                leave="transition-[max-height] duration-250 ease-in-out"
                leaveFrom="transform max-h-[380px]"
                leaveTo="transform max-h-0"
              >
                <div className="py-3 pt-5 flex flex-col gap-3 border-t border-slate-200/5">
                  <Typography variant="sm" weight={400} className="text-slate-400 pb-1">
                    You&apos;ll receive
                  </Typography>

                  <div className="flex items-center justify-between">
                    <Typography weight={500} className="flex gap-2 items-center text-slate-50">
                      <UICurrency.Icon currency={token0} width={20} height={20} />
                      <span className="text-slate-400">
                        <span className="text-slate-50">{underlying0?.toSignificant(6)}</span>{' '}
                        {Native.onChain(chainId).wrapped === pair.token0
                          ? Native.onChain(chainId).symbol
                          : underlying0?.currency.symbol}
                      </span>
                    </Typography>
                    <Typography variant="xs" className="text-slate-400">
                      {formatUSD(value0)}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography weight={500} className="flex gap-2 items-center text-slate-50">
                      <UICurrency.Icon currency={token1} width={20} height={20} />
                      <span className="text-slate-400">
                        <span className="text-slate-50">{underlying1?.toSignificant(6)}</span>{' '}
                        {Native.onChain(chainId).wrapped === pair.token1
                          ? Native.onChain(chainId).symbol
                          : underlying1?.currency.symbol}
                      </span>
                    </Typography>
                    <Typography variant="xs" className="text-slate-400">
                      {formatUSD(value1)}
                    </Typography>
                  </div>
                </div>
              </Transition>
              {isMounted && !address ? (
                <Wallet.Button appearOnMount={false} fullWidth color="blue" size="md">
                  Connect Wallet
                </Wallet.Button>
              ) : isMounted && chain && chain.id !== chainId ? (
                <Button size="md" fullWidth onClick={() => switchNetwork && switchNetwork(chainId)}>
                  Switch to {Chain.from(chainId).name}
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
                      <Approve.Token
                        size="md"
                        className="whitespace-nowrap"
                        fullWidth
                        amount={balance?.[FundSource.WALLET].multiply(percentageEntity)}
                        address={getV2RouterContractConfig(chainId).addressOrName}
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
              )}
            </div>
          </Widget.Content>
        </Widget>
      </div>
    </Layout>
  )
}

export default RemovePage
