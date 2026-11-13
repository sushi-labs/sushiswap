'use client'

import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import {
  Collapsible,
  IconButton,
  SkeletonCircle,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { GasIcon } from '@sushiswap/ui/icons/gas-icon'
import type { ReactElement, ReactNode } from 'react'

export function TradeStats({
  summary,
  open,
  detailsId,
  children,
}: {
  summary: ReactNode
  open: boolean
  detailsId?: string
  children: ReactNode
}): ReactElement {
  return (
    <>
      {summary}
      <Collapsible open={open}>
        <div
          id={detailsId}
          aria-hidden={detailsId ? !open : undefined}
          inert={detailsId ? !open : undefined}
          className="mt-2 py-2 w-full flex flex-col gap-1 border-t border-accent text-sm"
        >
          {children}
        </div>
      </Collapsible>
    </>
  )
}

export function TradeStatsSummary({
  rate,
  fee,
  showFees = true,
  isLoading = false,
  className = 'text-muted-foreground',
  feeClassName = 'gap-0.5',
  gasIconClassName = 'h-4',
  'aria-label': ariaLabel,
  children,
}: {
  rate: ReactNode
  fee?: ReactNode
  showFees?: boolean
  isLoading?: boolean
  className?: string
  feeClassName?: string
  gasIconClassName?: string
  'aria-label'?: string
  children?: ReactNode
}): ReactElement {
  return (
    <div
      className={classNames(
        'flex items-center justify-between gap-2',
        className,
      )}
      aria-label={ariaLabel}
    >
      {rate}
      {!showFees ? null : isLoading ? (
        <div className="flex items-center gap-0.5">
          <SkeletonText fontSize="sm" className="!w-[60px]" />
          <SkeletonCircle radius={26} />
        </div>
      ) : (
        <div className={classNames('flex items-center', feeClassName)}>
          <div className="text-xs md:text-sm text-primary font-medium flex items-center">
            <GasIcon
              className={classNames(
                'inline-block w-3 mr-0.5',
                gasIconClassName,
              )}
            />
            {fee}
          </div>
          {children}
        </div>
      )}
    </div>
  )
}

export function TradeStatsToggle({
  collapsed,
  onClick,
  detailsId,
}: {
  collapsed: boolean
  onClick(): void
  detailsId?: string
}): ReactElement {
  return (
    <IconButton
      icon={ChevronDownIcon}
      size="xs"
      name="Toggle Swap Details"
      aria-expanded={detailsId ? !collapsed : undefined}
      aria-controls={detailsId}
      onClick={onClick}
      className={classNames(
        collapsed ? '' : 'rotate-180',
        'transition-transform',
      )}
      variant="ghost"
    />
  )
}
