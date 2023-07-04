import { isAddress } from '@ethersproject/address'
import { TransactionRequest } from '@ethersproject/providers'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Chain } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { FuroVestingRouterChainId } from '@sushiswap/furo'
import { FundSource } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { Dots } from '@sushiswap/ui/components/dots'
import { List } from '@sushiswap/ui/components/list/List'
import { Modal } from '@sushiswap/ui/components/modal/Modal'
import { createToast } from '@sushiswap/ui/components/toast'
import {
  getFuroVestingRouterContractConfig,
  useAccount,
  useBentoBoxTotal,
  useFuroVestingRouterContract,
} from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { TxStatusModalContent } from '@sushiswap/wagmi/future/components/TxStatusModal'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { useApproved, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { useSignature } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { format } from 'date-fns'
import React, { Dispatch, FC, SetStateAction, useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { approveBentoBoxAction, batchAction, useDeepCompareMemoize, vestingCreationAction } from '../../../lib'
import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { CreateMultipleVestingFormSchemaType, STEP_CONFIGURATIONS_LABEL,STEP_CONFIGURATIONS_MAP } from '../schema'
import { calculateCliffDuration, calculateEndDate, calculateStepPercentage, calculateTotalAmount } from '../utils'

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
    formState: { isValid, isValidating, errors },
  } = useFormContext<CreateMultipleVestingFormSchemaType>()

  const { approved } = useApproved(APPROVE_TAG)
  const { signature, setSignature } = useSignature(APPROVE_TAG)

  const formData = watch('vestings.0')
  const _formData = useDeepCompareMemoize(formData)

  const {
    recipient,
    startDate,
    stepConfig,
    stepPayouts,
    fundSource,
    currency,
    cliffEnabled,
    cliffAmount,
    cliffEndDate,
    stepAmount,
  } = _formData
  const _fundSource = ZFundSourceToFundSource.parse(fundSource)
  const _currency = useTokenFromZToken(formData.currency)
  const _totalAmount = useMemo(
    () => calculateTotalAmount({ currency, cliffEnabled, cliffAmount, stepAmount, stepPayouts }),
    [cliffAmount, cliffEnabled, currency, stepAmount, stepPayouts]
  )
  const _cliffDuration = useMemo(
    () => calculateCliffDuration({ cliffEnabled, cliffEndDate, startDate }),
    [cliffEnabled, cliffEndDate, startDate]
  )
  const _stepPercentage = useMemo(
    () => calculateStepPercentage({ currency, cliffEnabled, cliffAmount, stepAmount, stepPayouts }),
    [cliffAmount, cliffEnabled, currency, stepAmount, stepPayouts]
  )
  const rebase = useBentoBoxTotal(chainId, _currency)
  const endDate = useMemo(
    () => calculateEndDate({ cliffEndDate, cliffEnabled, startDate, stepPayouts, stepConfig }),
    [cliffEnabled, cliffEndDate, startDate, stepConfig, stepPayouts]
  )

  const [_cliffAmount, _stepAmount] = useMemo(() => {
    if (cliffEnabled) {
      return [tryParseAmount(cliffAmount?.toString(), _currency), tryParseAmount(stepAmount?.toString(), _currency)]
    } else {
      return [undefined, tryParseAmount(stepAmount?.toString(), _currency)]
    }
  }, [_currency, cliffAmount, cliffEnabled, stepAmount])

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
        !STEP_CONFIGURATIONS_MAP[stepConfig] ||
        !_stepPercentage ||
        !_totalAmount ||
        !stepPayouts ||
        !rebase ||
        approved
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
          stepDuration: STEP_CONFIGURATIONS_MAP[stepConfig].toString(),
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
      approved,
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
        STEP_CONFIGURATIONS_MAP[stepConfig] &&
        _stepPercentage &&
        _totalAmount &&
        stepPayouts &&
        rebase &&
        approved
    ),
  })

  const formValid = isValid && !isValidating && Object.keys(errors).length === 0
  console.log({ stepConfig })
  if (stepConfig) console.log(STEP_CONFIGURATIONS_MAP[stepConfig])
  return (
    <>
      <div className="grid grid-cols-3 gap-x-10">
        <div />
        <Checker.Connect fullWidth type="button" className="col-span-3 md:col-span-2">
          <Checker.Network fullWidth type="button" chainId={chainId} className="col-span-3 md:col-span-2">
            <Checker.Amounts
              fullWidth
              type="button"
              chainId={chainId}
              amounts={[_totalAmount]}
              className="col-span-3 md:col-span-2"
            >
              <Checker.ApproveBentobox
                tag={APPROVE_TAG}
                type="button"
                fullWidth
                id="create-single-vest-approve-bentobox"
                chainId={chainId as BentoBoxV1ChainId}
                masterContract={getFuroVestingRouterContractConfig(chainId).address}
                className="col-span-3 md:col-span-2"
              >
                <Checker.ApproveERC20
                  type="button"
                  fullWidth
                  contract={bentoBoxV1Address[chainId]}
                  id="create-single-vest-approve-token"
                  amount={_totalAmount}
                  className="col-span-3 md:col-span-2"
                >
                  <Checker.Success tag={APPROVE_TAG}>
                    <Modal.Trigger tag={MODAL_ID}>
                      {({ open }) => (
                        <Button
                          size="xl"
                          type="button"
                          fullWidth
                          disabled={!formValid || !sendTransactionAsync}
                          onClick={open}
                          testId="review-single-vest"
                          className="col-span-3 md:col-span-2"
                        >
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
      </div>
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
              {cliffEnabled && cliffEndDate && _cliffAmount && (
                <List>
                  <List.Control>
                    <List.KeyValue flex title="Cliff end date">
                      {format(cliffEndDate, 'dd MMM yyyy')}
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
                      {stepConfig ? STEP_CONFIGURATIONS_LABEL[stepConfig] : ''}
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
                  testId="create-single-vest-confirmation"
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
