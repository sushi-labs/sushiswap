'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'

import { Button } from '@sushiswap/ui'
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

export const MobileChart = (props: Partial<ChartingLibraryWidgetOptions>) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="w-full gap-2">
          <ChartIcon />
          Price Chart
        </Button>
      </DialogTrigger>
      <DialogContent className="h-screen !p-4">
        <Chart {...props} />
      </DialogContent>
    </Dialog>
  )
}
