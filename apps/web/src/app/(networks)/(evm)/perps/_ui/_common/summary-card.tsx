import { InformationCircleIcon } from '@heroicons/react-v1/solid'
import {
  SkeletonText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { PerpsCard } from './perps-card'

export const SummaryCard = ({
  label,
  value,
  isLoading,
  footer,
  tooltip,
  actionButton,
  fullWidth = false,
}: {
  label: string
  value: ReactNode
  isLoading: boolean
  footer?: ReactNode
  tooltip?: string
  actionButton?: ReactNode
  fullWidth?: boolean
}) => {
  return (
    <PerpsCard
      className="p-3 gap-2 flex flex-col justify-between "
      fullWidth={fullWidth}
    >
      <div className="text-perps-muted-50 text-xs lg:text-sm">
        {tooltip ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  aria-label={label}
                  className="inline-flex items-center gap-1 text-left"
                >
                  <span>{label}</span>
                  <InformationCircleIcon className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="!bg-black/10">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          label
        )}
      </div>
      {isLoading ? (
        <div className="w-24 h-8">
          <SkeletonText fontSize="xl" />
        </div>
      ) : (
        <div className="flex items-center justify-between flex-wrap gap-1">
          <div className="font-medium text-lg md:text-2xl text-ellipsis overflow-hidden text-perps-muted">
            {value}
          </div>
          {actionButton ? actionButton : null}
        </div>
      )}
      {footer ? (
        <div className="text-xs text-perps-muted/40">{footer}</div>
      ) : null}
    </PerpsCard>
  )
}
