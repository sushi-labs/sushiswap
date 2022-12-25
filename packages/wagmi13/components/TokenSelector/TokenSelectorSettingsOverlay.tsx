import { CogIcon } from '@heroicons/react/24/outline'
import { SlideIn } from '@sushiswap/ui13/components/animation'
import { List } from '@sushiswap/ui13/components/list/List'
import { Overlay } from '@sushiswap/ui13/components/overlay'
import React, { FC, useState } from 'react'

import { TokenSelectorCustomTokensOverlay } from './TokenSelectorCustomTokensOverlay'

export const TokenSelectorSettingsOverlay: FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-200 hover:dark:bg-slate-700 hover:bg-gray-200 text-gray-900 min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <CogIcon
          width={24}
          height={24}
          className="cursor-pointer hover:animate-spin-slow hover:dark:text-slate-50 dark:text-slate-200 text-gray-700 hover:text-gray-900"
        />
      </button>
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
