import { defaultAbiCoder } from '@ethersproject/abi'
import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { Chain } from '@sushiswap/chain'
import { Amount, tryParseAmount } from '@sushiswap/currency'
import { calculateSlippageAmount } from '@sushiswap/exchange'
import { JSBI, Percent, ZERO } from '@sushiswap/math'
import { Button, createToast, Dots } from '@sushiswap/ui'
import {
  Approve,
  BENTOBOX_ADDRESS,
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
import { approveMasterContractAction, batchAction, getAsEncodedAction, LiquidityInput } from '../../lib/actions'
import { useTokensFromPair } from '../../lib/hooks'
import { useSettings } from '../../lib/state/storage'
import { AddSectionReviewModal } from './AddSectionReviewModal'
import { AddSectionWidget } from './AddSectionWidget'

const ZERO_PERCENT = new Percent('0')

export const AddSectionTrident: FC<{ pair: Pair }> = ({ pair }) => {
  const { token0, token1, liquidityToken } = useTokensFromPair(pair)
  const { chain } = useNetwork()
  const { address } = useAccount()
  const contract = useV3RouterContract(pair.chainId)
  const [{ slippageTolerance }] = useSettings()
  const [permit, setPermit] = useState<Signature>()
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction({ chainId: pair.chainId })

  const [error, setError] = useState<string>()
  const [review, setReview] = useState(false)
  const [{ input0, input1 }, setTypedAmounts] = useState<{ input0: string; input1: string }>({ input0: '', input1: '' })

  const [poolState, pool] = useConstantProductPool(pair.chainId, token0, token1, pair.swapFee, pair.twapEnabled)
  const totalSupply = useTotalSupply(liquidityToken)
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
        isWritePending={isWritePending}
        onReview={() => setReview(true)}
      />
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
      </AddSectionReviewModal>
    </div>
  )
}
