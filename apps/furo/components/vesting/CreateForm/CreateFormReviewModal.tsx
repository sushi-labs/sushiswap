import { Transition } from '@headlessui/react'
import { Chain } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { classNames, Dialog, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import React, { FC, Fragment, ReactNode, useMemo } from 'react'
import { useNetwork } from 'wagmi'

import { createScheduleRepresentation } from '../createScheduleRepresentation'
import { CreateVestingFormDataTransformedAndValidated } from '../types'
import CreateFormButtons from './CreateFormButtons'
import { ScheduleReview } from './ScheduleReview'

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

const Table: FC<{
  title: string
  className?: string
  children: React.ReactElement<typeof Item> | React.ReactElement<typeof Item>[]
}> = ({ children, title, className }) => {
  return (
    <div className={classNames(className, 'flex flex-col pb-3 gap-2')}>
      <Typography variant="xxs" className="!leading-5 tracking-widest text-slate-50 font-medium uppercase">
        {title}
      </Typography>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

interface CreateFormReviewModal {
  open: boolean
  onDismiss(): void
  formData: CreateVestingFormDataTransformedAndValidated
}

const CreateFormReviewModal: FC<CreateFormReviewModal> = ({ open, onDismiss, formData }) => {
  const { chain: activeChain } = useNetwork()
  const {
    currency,
    startDate,
    stepConfig,
    stepAmount,
    fundSource,
    recipient,
    cliffEndDate,
    cliff,
    cliffAmount,
    stepPayouts,
  } = formData

  const [_cliffAmount, _stepAmount, totalAmount, endDate] = useMemo(() => {
    const cliff = tryParseAmount(cliffAmount?.toString(), currency)
    const step = tryParseAmount(stepAmount?.toString(), currency)
    const endDate = new Date(
      (cliff && cliffEndDate ? cliffEndDate : startDate).getTime() + stepConfig.time * stepPayouts * 1000
    )
    return [
      cliff,
      step,
      cliff && stepAmount
        ? stepAmount.multiply(stepPayouts).add(cliffAmount)
        : stepAmount
        ? stepAmount.multiply(stepPayouts)
        : undefined,
      endDate,
    ]
  }, [cliffAmount, cliffEndDate, startDate, stepAmount, stepConfig.time, stepPayouts, currency])

  const schedule = useMemo(() => {
    return open && _stepAmount
      ? createScheduleRepresentation({
          currency,
          cliffAmount: _cliffAmount,
          stepAmount: _stepAmount,
          stepDuration: stepConfig.time * 1000,
          startDate,
          cliffEndDate,
          stepPayouts,
        })
      : undefined
  }, [_cliffAmount, _stepAmount, cliffEndDate, open, startDate, stepConfig, stepPayouts, currency])

  return (
    <Dialog open={open} onClose={onDismiss} unmount={false}>
      <Dialog.Content className="!space-y- min-h-[300px] !max-w-sm relative overflow-hidden bg-slate-900 !pb-3">
        <Dialog.Header title="Review Details" onClose={onDismiss} />
        <Typography variant="xs" className="!leading-5 text-slate-400 mt-3">
          This will create a stream to{' '}
          <span className="font-medium text-slate-50 hover:text-blue">
            {activeChain && recipient && (
              <a target="_blank" href={Chain.from(activeChain.id).getAccountUrl(recipient)} rel="noreferrer">
                {shortenAddress(recipient)}
              </a>
            )}
          </span>{' '}
          consisting of{' '}
          <span className="font-medium text-slate-50">
            {totalAmount?.toSignificant(6)} {totalAmount?.currency.symbol}
          </span>{' '}
          from{' '}
          <span className="font-medium text-slate-50">{!!startDate && format(startDate, 'dd MMM yyyy hh:mm')}</span>{' '}
          until <span className="font-medium text-slate-50">{!!endDate && format(endDate, 'dd MMM yyyy hh:mm')}</span>
        </Typography>
        <div className="mt-2">
          <ScheduleReview schedule={schedule} currency={currency} />
        </div>
        <div className="flex flex-col gap-2 mt-3">
          <Table title="Details">
            <Item title="Funds Source" value={fundSource.toLowerCase()} className="capitalize" />
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
          <Table title="Cliff Details" className={cliff ? '' : 'opacity-40'}>
            {cliff && cliffEndDate ? (
              <>
                <Item title="Cliff End Date" value={format(cliffEndDate, 'dd MMM yyyy')} />
                <Item
                  title="Cliff Amount"
                  value={
                    <>
                      {cliffAmount.toSignificant(6)} {currency.symbol}
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
                  {stepAmount.toSignificant(6)} {currency.symbol}
                </>
              }
            />
            <Item title="Period Length" value={stepConfig.label} />
            <Item title="Amount of Periods" value={stepPayouts} />
          </Table>
        </div>
        <Transition
          as={Fragment}
          show={startDate.getTime() <= new Date().getTime()}
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
        <div className="w-full pt-3 border-t border-slate-200/5" />
        <CreateFormButtons formData={formData} onDismiss={onDismiss} />
      </Dialog.Content>
    </Dialog>
  )
}

export default CreateFormReviewModal
