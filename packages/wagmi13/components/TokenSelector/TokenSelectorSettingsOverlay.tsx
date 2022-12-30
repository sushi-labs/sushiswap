import { CogIcon } from '@heroicons/react/24/outline'
import { SlideIn } from '@sushiswap/ui13/components/animation'
import { Button } from '@sushiswap/ui13/components/button'
import { List } from '@sushiswap/ui13/components/list/List'
import { Overlay } from '@sushiswap/ui13/components/overlay'
import React, { FC, useState } from 'react'

import { TokenSelectorCustomTokensOverlay } from './TokenSelectorCustomTokensOverlay'

export const TokenSelectorSettingsOverlay: FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="filled" color="default" size="lg" className="!px-0 !w-[44px]" onClick={() => setOpen(true)}>
        <CogIcon
          width={24}
          height={24}
          className="cursor-pointer hover:animate-spin-slow hover:dark:text-slate-50 dark:text-slate-200 text-gray-700 hover:text-gray-900"
        />
      </Button>
      <SlideIn.FromRight show={open} onClose={() => setOpen(false)}>
        <Overlay.Content className="bg-gray-100 dark:bg-slate-900">
          <Overlay.Header onBack={() => setOpen(false)} title="" />
          <List>
            <List.Label>Settings</List.Label>
            <List.Control>
              <TokenSelectorCustomTokensOverlay />
            </List.Control>
          </List>
        </Overlay.Content>
      </SlideIn.FromRight>
    </>
  )
}
