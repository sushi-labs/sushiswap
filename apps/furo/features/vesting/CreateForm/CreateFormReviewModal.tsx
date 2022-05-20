import { shortenAddress } from '@sushiswap/format'
import { Chip, classNames, Dialog, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import { PeriodType } from 'features'
import CreateFormButtons from 'features/vesting/CreateForm/CreateFormButtons'
import { createScheduleRepresentation } from 'features/vesting/CreateForm/createScheduleRepresentation'
import { CreateVestingFormDataTransformed } from 'features/vesting/CreateForm/types'
import { parseAmount } from 'functions/parseAmount'
import React, { FC } from 'react'

interface Item {
  title: string
  value: any
  className?: string
}

const Item: FC<Item> = ({ title, value, className }) => {
  return (
    <div className="flex flex-col gap-1">
      <Typography variant="xs" weight={700} className="whitespace-nowrap text-slate-500">
        {title}
      </Typography>
      <Typography variant="sm" weight={700} className={classNames(className, 'whitespace-nowrap text-slate-200')}>
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
    <div className={classNames(className, 'flex flex-col py-4 gap-2')}>
      <Typography variant="xxs" className="!leading-5 tracking-widest text-slate-600 uppercase">
        {title}
      </Typography>
      <div className="flex gap-x-6 gap-y-6 flex-wrap">{children}</div>
    </div>
  )
}

interface CreateFormReviewModal {
  open: boolean
  onDismiss(): void
  formData: CreateVestingFormDataTransformed
}

const CreateFormReviewModal: FC<CreateFormReviewModal> = ({ open, onDismiss, formData }) => {
  const {
    steps,
    cliffDuration,
    stepDuration,
    token,
    startDate,
    stepConfig,
    stepEndDate,
    stepAmount,
    fundSource,
    recipient,
    cliffEndDate,
    cliff,
    cliffAmount,
  } = formData

  const schedule = createScheduleRepresentation({
    token,
    cliff,
    cliffAmount: parseAmount(token, cliffAmount.toString()),
    stepAmount: parseAmount(token, stepAmount.toString()),
    stepConfig,
    startDate,
    cliffEndDate,
    stepEndDate,
  })

  return (
    <Dialog open={open} onClose={onDismiss}>
      <Dialog.Content className="!space-y-6 min-h-[300px] !max-w-3xl relative overflow-hidden border border-slate-700">
        <Dialog.Header title="Review Details" onClose={onDismiss} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="flex flex-col gap-2">
            <Table title="General Details">
              <Item title="Start Date" value={format(startDate, 'dd MMM yyyy')} />
              <Item title="Recipient" value={shortenAddress(recipient)} />
              <Item title="Funds Source" value={fundSource.toLowerCase()} className="capitalize" />
            </Table>
            <Table title="Cliff Details" className={cliff ? '' : 'opacity-40'}>
              {cliff ? (
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
              <Item title="Graded Vesting End Date" value={format(stepEndDate, 'dd MMM yyyy')} />
              <Item title="Payment Frequency" value={stepConfig.label} />
              <Item
                title="Payment per Frequency"
                value={
                  <>
                    {stepAmount} {token.symbol}
                  </>
                }
              />
            </Table>
          </div>
          <div className="flex flex-col w-full py-3">
            <Typography variant="xxs" weight={700} className="!leading-5 tracking-widest text-slate-600 uppercase">
              Schedule
            </Typography>
            <div className="border border-slate-800 overflow-auto max-h-[440px] rounded-2xl mt-5 hide-scrollbar shadow-md">
              {schedule.map((period) => (
                <div key={period.id} className="even:bg-slate-700/40 flex items-center justify-between gap-7 py-2 px-4">
                  <Typography variant="xs" className="text-slate-500 flex flex-col text-left" weight={500}>
                    {format(new Date(period.time), 'dd MMM yyyy')}
                    <span>{format(new Date(period.time), 'hh:maaa')}</span>
                  </Typography>
                  <div className="grid grid-cols-[80px_100px] gap-2 items-center justify-center">
                    <div>
                      <Chip color="default" label={period.type.toLowerCase()} className="capitalize" />
                    </div>
                    <Typography variant="xs" weight={500} className="text-slate-200">
                      {period.amount.toSignificant(6)}
                      {period.type !== PeriodType.START && (
                        <span className="text-xs text-slate-500 font-medium"> {period?.amount.currency?.symbol}</span>
                      )}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <CreateFormButtons formData={formData} onDismiss={onDismiss} />
      </Dialog.Content>
    </Dialog>
  )
}

export default CreateFormReviewModal
