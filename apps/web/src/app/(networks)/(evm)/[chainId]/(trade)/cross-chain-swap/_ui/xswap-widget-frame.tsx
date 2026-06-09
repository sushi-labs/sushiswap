import type { ReactNode } from 'react'
import { DetailsInteractionTrackerProvider } from '../../_ui/details-interaction-tracker-provider'
import { SwapModeButtons } from '../../_ui/swap-mode-buttons'
import { CrossChainSwapSettingsOverlay } from './cross-chain-swap-settings-overlay'
import { XSwapMaintenanceMessage } from './xswap-maintenance-message'

interface XSwapWidgetFrameProps {
  children: ReactNode
}

export function XSwapWidgetFrame({ children }: XSwapWidgetFrameProps) {
  return (
    <DetailsInteractionTrackerProvider>
      <div className="flex flex-col gap-4 p-4 md:p-6 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(25,32,49,0.8)] rounded-3xl backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <SwapModeButtons />
          <CrossChainSwapSettingsOverlay />
        </div>
        <XSwapMaintenanceMessage />
        {children}
      </div>
    </DetailsInteractionTrackerProvider>
  )
}
