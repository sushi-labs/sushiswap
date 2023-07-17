import { SlideIn } from '@sushiswap/ui/future/components/animation'
import { Button } from '@sushiswap/ui/future/components/button'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Overlay } from '@sushiswap/ui/future/components/overlay'
import React, { useState } from 'react'

export const TokenSelectorCustomTokenOverlay = () => {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <>
      <Button className="rounded-full" color="blue" size="xs" onClick={() => setOpen(true)}>
        Manage
      </Button>
      <SlideIn.FromRight show={open} onClose={() => setOpen(false)} className="!mt-0">
        <Overlay.Content>
          <Overlay.Header onBack={() => setOpen(false)} title="Custom Tokens" />
          <List>
            <List.Label>Tokens</List.Label>
            <List.Control>
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-xs flex text-slate-500 py-10">No custom tokens found</span>
              </div>
            </List.Control>
          </List>
        </Overlay.Content>
      </SlideIn.FromRight>
    </>
  )
}
