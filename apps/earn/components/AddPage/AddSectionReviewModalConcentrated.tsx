import { TransactionRequest } from '@ethersproject/providers'
import { Amount, Type } from '@sushiswap/currency'
import { Percent, ZERO } from '@sushiswap/math'
import { classNames, Collapsible, Dots } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import { useSendTransaction } from '@sushiswap/wagmi'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useAccount, UserRejectedRequestError } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'
import { AddSectionReviewModal } from './AddSectionReviewModal'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { FeeAmount, NonfungiblePositionManager } from '@sushiswap/v3-sdk'
import { useConcentratedLiquidityURLState } from '../ConcentratedLiquidityURLStateProvider'
import { useSlippageTolerance } from '../../lib/hooks/useSlippageTolerance'
import { useV3NFTPositionManagerContract } from '@sushiswap/wagmi/hooks/useNFTPositionManagerContract'
import { useTransactionDeadline } from '@sushiswap/wagmi/future/hooks'
import { useConcentratedDerivedMintInfo } from '../../lib/hooks/useConcentratedDerivedMintInfo'
import {
  ConfirmationDialog as UIConfirmationDialog,
  ConfirmationDialogState,
} from '@sushiswap/ui/dialog/ConfirmationDialog'
import { Dialog } from '@sushiswap/ui/future/components/dialog'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Chain } from '@sushiswap/chain'
import { AddSectionConfirmModalConcentrated } from './AddSectionConfirmModalConcentrated'
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/solid'
import { Bound } from '../../lib/constants'

interface AddSectionReviewModalConcentratedProps
  extends Pick<
    ReturnType<typeof useConcentratedDerivedMintInfo>,
    'noLiquidity' | 'position' | 'price' | 'pricesAtTicks'
  > {
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  children({ open, setOpen }: { open: boolean; setOpen(open: boolean): void }): ReactNode
}

export const AddSectionReviewModalConcentrated: FC<AddSectionReviewModalConcentratedProps> = ({
  input0,
  input1,
  children,
  noLiquidity,
  position,
  price,
  pricesAtTicks,
}) => {
  const { chainId, feeAmount } = useConcentratedLiquidityURLState()
  const [open, setOpen] = useState(false)

  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const [minPriceDiff, maxPriceDiff] = useMemo(() => {
    if (!price || !priceLower || !priceUpper) return [undefined, undefined]
    const min = +priceLower?.toFixed(4)
    const cur = +price?.toFixed(4)
    const max = +priceUpper?.toFixed(4)

    return [(((min - cur) / cur) * 100).toFixed(2), (((max - cur) / cur) * 100).toFixed(2)]
  }, [price, priceLower, priceUpper])

  const close = useCallback(() => setOpen(false), [])
  return (
    <>
      {children({ open, setOpen })}
      <Dialog open={open} unmount={false} onClose={close} variant="opaque">
        <div className="max-w-[504px] mx-auto">
          <button onClick={close} className="pl-0 p-3">
            <ArrowLeftIcon strokeWidth={3} width={24} height={24} />
          </button>
          <div className="flex justify-between gap-4 items-start py-2">
            <div className="flex flex-col flex-grow gap-1">
              <h1 className="text-3xl font-semibold dark:text-slate-50">
                {input0?.currency.symbol}/{input1?.currency.symbol}
              </h1>
              <h1 className="text-lg font-medium text-gray-900 dark:text-slate-300">Add Liquidity</h1>
            </div>
            <div className="-mr-[20px]">
              {input0 && input1 && (
                <Currency.IconList iconWidth={56} iconHeight={56}>
                  <Currency.Icon currency={input0?.currency} width={56} height={56} />
                  <Currency.Icon currency={input1?.currency} width={56} height={56} />
                </Currency.IconList>
              )}
            </div>
          </div>
          {/*{warningSeverity(trade?.priceImpact) >= 3 && (*/}
          {/*  <div className="rounded-xl px-4 py-3 bg-red/20 mt-4">*/}
          {/*    <span className="text-red-600 font-medium text-sm">*/}
          {/*      High price impact. You will lose a significant portion of your funds in this trade due to price impact.*/}
          {/*    </span>*/}
          {/*  </div>*/}
          {/*)}*/}
          <div className="flex flex-col gap-3">
            <List>
              <List.Control>
                <List.KeyValue title="Network">{Chain.from(chainId).name}</List.KeyValue>
                {feeAmount && <List.KeyValue title="Fee Tier">{`${+feeAmount / 10000}%`}</List.KeyValue>}
              </List.Control>
            </List>
            <List>
              <List.Control>
                <List.KeyValue
                  title={`Minimum Price`}
                  subtitle={`Your position will be 100% composed of ${input0?.currency.symbol} at this price`}
                >
                  <div className="flex flex-col gap-1">
                    {priceLower?.toSignificant(6)} <span className="text-xs text-slate-400">{minPriceDiff}%</span>
                  </div>
                </List.KeyValue>
                <List.KeyValue title="Price" subtitle={`Current price`}>
                  {price?.toSignificant(6)}
                </List.KeyValue>
                <List.KeyValue
                  title={`Maximum Price`}
                  subtitle={`Your position will be 100% composed of ${input1?.currency.symbol} at this price`}
                >
                  <div className="flex flex-col gap-1">
                    {priceUpper?.toSignificant(6)} <span className="text-xs text-slate-400">+{maxPriceDiff}%</span>
                  </div>
                </List.KeyValue>{' '}
              </List.Control>
            </List>
            <List>
              <List.Control>
                {input0 && (
                  <List.KeyValue title={`${input0?.currency.symbol}`}>
                    <div className="flex items-center gap-2">
                      <Currency.Icon currency={input0.currency} width={18} height={18} />
                      {input0?.toSignificant(6)} {input0?.currency.symbol}
                    </div>
                  </List.KeyValue>
                )}
                {input1 && (
                  <List.KeyValue title={`${input1?.currency.symbol}`}>
                    <div className="flex items-center gap-2">
                      <Currency.Icon currency={input1.currency} width={18} height={18} />
                      {input1?.toSignificant(6)} {input1?.currency.symbol}
                    </div>
                  </List.KeyValue>
                )}
              </List.Control>
            </List>
          </div>
          <div className="pt-4">
            <AddSectionConfirmModalConcentrated position={position} noLiquidity={noLiquidity} closeReview={close}>
              {({ onClick, isWritePending, isLoading, isError, error, isConfirming }) => (
                <div className="space-y-4">
                  <Button
                    fullWidth
                    size="xl"
                    loading={isLoading && !isError}
                    onClick={onClick}
                    disabled={isWritePending || Boolean(isLoading) || isError}
                    color={isError ? 'red' : 'blue'}
                  >
                    {isError ? (
                      'Shoot! Something went wrong :('
                    ) : isConfirming ? (
                      <Dots>Confirming transaction</Dots>
                    ) : isWritePending ? (
                      <Dots>Confirm Add</Dots>
                    ) : (
                      'Add Liquidity'
                    )}
                  </Button>
                  <Collapsible open={!!error}>
                    <div className="scroll bg-red/20 text-red-700 dark:bg-black/20 p-2 px-3 rounded-lg border border-slate-200/10 text-[10px] break-all max-h-[80px] overflow-y-auto">
                      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                      {/* @ts-ignore */}
                      <code>{error ? ('data' in error ? error?.data?.message : error.message) : ''}</code>
                    </div>
                  </Collapsible>
                </div>
              )}
            </AddSectionConfirmModalConcentrated>
          </div>
        </div>
      </Dialog>
    </>
  )
}
