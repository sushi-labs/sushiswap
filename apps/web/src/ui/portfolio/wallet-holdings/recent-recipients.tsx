import { Button, Collapsible, classNames } from '@sushiswap/ui'
import { useEffect, useRef, useState } from 'react'
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
  const [isAtEnd, setIsAtEnd] = useState(false)

  useEffect(() => {
    const el = overflowRef.current
    if (!el) return
    const handleScroll = () => {
      const tolerance = 2
      const reachedEnd =
        el.scrollLeft + el.clientWidth >= el.scrollWidth - tolerance
      setIsAtEnd(reachedEnd)
    }
    el.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

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
          <div
            className={classNames(
              'pointer-events-none absolute top-0 right-0 h-full w-20 bg-gradient-to-r from-transparent to-white dark:to-slate-800 hidden md:block transition-opacity duration-300 ease-in-out',
              hasOverflow && !isAtEnd ? 'opacity-100' : 'opacity-0',
            )}
          />
        </div>
      </div>
    </Collapsible>
  )
}

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
