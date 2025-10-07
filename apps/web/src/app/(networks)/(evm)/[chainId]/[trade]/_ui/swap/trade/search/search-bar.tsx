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
import { useEffect } from 'react'
import { SearchContent } from './search-content'
import { useSearchContext } from './search-provider'

export const SearchBar = () => {
  const { isLg } = useBreakpoint('lg')
  const {
    state: { isOpen },
    mutate: { setIsOpen },
  } = useSearchContext()

  useEffect(() => {
    if (isLg && isOpen) {
      setIsOpen(false)
    }
  }, [isLg, isOpen, setIsOpen])

  const onClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div className="lg:hidden">
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
          <DialogContent
            aria-describedby={undefined}
            hideClose
            variant="semi-opaque"
            className="!px-3"
          >
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className="text-xl font-medium">Search</DialogTitle>
              <DialogClose className="mr-2">
                <XIcon width={20} height={20} />
              </DialogClose>
            </div>
            <SearchContent onClose={onClose} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="hidden lg:block">
        <SearchContent onClose={onClose} />
      </div>
    </>
  )
}
