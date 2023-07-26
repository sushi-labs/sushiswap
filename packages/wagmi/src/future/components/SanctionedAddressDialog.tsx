'use client'

import { useLocalStorage } from '@sushiswap/hooks'
import { Link } from '@sushiswap/ui'
import { DialogNew } from '@sushiswap/ui'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'

export const SanctionedAddressDialog = () => {
  const [open, setOpen] = useLocalStorage('sanctionedAddress', false)

  return (
    <DialogNew open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sanctioned address detected</DialogTitle>
          <DialogDescription>Your address has been identified as sanctioned and cannot be supported.</DialogDescription>
          <div className="flex flex-col gap-4">
            <Link.External href="https://www.trmlabs.com/products/sanctions" className="text-blue underline text-sm">
              What is this?
            </Link.External>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button fullWidth size="xl" onClick={() => setOpen(false)}>
            I understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogNew>
  )
}
