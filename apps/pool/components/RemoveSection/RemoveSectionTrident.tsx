import { Signature } from '@ethersproject/bytes'
import { Transition } from '@headlessui/react'
import { Chain } from '@sushiswap/chain'
import { Amount, Native } from '@sushiswap/currency'
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
import { FC, Fragment, useCallback, useMemo, useState } from 'react'
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
import { useTokenAmountDollarValues, useTokensFromPair, useUnderlyingTokenBalanceFromPair } from '../../lib/hooks'
import { useSettings } from '../../lib/state/storage'
import { Layout } from '../Layout'

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
  const [value0, value1] = useTokenAmountDollarValues({ chainId: pair.chainId, amounts: underlying })

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

    const indexOfWETH = minAmount0.wrapped.currency.address === Native.onChain(pair.chainId).wrapped.address ? 0 : 1

    const actions = [
      approveMasterContractAction({ router: contract, signature: permit }),
      burnLiquidityAction({
        router: contract,
        address: pool.liquidityToken.address,
        amount: slpAmountToRemove.quotient.toString(),
        recipient: contract.address,
        liquidityOutput,
        receiveToWallet: true,
      }),
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
      }),
    ]

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
                    {formatUSD((Number(value0) + Number(value1)) * (percentage / 100))}
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
                show={Boolean(percentage > 0 && pair)}
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
                    <Typography variant="sm" weight={500} className="flex gap-2 items-center text-slate-50">
                      {token0 && <UICurrency.Icon currency={token0} width={20} height={20} />}
                      <span className="text-slate-400">
                        <span className="text-slate-50">{underlying0?.toSignificant(6)}</span>{' '}
                        {Native.onChain(pair.chainId).wrapped === pool?.token0
                          ? Native.onChain(pair.chainId).symbol
                          : underlying0?.currency.symbol}
                      </span>
                    </Typography>
                    <Typography variant="xs" className="text-slate-400">
                      {formatUSD(Number(value0))}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="sm" weight={500} className="flex gap-2 items-center text-slate-50">
                      {token1 && <UICurrency.Icon currency={token1} width={20} height={20} />}
                      <span className="text-slate-400">
                        <span className="text-slate-50">{underlying1?.toSignificant(6)}</span>{' '}
                        {Native.onChain(pair.chainId).wrapped === pool?.token1
                          ? Native.onChain(pair.chainId).symbol
                          : underlying1?.currency.symbol}
                      </span>
                    </Typography>
                    <Typography variant="xs" className="text-slate-400">
                      {formatUSD(Number(value1))}
                    </Typography>
                  </div>
                </div>
              </Transition>
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
              {error && (
                <Typography variant="xs" className="text-center text-red mt-4" weight={500}>
                  {error}
                </Typography>
              )}
            </div>
          </Widget.Content>
        </Widget>
      </div>
    </Layout>
  )
}
