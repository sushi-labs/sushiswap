import { ChainId } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import { calculateSlippageAmount } from '@sushiswap/exchange'
import { Percent } from '@sushiswap/math'
import { Button, Dots } from '@sushiswap/ui'
import {
  Approve,
  calculateGasMargin,
  getV2RouterContractConfig,
  PairState,
  useV2RouterContract,
} from '@sushiswap/wagmi'
import { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { ProviderRpcError, useAccount, useNetwork, UserRejectedRequestError, useSendTransaction } from 'wagmi'

import { useTransactionDeadline } from '../../lib/hooks'
import { useNotifications, useSettings } from '../../lib/state/storage'
import { AddSectionReviewModal } from './AddSectionReviewModal'

interface AddSectionReviewModalLegacyProps {
  poolState: PairState
  chainId: ChainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  children({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }): ReactNode
}

export const AddSectionReviewModalLegacy: FC<AddSectionReviewModalLegacyProps> = ({
  poolState,
  chainId,
  token0,
  token1,
  input0,
  input1,
  children,
}) => {
  const deadline = useTransactionDeadline(chainId)
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
  const { chain } = useNetwork()

  const [, { createNotification }] = useNotifications(address)
  const contract = useV2RouterContract(chainId)
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
        ? poolState === PairState.NOT_EXISTS
          ? input0
          : Amount.fromRawAmount(input0.currency, calculateSlippageAmount(input0, slippagePercent)[0])
        : undefined,
      input1
        ? poolState === PairState.NOT_EXISTS
          ? input1
          : Amount.fromRawAmount(input1.currency, calculateSlippageAmount(input1, slippagePercent)[0])
        : undefined,
    ]
  }, [poolState, input0, input1, slippagePercent])

  const execute = useCallback(async () => {
    if (!token0 || !token1 || !chain?.id || !contract || !input0 || !input1 || !address || !minAmount0 || !minAmount1)
      return
    const withNative = token0.isNative || token1.isNative

    try {
      let data
      if (withNative) {
        const value = (token1.isNative ? input1 : input0).quotient.toString()
        const args = [
          (token1.isNative ? token0 : token1).wrapped.address,
          (token1.isNative ? input0 : input1).quotient.toString(),
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
          input0.quotient.toString(),
          input1.quotient.toString(),
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

      const ts = new Date().getTime()
      createNotification({
        type: 'mint',
        chainId: chain.id,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Adding liquidity to the ${token0.symbol}/${token1.symbol} pair`,
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
    token0,
    token1,
    chain?.id,
    contract,
    input0,
    input1,
    address,
    minAmount0,
    minAmount1,
    createNotification,
    deadline,
    sendTransactionAsync,
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
                <Approve.Token
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={input0}
                  address={getV2RouterContractConfig(chainId).addressOrName}
                />
                <Approve.Token
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={input1}
                  address={getV2RouterContractConfig(chainId).addressOrName}
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
    [chainId, children, createNotification, error, execute, input0, input1, isWritePending, open]
  )
}
