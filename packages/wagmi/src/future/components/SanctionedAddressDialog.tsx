'use client'

import { Dialog } from '@sushiswap/ui/future/components/dialog'
import { DangerousIcon } from '@sushiswap/ui/icons'
import { Button } from '@sushiswap/ui/future/components/button'
import { Link } from '@sushiswap/ui'
import { useLocalStorage } from '@sushiswap/hooks'

export const SanctionedAddressDialog = () => {
  const [open, setOpen] = useLocalStorage("sanctionedAddress", false)

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Dialog.Content className="flex flex-col gap-4">
        <Dialog.Header
          title={
            <div className="flex gap-2 items-center">
              <DangerousIcon width={18} height={18} className="text-red" />
              <span>Sanctioned address detected</span>
            </div>
          }
        />
        <Link.External href="https://www.trmlabs.com/products/sanctions" className="text-blue underline text-sm">
          What is this?
        </Link.External>
        <p>Your address has been identified as sanctioned and cannot be supported.</p>
        <Button onClick={() => setOpen(false)}>I understand</Button>
      </Dialog.Content>
    </Dialog>
  )
}
