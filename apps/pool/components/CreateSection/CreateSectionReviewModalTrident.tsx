import { defaultAbiCoder } from '@ethersproject/abi'
import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { Chain, ChainId } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import { computeConstantProductPoolAddress, Fee } from '@sushiswap/exchange'
import { Button, createToast, Dots } from '@sushiswap/ui'
import {
  Approve,
  BENTOBOX_ADDRESS,
  getV3RouterContractConfig,
  useConstantProductPoolFactoryContract,
  useV3RouterContract,
} from '@sushiswap/wagmi'
import { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { ProviderRpcError, useAccount, useNetwork, UserRejectedRequestError, useSendTransaction } from 'wagmi'

import {
  approveMasterContractAction,
  batchAction,
  deployNewPoolAction,
  getAsEncodedAction,
  LiquidityInput,
} from '../../lib/actions'
import { AddSectionReviewModal } from '../AddSection'

interface CreateSectionReviewModalTridentProps {
  chainId: ChainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  fee: Fee
  children({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }): ReactNode
}

export const CreateSectionReviewModalTrident: FC<CreateSectionReviewModalTridentProps> = ({
  token0,
  token1,
  input0,
  input1,
  fee,
  chainId,
  children,
}) => {
  const { address } = useAccount()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [permit, setPermit] = useState<Signature>()
  const { chain } = useNetwork()
  const contract = useV3RouterContract(chainId)
  const factory = useConstantProductPoolFactoryContract(chainId)

  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction({
    chainId,
    onSuccess: () => setOpen(false),
  })

  const poolAddress = useMemo(() => {
    if (!factory || !token0 || !token1) return undefined

    return computeConstantProductPoolAddress({
      factoryAddress: factory.address,
      tokenA: token0.wrapped,
      tokenB: token1.wrapped,
      fee: fee,
      twap: false,
    })
  }, [factory, fee, token0, token1])

  const execute = useCallback(async () => {
    if (!factory || !token0 || !token1 || !poolAddress) return

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

      const data = await sendTransactionAsync({
        request: {
          from: address,
          to: contract.address,
          data: batchAction({
            contract,
            actions: [
              approveMasterContractAction({ router: contract, signature: permit }),
              deployNewPoolAction({
                assets: [token0, token1],
                factory: '',
                router: contract,
                feeTier: fee,
                twap: false,
              }),
              getAsEncodedAction({
                contract,
                fn: 'addLiquidity',
                args: [liquidityInput, poolAddress, 1, encoded],
              }),
            ],
          }),
          ...(value && { value }),
        },
      })

      createToast({
        txHash: data.hash,
        href: Chain.from(chainId).getTxUrl(data.hash),
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
    address,
    chainId,
    contract,
    factory,
    fee,
    input0,
    input1,
    permit,
    poolAddress,
    sendTransactionAsync,
    token0,
    token1,
  ])

  return (
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
          className="flex-grow !justify-end"
          components={
            <Approve.Components>
              <Approve.Bentobox
                size="md"
                className="whitespace-nowrap"
                fullWidth
                address={getV3RouterContractConfig(chainId).addressOrName}
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
              <Button size="md" disabled={!approved} fullWidth color="gradient" onClick={execute}>
                Add
              </Button>
            )
          }}
        />
      </AddSectionReviewModal>
    </>
  )
}
