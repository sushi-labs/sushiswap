import { XMarkIcon } from '@heroicons/react/24/solid'
import {
  Chip,
  DataTable,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Loader,
} from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Native } from 'sushi/currency'
import { MobileCard } from '../mobile-card/mobile-card'
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

export const MOBILE_COLUMNS: ColumnDef<DCAOrderDetails>[] = [
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
      date: 1622505600000,
      buyAmount: 150,
      sellAmount: 100,
      sellToken: Native.onChain(43114),
      buyToken: Native.onChain(1),
      priceUsd: 1500,
      valueUsd: 1500,
      txHash: '0xabcdef1234567890',
    },
    {
      id: '2',
      orderId: '002',
      date: 1625097600000,
      buyAmount: 200,
      sellAmount: 150,
      sellToken: Native.onChain(43114),
      buyToken: Native.onChain(1),
      priceUsd: 2000,
      valueUsd: 2000,
      txHash: '0x1234567890abcdef',
    },
    {
      id: '3',
      orderId: '003',
      date: 1627776000000,
      buyAmount: 250,
      sellAmount: 200,
      sellToken: Native.onChain(43114),
      buyToken: Native.onChain(1),
      priceUsd: 2500,
      valueUsd: 2500,
      txHash: '0x7890abcdef123456',
    },
    {
      id: '4',
      orderId: '004',
      date: 1630454400000,
      buyAmount: 300,
      sellAmount: 250,
      sellToken: Native.onChain(43114),
      buyToken: Native.onChain(1),
      priceUsd: 3000,
      valueUsd: 3000,
      txHash: '0x4567890abcdef123',
    },
    {
      id: '5',
      orderId: '005',
      date: 1633046400000,
      buyAmount: 350,
      sellAmount: 300,
      sellToken: Native.onChain(43114),
      buyToken: Native.onChain(1),
      priceUsd: 3500,
      valueUsd: 3500,
      txHash: '0xabcdef7890123456',
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild className="hidden">
        <span />
      </DialogTrigger>
      <DialogContent
        className="!max-w-5xl bg-slate-50 dark:bg-slate-800"
        hideClose
      >
        <DialogHeader className="flex items-center !flex-row justify-between">
          <DialogTitle>
            <div className="flex items-center gap-2">
              <span>DCA Fill History (5)</span>

              <Chip className="px-3 py-1 bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-900 dark:text-white text-muted-foreground hover:bg-gray-100">
                Order ID 001
              </Chip>
            </div>
          </DialogTitle>
          <DialogClose>
            <XMarkIcon className="w-5 h-5" />
          </DialogClose>
        </DialogHeader>
        <div
          id="dca-scroll" // 👈  this is the target
          className="max-h-[70vh] overflow-y-auto"
        >
          <InfiniteScroll
            dataLength={MOCK_DATA.length}
            next={() => {}}
            hasMore={false}
            loader={
              <div className="flex justify-center w-full py-4">
                <Loader size={16} />
              </div>
            }
            scrollableTarget="dca-scroll"
          >
            <div className="max-h-full overflow-auto">
              <DataTable
                columns={COLUMNS}
                data={MOCK_DATA}
                loading={false}
                className="hidden md:block"
              />
              <div className="md:hidden">
                {MOCK_DATA.map((row) => (
                  <div key={row.id} className="pb-6">
                    <MobileCard
                      row={row}
                      columns={COLUMNS}
                      className="p-5 border rounded-xl dark:border-[#222137] border-[#F5F5F5]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </InfiniteScroll>
        </div>
      </DialogContent>
    </Dialog>
  )
}
