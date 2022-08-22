import { AddressZero } from '@ethersproject/constants'
import { Transition } from '@headlessui/react'
import { ExternalLinkIcon, PlusIcon } from '@heroicons/react/solid'
import { Chain, ChainId, chainShortName } from '@sushiswap/chain'
import { Amount, Currency, Native, Price, tryParseAmount } from '@sushiswap/currency'
import { calculateSlippageAmount, computePairAddress, FACTORY_ADDRESS } from '@sushiswap/exchange'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Percent } from '@sushiswap/math'
import { Button, Container, createToast, Dialog, Dots, Link, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import { Widget } from '@sushiswap/ui/widget'
import {
  Approve,
  calculateGasMargin,
  PairState,
  useBalances,
  usePair,
  usePrices,
  Wallet,
  Web3Input,
} from '@sushiswap/wagmi'
import { getV2RouterContractConfig, useV2RouterContract } from '@sushiswap/wagmi/hooks/useV2Router'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { ProviderRpcError, useSwitchNetwork } from 'wagmi'
import { useAccount, useNetwork, UserRejectedRequestError, useSendTransaction } from 'wagmi'

import { Layout, Rate } from '../components'
import { AddSectionStepper } from '../components/AddSection'
import { AddSectionMyPosition } from '../components/AddSection/AddSectionMyPosition'
import { useTransactionDeadline } from '../lib/hooks'
import { useCustomTokens, useSettings } from '../lib/state/storage'
import { useTokens } from '../lib/state/token-lists'
import { PairWithAlias } from '../types'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      ...(query.token0 && { token0: query.token0 }),
      ...(query.token1 && { token1: query.token1 }),
      ...(query.chainId && { chainId: query.chainId }),
    },
  }
}

