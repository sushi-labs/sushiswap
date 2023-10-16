'use client'

import { useLocalStorage } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@sushiswap/ui/components/dialog'
import { LinkExternal } from '@sushiswap/ui/components/link'

export const SanctionedAddressDialog = () => {
  const [open, setOpen] = useLocalStorage('sanctionedAddress', false)

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sanctioned address detected</DialogTitle>
          <DialogDescription>
            Your address has been identified as sanctioned and cannot be
            supported.
          </DialogDescription>
          <div className="flex flex-col gap-4">
            <LinkExternal
              href="https://www.trmlabs.com/products/sanctions"
              className="text-blue underline text-sm"
            >
              What is this?
            </LinkExternal>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button fullWidth size="xl" onClick={() => setOpen(false)}>
            I understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
