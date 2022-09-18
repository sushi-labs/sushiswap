import { defaultAbiCoder } from '@ethersproject/abi'
import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Amount, Token, Type } from '@sushiswap/currency'
import { calculateSlippageAmount, ConstantProductPool } from '@sushiswap/exchange'
import { JSBI, Percent, ZERO } from '@sushiswap/math'
import { Button, Dots } from '@sushiswap/ui'
import {
  Approve,
  BENTOBOX_ADDRESS,
  getTridentRouterContractConfig,
  PoolState,
  useBentoBoxTotals,
  useTotalSupply,
  useTridentRouterContract,
} from '@sushiswap/wagmi'
import { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { ProviderRpcError, useAccount, useNetwork, UserRejectedRequestError, useSendTransaction } from 'wagmi'

import { approveMasterContractAction, batchAction, getAsEncodedAction, LiquidityInput } from '../../lib/actions'
import { useNotifications, useSettings } from '../../lib/state/storage'
import { AddSectionReviewModal } from './AddSectionReviewModal'

interface AddSectionReviewModalTridentProps {
  poolAddress: string
  poolState: PoolState
  pool: ConstantProductPool | null
  chainId: ChainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  children({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }): ReactNode
}

const ZERO_PERCENT = new Percent('0')

export const AddSectionReviewModalTrident: FC<AddSectionReviewModalTridentProps> = ({
  poolAddress,
  poolState,
  pool,
  chainId,
  token0,
  token1,
  input0,
  input1,
  children,
}) => {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [permit, setPermit] = useState<Signature>()
  const liquidityToken = useMemo(() => {
    return new Token({
      address: poolAddress.includes(':') ? poolAddress.split(':')[1] : poolAddress,
      name: 'SLP Token',
      decimals: 18,
      symbol: 'SLP',
      chainId,
    })
  }, [chainId, poolAddress])

  const [, { createNotification }] = useNotifications(address)
  const totalSupply = useTotalSupply(liquidityToken)
  const rebases = useBentoBoxTotals(chainId, [token0, token1])
  const contract = useTridentRouterContract(chainId)
  const [{ slippageTolerance }] = useSettings()
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction({
    chainId,
    onSuccess: () => setOpen(false),
  })

  const [error, setError] = useState<string>()

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      input0
        ? poolState === PoolState.NOT_EXISTS
          ? input0
          : Amount.fromRawAmount(input0.currency, calculateSlippageAmount(input0, slippagePercent)[0])
        : undefined,
      input1
        ? poolState === PoolState.NOT_EXISTS
          ? input1
          : Amount.fromRawAmount(input1.currency, calculateSlippageAmount(input1, slippagePercent)[0])
        : undefined,
    ]
  }, [poolState, input0, input1, slippagePercent])

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
      input0 &&
      input1 &&
      rebases?.[token0.wrapped.address] &&
      rebases?.[token1.wrapped.address]
    ) {
      const amountA = input0.wrapped.toShare(rebases?.[token0.wrapped.address])
      const amountB = input1.wrapped.toShare(rebases?.[token1.wrapped.address])

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
  }, [noLiquidity, input0, input1, pool, rebases, slippagePercent, token0, token1, totalSupply])

  const execute = useCallback(async () => {
    if (
      !chain?.id ||
      !pool ||
      !token0 ||
      !token1 ||
      !chainId ||
      !contract ||
      !input0 ||
      !input1 ||
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
      if (input0) {
        if (input0.currency.isNative) {
          value = input0.quotient.toString()
        }

        liquidityInput.push({
          token: input0.currency.isNative ? AddressZero : input0.currency.wrapped.address,
          native: true,
          amount: input0.quotient.toString(),
        })
      }

      if (input1) {
        if (input1.currency.isNative) {
          value = input1.quotient.toString()
        }

        liquidityInput.push({
          token: input1.currency.isNative ? AddressZero : input1.currency.wrapped.address,
          native: true,
          amount: input1.quotient.toString(),
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

      const ts = new Date().getTime()
      createNotification({
        type: 'mint',
        chainId: chain.id,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Adding liquidity to the {token0.symbol}/{token1.symbol} pair`,
          completed: `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          failed: 'Something went wrong when adding liquidity',
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
    chainId,
    contract,
    input0,
    input1,
    address,
    minAmount0,
    minAmount1,
    liquidityMinted,
    sendTransactionAsync,
    permit,
    createNotification,
  ])

  return useMemo(
    () => (
      <>
        {children({ isWritePending, setOpen })}
        <AddSectionReviewModal
          chainId={chainId}
          input0={input0}
          input1={input1}
          open={open}
          setOpen={setOpen}
          error={error}
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
                  address={getTridentRouterContractConfig(chainId).addressOrName}
                  onSignature={setPermit}
                />
                <Approve.Token
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={input0}
                  address={chain ? BENTOBOX_ADDRESS[chain?.id] : undefined}
                />
                <Approve.Token
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={input1}
                  address={chain ? BENTOBOX_ADDRESS[chain?.id] : undefined}
                />
              </Approve.Components>
            }
            render={({ approved }) => {
              return (
                <Button size="md" disabled={!approved || isWritePending} fullWidth onClick={execute}>
                  {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add'}
                </Button>
              )
            }}
          />
        </AddSectionReviewModal>
      </>
    ),
    [chain, chainId, children, createNotification, error, execute, input0, input1, isWritePending, open]
  )
}
