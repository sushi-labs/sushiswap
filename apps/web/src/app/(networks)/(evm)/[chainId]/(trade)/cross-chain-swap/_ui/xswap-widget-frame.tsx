import type { ReactNode } from 'react'
import { useUnifiedSwap } from 'src/lib/swap/unified-swap-context'
import { getChainById } from 'sushi'
import { DetailsInteractionTrackerProvider } from '../../_ui/details-interaction-tracker-provider'
import { SwapModeButtons } from '../../_ui/swap-mode-buttons'
import { CrossChainSwapSettingsOverlay } from './cross-chain-swap-settings-overlay'
import { XSwapMaintenanceMessage } from './xswap-maintenance-message'

interface XSwapWidgetFrameProps {
  children: ReactNode
}

export function XSwapWidgetFrame({ children }: XSwapWidgetFrameProps) {
  const unified = useUnifiedSwap()
  return (
    <DetailsInteractionTrackerProvider>
      <div className="flex flex-col gap-4 p-4 md:px-12 md:py-6 bg-secondary rounded-3xl border-accent border">
        <div className="flex items-center justify-between">
          <SwapModeButtons
            chainId={unified?.chainId0}
            activePathname={
              unified
                ? `/${getChainById(unified.chainId0).key}/swap`
                : undefined
            }
          />
          <CrossChainSwapSettingsOverlay />
        </div>
        <XSwapMaintenanceMessage />
        {children}
      </div>
    </DetailsInteractionTrackerProvider>
  )
}
