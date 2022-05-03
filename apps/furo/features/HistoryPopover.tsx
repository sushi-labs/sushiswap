import { Popover } from '@headlessui/react'
import { memo, useMemo } from 'react'
import { FC } from 'react'
import { Typography, ArrowFlatLinesUp, HistoryIcon } from '@sushiswap/ui'
import { TransactionType } from './context/enums'
import { TransactionRepresentation } from 'features/context'
import { Transaction } from 'features/context'
import { XIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import { usePopover } from 'hooks'
import { useAccount } from 'wagmi'
import { classNames } from '@sushiswap/ui'

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
      {({ open }) => (
        <>
          <Popover.Button ref={setReferenceElement}>
            <div
              className={classNames(
                open ? 'border-dark-700 bg-dark-800' : 'border-dark-800',
                'flex items-center gap-2 px-5 border shadow-md cursor-pointer shadow-dark-1000 hover:border-dark-700 active:border-dark-600 bg-dark-900 hover:bg-dark-800 active:bg-dark-700 rounded-xl h-11',
              )}
            >
              <HistoryIcon width={18} height={18} />
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                History
              </Typography>
            </div>
          </Popover.Button>

          <Popover.Panel
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
            className="overflow-hidden z-10 bg-dark-900 shadow-depth-1 p-4 pb-0 rounded-xl border border-dark-800 flex flex-col gap-4 max-w-[530px]"
          >
            <div className="flex justify-between gap-4">
              <Typography variant="lg" weight={700} className="text-high-emphesis">
                History
              </Typography>
              <XIcon width={24} height={24} className="text-secondary" />
            </div>
            <div className="h-[200px] max-h-[440px] min-w-[258px] whitespace-nowrap overflow-auto hide-scrollbar flex flex-col divide-y divide-dark-800 border-t border-dark-800">
              {transactions?.length ? (
                Object.values(transactions).map((transaction) => (
                  <HistoryPopoverTransaction transaction={transaction} key={transaction.id} />
                ))
              ) : (
                <Typography variant="xs" className="italic text-secondary flex justify-center items-center h-full pb-4">
                  No transactions found
                </Typography>
              )}
            </div>
            <div className="w-full h-[60px] bottom-0 left-0 absolute bg-gradient-to-b from-[rgba(22,_21,_34,_0)] to-[#161522]" />
          </Popover.Panel>
        </>
      )}
    </Popover>
  )
}

const HistoryPopoverTransaction: FC<{ transaction: Transaction }> = memo(({ transaction }) => {
  return (
    <div key={transaction.id} className="flex items-center justify-between gap-3 py-3">
      <div className="grid grid-cols-[20px_80px_140px] gap-2 items-center">
        {transaction.status === TransactionType.DEPOSIT ? (
          <ArrowFlatLinesUp width={18} height={18} className="text-blue" />
        ) : TransactionType.WITHDRAWAL ? (
          <ArrowFlatLinesUp width={18} height={18} className="transform rotate-180 text-pink" />
        ) : TransactionType.EXTEND ? (
          <HistoryIcon width={18} height={18} />
        ) : (
          <HistoryIcon width={18} height={18} />
        )}
        <Typography variant="sm" className="capitalize" weight={700}>
          {transaction.status.toLowerCase()}
        </Typography>
        <Typography variant="xs" className="text-secondary" weight={500}>
          {format(transaction.timestamp, 'dd MMM yyyy')} @ {format(transaction.timestamp, 'h:maaa')}{' '}
        </Typography>
      </div>
      <div className="rounded-[10px] border border-dark-700 px-3 py-1 bg-dark-800">
        <Typography variant="xs" weight={500} className="text-high-emphesis">
          {transaction.amount.toSignificant(6)} {transaction.amount.currency.symbol}
        </Typography>
      </div>
    </div>
  )
})

HistoryPopoverTransaction.displayName = 'HistoryPopoverTransaction'

export default HistoryPopover
