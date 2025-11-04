import { XIcon } from '@heroicons/react-v1/solid'
import { useBreakpoint } from '@sushiswap/hooks'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { useEffect, useState } from 'react'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { NetworkMenu } from './network-menu'
import { useNetworkContext } from './network-provider'
import { Recent } from './recent'

export const RecentDialog = () => {
  const { isLg } = useBreakpoint('lg')
  const [isOpen, setIsOpen] = useState(false)
  const {
    state: { selectedNetwork },
    mutate: { setSelectedNetwork },
  } = useNetworkContext()

  useEffect(() => {
    if (isLg && isOpen) {
      setIsOpen(false)
    }
  }, [isLg, isOpen])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">Recent</Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        hideClose
        variant="semi-opaque"
        className="!px-3"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <DialogTitle className="!mr-0 text-xl font-medium">
              Recent
            </DialogTitle>
            <NetworkMenu
              testId="recent-network-menu-trigger"
              selectedNetwork={selectedNetwork}
              onNetworkSelect={setSelectedNetwork}
              className="!px-1"
              networkOptions={SUPPORTED_CHAIN_IDS}
            />
          </div>
          <DialogClose className="mr-2">
            <XIcon width={20} height={20} />
          </DialogClose>
        </div>
        <div className="mt-4 max-h-[calc(100vh-200px)] overflow-y-auto hide-scrollbar">
          <Recent
            onClose={() => {
              setIsOpen(false)
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
