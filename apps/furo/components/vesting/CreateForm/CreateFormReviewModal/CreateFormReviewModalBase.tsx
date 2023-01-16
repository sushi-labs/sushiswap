import { isAddress } from '@ethersproject/address'
import { Transition } from '@headlessui/react'
import { Chain, ChainId } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { classNames, Dialog, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import React, { FC, Fragment, ReactNode, useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { useDeepCompareMemoize } from '../../../../lib'
import { useTokenFromZToken } from '../../../../lib/zod'
import { createScheduleRepresentation } from '../../createScheduleRepresentation'
import { calculateEndDate, calculateTotalAmount } from '../../utils'
import { ScheduleReview } from '../ScheduleReview'
import { CreateVestingFormSchemaType } from '../schema'

interface Item {
  title: string
  value: ReactNode | Array<ReactNode>
  className?: string
}

const Item: FC<Item> = ({ title, value, className }) => {
  return (
    <div className="flex items-center justify-between w-full gap-1">
      <Typography variant="sm" className="whitespace-nowrap text-slate-300">
        {title}
      </Typography>
      <Typography variant="sm" weight={500} className={classNames(className, 'whitespace-nowrap text-slate-50')}>
        {value}
      </Typography>
    </div>
  )
}

const Table: FC<{
  title: string
  className?: string
  children: React.ReactElement<typeof Item> | React.ReactElement<typeof Item>[]
}> = ({ children, title, className }) => {
  return (
    <div className={classNames(className, 'flex flex-col pb-3 gap-2')}>
      <Typography variant="xxs" className="!leading-5 tracking-widest text-slate-400 font-semibold uppercase">
        {title}
      </Typography>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  )
}

interface CreateFormReviewModalBase {
  chainId: ChainId
  open: boolean
  setOpen(open: boolean): void
  children: ReactNode
}

const CreateFormReviewModalBase: FC<CreateFormReviewModalBase> = ({ chainId, children, open, setOpen }) => {
  const { watch } = useFormContext<CreateVestingFormSchemaType>()
  const formData = watch()
  const _formData = useDeepCompareMemoize(formData)
  const { cliff, recipient, currency, stepAmount, stepPayouts, stepConfig, startDate, fundSource } = _formData
  const _currency = useTokenFromZToken(currency)

  const endDate = useMemo(
    () => calculateEndDate({ cliff, startDate, stepPayouts, stepConfig }),
    [cliff, startDate, stepConfig, stepPayouts]
  )
  const totalAmount = useMemo(
    () => calculateTotalAmount({ currency, cliff, stepAmount, stepPayouts }),
    [cliff, currency, stepAmount, stepPayouts]
  )
  const [_cliffAmount, _stepAmount] = useMemo(() => {
    if (cliff.cliffEnabled) {
      const { cliffAmount } = cliff
      return [tryParseAmount(cliffAmount?.toString(), _currency), tryParseAmount(stepAmount?.toString(), _currency)]
    } else {
      return [undefined, tryParseAmount(stepAmount?.toString(), _currency)]
    }
  }, [_currency, cliff, stepAmount])

  const schedule = useMemo(() => {
    if (cliff.cliffEnabled) {
      const { cliffEndDate } = cliff
      return _stepAmount && _currency && stepConfig && startDate && stepPayouts
        ? createScheduleRepresentation({
            currency: _currency,
            cliffAmount: _cliffAmount,
            stepAmount: _stepAmount,
            stepDuration: stepConfig.time * 1000,
            startDate,
            cliffEndDate,
            stepPayouts,
          })
        : undefined
    }

    return _stepAmount && _currency && stepConfig && startDate && stepPayouts
      ? createScheduleRepresentation({
          currency: _currency,
          cliffAmount: _cliffAmount,
          stepAmount: _stepAmount,
          stepDuration: stepConfig.time * 1000,
          startDate,
          cliffEndDate: null,
          stepPayouts,
        })
      : undefined
  }, [cliff, _stepAmount, _currency, stepConfig, startDate, stepPayouts, _cliffAmount])

  const onDismiss = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Dialog open={open} onClose={onDismiss} unmount={false}>
      <Dialog.Content className="!space-y- min-h-[300px] !max-w-md relative overflow-hidden bg-slate-900 !pb-3 !px-4">
        <Dialog.Header title="Review Details" onClose={onDismiss} />
        {_currency && recipient && isAddress(recipient) && endDate && (
          <>
            <Typography variant="xs" className="!leading-5 text-slate-400 mt-6 text-center">
              This will create a stream to{' '}
              <span className="font-medium text-slate-50 hover:text-blue">
                <a target="_blank" href={Chain.from(chainId)?.getAccountUrl(recipient)} rel="noreferrer">
                  {shortenAddress(recipient)}
                </a>
              </span>{' '}
              consisting of{' '}
              <span className="font-medium text-slate-50">
                {totalAmount?.toSignificant(6)} {totalAmount?.currency.symbol}
              </span>{' '}
              from{' '}
              <span className="font-medium text-slate-50">{!!startDate && format(startDate, 'dd MMM yyyy hh:mm')}</span>{' '}
              until{' '}
              <span className="font-medium text-slate-50">{!!endDate && format(endDate, 'dd MMM yyyy hh:mm')}</span>
            </Typography>
            <div className="mt-6">
              <ScheduleReview schedule={schedule} currency={_currency} />
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <Table title="Details">
                <Item title="Funds Source" value={fundSource?.toLowerCase()} className="capitalize" />
                <Item
                  title="Total Amount"
                  value={
                    <>
                      {totalAmount?.toSignificant(6)} {totalAmount?.currency.symbol}
                    </>
                  }
                />
                <Item title="End Date" value={format(endDate, 'dd MMM yyyy')} />
              </Table>
              <Table title="Cliff Details" className={cliff.cliffEnabled ? '' : 'opacity-40'}>
                {cliff.cliffEnabled && cliff.cliffEndDate ? (
                  <>
                    <Item title="Cliff End Date" value={format(cliff.cliffEndDate, 'dd MMM yyyy')} />
                    <Item
                      title="Cliff Amount"
                      value={
                        <>
                          {_cliffAmount?.toSignificant(6)} {currency?.symbol}
                        </>
                      }
                    />
                  </>
                ) : (
                  <Item title="Cliff Amount" value={<span className="italic">Not enabled</span>} />
                )}
              </Table>
              <Table title="Graded Vesting Details">
                <Item
                  title="Payment per Period"
                  value={
                    <>
                      {_stepAmount?.toSignificant(6)} {currency?.symbol}
                    </>
                  }
                />
                <Item title="Period Length" value={stepConfig?.label} />
                <Item title="Amount of Periods" value={stepPayouts} />
              </Table>
            </div>
            <Transition
              as={Fragment}
              show={startDate && startDate.getTime() <= new Date().getTime()}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="!my-0 flex flex-col gap-1 absolute inset-0 bg-slate-900 items-center justify-center">
                <Typography variant="lg" weight={500} className="text-slate-200">
                  Start date has expired
                </Typography>
                <Typography variant="xs" weight={500} className="text-slate-400">
                  Please change the start date of your stream
                </Typography>
              </div>
            </Transition>
            <div className="w-full pt-3" />
            {children}
          </>
        )}
      </Dialog.Content>
    </Dialog>
  )
}

export default CreateFormReviewModalBase
