import { Skeleton } from '@sushiswap/ui/future/components/skeleton'

export const TYPE_COLUMN = {
  id: 'type',
  header: 'Type',
  cell: () => <span className="text-sm text-right text-gray-900 dark:text-slate-50">{}</span>,
  meta: {
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const SENDER_COLUMN = {
  id: 'sender',
  header: 'Maker',
  cell: () => <span className="text-sm text-right text-gray-900 dark:text-slate-50">{}</span>,
  meta: {
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const AMOUNT_IN_COLUMN = {
  id: 'amounts_in',
  header: 'Amount in',
  cell: () => {
    switch ('') {
      case '':
        return (
          <span className="font-normal">
            <span className="font-semibold">{}</span>
            {''}
            <span className="text-gray-600 dark:text-slate-400">{}</span>
          </span>
        )
      case '':
      case '':
        return (
          <span className="font-normal">
            <span className="font-semibold">{}</span>
            {''}
            <span className="text-gray-600 dark:text-slate-400">{}</span>
          </span>
        )
    }
  },
  meta: {
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const AMOUNT_OUT_COLUMN = {
  id: 'amount_out',
  header: 'Amount out',
  cell: () => {
    switch ('') {
      case '':
        return (
          <span className="font-normal">
            <span className="font-semibold">{}</span> <span className="text-gray-600 dark:text-slate-400">{}</span>
          </span>
        )
      case '':
      case '':
        return (
          <span className="font-normal">
            <span className="font-semibold">{}</span> <span className="text-gray-600 dark:text-slate-400">{}</span>
          </span>
        )
    }
  },
  meta: {
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const AMOUNT_USD_COLUMN = {
  id: 'amountUSD',
  header: 'Amount (USD)',
  cell: () => <span className="text-sm text-right text-gray-900 dark:text-slate-50">{}</span>,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}

export const TIME_COLUMN = {
  id: 'time',
  header: 'Time',
  cell: () => <span className="text-sm text-right text-gray-900 dark:text-slate-50">{}</span>,
  meta: {
    className: 'justify-end',
    skeleton: <Skeleton.Text fontSize="text-lg" />,
  },
}
