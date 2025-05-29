import { XMarkIcon } from '@heroicons/react/24/solid'
import {
  Card,
  Chip,
  DataTable,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Loader,
  Slot,
} from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { Native } from 'sushi/currency'
import type { DCAOrderDetails } from './order-details-columns'
import {
  BUY_COLUMN,
  DATE_COLUMN,
  PRICE_USD_COLUMN,
  SELL_COLUMN,
  TX_HASH_COLUMN,
  VALUE_COLUMN,
} from './order-details-columns'

const COLUMNS: ColumnDef<DCAOrderDetails>[] = [
  DATE_COLUMN,
  BUY_COLUMN,
  SELL_COLUMN,
  VALUE_COLUMN,
  PRICE_USD_COLUMN,
  TX_HASH_COLUMN,
]

export const DCAOrderDetailsModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const MOCK_DATA: DCAOrderDetails[] = [
    {
      id: '1',
      orderId: '001',
      date: 1622505600000, // 2021-06-01
      buyAmount: 150,
      sellAmount: 100,
      sellToken: Native.onChain(43114), // AVAX
      buyToken: Native.onChain(1), // Ethereum
      priceUsd: 1500,
      valueUsd: 1500,
      txHash: '0xabcdef1234567890',
    },
    {
      id: '2',
      orderId: '002',
      date: 1625097600000, // 2021-07-01
      buyAmount: 200,
      sellAmount: 150,
      sellToken: Native.onChain(43114), // AVAX
      buyToken: Native.onChain(1), // Ethereum
      priceUsd: 2000,
      valueUsd: 2000,
      txHash: '0x1234567890abcdef',
    },
    {
      id: '3',
      orderId: '003',
      date: 1627776000000, // 2021-08-01
      buyAmount: 250,
      sellAmount: 200,
      sellToken: Native.onChain(43114), // AVAX
      buyToken: Native.onChain(1), // Ethereum
      priceUsd: 2500,
      valueUsd: 2500,
      txHash: '0x7890abcdef123456',
    },
    {
      id: '4',
      orderId: '004',
      date: 1630454400000, // 2021-09-01
      buyAmount: 300,
      sellAmount: 250,
      sellToken: Native.onChain(43114), // AVAX
      buyToken: Native.onChain(1), // Ethereum
      priceUsd: 3000,
      valueUsd: 3000,
      txHash: '0x4567890abcdef123',
    },
    {
      id: '5',
      orderId: '005',
      date: 1633046400000, // 2021-10-01
      buyAmount: 350,
      sellAmount: 300,
      sellToken: Native.onChain(43114), // AVAX
      buyToken: Native.onChain(1), // Ethereum
      priceUsd: 3500,
      valueUsd: 3500,
      txHash: '0xabcdef7890123456',
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <span>View Details</span>
      </DialogTrigger>
      <DialogContent className="!max-w-5xl" hideClose>
        <DialogHeader className="flex items-center !flex-row justify-between">
          <DialogTitle>
            <div className="flex items-center gap-2">
              <span>DCA Fill History (5)</span>

              <Chip className="px-3 py-1 dark:bg-slate-900 text-primary">
                Order ID 001
              </Chip>
            </div>
          </DialogTitle>
          <DialogClose>
            <XMarkIcon className="w-5 h-5" />
          </DialogClose>
        </DialogHeader>
        <div className="overflow-x-auto">
          <DataTable columns={COLUMNS} data={MOCK_DATA} loading={false} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
