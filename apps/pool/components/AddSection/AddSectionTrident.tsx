import { defaultAbiCoder } from '@ethersproject/abi'
import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { PlusIcon } from '@heroicons/react/solid'
import { Chain } from '@sushiswap/chain'
import { Amount, Price, tryParseAmount } from '@sushiswap/currency'
import { calculateSlippageAmount } from '@sushiswap/exchange'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { JSBI, Percent, ZERO } from '@sushiswap/math'
import { Button, createToast, Dialog, Dots, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import { Widget } from '@sushiswap/ui/widget'
import {
  Approve,
  BENTOBOX_ADDRESS,
  getV3RouterContractConfig,
  PoolState,
  useBalances,
  useBentoBoxTotals,
  useConstantProductPool,
  useTotalSupply,
  useV3RouterContract,
  Wallet,
  Web3Input,
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
import { approveMasterContractAction, batchAction, getAsEncodedAction, LiquidityInput } from '../../lib/actions'
import { useTokenAmountDollarValues, useTokensFromPair } from '../../lib/hooks'
import { useCustomTokens, useSettings } from '../../lib/state/storage'
import { useTokens } from '../../lib/state/token-lists'
import { Rate } from '../Rate'

const ZERO_PERCENT = new Percent('0')

export const AddSectionTrident: FC<{ pair: Pair }> = ({ pair }) => {
  const { token0, token1, liquidityToken } = useTokensFromPair(pair)
  const { chain } = useNetwork()
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const contract = useV3RouterContract(pair.chainId)
  const tokenMap = useTokens(pair.chainId)
  const { switchNetwork } = useSwitchNetwork()
  const [{ slippageTolerance }] = useSettings()
  const [permit, setPermit] = useState<Signature>()
  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(pair.chainId)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction({ chainId: pair.chainId })

  const [error, setError] = useState<string>()
  const [review, setReview] = useState(false)
  const [{ input0, input1 }, setTypedAmounts] = useState<{ input0: string; input1: string }>({ input0: '', input1: '' })

  const [poolState, pool] = useConstantProductPool(pair.chainId, token0, token1, pair.swapFee, pair.twapEnabled)
  const totalSupply = useTotalSupply(liquidityToken)
  const { data: balances } = useBalances({ chainId: pair.chainId, account: address, currencies: [token0, token1] })
  const rebases = useBentoBoxTotals(pair.chainId, [token0, token1])

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      parsedInput0
        ? poolState === PoolState.NOT_EXISTS
          ? parsedInput0
          : Amount.fromRawAmount(parsedInput0.currency, calculateSlippageAmount(parsedInput0, slippagePercent)[0])
        : undefined,
      parsedInput1
        ? poolState === PoolState.NOT_EXISTS
          ? parsedInput1
          : Amount.fromRawAmount(parsedInput1.currency, calculateSlippageAmount(parsedInput1, slippagePercent)[0])
        : undefined,
    ]
  }, [poolState, parsedInput0, parsedInput1, slippagePercent])

  const [value0, value1] = useTokenAmountDollarValues({ chainId: pair.chainId, amounts: [parsedInput0, parsedInput1] })

  const onChangeToken0TypedAmount = useCallback(
    (value) => {
      if (poolState === PoolState.NOT_EXISTS) {
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
      if (poolState === PoolState.NOT_EXISTS) {
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

  const noLiquidity = useMemo(() => {
    return (
      poolState === PoolState.NOT_EXISTS ||
      Boolean(totalSupply && JSBI.equal(totalSupply.quotient, ZERO)) ||
      Boolean(pool && JSBI.equal(pool.reserve0.quotient, ZERO) && JSBI.equal(pool.reserve1.quotient, ZERO))
    )
  }, [pool, poolState, totalSupply])

  const liquidityMinted = useMemo(() => {
    if (
      pool &&
      totalSupply &&
      token0 &&
      token1 &&
      parsedInput0 &&
      parsedInput1 &&
      rebases?.[token0.wrapped.address] &&
      rebases?.[token1.wrapped.address]
    ) {
      const amountA = parsedInput0.wrapped.toShare(rebases?.[token0.wrapped.address])
      const amountB = parsedInput1.wrapped.toShare(rebases?.[token1.wrapped.address])

      // Both can't be zero
      if (amountA.equalTo(ZERO) && amountB.equalTo(ZERO)) return undefined

      try {
        const slp = pool.getLiquidityMinted(totalSupply, amountA, amountB)
        const minSLP = calculateSlippageAmount(slp, noLiquidity ? ZERO_PERCENT : slippagePercent)[0]
        return Amount.fromRawAmount(slp.currency, minSLP.toString())
      } catch (error) {
        console.error(error)
      }
    }

    return undefined
  }, [noLiquidity, parsedInput0, parsedInput1, pool, rebases, slippagePercent, token0, token1, totalSupply])

  const execute = useCallback(async () => {
    if (
      !pool ||
      !token0 ||
      !token1 ||
      !pair.chainId ||
      !contract ||
      !parsedInput0 ||
      !parsedInput1 ||
      !address ||
      !minAmount0 ||
      !minAmount1 ||
      !liquidityMinted
    )
      return

    let value
    const liquidityInput: LiquidityInput[] = []
    const encoded = defaultAbiCoder.encode(['address'], [address])

    try {
      if (parsedInput0) {
        if (parsedInput0.currency.isNative) {
          value = parsedInput0.quotient.toString()
        }

        liquidityInput.push({
          token: parsedInput0.currency.isNative ? AddressZero : parsedInput0.currency.wrapped.address,
          native: true,
          amount: parsedInput0.quotient.toString(),
        })
      }

      if (parsedInput1) {
        if (parsedInput1.currency.isNative) {
          value = parsedInput1.quotient.toString()
        }

        liquidityInput.push({
          token: parsedInput1.currency.isNative ? AddressZero : parsedInput1.currency.wrapped.address,
          native: true,
          amount: parsedInput1.quotient.toString(),
        })
      }

      if (liquidityInput.length === 0) return

      const data = await sendTransactionAsync({
        request: {
          from: address,
          to: contract.address,
          data: batchAction({
            contract,
            actions: [
              approveMasterContractAction({ router: contract, signature: permit }),
              getAsEncodedAction({
                contract,
                fn: 'addLiquidity',
                args: [liquidityInput, pool.liquidityToken.address, liquidityMinted.quotient.toString(), encoded],
              }),
            ],
          }),
          ...(value && { value }),
        },
      })

      createToast({
        txHash: data.hash,
        href: Chain.from(pool.chainId).getTxUrl(data.hash),
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
    pool,
    token0,
    token1,
    pair.chainId,
    contract,
    parsedInput0,
    parsedInput1,
    address,
    minAmount0,
    minAmount1,
    liquidityMinted,
    sendTransactionAsync,
    permit,
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
            loading={false}
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
                  amount={parsedInput0}
                  address={chain ? BENTOBOX_ADDRESS[chain?.id] : undefined}
                />
                <Approve.Token
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={parsedInput1}
                  address={chain ? BENTOBOX_ADDRESS[chain?.id] : undefined}
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
