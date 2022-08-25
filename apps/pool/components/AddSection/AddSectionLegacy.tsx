import { Chain } from '@sushiswap/chain'
import { Amount, tryParseAmount } from '@sushiswap/currency'
import { calculateSlippageAmount } from '@sushiswap/exchange'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Percent } from '@sushiswap/math'
import { Button, createToast, Dots } from '@sushiswap/ui'
import { Approve, calculateGasMargin, Checker, PairState, usePair } from '@sushiswap/wagmi'
import { getV2RouterContractConfig, useV2RouterContract } from '@sushiswap/wagmi/hooks/useV2Router'
import { FC, useCallback, useMemo, useState } from 'react'
import { ProviderRpcError, useAccount, useNetwork, UserRejectedRequestError, useSendTransaction } from 'wagmi'

import { Pair } from '../../.graphclient'
import { useTokensFromPair, useTransactionDeadline } from '../../lib/hooks'
import { useSettings } from '../../lib/state/storage'
import { AddSectionReviewModal } from './AddSectionReviewModal'
import { AddSectionWidget } from './AddSectionWidget'

export const AddSectionLegacy: FC<{ pair: Pair }> = ({ pair }) => {
  const isMounted = useIsMounted()
  const { token0, token1 } = useTokensFromPair(pair)
  const { chain } = useNetwork()
  const { address } = useAccount()
  const contract = useV2RouterContract(pair.chainId)
  const deadline = useTransactionDeadline(pair.chainId)
  const [{ slippageTolerance }] = useSettings()

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction({ chainId: pair.chainId })

  const [error, setError] = useState<string>()
  const [review, setReview] = useState(false)
  const [{ input0, input1 }, setTypedAmounts] = useState<{ input0: string; input1: string }>({ input0: '', input1: '' })

  const [poolState, pool] = usePair(pair.chainId, token0, token1)

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

  return (
    <div>
      <AddSectionWidget
        chainId={pair.chainId}
        input0={input0}
        input1={input1}
        token0={token0}
        token1={token1}
        onInput0={onChangeToken0TypedAmount}
        onInput1={onChangeToken1TypedAmount}
      >
        <Checker.Connected fullWidth size="md">
          <Checker.Custom
            logic={isMounted && [PairState.NOT_EXISTS, PairState.INVALID].includes(poolState)}
            button={
              <Button size="md" color="gray" fullWidth disabled={true}>
                Pool Not Found
              </Button>
            }
          >
            <Checker.Network fullWidth size="md" chainId={pair.chainId}>
              <Checker.Amounts
                fullWidth
                size="md"
                chainId={pair.chainId}
                fundSource={FundSource.WALLET}
                amounts={[parsedInput0, parsedInput1]}
              >
                <Button fullWidth onClick={() => setReview(true)} disabled={isWritePending} size="md">
                  {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add Liquidity'}
                </Button>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Custom>
        </Checker.Connected>
      </AddSectionWidget>
      <AddSectionReviewModal
        chainId={pair.chainId}
        input0={parsedInput0}
        input1={parsedInput1}
        open={review}
        setOpen={setReview}
        error={error}
      >
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
      </AddSectionReviewModal>
    </div>
  )
}
