import { ArrowRightIcon, MoonIcon } from '@heroicons/react/24/outline'
import { Button } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import {
  SUSHI_V2_FEE_DISPOSITION_LABELS,
  type SushiV2FeeDisposition,
  type SushiV2LiquidityMode,
} from '../../_providers/sushi-v2/contract'

interface CreateLaunchPreviewProps {
  name: string
  symbol: string
  liquidityMode: SushiV2LiquidityMode
  feeDisposition: SushiV2FeeDisposition
  previewImageUrl?: string
  onContinue?: () => void
  footer?: ReactNode
}

function PreviewDetail({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-perps-muted-50">{label}</span>
      <span className="flex items-center gap-1 text-right font-medium text-perps-muted">
        {children}
      </span>
    </div>
  )
}

export function CreateLaunchPreview({
  name,
  symbol,
  liquidityMode,
  feeDisposition,
  previewImageUrl,
  onContinue,
  footer,
}: CreateLaunchPreviewProps) {
  const displayName = name.trim() || 'Token name'
  const displaySymbol = symbol.trim() || 'SYMBOL'

  return (
    <PerpsCard className="overflow-hidden lg:sticky lg:top-24" fullWidth>
      <div className="space-y-4 p-5">
        <h2 className="text-sm font-semibold text-perps-muted">Preview</h2>

        <div className="flex flex-col items-center gap-3 pt-2 pb-2 text-center">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border-2 border-dashed border-white/[0.12] bg-white/[0.03]">
            {previewImageUrl ? (
              <img
                src={previewImageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0 max-w-full">
            <div className="truncate text-base font-bold uppercase tracking-[0.1em] text-perps-muted">
              {displayName}
            </div>
            <div className="mt-0.5 truncate text-xs uppercase tracking-[0.1em] text-perps-muted-50">
              ${displaySymbol}
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06]" />

        <div className="space-y-3">
          <PreviewDetail label="Total supply">1,000,000,000</PreviewDetail>
          <PreviewDetail label="Decimals">18</PreviewDetail>
          <PreviewDetail label="Liquidity mode">
            {liquidityMode === 'MOON' ? (
              <MoonIcon className="h-3 w-3" aria-hidden="true" />
            ) : null}
            {liquidityMode === 'MOON' ? 'Moon' : 'Standard'}
          </PreviewDetail>
          <PreviewDetail label="Creator fee mode">
            {SUSHI_V2_FEE_DISPOSITION_LABELS[feeDisposition]}
          </PreviewDetail>
        </div>
      </div>

      {footer || onContinue ? (
        <div className="border-t border-white/[0.06] p-4">
          {footer ?? (
            <Button
              type="button"
              size="default"
              variant="perps-default"
              icon={ArrowRightIcon}
              iconPosition="end"
              onClick={onContinue}
              fullWidth
            >
              Continue to initial buy
            </Button>
          )}
        </div>
      ) : null}
    </PerpsCard>
  )
}
