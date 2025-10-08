'use client'
import { PlusCircleIcon } from '@heroicons/react-v1/outline'
import { XIcon } from '@heroicons/react-v1/solid'
import { Button, TextField, classNames } from '@sushiswap/ui'
import { useRef, useState } from 'react'
import { PopoverDrawer } from 'src/app/(networks)/_ui/popover-drawer'
import { formatNumber } from 'sushi'

export const TableFiltersAPR = () => {
  const [aprRangeMin, setAprRangeMin] = useState<number | undefined>(undefined)
  const [aprRangeMax, setAprRangeMax] = useState<number | undefined>(undefined)

  const [localMin, setLocalMin] = useState('')
  const [localMax, setLocalMax] = useState('')
  const triggerRef = useRef<HTMLButtonElement>(null)

  const closeContent = () => {
    if (triggerRef.current) {
      triggerRef.current.click()
    }
  }

  const onConfirm = () => {
    const realMin = localMin ? Number.parseFloat(localMin) : undefined
    const realMax = localMax ? Number.parseFloat(localMax) : undefined
    if (realMax && realMin && realMax > realMin) {
      setAprRangeMin(realMin)
      setAprRangeMax(realMax)
      closeContent()
    }
  }

  const clearFilters = () => {
    setAprRangeMin(undefined)
    setAprRangeMax(undefined)
  }

  return (
    <PopoverDrawer
      popoverContentClassName="max-w-[225px]"
      dialogContentClassName="max-w-none"
      dialogTitle="APR Filter"
      trigger={
        <Button
          ref={triggerRef}
          icon={PlusCircleIcon}
          variant="outline"
          role="combobox"
          size="sm"
          className={classNames(
            'border-dashed !bg-slate-200 dark:!bg-slate-750 uppercase',
            'hover:dark:!bg-skyblue/20 hover:!bg-blue/20 hover:!text-blue hover:dark:!text-skyblue',
            aprRangeMin && aprRangeMax
              ? '!bg-blue/10 dark:!bg-skyblue/10 dark:!border-skyblue !text-blue dark:!text-skyblue !border-blue !border-1 !border-solid'
              : '',
          )}
        >
          APR
          {aprRangeMin && aprRangeMax
            ? `: ${formatNumber(aprRangeMin)}%-${formatNumber(aprRangeMax)}%`
            : null}
          {aprRangeMin && aprRangeMax ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                clearFilters()
              }}
              className="py-2 px-0.5"
            >
              <XIcon className="w-4 h-4" />
            </button>
          ) : null}
        </Button>
      }
      content={
        <div className="flex flex-col gap-3 md:gap-2 text-muted-foreground text-sm">
          <div className="text-[#535263] dark:text-slate-200 font-semibold">
            APR Filter
          </div>
          <div className="flex flex-col gap-1">
            <span>Min.</span>
            <div className="relative">
              <TextField
                className="!border !min-h-[32px] !h-[32px] dark:border-[#FFFFFF14] border-[#00000014]"
                value={localMin}
                onValueChange={(val) => setLocalMin(val)}
                type="number"
                placeholder="0.0"
              />
              <div className="absolute top-1/2 right-2 -translate-y-1/2 text-sm">
                %
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span>Max.</span>
            <div className="relative">
              <TextField
                className="!border !min-h-[32px] !h-[32px] dark:border-[#FFFFFF14] border-[#00000014]"
                value={localMax}
                onValueChange={(val) => setLocalMax(val)}
                type="number"
                placeholder="0.0"
              />
              <div className="absolute top-1/2 right-2 -translate-y-1/2 text-sm">
                %
              </div>
            </div>
          </div>
          <Button
            onClick={onConfirm}
            className="mt-2 dark:!bg-[#FFFFFF14] dark:text-slate-50 dark:hover:!bg-[#FFFFFF24]"
            variant="quinary"
          >
            Confirm
          </Button>
        </div>
      }
    />
  )
}
