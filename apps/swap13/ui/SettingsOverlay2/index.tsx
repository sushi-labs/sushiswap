import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Dialog } from '@sushiswap/ui13/components/dialog'
import { List } from '@sushiswap/ui13/components/list/List'
import React, { FC, useState } from 'react'

import { CarbonOffset } from './CarbonOffset'
import { ExpertMode } from './ExpertMode'
import { SlippageTolerance } from './SlippageTolerance'

export enum SettingsModule {
  CarbonOffset = 'CarbonOffset',
  CustomTokens = 'CustomTokens',
  SlippageTolerance = 'SlippageTolerance',
  ExpertMode = 'ExpertMode',
}

interface SettingsOverlayProps {
  modules: SettingsModule[]
}

export const SettingsOverlay2: FC<SettingsOverlayProps> = ({ modules }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Cog6ToothIcon
        onClick={() => setOpen(true)}
        width={26}
        height={26}
        className="cursor-pointer hover:animate-spin-slow hover:dark:text-slate-50 dark:text-slate-200 text-gray-700 hover:text-gray-900 mr-3"
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="!bg-gray-100 dark:!bg-slate-900 flex flex-col gap-3">
          {modules.includes(SettingsModule.SlippageTolerance) && (
            <List className="!pt-0">
              <List.Control>
                <SlippageTolerance />
              </List.Control>
            </List>
          )}
          <List className="!pt-0">
            <List.Control>
              {modules.includes(SettingsModule.CarbonOffset) && <CarbonOffset />}
              {modules.includes(SettingsModule.ExpertMode) && <ExpertMode />}
            </List.Control>
          </List>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
