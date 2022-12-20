import { Button } from '@sushiswap/ui'
import { FC, memo, MouseEventHandler, useCallback } from 'react'

interface VisibilitySelectorProps {
  displayTexts: string[]
  colors: string[]
  isHidden: Record<number, boolean>
  onToggleVisibility: (i: number) => void
}

export const VisiblilitySelector: FC<VisibilitySelectorProps> = memo(function VisiblilitySelector({
  displayTexts,
  colors,
  isHidden,
  onToggleVisibility,
}) {
  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      const index = Number(e.currentTarget.dataset.index)
      onToggleVisibility(index)
    },
    [onToggleVisibility]
  )

  return (
    <div className="gap-4 flex-wrap w-full flex items-center justify-between">
      <div className="text-[10px] leading-[10px] sm:leading-[12px] sm:text-xs">Show Liquidity:</div>
      <div className="inline-flex flex-grow gap-2">
        {displayTexts.map((text, index) => (
          <Button key={text} onClick={onClick} data-index={index}>
            <label className="sm:leading-[12px] leading-[10px] sm:text-xs text-[10px]">{text}</label>
          </Button>
        ))}
      </div>
    </div>
  )
})
