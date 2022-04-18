import { Popover } from '@headlessui/react'
import { shortenAddress } from 'format'
import { useMemo } from 'react'
import { FC } from 'react'
import { HistoryIcon } from 'ui/icons'
import Typography from 'ui/typography/Typography'
import { TransactionRepresentation, TransactionType } from '../context/representations'
import { Transaction } from '../context/Transaction'

interface Props {
  transactionRepresentations: TransactionRepresentation[]
}

const HistoryPopover: FC<Props> = ({ transactionRepresentations }) => {
  const transactions = useMemo(
    () => transactionRepresentations.map((transaction) => new Transaction({ transaction })),
    [transactionRepresentations],
  )

  return (
    <Popover>
      <Popover.Button>
        <div className="flex items-center gap-2 px-5 border shadow-md cursor-pointer shadow-dark-1000 border-dark-800 bg-dark-900 rounded-xl h-11">
          <HistoryIcon width={18} height={18} />
          <Typography variant="sm" weight={700} className="text-high-emphesis">
            History
          </Typography>
        </div>
      </Popover.Button>

      <Popover.Panel className="absolute z-10 bg-dark-900 shadow-depth-1 p-4 rounded-xl border border-dark-800 flex flex-col gap-4 max-w-[530px]">
        <div className="flex justify-between gap-4">
          <Typography variant="lg" weight={700} className="text-high-emphesis">
            History
          </Typography>
          <div>
            {transactions.length ? (
              Object.values(transactions).map((transaction) => (
                <div key={transaction.id}>
                  {/* TODO: Replace the icons depending on the status? DEPOSIT, WITHDRAWAL, EXTEND, DISBURSEMENT */}
                  {transaction.status === TransactionType.DEPOSIT ? (
                    <HistoryIcon width={18} height={18} />
                  ) : TransactionType.WITHDRAWAL ? (
                    <HistoryIcon width={18} height={18} />
                  ) : TransactionType.EXTEND ? (
                    <HistoryIcon width={18} height={18} />
                  ) : (
                    <HistoryIcon width={18} height={18} />
                  )}
                  <Typography variant="lg">
                    {`${transaction.status} 
                    ${shortenAddress(transaction.recipient.id)}
                  ${transaction.timestamp.toLocaleDateString()} @ 
                  ${transaction.timestamp.toLocaleTimeString()} 
                  ${transaction.amount.toString()}`}
                  </Typography>
                </div>
              ))
            ) : (
              <div>
                <i>No transactions found..</i>
              </div>
            )}
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default HistoryPopover
