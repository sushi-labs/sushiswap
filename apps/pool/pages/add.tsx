import { AddressZero } from '@ethersproject/constants'
import { PlusIcon } from '@heroicons/react/solid'
import { Chain } from '@sushiswap/chain'
import { Amount, Currency, tryParseAmount } from '@sushiswap/currency'
import { calculateSlippageAmount } from '@sushiswap/exchange'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Percent } from '@sushiswap/math'
import { Button, createToast, Dialog, Dots } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { Approve, calculateGasMargin, PairState, useBalances, usePair, Wallet, Web3Input } from '@sushiswap/wagmi'
import { getV2RouterContractConfig, useV2RouterContract } from '@sushiswap/wagmi/hooks/useV2Router'
import { useCallback, useMemo, useState } from 'react'
import { ProviderRpcError } from 'wagmi'
import { useAccount, useNetwork, UserRejectedRequestError, useSendTransaction } from 'wagmi'

import { Layout } from '../components'
import { useTransactionDeadline } from '../lib/hooks'
import { useCustomTokens, useSettings } from '../lib/state/storage'
import { useTokens } from '../lib/state/token-lists'

const AddPage = () => {
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const contract = useV2RouterContract(activeChain?.id)
  const tokenMap = useTokens(activeChain?.id)
  const deadline = useTransactionDeadline()
  const [{ slippageTolerance }] = useSettings()

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(activeChain?.id)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction({ chainId: activeChain?.id })

  const [error, setError] = useState<string>()
  const [review, setReview] = useState(false)
  const [{ input0, input1 }, setTypedAmounts] = useState<{ input0: string; input1: string }>({ input0: '', input1: '' })
  const [token0, setToken0] = useState<Currency>()
  const [token1, setToken1] = useState<Currency>()
  const [pairState, pair] = usePair(activeChain?.id, token0, token1)
  const { data: balances } = useBalances({ chainId: activeChain?.id, account: address, currencies: [token0, token1] })

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
      } else if (token0) {
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
      } else if (token1) {
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
    if (!activeChain?.id || !contract || !parsedInput0 || !parsedInput1 || !address) return
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

        console.log(contract.address, contract.interface.encodeFunctionData('addLiquidity', args))
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
        href: Chain.from(activeChain.id).getTxUrl(data.hash),
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
    activeChain?.id,
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
    (parsedInput0 &&
      balances?.[token0.isNative ? AddressZero : token0.wrapped.address][FundSource.WALLET]?.lessThan(parsedInput0)) ||
    (parsedInput1 &&
      balances?.[token1.isNative ? AddressZero : token1.wrapped.address][FundSource.WALLET]?.lessThan(parsedInput1))

  return (
    <Layout>
      <div className="flex flex-col gap-10 pb-40">
        <Widget id="addLiquidity" maxWidth={400}>
          <Widget.Content>
            <Widget.Header title={pairState === PairState.EXISTS ? 'Add Liquidity' : 'Create Pool'} />
            <Web3Input.Currency
              className="p-3"
              value={input0}
              onChange={onChangeToken0TypedAmount}
              currency={token0}
              onSelect={setToken0}
              customTokenMap={customTokensMap}
              onAddToken={addCustomToken}
              onRemoveToken={removeCustomToken}
              chainId={activeChain?.id}
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
                onSelect={setToken1}
                customTokenMap={customTokensMap}
                onAddToken={addCustomToken}
                onRemoveToken={removeCustomToken}
                chainId={activeChain?.id}
                tokenMap={tokenMap}
              />
              <div className="p-3">
                {isMounted && !address ? (
                  <Wallet.Button appearOnMount={false} fullWidth color="blue" size="md">
                    Connect Wallet
                  </Wallet.Button>
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
      </div>
      <Dialog open={review} onClose={() => setReview(false)}>
        <Dialog.Content>
          <Dialog.Header
            title={pairState === PairState.EXISTS ? 'Add Liquidity' : 'Create Pool'}
            onClose={() => setReview(false)}
          />
          <Approve
            className="flex-grow !justify-end pt-4"
            components={
              <Approve.Components>
                <Approve.Token
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={parsedInput0}
                  address={getV2RouterContractConfig(activeChain?.id).addressOrName}
                />
                <Approve.Token
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={parsedInput1}
                  address={getV2RouterContractConfig(activeChain?.id).addressOrName}
                />
              </Approve.Components>
            }
            render={({ approved }) => {
              return (
                <Button size="md" disabled={!approved} fullWidth color="gradient" onClick={execute}>
                  Confirm Add Liquidity
                </Button>
              )
            }}
          />
        </Dialog.Content>
      </Dialog>
      <div className="z-[-1] bg-gradient-radial from-blue-500/10 via-slate-900 to-slate-900 fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
    </Layout>
  )
}

export default AddPage
