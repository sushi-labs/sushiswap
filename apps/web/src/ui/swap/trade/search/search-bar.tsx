import { XIcon } from '@heroicons/react-v1/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
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
import { SearchContent } from './search-content'

export const SearchBar = () => {
  const { isMd } = useBreakpoint('md')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isMd && isOpen) {
      setIsOpen(false)
    }
  }, [isMd, isOpen])

  return (
    <>
      <div className="md:hidden">
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
          }}
        >
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <MagnifyingGlassIcon width={20} height={20} />
            </Button>
          </DialogTrigger>
          <DialogContent hideClose variant="semi-opaque" className="!px-3">
            <div className="flex items-center justify-between mb-4">
              <DialogTitle>Search</DialogTitle>
              <DialogClose className="mr-2">
                <XIcon width={20} height={20} />
              </DialogClose>
            </div>
            <SearchContent />
          </DialogContent>
        </Dialog>
      </div>

      <div className="hidden md:block">
        <SearchContent />
      </div>
    </>
  )
}
