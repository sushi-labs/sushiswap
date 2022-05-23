import { Amount, Token } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { classNames, Dialog, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import CreateFormButtons from 'features/vesting/CreateForm/CreateFormButtons'
import { createScheduleRepresentation } from 'features/vesting/CreateForm/createScheduleRepresentation'
import { CreateVestingFormDataTransformed } from 'features/vesting/CreateForm/types'
import { getExplorerLink } from 'functions'
import { parseAmount } from 'functions/parseAmount'
import React, { FC, ReactNode, useMemo } from 'react'
import { useNetwork } from 'wagmi'

interface Item {
  title: string
  value: any
  className?: string
}

const Item: FC<Item> = ({ title, value, className }) => {
  return (
    <div className="flex w-full justify-between items-center gap-1">
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
      <div className="flex gap-2 flex-wrap">{children}</div>
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
    token,
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
    const cliff = parseAmount(token, cliffAmount?.toString())
    const step = parseAmount(token, stepAmount.toString())
    const endDate = new Date(
      (cliff && cliffEndDate ? cliffEndDate : startDate).getTime() + stepConfig.time * stepPayouts * 1000
    )
    return [cliff, step, step.multiply(stepPayouts).add(cliff), endDate]
  }, [cliffAmount, cliffEndDate, startDate, stepAmount, stepConfig.time, stepPayouts, token])

  const schedule = useMemo(() => {
    return open
      ? createScheduleRepresentation({
          token,
          cliff,
          cliffAmount: _cliffAmount,
          stepAmount: _stepAmount,
          stepConfig,
          startDate,
          cliffEndDate,
          stepPayouts,
        })
      : undefined
  }, [_cliffAmount, _stepAmount, cliff, cliffEndDate, open, startDate, stepConfig, stepPayouts, token])

  return (
    <Dialog open={open} onClose={onDismiss} unmount={true}>
      <Dialog.Content className="!space-y- min-h-[300px] !max-w-md relative overflow-hidden border border-slate-700">
        <Dialog.Header title="Review Details" onClose={onDismiss} />
        <Typography variant="xs" className="!leading-5 text-slate-400">
          This will create a stream to{' '}
          <span className="font-bold text-slate-50 hover:text-blue">
            <a target="_blank" href={getExplorerLink(activeChain?.id, recipient, 'address')} rel="noreferrer">
              {shortenAddress(recipient)}
            </a>
          </span>{' '}
          consisting of{' '}
          <span className="font-bold text-slate-50">
            {totalAmount?.toSignificant(6)} {totalAmount.currency.symbol}
          </span>{' '}
          from <span className="font-bold text-slate-50">{format(startDate, 'dd MMM yyyy hh:mm')}</span> until{' '}
          <span className="font-bold text-slate-50">{format(endDate, 'dd MMM yyyy hh:mm')}</span>
        </Typography>
        <div className="flex flex-col w-full">
          <div className="border px-2 rounded-lg border-slate-800 overflow-auto max-h-[240px] mt-2 hide-scrollbar divide-y divide-slate-800">
            <div className="py-2 grid grid-cols-[60px_80px_80px_auto] gap-2 items-center">
              <Typography className="capitalize text-slate-500 tracking-wider" variant="xxs">
                Schedule
              </Typography>
              <Typography className="capitalize text-slate-500 tracking-wider" variant="xxs">
                Date
              </Typography>
              <Typography className="capitalize text-slate-500 tracking-wider text-right" variant="xxs">
                Amount
              </Typography>
              <Typography className="capitalize text-slate-500 tracking-wider text-right" variant="xxs">
                Total
              </Typography>
            </div>
            {
              schedule?.reduce<[ReactNode[], Amount<Token>]>(
                (acc, period) => {
                  acc[1] = acc[1].add(period.amount)
                  acc[0].push(
                    <div key={period.id} className="py-2 grid grid-cols-[60px_80px_80px_auto] gap-2 items-center">
                      <Typography className="capitalize text-slate-200 tracking-wider" weight={700} variant="xxs">
                        {period.type.toLowerCase()}
                      </Typography>
                      <Typography variant="xs" className="text-slate-200 flex flex-col text-left" weight={500}>
                        {format(new Date(period.time), 'dd MMM yyyy')}
                        <Typography as="span" variant="xxs" className="text-slate-500">
                          {format(new Date(period.time), 'hh:maaa')}
                        </Typography>
                      </Typography>
                      <Typography variant="xs" className="text-slate-200 flex flex-col text-right" weight={700}>
                        {period.amount.toSignificant(6)}
                        <Typography as="span" variant="xxs" className="text-slate-500">
                          {period?.amount.currency?.symbol}
                        </Typography>
                      </Typography>
                      <Typography variant="xs" className="text-slate-200 flex flex-col text-right" weight={700}>
                        {acc[1].toSignificant(6)}
                        <Typography as="span" variant="xxs" className="text-slate-500">
                          {period?.amount.currency?.symbol}
                        </Typography>
                      </Typography>
                    </div>
                  )

                  return acc
                },
                [[], Amount.fromRawAmount(token, '0')]
              )[0]
            }
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Table title="Details">
            <Item title="Funds Source" value={fundSource.toLowerCase()} className="capitalize" />
          </Table>
          <Table title="Cliff Details" className={cliff ? '' : 'opacity-40'}>
            {cliff && cliffEndDate ? (
              <>
                <Item title="Cliff End Date" value={format(cliffEndDate, 'dd MMM yyyy')} />
                <Item
                  title="Cliff Amount"
                  value={
                    <>
                      {cliffAmount} {token.symbol}
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
                  {stepAmount} {token.symbol}
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
