import { RefreshIcon, ZoomInIcon, ZoomOutIcon } from '@heroicons/react/outline'
import { IconButton, MinimizeIcon } from '@sushiswap/ui'
import React, { FC, memo } from 'react'

interface ZoomControlProps {
  zoomIn: () => void
  zoomOut: () => void
  zoomToFitSelectedRange: () => void
  resetRange: () => void
  showResetButton: boolean
}

export const ZoomControl: FC<ZoomControlProps> = memo(function ZoomControl({
  zoomIn,
  zoomOut,
  zoomToFitSelectedRange,
  resetRange,
  showResetButton,
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5 justify-end sm:absolute sm:top-[-36px] right-0 relative top-0">
      {showResetButton ? (
        <IconButton onClick={() => resetRange()}>
          <RefreshIcon width={16} height={16} />
        </IconButton>
      ) : (
        <IconButton onClick={() => zoomToFitSelectedRange()}>
          <MinimizeIcon width={16} height={16} />
        </IconButton>
      )}
      <IconButton onClick={zoomIn} disabled={false}>
        <ZoomInIcon width={16} height={16} />
      </IconButton>
      <IconButton onClick={zoomOut} disabled={false}>
        <ZoomOutIcon width={16} height={16} />
      </IconButton>
    </div>
  )
})
