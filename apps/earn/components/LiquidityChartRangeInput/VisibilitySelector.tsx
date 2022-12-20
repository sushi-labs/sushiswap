import { Button } from '@sushiswap/ui'
import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'

interface VisibilitySelectorProps {
  options: string[]
  colors: string[]
  hiddenOptionsIndexes: number[]
  selectedKeyIndex?: number
  onToggleOption: (index: number) => void
}

export const VisiblilitySelector: FC<VisibilitySelectorProps> = ({
  options,
  colors,
  hiddenOptionsIndexes,
  selectedKeyIndex,
  onToggleOption,
}) => {
  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      const index = Number(e.currentTarget.dataset.index)
      onToggleOption(index)
    },
    [onToggleOption]
  )

  return useMemo(
    () => (
      <div className="gap-4 flex-wrap w-full flex items-center justify-between">
        <div className="text-[10px] leading-[10px] sm:leading-[12px] sm:text-xs">Show Liquidity:</div>
        <div className="inline-flex flex-grow gap-2">
          {options.map((option, index) => (
            <Button key={option} onClick={onClick} data-index={index}>
              <label className="text-[10px] leading-[10px] sm:leading-[12px] sm:text-xs">{option}</label>
            </Button>
          ))}
        </div>
      </div>
    ),
    [options, onClick]
  )
}
