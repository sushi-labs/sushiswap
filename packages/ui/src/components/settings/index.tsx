'use client'

import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSlippageTolerance } from '@sushiswap/hooks'
import React, { FC, ReactNode, useState } from 'react'

import { Button } from '../button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog'
import { List } from '../list'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip'
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
  children?: ReactNode
  modules: SettingsModule[]
  externalModules?: FC[]
  options?: {
    slippageTolerance?: {
      storageKey?: string
      defaultValue?: string
      title?: string
    }
  }
}

export const SettingsOverlay: FC<SettingsOverlayProps> = ({
  modules,
  externalModules,
  children,
  options,
}) => {
  const [_open, setOpen] = useState(false)
  const [slippageTolerance, setSlippageTolerance] = useSlippageTolerance(
    options?.slippageTolerance?.storageKey,
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            size="sm"
            className="!rounded-full"
            variant="secondary"
            icon={Cog6ToothIcon}
            onClick={() => setOpen(true)}
          >
            {Number(slippageTolerance) > 0.5 &&
            modules.includes(SettingsModule.SlippageTolerance) ? (
              <TooltipProvider>
                <Tooltip delayDuration={150}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSlippageTolerance('0.1')
                      }}
                      className="!rounded-full -mr-1.5 !bg-opacity-50"
                      iconPosition="end"
                      variant={
                        Number(slippageTolerance) > 2 ? 'warning' : 'secondary'
                      }
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
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Adjust to your personal preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {modules.includes(SettingsModule.SlippageTolerance) && (
            <List className="!pt-0">
              <List.Control>
                <SlippageTolerance options={options?.slippageTolerance} />
              </List.Control>
            </List>
          )}
          <List className="!pt-0">
            <List.Control>
              {modules.includes(SettingsModule.ExpertMode) && <ExpertMode />}
              {modules.includes(SettingsModule.CarbonOffset) && (
                <CarbonOffset />
              )}
            </List.Control>
          </List>
          {externalModules?.map((Module, index) => (
            <List className="!pt-0" key={index}>
              <List.Control>
                <Module />
              </List.Control>
            </List>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
