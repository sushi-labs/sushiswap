'use client'

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import React, { FC, ReactNode } from 'react'

import { DialogContent, DialogDescription, DialogHeader, DialogNew, DialogTitle, DialogTrigger } from '../dialognew'
import { IconButton } from '../iconbutton'
import { List } from '../list'
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
  children?: ReactNode
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
  return (
    <DialogNew>
      <DialogTrigger asChild>
        {children ? children : <IconButton size="sm" name="Settings" icon={Cog6ToothIcon} />}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Adjust to your personal preferences.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
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
        </div>
      </DialogContent>
    </DialogNew>
  )
}
