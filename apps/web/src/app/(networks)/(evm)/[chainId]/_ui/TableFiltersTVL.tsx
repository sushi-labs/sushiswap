'use client'
import { PlusCircleIcon } from '@heroicons/react-v1/outline'
import { XIcon } from '@heroicons/react-v1/solid'
import { Button, TextField, classNames } from '@sushiswap/ui'
import { useRef, useState } from 'react'
import {
  usePoolFilters,
  useSetPoolFilters,
} from 'src/app/(networks)/_ui/pools-filters-provider'
import { PopoverDrawer } from 'src/app/(networks)/_ui/popover-drawer'
import { formatNumber } from 'sushi'

export const TableFiltersTVL = () => {
  const { tvlRangeMin, tvlRangeMax } = usePoolFilters()
  const setFilters = useSetPoolFilters()

  const [localMin, setLocalMin] = useState('')
  const [localMax, setLocalMax] = useState('')
  const [minMultiple, setMinMultiple] = useState<'k' | 'm'>('k')
  const [maxMultiple, setMaxMultiple] = useState<'k' | 'm'>('k')
  const triggerRef = useRef<HTMLButtonElement>(null)

  const closeContent = () => {
    if (triggerRef.current) {
      triggerRef.current.click()
    }
  }

  const onConfirm = () => {
    const realMin = localMin
      ? Number.parseFloat(localMin) * (minMultiple === 'k' ? 1000 : 1000000)
      : undefined
    const realMax = localMax
      ? Number.parseFloat(localMax) * (maxMultiple === 'k' ? 1000 : 1000000)
      : undefined
    if (realMax && realMin && realMax > realMin) {
      setFilters((prev) => ({
        ...prev,
        tvlRangeMin: realMin,
        tvlRangeMax: realMax,
      }))
      closeContent()
    }
  }

  const clearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      tvlRangeMin: undefined,
      tvlRangeMax: undefined,
    }))
  }

  return (
    <PopoverDrawer
      popoverContentClassName="max-w-[225px]"
      dialogContentClassName="max-w-none"
      dialogTitle="TVL Filter"
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
            tvlRangeMin && tvlRangeMax
              ? '!bg-blue/10 dark:!bg-skyblue/10 dark:!border-skyblue !text-blue dark:!text-skyblue !border-blue !border-1 !border-solid'
              : '',
          )}
        >
          TVL
          {tvlRangeMin && tvlRangeMax
            ? `: ${formatNumber(tvlRangeMin)}-${formatNumber(tvlRangeMax)}`
            : null}
          {tvlRangeMin && tvlRangeMax ? (
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
            TVL Filter
          </div>
          <div className="flex flex-col gap-1">
            <span>Min.</span>
            <div className="relative">
              <TextField
                className="!border !min-h-[32px] !h-[32px] dark:border-[#FFFFFF14] border-[#00000014]"
                value={localMin}
                onValueChange={(val) => setLocalMin(val)}
                type="number"
              />
              <div className="absolute top-1/2 right-2 -translate-y-1/2">
                <Multiple
                  value={minMultiple}
                  onChange={(value) => setMinMultiple(value)}
                />
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
              />
              <div className="absolute top-1/2 right-2 -translate-y-1/2">
                <Multiple
                  value={maxMultiple}
                  onChange={(value) => setMaxMultiple(value)}
                />
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

const Multiple = ({
  value,
  onChange,
  className,
}: {
  value: 'k' | 'm'
  onChange: (value: 'k' | 'm') => void
  className?: string
}) => {
  return (
    <div
      className={classNames(
        'flex items-center dark:text-slate-500 text-slate-450',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange('k')}
        className={classNames(
          'p-1 text-xs rounded-l-md',
          value === 'k' ? 'text-slate-900 dark:text-pink-100 font-medium' : '',
        )}
      >
        k
      </button>
      /
      <button
        type="button"
        onClick={() => onChange('m')}
        className={classNames(
          'p-1 text-xs rounded-r-md',
          value === 'm' ? 'text-slate-900 dark:text-pink-100 font-medium' : '',
        )}
      >
        m
      </button>
    </div>
  )
}
