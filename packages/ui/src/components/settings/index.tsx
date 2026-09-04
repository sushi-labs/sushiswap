'use client'

import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
  type SlippageToleranceStorageKey,
  type TTLStorageKey,
  useSlippageTolerance,
} from '@sushiswap/hooks'
import classNames from 'classnames'
import React, { type FC, type ReactNode } from 'react'

import { DEFAULT_SLIPPAGE } from 'sushi/evm'
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
import { CarbonOffset } from './carbon-offset'
import { ExpertMode } from './expert-mode'
import { SlippageTolerance } from './slippage-tolerance'
import { TransactionDeadline } from './transaction-deadline'

export enum SettingsModule {
  CarbonOffset = 'CarbonOffset',
  CustomTokens = 'CustomTokens',
  SlippageTolerance = 'SlippageTolerance',
  ExpertMode = 'ExpertMode',
  TransactionDeadline = 'TransactionDeadline',
}

interface SettingsOverlayProps {
  children?: ReactNode
  modules: SettingsModule[]
  externalModules?: FC[]
  theme?: 'default' | 'perps'
  options?: {
    slippageTolerance?: {
      storageKey?: SlippageToleranceStorageKey
      defaultValue?: string
      title?: string
    }
    transactionDeadline?: {
      storageKey: TTLStorageKey
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
  theme = 'default',
}) => {
  const [slippageTolerance, setSlippageTolerance] = useSlippageTolerance(
    options?.slippageTolerance?.storageKey,
    options?.slippageTolerance?.defaultValue,
  )

  const showSlippageBadge =
    modules.includes(SettingsModule.SlippageTolerance) &&
    Number(slippageTolerance) > 0.5

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
          >
            {showSlippageBadge ? (
              <TooltipProvider>
                <Tooltip delayDuration={150}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSlippageTolerance(
                          options?.slippageTolerance?.defaultValue ??
                            DEFAULT_SLIPPAGE,
                        )
                      }}
                      className="!rounded-full -mr-1.5 !bg-opacity-50"
                      iconPosition="end"
                      variant={
                        Number(slippageTolerance) > 20
                          ? 'destructive'
                          : Number(slippageTolerance) > 2
                            ? 'warning'
                            : 'secondary'
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
      <DialogContent
        className={classNames(
          theme === 'perps' &&
            '!max-w-md !border !border-white/[0.07] !bg-perps-background/95 !text-perps-muted shadow-[inset_1.5px_2px_1px_-2px_rgba(255,255,255,0.2),inset_-1.5px_-1.5px_1px_-2px_rgba(255,255,255,0.125)] backdrop-blur-2xl',
        )}
      >
        <DialogHeader>
          <DialogTitle
            className={classNames(theme === 'perps' && '!text-perps-muted')}
          >
            Settings
          </DialogTitle>
          <DialogDescription
            className={classNames(theme === 'perps' && '!text-perps-muted-50')}
          >
            Adjust to your personal preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[min(70vh,600px)]">
          {modules.includes(SettingsModule.SlippageTolerance) && (
            <List className="!pt-0">
              <List.Control
                className={classNames(
                  theme === 'perps' && '!border-white/[0.06] !bg-white/[0.025]',
                )}
              >
                <SlippageTolerance
                  options={options?.slippageTolerance}
                  theme={theme}
                />
              </List.Control>
            </List>
          )}
          {(modules.includes(SettingsModule.ExpertMode) ||
            modules.includes(SettingsModule.TransactionDeadline) ||
            modules.includes(SettingsModule.CarbonOffset)) && (
            <List className="!pt-0">
              <List.Control
                className={classNames(
                  theme === 'perps' && '!border-white/[0.06] !bg-white/[0.025]',
                )}
              >
                {modules.includes(SettingsModule.ExpertMode) && <ExpertMode />}
                {modules.includes(SettingsModule.CarbonOffset) && (
                  <CarbonOffset />
                )}
                {modules.includes(SettingsModule.TransactionDeadline) &&
                  options?.transactionDeadline && (
                    <TransactionDeadline
                      options={options.transactionDeadline}
                    />
                  )}
              </List.Control>
            </List>
          )}
          {externalModules?.map((Module, index) => (
            <List className="!pt-0" key={index}>
              <List.Control
                className={classNames(
                  theme === 'perps' && '!border-white/[0.06] !bg-white/[0.025]',
                )}
              >
                <Module />
              </List.Control>
            </List>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
