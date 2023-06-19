import { isAddress } from '@ethersproject/address'
import { TransactionRequest } from '@ethersproject/providers'
import { FundSource } from '@sushiswap/hooks'
import { classNames, Dots, Typography } from '@sushiswap/ui'
import { getFuroVestingRouterContractConfig, useBentoBoxTotal, useFuroVestingRouterContract } from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useAccount } from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'

import { approveBentoBoxAction, batchAction, useDeepCompareMemoize, vestingCreationAction } from '../../../../lib'
import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../../lib/zod'
import { calculateCliffDuration, calculateStepPercentage, calculateTotalAmount } from '../../utils'
import { CreateVestingFormSchemaType } from '../schema'
import CreateFormReviewModalBase from './CreateFormReviewModalBase'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { FuroVestingRouterChainId } from '@sushiswap/furo'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { Button } from '@sushiswap/ui/future/components/button'
import { useApproved, useSignature, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'

const APPROVE_TAG = 'createVestingSingle'

interface Item {
  title: string
  value: ReactNode | Array<ReactNode>
  className?: string
}

const Item: FC<Item> = ({ title, value, className }) => {
  return (
    <div className="flex items-center justify-between w-full gap-1">
      <Typography variant="xs" className="whitespace-nowrap text-slate-500">
        {title}
      </Typography>
      <Typography variant="xs" weight={500} className={classNames(className, 'whitespace-nowrap text-slate-200')}>
        {value}
      </Typography>
    </div>
  )
}

// const Table: FC<{
//   title: string
//   className?: string
//   children: React.ReactElement<typeof Item> | React.ReactElement<typeof Item>[]
// }> = ({ children, title, className }) => {
//   return (
//     <div className={classNames(className, 'flex flex-col pb-3 gap-2')}>
//       <Typography variant="xxs" className="!leading-5 tracking-widest text-slate-50 font-medium uppercase">
//         {title}
//       </Typography>
//       <div className="flex flex-wrap gap-2">{children}</div>
//     </div>
//   )
// }

interface CreateFormReviewModal {
  chainId: FuroVestingRouterChainId
  children({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }): ReactNode
}

const CreateFormReviewModal: FC<CreateFormReviewModal> = withCheckerRoot(({ chainId, children }) => {
  const { address } = useAccount()
  const contract = useFuroVestingRouterContract(chainId)
  const {
    watch,
    formState: { isValid, isValidating },
  } = useFormContext<CreateVestingFormSchemaType>()

  const { signature, setSignature } = useSignature(APPROVE_TAG)
  const { approved } = useApproved(APPROVE_TAG)
  const [open, setOpen] = useState(false)

  const formData = watch()
  const _formData = useDeepCompareMemoize(formData)

  const { recipient, startDate, stepConfig, stepPayouts, fundSource, currency, cliff, stepAmount } = _formData
  const _fundSource = ZFundSourceToFundSource.parse(fundSource)
  const _currency = useTokenFromZToken(formData.currency)
  const _totalAmount = useMemo(
    () => calculateTotalAmount({ currency, cliff, stepAmount, stepPayouts }),
    [cliff, currency, stepAmount, stepPayouts]
  )
  const _cliffDuration = useMemo(() => calculateCliffDuration({ cliff, startDate }), [cliff, startDate])
  const _stepPercentage = useMemo(
    () => calculateStepPercentage({ currency, cliff, stepAmount, stepPayouts }),
    [cliff, currency, stepAmount, stepPayouts]
  )
  const rebase = useBentoBoxTotal(chainId, _currency)

  const onSettled = useCallback(
    async (data: SendTransactionResult | undefined) => {
      if (!data || !_totalAmount) return

      const ts = new Date().getTime()
      createToast({
        account: address,
        type: 'createVesting',
        chainId: chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Creating ${_totalAmount.toSignificant(6)} ${_totalAmount.currency.symbol} vesting`,
          completed: `Created ${_totalAmount.toSignificant(6)} ${_totalAmount.currency.symbol} vesting`,
          failed: 'Something went wrong trying to create a vesting',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [_totalAmount, chainId, address]
  )

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      if (
        !isValid ||
        isValidating ||
        !contract ||
        !address ||
        !chainId ||
        !recipient ||
        !isAddress(recipient) ||
        !_currency ||
        !startDate ||
        !_cliffDuration ||
        !stepConfig?.time ||
        !_stepPercentage ||
        !_totalAmount ||
        !stepPayouts ||
        !rebase
      ) {
        return
      }

      const actions: string[] = []
      if (signature) {
        actions.push(approveBentoBoxAction({ contract, user: address, signature }))
      }

      actions.push(
        vestingCreationAction({
          contract,
          recipient,
          currency: _currency,
          startDate,
          cliffDuration: _cliffDuration.toString(),
          stepDuration: stepConfig?.time.toString(),
          steps: stepPayouts.toString(),
          stepPercentage: _stepPercentage.toString(),
          amount: _totalAmount.quotient.toString(),
          fromBentobox: _fundSource === FundSource.BENTOBOX,
          minShare: _totalAmount.toShare(rebase),
        })
      )

      setRequest({
        from: address,
        to: contract.address,
        data: batchAction({ contract, actions }),
        value: _currency.isNative ? _totalAmount.quotient.toString() : '0',
      })
    },
    [
      isValid,
      isValidating,
      contract,
      address,
      chainId,
      recipient,
      _currency,
      startDate,
      _cliffDuration,
      stepConfig?.time,
      _stepPercentage,
      _totalAmount,
      stepPayouts,
      rebase,
      signature,
      _fundSource,
    ]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess: () => {
      setSignature(undefined)
    },
    enabled: Boolean(
      isValid &&
        !isValidating &&
        contract &&
        address &&
        chainId &&
        recipient &&
        isAddress(recipient) &&
        _currency &&
        startDate &&
        _cliffDuration &&
        stepConfig?.time &&
        _stepPercentage &&
        _totalAmount &&
        stepPayouts &&
        rebase &&
        approved
    ),
  })

  return useMemo(
    () => (
      <>
        {children({ setOpen, isWritePending })}
        <CreateFormReviewModalBase chainId={chainId} open={open} setOpen={setOpen}>
          <Checker.Connect type="button" size="xl">
            <Checker.Network type="button" size="xl" chainId={chainId}>
              <Checker.Amounts type="button" size="xl" chainId={chainId} amounts={[_totalAmount]}>
                <Checker.ApproveBentobox
                  tag={APPROVE_TAG}
                  type="button"
                  id="furo-create-single-vest-approve-bentobox"
                  size="xl"
                  chainId={chainId as BentoBoxV1ChainId}
                  masterContract={getFuroVestingRouterContractConfig(chainId).address}
                >
                  <Checker.ApproveERC20
                    type="button"
                    contract={bentoBoxV1Address[chainId]}
                    id="furo-create-single-vest-approve-token"
                    size="xl"
                    amount={_totalAmount}
                  >
                    <Checker.Success tag={APPROVE_TAG}>
                      <Button
                        type="button"
                        fullWidth
                        size="xl"
                        disabled={isWritePending || !isValid || isValidating}
                        onClick={() => sendTransaction?.()}
                      >
                        {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create Vesting'}
                      </Button>
                    </Checker.Success>
                  </Checker.ApproveERC20>
                </Checker.ApproveBentobox>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connect>
        </CreateFormReviewModalBase>
      </>
    ),
    [_totalAmount, chainId, children, isValid, isValidating, isWritePending, open, sendTransaction]
  )
})

export default CreateFormReviewModal
