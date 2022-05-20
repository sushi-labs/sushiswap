import { Popover } from '@headlessui/react'
import { Chip, classNames, HistoryIcon, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import { Transaction, TransactionRepresentation, TransactionType } from 'features/context'
import { usePopover } from 'hooks'
import { FC, memo, useMemo } from 'react'
import { useAccount } from 'wagmi'

interface Props {
  transactionRepresentations?: TransactionRepresentation[]
}

const HistoryPopover: FC<Props> = ({ transactionRepresentations }) => {
  const { styles, attributes, setReferenceElement, setPopperElement } = usePopover()
  const { data: account } = useAccount()
  let transactions = useMemo(
    () =>
      transactionRepresentations
        ?.filter((transaction) => transaction.to.id === account?.address?.toLocaleLowerCase())
        .map((transaction) => new Transaction(transaction)),
    [transactionRepresentations, account],
  )

  return (
    <Popover>
      <Popover.Button ref={setReferenceElement}>
        {({ open }) => (
          <div
            className={classNames(
              open ? 'bg-slate-600' : '',
              'hover:ring-2 ring-slate-600 flex items-center gap-2 px-5 shadow-md cursor-pointer bg-slate-700 rounded-xl h-11',
            )}
          >
            <HistoryIcon width={18} height={18} />
            <Typography variant="sm" weight={700} className="text-slate-200">
              History
            </Typography>
          </div>
        )}
      </Popover.Button>
      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="border border-slate-700 overflow-hidden z-10 bg-slate-800 shadow-md rounded-xl flex flex-col gap-4 max-w-[530px]"
      >
        <div className="max-h-[440px] min-w-[258px] whitespace-nowrap overflow-auto flex flex-col divide-y divide-slate-800">
          {transactions?.length ? (
            Object.values(transactions).map((transaction) => (
              <HistoryPopoverTransaction transaction={transaction} key={transaction.id} />
            ))
          ) : (
            <Typography variant="xs" className="flex items-center justify-center h-full pb-4 italic text-slate-500">
              No transactions found
            </Typography>
          )}
        </div>
      </Popover.Panel>
    </Popover>
  )
}

const HistoryPopoverTransaction: FC<{ transaction: Transaction }> = memo(({ transaction }) => {
  return (
    <div key={transaction.id} className="even:bg-slate-700/40 flex items-center justify-between gap-7 py-2 px-4">
      <Typography variant="xs" className="text-slate-500 flex flex-col text-left" weight={500}>
        {format(transaction.timestamp, 'dd MMM yyyy')}
        <span>{format(transaction.timestamp, 'hh:maaa')}</span>
      </Typography>
      <div className="grid grid-cols-[80px_100px] gap-2 items-center justify-center">
        <div>
          <Chip
            color={
              transaction.status === TransactionType.DEPOSIT
                ? 'pink'
                : transaction.status === TransactionType.WITHDRAWAL
                ? 'blue'
                : transaction.status === TransactionType.EXTEND
                ? 'yellow'
                : 'default'
            }
            label={transaction.status.toLowerCase()}
            className="capitalize"
          />
        </div>
        <Typography variant="sm" weight={700} className="text-slate-200 text-right flex flex-col">
          {transaction.amount.toSignificant(6)}{' '}
          <span className="text-xs text-slate-500 font-medium">{transaction.amount.currency.symbol}</span>
        </Typography>
      </div>
    </div>
  )
})

HistoryPopoverTransaction.displayName = 'HistoryPopoverTransaction'

export default HistoryPopover
