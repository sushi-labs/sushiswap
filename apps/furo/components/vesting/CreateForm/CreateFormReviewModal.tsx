import { Chain } from '@sushiswap/chain'
import { Amount, tryParseAmount, Type } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { classNames, Dialog, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import React, { FC, ReactNode, useMemo } from 'react'
import { useNetwork } from 'wagmi'

import { createScheduleRepresentation } from '../createScheduleRepresentation'
import CreateFormButtons from './CreateFormButtons'
import { CreateVestingFormDataTransformed } from './types'

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
      <Typography variant="xs" weight={700} className={classNames(className, 'whitespace-nowrap text-slate-200')}>
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
  formData: CreateVestingFormDataTransformed
}

const CreateFormReviewModal: FC<CreateFormReviewModal> = ({ open, onDismiss, formData }) => {
  const { activeChain } = useNetwork()
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
    const step = tryParseAmount(stepAmount.toString(), currency)
    const endDate = new Date(
      (cliff && cliffEndDate ? cliffEndDate : startDate).getTime() + stepConfig.time * stepPayouts * 1000
    )
    return [
      cliff,
      step,
      cliff && step ? step.multiply(stepPayouts).add(cliff) : step ? step.multiply(stepPayouts) : undefined,
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

  console.log(startDate, endDate)
  return (
    <Dialog open={open} onClose={onDismiss} unmount={true}>
      <Dialog.Content className="!space-y- min-h-[300px] !max-w-md relative overflow-hidden border border-slate-700">
        <Dialog.Header title="Review Details" onClose={onDismiss} />
        <Typography variant="xs" className="!leading-5 text-slate-400">
          This will create a stream to{' '}
          <span className="font-bold text-slate-50 hover:text-blue">
            {activeChain && recipient && (
              <a target="_blank" href={Chain.from(activeChain.id).getAccountUrl(recipient)} rel="noreferrer">
                {shortenAddress(recipient)}
              </a>
            )}
          </span>{' '}
          consisting of{' '}
          <span className="font-bold text-slate-50">
            {totalAmount?.toSignificant(6)} {totalAmount?.currency.symbol}
          </span>{' '}
          from <span className="font-bold text-slate-50">{!!startDate && format(startDate, 'dd MMM yyyy hh:mm')}</span>{' '}
          until <span className="font-bold text-slate-50">{!!endDate && format(endDate, 'dd MMM yyyy hh:mm')}</span>
        </Typography>
        <div className="flex flex-col w-full">
          <div className="border px-2 rounded-lg border-slate-800 overflow-auto max-h-[240px] mt-2 hide-scrollbar divide-y divide-slate-800">
            <div className="py-2 grid grid-cols-[60px_80px_80px_auto] gap-2 items-center">
              <Typography className="tracking-wider capitalize text-slate-500" variant="xxs">
                Schedule
              </Typography>
              <Typography className="tracking-wider capitalize text-slate-500" variant="xxs">
                Date
              </Typography>
              <Typography className="tracking-wider text-right capitalize text-slate-500" variant="xxs">
                Amount
              </Typography>
              <Typography className="tracking-wider text-right capitalize text-slate-500" variant="xxs">
                Total
              </Typography>
            </div>
            {
              schedule?.reduce<[ReactNode[], Amount<Type>]>(
                (acc, period) => {
                  acc[1] = acc[1].add(period.amount)
                  acc[0].push(
                    <div key={period.id} className="py-2 grid grid-cols-[60px_80px_80px_auto] gap-2 items-center">
                      <Typography className="tracking-wider capitalize text-slate-200" weight={700} variant="xxs">
                        {period.type.toLowerCase()}
                      </Typography>
                      <Typography variant="xs" className="flex flex-col text-left text-slate-200" weight={500}>
                        {format(period.date, 'dd MMM yyyy')}
                        <Typography as="span" variant="xxs" className="text-slate-500">
                          {format(period.date, 'hh:maaa')}
                        </Typography>
                      </Typography>
                      <Typography variant="xs" className="flex flex-col text-right text-slate-200" weight={700}>
                        {period.amount.toSignificant(6)}
                        <Typography as="span" variant="xxs" className="text-slate-500">
                          {period?.amount.currency?.symbol}
                        </Typography>
                      </Typography>
                      <Typography variant="xs" className="flex flex-col text-right text-slate-200" weight={700}>
                        {acc[1].toSignificant(6)}
                        <Typography as="span" variant="xxs" className="text-slate-500">
                          {period?.amount.currency?.symbol}
                        </Typography>
                      </Typography>
                    </div>
                  )

                  return acc
                },
                [[], Amount.fromRawAmount(currency, '0')]
              )[0]
            }
          </div>
        </div>
        <div className="flex flex-col gap-2">
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
                      {cliffAmount} {currency.symbol}
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
                  {stepAmount} {currency.symbol}
                </>
              }
            />
            <Item title="Period Length" value={stepConfig.label} />
            <Item title="Amount of Periods" value={stepPayouts} />
          </Table>
        </div>
        <div className="border-t border-slate-800">
          <CreateFormButtons formData={formData} onDismiss={onDismiss} />
        </div>
      </Dialog.Content>
    </Dialog>
  )
}

export default CreateFormReviewModal
