import { HistoryIcon, Popover, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import { Transaction, TransactionRepresentation } from 'features/context'
import { FC, memo, useMemo } from 'react'
import { useAccount, useNetwork } from 'wagmi'

interface Props {
  transactionRepresentations?: TransactionRepresentation[]
}

const HistoryPopover: FC<Props> = ({ transactionRepresentations }) => {
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()

  let transactions = useMemo(
    () =>
      activeChain?.id
        ? transactionRepresentations
            ?.filter((transaction) => transaction.to.id === account?.address?.toLocaleLowerCase())
            .map((transaction) => new Transaction(transaction, activeChain?.id))
        : [],
    [activeChain?.id, transactionRepresentations, account?.address]
  )

  return (
    <Popover
      button={
        <div className="hover:ring-2 active:bg-slate-500 focus:bg-slate-500 hover:bg-slate-600 ring-slate-600 flex items-center gap-2 px-5 shadow-md cursor-pointer bg-slate-700 rounded-xl h-11">
          <HistoryIcon width={18} height={18} />
          <Typography variant="sm" weight={700} className="text-slate-200">
            History
          </Typography>
        </div>
      }
      panel={
        <div className="z-10 shadow-md overflow-hidden rounded-xl flex flex-col bg-slate-800">
          <div className="p-4 bg-slate-700">
            <div className="grid grid-cols-[80px_80px_100px] gap-2 items-center">
              <Typography weight={700} className="capitalize text-slate-400 tracking-wider" variant="xxs">
                Type
              </Typography>
              <Typography weight={700} className="capitalize text-slate-400 tracking-wider text-left" variant="xxs">
                Date
              </Typography>
              <Typography weight={700} className="capitalize text-slate-400 tracking-wider text-right" variant="xxs">
                Amount
              </Typography>
            </div>
          </div>
          <div className="px-4 overflow-auto max-h-[240px] hide-scrollbar divide-y divide-slate-700/50">
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
        </div>
      }
    ></Popover>
  )
}

const HistoryPopoverTransaction: FC<{ transaction: Transaction }> = memo(({ transaction }) => {
  return (
    <div key={transaction.id} className="py-2 grid grid-cols-[80px_80px_100px] gap-2 items-center">
      <Typography className="capitalize text-slate-200 tracking-wider" weight={700} variant="xxs">
        {transaction.status.toLowerCase()}
      </Typography>
      <Typography variant="xs" className="text-slate-200 flex flex-col text-left" weight={500}>
        {format(new Date(transaction.timestamp), 'dd MMM yyyy')}
        <Typography as="span" variant="xxs" className="text-slate-500">
          {format(new Date(transaction.timestamp), 'hh:maaa')}
        </Typography>
      </Typography>
      <Typography variant="xs" weight={700} className="flex flex-col text-right text-slate-200">
        {transaction.amount.toSignificant(6)}{' '}
        <span className="text-xs font-medium text-slate-500">{transaction.amount.currency.symbol}</span>
      </Typography>
    </div>
  )
})

HistoryPopoverTransaction.displayName = 'HistoryPopoverTransaction'

export default HistoryPopover
