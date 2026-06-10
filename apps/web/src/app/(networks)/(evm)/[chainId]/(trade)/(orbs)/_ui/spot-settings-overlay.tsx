'use client'

import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
  Button,
  SettingsOverlay,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { PriceProtection } from './price-protection'
import {
  AUTO_PRICE_PROTECTION,
  usePriceProtection,
} from './use-price-protection'

export function SpotSettingsOverlay() {
  const [priceProtection, setPriceProtection] = usePriceProtection()

  const showPriceProtectionBadge = priceProtection !== AUTO_PRICE_PROTECTION

  return (
    <SettingsOverlay modules={[]} externalModules={[PriceProtection]}>
      <Button
        size="sm"
        className="!rounded-full"
        variant="secondary"
        icon={Cog6ToothIcon}
      >
        {showPriceProtectionBadge ? (
          <TooltipProvider>
            <Tooltip delayDuration={150}>
              <TooltipTrigger asChild>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setPriceProtection(AUTO_PRICE_PROTECTION)
                  }}
                  className="!rounded-full -mr-1.5 !bg-opacity-50"
                  iconPosition="end"
                  variant="secondary"
                  size="xs"
                  asChild
                  icon={XMarkIcon}
                >
                  {priceProtection}%
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset price protection</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </Button>
    </SettingsOverlay>
  )
}
