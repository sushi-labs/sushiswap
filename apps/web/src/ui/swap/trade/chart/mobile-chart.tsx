'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'

import { Button, DialogClose, DialogPrimitive, IconButton } from '@sushiswap/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { ChartIcon } from '@sushiswap/ui/icons/Chart'
import type { ChartingLibraryWidgetOptions } from 'public/static/charting_library/charting_library'
import { Chart } from './chart'
import { ChartHeader } from './chart-header'

export const MobileChart = (props: Partial<ChartingLibraryWidgetOptions>) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="w-full gap-2">
          <ChartIcon />
          Price Chart
        </Button>
      </DialogTrigger>
      <DialogContent className="h-screen !p-4 !flex flex-col" hideClose>
        <DialogHeader className="h-fit">
          <ChartHeader />
          <DialogTitle />
          <DialogClose className="absolute top-2.5 right-2.5">
            <IconButton variant={'ghost'} icon={XMarkIcon} name="Close" />
          </DialogClose>
        </DialogHeader>
        <Chart {...props} />
      </DialogContent>
    </Dialog>
  )
}
