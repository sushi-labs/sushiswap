import { Button } from '@sushiswap/ui'
import { useRef } from 'react'
import { shortenAddress } from 'sushi/format'
import { useOverflow } from '../lp-positions-table/trending'

const RECENT_RECIPIENTS = [
  '0x38A6f57BD9B8E8f2fE1D69C6a3B9367BFC9B2f40',
  '0x9876543210987654321098765432109876543210',
  'ron.eth',
  '0x38A6f57BD9B8E8f2fE1D69C6a3B9367BFC9B2f40',
  '0x9876543210987654321098765432109876543210',
  '0x38A6f57BD9B8E8f2fE1D69C6a3B9367BFC9B2f40',
  '0x9876543210987654321098765432109876543210',
]

export const RecentRecipients = () => {
  const overflowRef = useRef<HTMLDivElement>(null)
  const { hasOverflow } = useOverflow(overflowRef)

  return (
    <div className="overflow-x-hidden relative">
      <div className="flex gap-2.5 text-muted-foreground text-sm font-medium items-center">
        Recent:
        <div
          ref={overflowRef}
          className="flex gap-2.5 snap-x overflow-x-auto hide-scrollbar"
        >
          {RECENT_RECIPIENTS.map((address, idx) => (
            <RecentRecipientItem key={`${address}-${idx}`} address={address} />
          ))}
        </div>
        {hasOverflow ? (
          <div className="h-full z-10 w-20 bg-gradient-to-r absolute right-0 top-1/2 -translate-y-1/2 from-transparent to-85% to-white dark:to-slate-900" />
        ) : null}
      </div>
    </div>
  )
}

// TODO: add ENS support
export const RecentRecipientItem = ({
  address,
}: {
  address: string
}) => {
  return (
    <Button
      className="!bg-[#0000001F] !text-slate-900 dark:!text-slate-100 !rounded-full text-sm w-fit !py-1 !px-3"
      size="xs"
    >
      {address.startsWith('0x') ? shortenAddress(address) : address}
    </Button>
  )
}
