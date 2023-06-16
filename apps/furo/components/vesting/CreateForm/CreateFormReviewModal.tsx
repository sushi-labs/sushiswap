import { isAddress } from '@ethersproject/address'
import { Signature } from '@ethersproject/bytes'
import { TransactionRequest } from '@ethersproject/providers'
import { FundSource } from '@sushiswap/hooks'
import { Dots } from '@sushiswap/ui'
import {
  getFuroVestingRouterContractConfig,
  useAccount,
  useBentoBoxTotal,
  useFuroVestingRouterContract,
} from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import React, { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'

import { createToast } from '@sushiswap/ui/future/components/toast'
import { FuroVestingRouterChainId } from '@sushiswap/furo'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { Button } from '@sushiswap/ui/future/components/button'
import { useApproved, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { Modal } from '@sushiswap/ui/future/components/modal/Modal'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Chain } from '@sushiswap/chain'
import { TxStatusModalContent } from '@sushiswap/wagmi/future/components/TxStatusModal'
import { format } from 'date-fns'
import { tryParseAmount } from '@sushiswap/currency'
import { approveBentoBoxAction, batchAction, useDeepCompareMemoize, vestingCreationAction } from '../../../lib'
import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { calculateCliffDuration, calculateEndDate, calculateStepPercentage, calculateTotalAmount } from '../utils'
import { CreateMultipleVestingFormSchemaType, STEP_CONFIGURATIONS } from '../schema'

const MODAL_ID = 'createVestingSingle'
const APPROVE_TAG = 'createVestingSingle'

interface CreateFormReviewModal {
  chainId: FuroVestingRouterChainId
}

export const CreateFormReviewModal: FC<CreateFormReviewModal> = withCheckerRoot(({ chainId }) => {
  const { address } = useAccount()
  const contract = useFuroVestingRouterContract(chainId)
  const {
    watch,
    formState: { isValid, isValidating },
  } = useFormContext<CreateMultipleVestingFormSchemaType>()

  const { approved } = useApproved(APPROVE_TAG)
  const [signature, setSignature] = useState<Signature>()

  const formData = watch('vestings.0')
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
  const endDate = useMemo(
    () => calculateEndDate({ cliff, startDate, stepPayouts, stepConfig }),
    [cliff, startDate, stepConfig, stepPayouts]
  )

  const [_cliffAmount, _stepAmount] = useMemo(() => {
    if (cliff.cliffEnabled) {
      const { cliffAmount } = cliff
      return [tryParseAmount(cliffAmount?.toString(), _currency), tryParseAmount(stepAmount?.toString(), _currency)]
    } else {
      return [undefined, tryParseAmount(stepAmount?.toString(), _currency)]
    }
  }, [_currency, cliff, stepAmount])

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
        !stepConfig ||
        !STEP_CONFIGURATIONS[stepConfig] ||
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
          stepDuration: STEP_CONFIGURATIONS[stepConfig].toString(),
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
      stepConfig,
      _stepPercentage,
      _totalAmount,
      stepPayouts,
      rebase,
      signature,
      _fundSource,
    ]
  )

  const { sendTransactionAsync, isLoading, isError, data } = useSendTransaction({
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
        stepConfig &&
        STEP_CONFIGURATIONS[stepConfig] &&
        _stepPercentage &&
        _totalAmount &&
        stepPayouts &&
        rebase &&
        approved
    ),
  })

  return (
    <>
      <Checker.Connect type="button" size="xl">
        <Checker.Network type="button" size="xl" chainId={chainId}>
          <Checker.Amounts type="button" size="xl" chainId={chainId} amounts={[_totalAmount]}>
            <Checker.ApproveBentobox
              type="button"
              id="create-single-vest-approve-bentobox"
              size="xl"
              chainId={chainId as BentoBoxV1ChainId}
              contract={getFuroVestingRouterContractConfig(chainId).address}
              onSignature={setSignature}
            >
              <Checker.ApproveERC20
                type="button"
                contract={bentoBoxV1Address[chainId]}
                id="create-single-vest-approve-token"
                size="xl"
                amount={_totalAmount}
              >
                <Checker.Success tag={APPROVE_TAG}>
                  <Modal.Trigger tag={MODAL_ID}>
                    {({ open }) => (
                      <Button type="button" fullWidth size="xl" onClick={open} testdata-id="review-single-vest-button">
                        {isLoading ? <Dots>Confirm transaction</Dots> : 'Review Vesting'}
                      </Button>
                    )}
                  </Modal.Trigger>
                </Checker.Success>
              </Checker.ApproveERC20>
            </Checker.ApproveBentobox>
          </Checker.Amounts>
        </Checker.Network>
      </Checker.Connect>
      <Modal.Review tag={MODAL_ID} variant="opaque">
        {({ close, confirm }) => (
          <div className="max-w-[504px] mx-auto">
            <button onClick={close} className="p-3 pl-0">
              <ArrowLeftIcon strokeWidth={3} width={24} height={24} />
            </button>
            <div className="flex items-start justify-between gap-4 py-2">
              <div className="flex flex-col flex-grow gap-1">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-slate-50">Create Vesting</h1>
                <h1 className="text-lg font-medium text-gray-600 dark:text-slate-300">{_currency?.symbol}</h1>
              </div>
              <div>{_currency && <Currency.Icon currency={_currency} width={56} height={56} />}</div>
            </div>
            <div className="flex flex-col gap-3">
              <List>
                <List.Control>
                  <List.KeyValue flex title="Network">
                    {Chain.from(chainId).name}
                  </List.KeyValue>
                  {_totalAmount && (
                    <List.KeyValue flex title="Total amount">
                      <div className="flex items-center gap-2" testdata-id="vesting-review-total-amount">
                        <Currency.Icon currency={_totalAmount.currency} width={18} height={18} />
                        {_totalAmount?.toSignificant(6)} {_totalAmount.currency.symbol}
                      </div>
                    </List.KeyValue>
                  )}
                  {endDate && (
                    <List.KeyValue flex title="End date">
                      {format(endDate, 'dd MMM yyyy hh:mm')}
                    </List.KeyValue>
                  )}
                </List.Control>
              </List>
              {cliff.cliffEnabled && cliff.cliffEndDate && _cliffAmount && (
                <List>
                  <List.Control>
                    <List.KeyValue flex title="Cliff end date">
                      {format(cliff.cliffEndDate, 'dd MMM yyyy')}
                    </List.KeyValue>
                    <List.KeyValue flex title="Cliff amount">
                      <div className="flex items-center gap-2" testdata-id="vesting-review-cliff-amount">
                        <Currency.Icon currency={_cliffAmount.currency} width={18} height={18} />
                        {_cliffAmount?.toSignificant(6)} {_cliffAmount.currency.symbol}
                      </div>
                    </List.KeyValue>
                  </List.Control>
                </List>
              )}
              <List>
                <List.Control>
                  {_stepAmount && (
                    <List.KeyValue flex title="Payout per unlock">
                      <div className="flex items-center gap-2" testdata-id="vesting-review-payment-per-period">
                        <Currency.Icon currency={_stepAmount.currency} width={18} height={18} />
                        {_stepAmount?.toSignificant(6)} {_stepAmount.currency.symbol}
                      </div>
                    </List.KeyValue>
                  )}
                  <List.KeyValue flex title="Number of unlocks" testdata-id="vesting-review-amount-of-periods">
                    <div className="flex items-center gap-2" testdata-id="vesting-review-amount-of-periods">
                      {stepPayouts}
                    </div>
                  </List.KeyValue>
                  <List.KeyValue flex title="Unlock frequency" testdata-id="vesting-review-period-length">
                    <div className="flex items-center gap-2" testdata-id="vesting-review-period-length">
                      {stepConfig}
                    </div>
                  </List.KeyValue>
                </List.Control>
              </List>
            </div>
            <div className="pt-4">
              <div className="space-y-4">
                <Button
                  fullWidth
                  size="xl"
                  loading={isLoading && !isError}
                  onClick={() => sendTransactionAsync?.().then(() => confirm())}
                  disabled={isError || !sendTransactionAsync}
                  color={isError ? 'red' : 'blue'}
                  testdata-id="create-single-vest-confirmation-button"
                >
                  {isError ? 'Shoot! Something went wrong :(' : isLoading ? <Dots>Create</Dots> : 'Create'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal.Review>
      <Modal.Confirm tag={MODAL_ID} variant="transparent">
        {({ close }) => (
          <TxStatusModalContent
            testId="vest-creation-success-modal"
            tag={MODAL_ID}
            chainId={chainId}
            hash={data?.hash}
            successMessage={'Successfully created vest'}
            onClose={close}
          />
        )}
      </Modal.Confirm>
    </>
  )
})
