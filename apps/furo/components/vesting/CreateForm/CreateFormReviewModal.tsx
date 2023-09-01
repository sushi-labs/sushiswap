import { isAddress } from '@ethersproject/address'
import { BENTOBOX_ADDRESS, BentoBoxChainId } from '@sushiswap/bentobox-sdk'
import { Chain } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { FuroChainId } from '@sushiswap/furo-sdk'
import { FundSource } from '@sushiswap/hooks'
import {
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { Dots } from '@sushiswap/ui/components/dots'
import { List } from '@sushiswap/ui/components/list/List'
import { createToast } from '@sushiswap/ui/components/toast'
import {
  getFuroVestingRouterContractConfig,
  useAccount,
  useBentoBoxTotal,
  useFuroVestingRouterContract,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from '@sushiswap/wagmi'
import { SendTransactionResult, waitForTransaction } from '@sushiswap/wagmi/actions'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { useApproved, useSignature, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { format } from 'date-fns'
import React, { FC, useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { Hex } from 'viem'

import { approveBentoBoxAction, batchAction, useDeepCompareMemoize, vestingCreationAction } from '../../../lib'
import { useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { CreateMultipleVestingFormSchemaType, STEP_CONFIGURATIONS_LABEL, STEP_CONFIGURATIONS_MAP } from '../schema'
import { calculateCliffDuration, calculateEndDate, calculateStepPercentage, calculateTotalAmount } from '../utils'

const APPROVE_TAG = 'createVestingSingle'

interface CreateFormReviewModal {
  chainId: FuroChainId
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
  const rebase = useBentoBoxTotal(chainId as BentoBoxChainId, _currency)
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
        promise: waitForTransaction({ hash: data.hash }),
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

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
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
      !(cliffEnabled || !_cliffDuration) ||
      !stepConfig ||
      !STEP_CONFIGURATIONS_MAP[stepConfig] ||
      !_stepPercentage ||
      !_totalAmount ||
      !stepPayouts ||
      !rebase ||
      !approved
    ) {
      return {}
    }

    const actions: Hex[] = []
    if (signature) {
      actions.push(approveBentoBoxAction({ user: address, signature }))
    }

    actions.push(
      vestingCreationAction({
        recipient,
        currency: _currency,
        startDate,
        cliffDuration: Number(_cliffDuration),
        stepDuration: STEP_CONFIGURATIONS_MAP[stepConfig],
        steps: Number(stepPayouts),
        stepPercentage: _stepPercentage,
        amount: _totalAmount.quotient,
        fromBentoBox: _fundSource === FundSource.BENTOBOX,
        minShare: _totalAmount.toShare(rebase),
      })
    )

    return {
      account: address,
      to: contract.address,
      data: batchAction({ actions }),
      value: _currency.isNative ? _totalAmount.quotient : 0n,
    }
  }, [
    isValid,
    isValidating,
    contract,
    address,
    chainId,
    recipient,
    _currency,
    startDate,
    cliffEnabled,
    _cliffDuration,
    stepConfig,
    _stepPercentage,
    _totalAmount,
    stepPayouts,
    rebase,
    approved,
    signature,
    _fundSource,
  ])

  const { config } = usePrepareSendTransaction({
    ...prepare,
    chainId,
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
        (!cliffEnabled || _cliffDuration) &&
        stepConfig &&
        STEP_CONFIGURATIONS_MAP[stepConfig] &&
        _stepPercentage &&
        _totalAmount &&
        stepPayouts &&
        rebase &&
        approved
    ),
  })

  const { sendTransactionAsync, isLoading, isError, data } = useSendTransaction({
    ...config,
    onSettled,
    onSuccess: () => {
      setSignature(undefined)
    },
  })
  const { status } = useWaitForTransaction({ chainId, hash: data?.hash })

  const formValid = isValid && !isValidating && Object.keys(errors).length === 0

  if (stepConfig) console.log(STEP_CONFIGURATIONS_MAP[stepConfig])

  return (
    <DialogProvider>
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
                chainId={chainId as BentoBoxChainId}
                masterContract={getFuroVestingRouterContractConfig(chainId).address}
                className="col-span-3 md:col-span-2"
              >
                <Checker.ApproveERC20
                  type="button"
                  fullWidth
                  contract={BENTOBOX_ADDRESS[chainId as BentoBoxChainId]}
                  id="create-single-vest-approve-token"
                  amount={_totalAmount}
                  className="col-span-3 md:col-span-2"
                >
                  <Checker.Success tag={APPROVE_TAG}>
                    <DialogReview>
                      {({ confirm }) => (
                        <>
                          <DialogTrigger asChild>
                            <Button
                              size="xl"
                              type="button"
                              fullWidth
                              disabled={!formValid || !sendTransactionAsync}
                              testId="review-single-vest"
                              className="col-span-3 md:col-span-2"
                            >
                              Review vesting
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create Vest</DialogTitle>
                              <DialogDescription>
                                {_totalAmount?.toSignificant(6)} {_totalAmount?.currency.symbol}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-4">
                              <List className="!pt-0">
                                <List.Control>
                                  <List.KeyValue flex title="Network">
                                    {Chain.from(chainId).name}
                                  </List.KeyValue>
                                  {_totalAmount && (
                                    <List.KeyValue flex title="Total amount">
                                      <div
                                        className="flex items-center gap-2"
                                        testdata-id="vesting-review-total-amount"
                                      >
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
                                <List className="!pt-0">
                                  <List.Control>
                                    <List.KeyValue flex title="Cliff end date">
                                      {format(cliffEndDate, 'dd MMM yyyy')}
                                    </List.KeyValue>
                                    <List.KeyValue flex title="Cliff amount">
                                      <div
                                        className="flex items-center gap-2"
                                        testdata-id="vesting-review-cliff-amount"
                                      >
                                        <Currency.Icon currency={_cliffAmount.currency} width={18} height={18} />
                                        {_cliffAmount?.toSignificant(6)} {_cliffAmount.currency.symbol}
                                      </div>
                                    </List.KeyValue>
                                  </List.Control>
                                </List>
                              )}
                              <List className="!pt-0">
                                <List.Control>
                                  {_stepAmount && (
                                    <List.KeyValue flex title="Payout per unlock">
                                      <div
                                        className="flex items-center gap-2"
                                        testdata-id="vesting-review-payment-per-period"
                                      >
                                        <Currency.Icon currency={_stepAmount.currency} width={18} height={18} />
                                        {_stepAmount?.toSignificant(6)} {_stepAmount.currency.symbol}
                                      </div>
                                    </List.KeyValue>
                                  )}
                                  <List.KeyValue
                                    flex
                                    title="Number of unlocks"
                                    testdata-id="vesting-review-amount-of-periods"
                                  >
                                    <div
                                      className="flex items-center gap-2"
                                      testdata-id="vesting-review-amount-of-periods"
                                    >
                                      {stepPayouts}
                                    </div>
                                  </List.KeyValue>
                                  <List.KeyValue
                                    flex
                                    title="Unlock frequency"
                                    testdata-id="vesting-review-period-length"
                                  >
                                    <div className="flex items-center gap-2" testdata-id="vesting-review-period-length">
                                      {stepConfig ? STEP_CONFIGURATIONS_LABEL[stepConfig] : ''}
                                    </div>
                                  </List.KeyValue>
                                </List.Control>
                              </List>
                            </div>
                            <DialogFooter>
                              <Button
                                fullWidth
                                size="xl"
                                loading={isLoading && !isError}
                                onClick={() => sendTransactionAsync?.().then(() => confirm())}
                                disabled={isError || !sendTransactionAsync}
                                color={isError ? 'red' : 'blue'}
                                testId="create-single-vest-confirmation"
                              >
                                {isError ? (
                                  'Shoot! Something went wrong :('
                                ) : isLoading ? (
                                  <Dots>Create</Dots>
                                ) : (
                                  'Create'
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </>
                      )}
                    </DialogReview>
                  </Checker.Success>
                </Checker.ApproveERC20>
              </Checker.ApproveBentobox>
            </Checker.Amounts>
          </Checker.Network>
        </Checker.Connect>
      </div>
      <DialogConfirm
        chainId={chainId}
        status={status}
        testId="vest-creation-success-modal"
        successMessage="Successfully created vest!"
        txHash={data?.hash}
      />
    </DialogProvider>
  )
})
