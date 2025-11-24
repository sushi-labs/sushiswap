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
import {
  type TwapFill,
  type TwapOrder,
  useParsedOrder,
} from 'src/lib/hooks/react-query/twap'
import { MobileDataCard } from '../mobile-data-card/mobile-data-card'
import {
  BUY_COLUMN,
  DATE_COLUMN,
  PRICE_USD_COLUMN,
  SELL_COLUMN,
  TX_HASH_COLUMN,
  VALUE_COLUMN,
} from './order-details-columns'

const COLUMNS: ColumnDef<TwapFill>[] = [
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
  order,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  order?: TwapOrder
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild className="hidden">
        <span />
      </DialogTrigger>
      <DialogContent
        className="!max-w-5xl bg-slate-50 dark:bg-slate-800"
        hideClose
      >
        {order && <Content order={order} />}
      </DialogContent>
    </Dialog>
  )
}

const Content = ({ order }: { order: TwapOrder }) => {
  const { fills, orderId } = useParsedOrder(order)

  return (
    <>
      <DialogHeader className="flex items-center !flex-row justify-between">
        <DialogTitle>
          <div className="flex items-center gap-2">
            <span>DCA Fill History ({fills?.length || 0})</span>

            <Chip className="px-3 py-1 bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-900 dark:text-white text-muted-foreground hover:bg-gray-100">
              Order ID {orderId}
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
          dataLength={order?.fills?.length ?? 0}
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
              data={fills ?? []}
              loading={false}
              className="hidden lg:block"
            />
            <div className="lg:hidden">
              {fills?.map((row, index) => (
                <div key={index} className="pb-6">
                  <MobileDataCard
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
    </>
  )
}
