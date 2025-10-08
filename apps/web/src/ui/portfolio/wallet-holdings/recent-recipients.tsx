import { Button, Collapsible } from '@sushiswap/ui'
import { useRef } from 'react'
import { shortenEvmAddress } from 'sushi/evm'
import { isAddress } from 'viem'
import { useRecentRecipients } from '../../../lib/wagmi/hooks/hooks/use-recent-recipients'
import { useOverflow } from '../lp-positions-table/trending'
import { useSendTokens } from './send-token-provider'

export const RecentRecipients = () => {
  const overflowRef = useRef<HTMLDivElement>(null)
  const { hasOverflow } = useOverflow(overflowRef)
  const { mutate } = useSendTokens()
  const { recents } = useRecentRecipients()

  if (recents.length === 0) return null

  return (
    <Collapsible open={recents.length > 0}>
      <div className="overflow-x-hidden relative">
        <div className="flex gap-2.5 text-muted-foreground text-sm font-medium items-center">
          Recent:
          <div
            ref={overflowRef}
            className="flex gap-2.5 snap-x overflow-x-auto hide-scrollbar"
          >
            {recents.map((address, idx) => (
              <RecentRecipientItem
                key={`${address}-${idx}`}
                address={address}
                onClick={() => {
                  mutate.setRawRecipientInput(address)
                }}
              />
            ))}
          </div>
          {hasOverflow ? (
            <div className="h-full z-10 w-20 bg-gradient-to-r absolute right-0 top-1/2 -translate-y-1/2 from-transparent to-85% to-white dark:to-slate-800" />
          ) : null}
        </div>
      </div>
    </Collapsible>
  )
}

// TODO: add ENS support
export const RecentRecipientItem = ({
  address,
  onClick,
}: {
  address: string
  onClick: () => void
}) => {
  return (
    <Button
      className="!bg-[#0000001F] dark:!bg-[#FFFFFF1F] !text-slate-900 dark:!text-slate-100 !rounded-full text-sm w-fit !py-1 !px-3"
      size="xs"
      onClick={onClick}
    >
      {isAddress(address) ? shortenEvmAddress(address) : address}
    </Button>
  )
}
