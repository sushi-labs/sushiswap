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
import { Favorite } from './favorite'
import { NetworkMenu } from './network-menu'

export const FavoriteDialog = () => {
  const { isMd } = useBreakpoint('md')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isMd && isOpen) {
      setIsOpen(false)
    }
  }, [isMd, isOpen])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">Favorite</Button>
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
              Favorite
            </DialogTitle>
            <NetworkMenu />
          </div>
          <DialogClose className="mr-2">
            <XIcon width={20} height={20} />
          </DialogClose>
        </div>
        <div className="mt-4 max-h-[calc(100vh-200px)] overflow-y-auto hide-scrollbar">
          <Favorite />
        </div>
      </DialogContent>
    </Dialog>
  )
}
