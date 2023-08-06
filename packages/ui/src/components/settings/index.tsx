'use client'

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useSlippageTolerance } from '@sushiswap/hooks'
import React, { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react'

import { Button } from '../button'
import { Dialog } from '../dialog'
import { List } from '../list'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip'
import { CarbonOffset } from './CarbonOffset'
import { ExpertMode } from './ExpertMode'
import { RoutingApi } from './RoutingApi'
import { SlippageTolerance } from './SlippageTolerance'
export enum SettingsModule {
  CarbonOffset = 'CarbonOffset',
  CustomTokens = 'CustomTokens',
  SlippageTolerance = 'SlippageTolerance',
  ExpertMode = 'ExpertMode',
  RoutingApi = 'RoutingApi',
}

interface SettingsOverlayProps {
  children?({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }): ReactNode
  modules: SettingsModule[]
  options?: {
    slippageTolerance?: {
      storageKey?: string
      defaultValue?: string
      title?: string
    }
  }
}

export const SettingsOverlay: FC<SettingsOverlayProps> = ({ modules, children, options }) => {
  const [open, setOpen] = useState(false)
  const [slippageTolerance, setSlippageTolerance] = useSlippageTolerance(options?.slippageTolerance?.storageKey)

  return (
    <>
      {children ? (
        children({ setOpen })
      ) : (
        <>
          <Button
            size="sm"
            className="!rounded-full"
            variant="secondary"
            icon={Cog6ToothIcon}
            onClick={() => setOpen(true)}
          >
            {Number(slippageTolerance) > 0.5 && modules.includes(SettingsModule.SlippageTolerance) ? (
              <TooltipProvider>
                <Tooltip delayDuration={150}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSlippageTolerance('0.5')
                      }}
                      className="!rounded-full -mr-1.5 !bg-opacity-50"
                      iconPosition="end"
                      variant={Number(slippageTolerance) > 2 ? 'warning' : 'secondary'}
                      size="xs"
                      asChild
                      icon={XMarkIcon}
                    >
                      {slippageTolerance}%
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset slippage tolerance</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}
          </Button>
        </>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="flex flex-col gap-3">
          <Dialog.Header title="Settings" onClose={() => setOpen(false)} />
          {modules.includes(SettingsModule.SlippageTolerance) && (
            <List className="!pt-0">
              <List.Control>
                <SlippageTolerance options={options?.slippageTolerance} />
              </List.Control>
            </List>
          )}
          {modules.length > 1 && (
            <List className="!pt-0">
              <List.Control>
                {modules.includes(SettingsModule.ExpertMode) && <ExpertMode />}
                {modules.includes(SettingsModule.CarbonOffset) && <CarbonOffset />}
              </List.Control>
            </List>
          )}
          {modules.includes(SettingsModule.RoutingApi) && (
            <List className="!pt-0">
              <List.Control>
                <RoutingApi />
              </List.Control>
            </List>
          )}
        </Dialog.Content>
      </Dialog>
    </>
  )
}
