import { Amount } from '@sushiswap/currency'
import { Button, HistoryIcon, Popover, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import { Stream, Transaction, Vesting } from 'lib'
import { FC, memo, useMemo } from 'react'

import { type Transaction as TransactionDTO } from '.graphclient'

interface Props {
  stream: Stream | Vesting | undefined
  transactionRepresentations?: TransactionDTO[]
}

export const HistoryPopover: FC<Props> = ({ stream, transactionRepresentations }) => {
  const transactions = useMemo(
    () =>
      stream ? transactionRepresentations?.map((transaction) => new Transaction(transaction, stream.chainId)) : [],
    [stream, transactionRepresentations]
  )

  return (
    <Popover
      hover
      button={
        <Button color="gray" as="div">
          <HistoryIcon width={18} height={18} />
          <Typography variant="sm" weight={500} className="text-slate-200">
            History
          </Typography>
        </Button>
      }
      panel={
        <div className="z-10 flex flex-col overflow-hidden shadow-md rounded-xl bg-slate-800">
          <div className="p-4 bg-slate-700">
            <div className="grid grid-cols-[80px_80px_100px] gap-2 items-center">
              <Typography weight={500} className="tracking-wider capitalize text-slate-400" variant="xxs">
                Type
              </Typography>
              <Typography weight={500} className="tracking-wider text-left capitalize text-slate-400" variant="xxs">
                Date
              </Typography>
              <Typography weight={500} className="tracking-wider text-right capitalize text-slate-400" variant="xxs">
                Amount
              </Typography>
            </div>
          </div>
          <div className="px-4 overflow-auto max-h-[240px] hide-scrollbar divide-y divide-slate-700/50">
            {stream && transactions?.length ? (
              Object.values(transactions).map((transaction) => (
                <HistoryPopoverTransaction stream={stream} transaction={transaction} key={transaction.id} />
              ))
            ) : (
              <Typography variant="xs" className="flex items-center justify-center h-full py-4 italic text-slate-500">
                No transactions found
              </Typography>
            )}
          </div>
        </div>
      }
    ></Popover>
  )
}

const HistoryPopoverTransaction: FC<{ stream: Stream | Vesting; transaction: Transaction }> = memo(
  ({ stream, transaction }) => {
    return (
      <div key={transaction.id} className="py-2 grid grid-cols-[80px_80px_100px] gap-2 items-center">
        <Typography className="tracking-wider capitalize text-slate-200" weight={500} variant="xxs">
          {transaction?.status?.toLowerCase()}
        </Typography>
        <Typography variant="xs" className="flex flex-col text-left text-slate-200" weight={500}>
          {format(new Date(transaction.timestamp), 'dd MMM yyyy')}
          <Typography as="span" variant="xxs" className="text-slate-500">
            {format(new Date(transaction.timestamp), 'hh:maaa')}
          </Typography>
        </Typography>
        <Typography variant="xs" weight={500} className="flex flex-col text-right text-slate-200">
          {Amount.fromShare(transaction.amount.currency, transaction.amount.quotient, stream.rebase).toSignificant(6)}{' '}
          <span className="text-xs font-medium text-slate-500">{transaction.amount.currency.symbol}</span>
        </Typography>
      </div>
    )
  }
)

HistoryPopoverTransaction.displayName = 'HistoryPopoverTransaction'