const AddPage = ({
  token0: _token0,
  token1: _token1,
  chainId: _chainId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { chain } = useNetwork()
  const chainId = Number(_chainId ?? chain?.id ?? ChainId.ETHEREUM)
  const tokens = useTokens(chainId)
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const contract = useV2RouterContract(chainId)
  const tokenMap = useTokens(chainId)
  const deadline = useTransactionDeadline(chainId)
  const { switchNetwork } = useSwitchNetwork()
  const [{ slippageTolerance }] = useSettings()
  const router = useRouter()
  const [step, setStep] = useState(1)

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction({ chainId })

  const [error, setError] = useState<string>()
  const [review, setReview] = useState(false)
  const [{ input0, input1 }, setTypedAmounts] = useState<{ input0: string; input1: string }>({ input0: '', input1: '' })

  const [token0, setToken0] = useState<Currency | undefined>(
    _token0 === Native.onChain(chainId).symbol
      ? Native.onChain(chainId)
      : _token0 in tokens
      ? tokens[_token0]
      : undefined
  )

  // Check if Sushi address to avoid token flash on init since useTokens isn't available on server
  const [token1, setToken1] = useState<Currency | undefined>(
    _token1 === Native.onChain(chainId).symbol
      ? Native.onChain(chainId)
      : _token1 in tokens
      ? tokens[_token1]
      : undefined
  )

  const id =
    token0 && token1 && chainId
      ? `${chainShortName[chainId]}:${computePairAddress({
          factoryAddress: FACTORY_ADDRESS[token0.chainId],
          tokenA: token0.wrapped,
          tokenB: token1.wrapped,
        }).toLowerCase()}`
      : undefined

  const { data: pairData } = useSWR<{ pair: PairWithAlias }>(id ? `/pool/api/pool/${id}` : null, (url) =>
    fetch(url).then((response) => response.json())
  )

  const loadingToken0 = _token0 && !token0
  const loadingToken1 = _token1 && !token1

  const [pairState, pair] = usePair(chainId, token0, token1)
  const { data: balances } = useBalances({ chainId, account: address, currencies: [token0, token1] })
  const { data: prices } = usePrices({ chainId })

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      parsedInput0
        ? pairState === PairState.NOT_EXISTS
          ? parsedInput0
          : Amount.fromRawAmount(parsedInput0.currency, calculateSlippageAmount(parsedInput0, slippagePercent)[0])
        : undefined,
      parsedInput1
        ? pairState === PairState.NOT_EXISTS
          ? parsedInput1
          : Amount.fromRawAmount(parsedInput1.currency, calculateSlippageAmount(parsedInput1, slippagePercent)[0])
        : undefined,
    ]
  }, [pairState, parsedInput0, parsedInput1, slippagePercent])

  const onChangeToken0TypedAmount = useCallback(
    (value) => {
      if (pairState === PairState.NOT_EXISTS) {
        setTypedAmounts((prev) => ({
          ...prev,
          input0: value,
        }))
      } else if (token0 && pair) {
        const parsedAmount = tryParseAmount(value, token0)
        setTypedAmounts({
          input0: value,
          input1: parsedAmount ? pair.priceOf(token0.wrapped).quote(parsedAmount.wrapped).toExact() : '',
        })
      }
    },
    [pair, pairState, token0]
  )

  const onChangeToken1TypedAmount = useCallback(
    (value) => {
      if (pairState === PairState.NOT_EXISTS) {
        setTypedAmounts((prev) => ({
          ...prev,
          input1: value,
        }))
      } else if (token1 && pair) {
        const parsedAmount = tryParseAmount(value, token1)
        setTypedAmounts({
          input0: parsedAmount ? pair.priceOf(token1.wrapped).quote(parsedAmount.wrapped).toExact() : '',
          input1: value,
        })
      }
    },
    [pair, pairState, token1]
  )

  const execute = useCallback(async () => {
    if (
      !token0 ||
      !token1 ||
      !chain?.id ||
      !contract ||
      !parsedInput0 ||
      !parsedInput1 ||
      !address ||
      !minAmount0 ||
      !minAmount1
    )
      return
    const withNative = token0.isNative || token1.isNative

    try {
      let data
      if (withNative) {
        const value = (token1.isNative ? parsedInput1 : parsedInput0).quotient.toString()
        const args = [
          (token1.isNative ? token0 : token1).wrapped.address,
          (token1.isNative ? parsedInput0 : parsedInput1).quotient.toString(),
          (token1.isNative ? minAmount0 : minAmount1).quotient.toString(),
          (token1.isNative ? minAmount1 : minAmount0).quotient.toString(),
          address,
          deadline.toHexString(),
        ]

        const gasLimit = await contract.estimateGas.addLiquidityETH(...args, { value })
        data = await sendTransactionAsync({
          request: {
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData('addLiquidityETH', args),
            value,
            gasLimit: calculateGasMargin(gasLimit),
          },
        })
      } else {
        const args = [
          token0.wrapped.address,
          token1.wrapped.address,
          parsedInput0.quotient.toString(),
          parsedInput1.quotient.toString(),
          minAmount0.quotient.toString(),
          minAmount1.quotient.toString(),
          address,
          deadline.toHexString(),
        ]

        const gasLimit = await contract.estimateGas.addLiquidity(...args, {})
        data = await sendTransactionAsync({
          request: {
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData('addLiquidity', args),
            gasLimit: calculateGasMargin(gasLimit),
          },
        })
      }

      createToast({
        txHash: data.hash,
        href: Chain.from(chain.id).getTxUrl(data.hash),
        promise: data.wait(),
        summary: {
          pending: (
            <Dots>
              Adding liquidity to the {token0.symbol}/{token1.symbol} pair
            </Dots>
          ),
          completed: `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          failed: 'Something went wrong when adding liquidity',
        },
      })
    } catch (e: unknown) {
      if (!(e instanceof UserRejectedRequestError)) {
        setError((e as ProviderRpcError).message)
      }

      console.log(e)
    }
  }, [
    chain?.id,
    contract,
    parsedInput0,
    parsedInput1,
    address,
    token0,
    token1,
    sendTransactionAsync,
    minAmount0,
    minAmount1,
    deadline,
  ])

  const insufficientBalance =
    token0 && token1
      ? (parsedInput0 &&
          balances?.[token0.isNative ? AddressZero : token0.wrapped.address]?.[FundSource.WALLET]?.lessThan(
            parsedInput0
          )) ||
        (parsedInput1 &&
          balances?.[token1.isNative ? AddressZero : token1.wrapped.address]?.[FundSource.WALLET]?.lessThan(
            parsedInput1
          ))
      : undefined

  const [inputUsd, outputUsd] = useMemo(() => {
    if (!token0 || !token1) return [undefined, undefined]
    const token0Price = prices?.[token0.wrapped.address]
    const token1Price = prices?.[token1.wrapped.address]

    const inputUSD = parsedInput0 && token0Price ? parsedInput0.multiply(token0Price.asFraction) : undefined
    const outputUSD = parsedInput1 && token1Price ? parsedInput1.multiply(token1Price.asFraction) : undefined
    return [inputUSD, outputUSD]
  }, [parsedInput0, parsedInput1, prices, token0, token1])

  useEffect(() => {
    if (
      token0 &&
      token1 &&
      chainId === Number(router.query.chainId) &&
      (token0.symbol === router.query.token0 || token0.wrapped.address === router.query.token0) &&
      (token1.symbol === router.query.token1 || token1.wrapped.address === router.query.token1)
    ) {
      return
    }

    if (token0 && token1) {
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
    }
  }, [router, chainId, token0, token1])

  useEffect(() => {
    setToken0(
      _token0 === Native.onChain(chainId).symbol
        ? Native.onChain(chainId)
        : _token0 in tokens
        ? tokens[_token0]
        : undefined
    )
  }, [_token0, chainId, tokens])
  useEffect(() => {
    setToken1(
      _token1 === Native.onChain(chainId).symbol
        ? Native.onChain(chainId)
        : _token1 in tokens
        ? tokens[_token1]
        : undefined
    )
  }, [_token1, chainId, tokens])

  const price = useMemo(() => {
    if (!parsedInput0 || !parsedInput1) return undefined
    return new Price({ baseAmount: parsedInput0, quoteAmount: parsedInput1 })
  }, [parsedInput0, parsedInput1])

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-[264px_396px_264px] gap-10">
        <div />
        <div className="flex flex-col gap-3 pb-40">
          <Widget id="addLiquidity" maxWidth={400}>
            <Widget.Content>
              <Widget.Header title="Add Liquidity" />
              <Web3Input.Currency
                className="p-3"
                loading={loadingToken0}
                value={input0}
                onChange={onChangeToken0TypedAmount}
                currency={token0}
                onSelect={setToken0}
                customTokenMap={customTokensMap}
                onAddToken={addCustomToken}
                onRemoveToken={removeCustomToken}
                chainId={chainId}
                tokenMap={tokenMap}
              />
              <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
                <div className="group bg-slate-700 p-0.5 border-2 border-slate-800 transition-all rounded-full">
                  <PlusIcon width={16} height={16} />
                </div>
              </div>
              <div className="bg-slate-800">
                <Web3Input.Currency
                  className="p-3 !pb-1"
                  value={input1}
                  loading={loadingToken1}
                  onChange={onChangeToken1TypedAmount}
                  currency={token1}
                  onSelect={setToken1}
                  customTokenMap={customTokensMap}
                  onAddToken={addCustomToken}
                  onRemoveToken={removeCustomToken}
                  chainId={chainId}
                  tokenMap={tokenMap}
                />
                <div className="p-3">
                  {isMounted && !address ? (
                    <Wallet.Button appearOnMount={false} fullWidth color="blue" size="md">
                      Connect Wallet
                    </Wallet.Button>
                  ) : isMounted && chain && chain.id !== chainId ? (
                    <Button size="md" fullWidth onClick={() => switchNetwork && switchNetwork(chainId)}>
                      Switch to {Chain.from(chainId).name}
                    </Button>
                  ) : !parsedInput0 || !parsedInput1 ? (
                    <Button size="md" fullWidth disabled>
                      Enter Amounts
                    </Button>
                  ) : insufficientBalance ? (
                    <Button size="md" fullWidth disabled>
                      Insufficient Balance
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      size="md"
                      variant="filled"
                      disabled={isWritePending}
                      onClick={() => setReview(true)}
                    >
                      {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add Liquidity'}
                    </Button>
                  )}
                </div>
              </div>
            </Widget.Content>
          </Widget>
          <Container className="mx-auto max-w-[400px]">
            <Link.External
              href="https://docs.sushi.com/docs/Products/Sushiswap/Liquidity%20Pools"
              className="flex justify-center px-6 py-4 decoration-slate-500 hover:bg-opacity-[0.06] cursor-pointer rounded-2xl"
            >
              <Typography variant="xs" weight={500} className="flex items-center gap-1 text-slate-500">
                Learn more about liquidity and yield farming
                <ExternalLinkIcon width={16} height={16} className="text-slate-500" />
              </Typography>
            </Link.External>
          </Container>
        </div>
        <div>
          {pairData?.pair && (
            <Transition
              appear
              show={true}
              enter="transition duration-300 origin-center ease-out"
              enterFrom="transform scale-90 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform opacity-100"
              leaveTo="transform opacity-0"
            >
              <div className="flex flex-col bg-white bg-opacity-[0.04] rounded-2xl">
                <AddSectionStepper onClick={setStep} step={step} pair={pairData.pair} />
                <div className="px-5">
                  <hr className="h-px border-t border-slate-200/5" />
                </div>
                <AddSectionMyPosition pair={pairData.pair} />
              </div>
            </Transition>
          )}
        </div>
      </div>
      <Dialog open={review} onClose={() => setReview(false)}>
        <Dialog.Content className="max-w-sm !pb-4">
          <Dialog.Header border={false} title="Add Liquidity" onClose={() => setReview(false)} />
          <div className="!my-0 grid grid-cols-12 items-center">
            <div className="relative flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-700/40 border-slate-200/5">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-between w-full gap-2">
                  <Typography variant="h3" weight={500} className="truncate text-slate-50">
                    {parsedInput0?.toSignificant(6)}{' '}
                  </Typography>
                  <div className="flex items-center justify-end gap-2 text-right">
                    {parsedInput0 && (
                      <div className="w-5 h-5">
                        <Icon currency={parsedInput0.currency} width={20} height={20} />
                      </div>
                    )}
                    <Typography variant="h3" weight={500} className="text-right text-slate-50">
                      {parsedInput0?.currency.symbol}
                    </Typography>
                  </div>
                </div>
              </div>
              <Typography variant="sm" weight={500} className="text-slate-500">
                {inputUsd ? `$${inputUsd.toFixed(2)}` : '-'}
              </Typography>
            </div>
            <div className="flex items-center justify-center col-span-12 -mt-2.5 -mb-2.5">
              <div className="p-0.5 bg-slate-700 border-2 border-slate-800 ring-1 ring-slate-200/5 z-10 rounded-full">
                <PlusIcon width={18} height={18} className="text-slate-200" />
              </div>
            </div>
            <div className="flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-700/40 border-slate-200/5">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-between w-full gap-2">
                  <Typography variant="h3" weight={500} className="truncate text-slate-50">
                    {parsedInput1?.toSignificant(6)}{' '}
                  </Typography>
                  <div className="flex items-center justify-end gap-2 text-right">
                    {parsedInput1 && (
                      <div className="w-5 h-5">
                        <Icon currency={parsedInput1.currency} width={20} height={20} />
                      </div>
                    )}
                    <Typography variant="h3" weight={500} className="text-right text-slate-50">
                      {parsedInput1?.currency.symbol}
                    </Typography>
                  </div>
                </div>
              </div>
              <Typography variant="sm" weight={500} className="text-slate-500">
                {outputUsd ? `$${outputUsd.toFixed(2)}` : ''}
              </Typography>
            </div>
          </div>
          <div className="flex justify-center p-4">
            <Rate price={price}>
              {({ toggleInvert, content, usdPrice }) => (
                <Typography
                  as="button"
                  onClick={() => toggleInvert()}
                  variant="sm"
                  weight={600}
                  className="flex items-center gap-1 text-slate-100"
                >
                  {content} {usdPrice && <span className="font-normal text-slate-300">(${usdPrice})</span>}
                </Typography>
              )}
            </Rate>
          </div>
          <Approve
            className="flex-grow !justify-end"
            components={
              <Approve.Components>
                <Approve.Token
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={parsedInput0}
                  address={getV2RouterContractConfig(chainId).addressOrName}
                />
                <Approve.Token
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={parsedInput1}
                  address={getV2RouterContractConfig(chainId).addressOrName}
                />
              </Approve.Components>
            }
            render={({ approved }) => {
              return (
                <Button size="md" disabled={!approved} fullWidth color="gradient" onClick={execute}>
                  Add
                </Button>
              )
            }}
          />
          {error && (
            <Typography variant="xs" className="text-center text-red mt-4" weight={500}>
              {error}
            </Typography>
          )}
        </Dialog.Content>
      </Dialog>
      <div className="z-[-1] bg-gradient-radial from-blue-500/10 via-slate-900 to-slate-900 fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
    </Layout>
  )
}

export default AddPage
