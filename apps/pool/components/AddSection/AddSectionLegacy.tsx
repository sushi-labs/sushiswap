import { AddressZero } from '@ethersproject/constants'
import { PlusIcon } from '@heroicons/react/solid'
import { Chain } from '@sushiswap/chain'
import { Amount, Price, tryParseAmount } from '@sushiswap/currency'
import { calculateSlippageAmount } from '@sushiswap/exchange'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Percent } from '@sushiswap/math'
import { Button, createToast, Dialog, Dots, Typography } from '@sushiswap/ui'
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
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo, useState } from 'react'
import {
  ProviderRpcError,
  useAccount,
  useNetwork,
  UserRejectedRequestError,
  useSendTransaction,
  useSwitchNetwork,
} from 'wagmi'

import { useTokenAmountDollarValues, useTokensFromPair, useTransactionDeadline } from '../../lib/hooks'
import { useCustomTokens, useSettings } from '../../lib/state/storage'
import { useTokens } from '../../lib/state/token-lists'
import { Rate } from '../Rate'
import { AddSectionProps } from './AddSection'

export const AddSectionLegacy: FC<AddSectionProps> = ({ pair }) => {
  const { token0, token1 } = useTokensFromPair(pair)
  const { chain } = useNetwork()
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const contract = useV2RouterContract(pair.chainId)
  const tokenMap = useTokens(pair.chainId)
  const deadline = useTransactionDeadline(pair.chainId)
  const { switchNetwork } = useSwitchNetwork()
  const [{ slippageTolerance }] = useSettings()
  const router = useRouter()

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(pair.chainId)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction({ chainId: pair.chainId })

  const [error, setError] = useState<string>()
  const [review, setReview] = useState(false)
  const [{ input0, input1 }, setTypedAmounts] = useState<{ input0: string; input1: string }>({ input0: '', input1: '' })

  const [poolState, pool] = usePair(pair.chainId, token0, token1)
  const { data: balances } = useBalances({ chainId: pair.chainId, account: address, currencies: [token0, token1] })
  const { data: prices } = usePrices({ chainId: pair.chainId })

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      parsedInput0
        ? poolState === PairState.NOT_EXISTS
          ? parsedInput0
          : Amount.fromRawAmount(parsedInput0.currency, calculateSlippageAmount(parsedInput0, slippagePercent)[0])
        : undefined,
      parsedInput1
        ? poolState === PairState.NOT_EXISTS
          ? parsedInput1
          : Amount.fromRawAmount(parsedInput1.currency, calculateSlippageAmount(parsedInput1, slippagePercent)[0])
        : undefined,
    ]
  }, [poolState, parsedInput0, parsedInput1, slippagePercent])

  const onChangeToken0TypedAmount = useCallback(
    (value) => {
      if (poolState === PairState.NOT_EXISTS) {
        setTypedAmounts((prev) => ({
          ...prev,
          input0: value,
        }))
      } else if (token0 && pool) {
        const parsedAmount = tryParseAmount(value, token0)
        setTypedAmounts({
          input0: value,
          input1: parsedAmount ? pool.priceOf(token0.wrapped).quote(parsedAmount.wrapped).toExact() : '',
        })
      }
    },
    [pool, poolState, token0]
  )

  const onChangeToken1TypedAmount = useCallback(
    (value) => {
      if (poolState === PairState.NOT_EXISTS) {
        setTypedAmounts((prev) => ({
          ...prev,
          input1: value,
        }))
      } else if (token1 && pool) {
        const parsedAmount = tryParseAmount(value, token1)
        setTypedAmounts({
          input0: parsedAmount ? pool.priceOf(token1.wrapped).quote(parsedAmount.wrapped).toExact() : '',
          input1: value,
        })
      }
    },
    [pool, poolState, token1]
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

  const [value0, value1] = useTokenAmountDollarValues({ chainId: pair.chainId, amounts: [parsedInput0, parsedInput1] })

  const price = useMemo(() => {
    if (!parsedInput0 || !parsedInput1) return undefined
    return new Price({ baseAmount: parsedInput0, quoteAmount: parsedInput1 })
  }, [parsedInput0, parsedInput1])

  return (
    <div>
      <Widget id="addLiquidity" maxWidth={400}>
        <Widget.Content>
          <Widget.Header title="Add Liquidity" />
          <Web3Input.Currency
            className="p-3"
            value={input0}
            onChange={onChangeToken0TypedAmount}
            currency={token0}
            customTokenMap={customTokensMap}
            onAddToken={addCustomToken}
            onRemoveToken={removeCustomToken}
            chainId={pair.chainId}
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
              onChange={onChangeToken1TypedAmount}
              currency={token1}
              customTokenMap={customTokensMap}
              onAddToken={addCustomToken}
              onRemoveToken={removeCustomToken}
              chainId={pair.chainId}
              tokenMap={tokenMap}
            />
            <div className="p-3">
              {isMounted && !address ? (
                <Wallet.Button appearOnMount={false} fullWidth color="blue" size="md">
                  Connect Wallet
                </Wallet.Button>
              ) : isMounted && chain && chain.id !== pair.chainId ? (
                <Button size="md" fullWidth onClick={() => switchNetwork && switchNetwork(pair.chainId)}>
                  Switch to {Chain.from(pair.chainId).name}
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
                <Button fullWidth size="md" variant="filled" disabled={isWritePending} onClick={() => setReview(true)}>
                  {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add Liquidity'}
                </Button>
              )}
            </div>
          </div>
        </Widget.Content>
      </Widget>
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
                {value0 ? `$${value0.toFixed(2)}` : '-'}
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
                {value1 ? `$${value1.toFixed(2)}` : ''}
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
                  address={getV2RouterContractConfig(pair.chainId).addressOrName}
                />
                <Approve.Token
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={parsedInput1}
                  address={getV2RouterContractConfig(pair.chainId).addressOrName}
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
    </div>
  )
}
