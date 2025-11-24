'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'

import { Button, DialogClose, IconButton } from '@sushiswap/ui'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { ChartIcon } from '@sushiswap/ui/icons/Chart'
import type { ChartingLibraryWidgetOptions } from 'public/trading_view/charting_library/charting_library'
import { Chart } from './chart'
import { ChartHeader } from './chart-header'

export const MobileChart = ({
  widgetProps,
}: { widgetProps: Partial<ChartingLibraryWidgetOptions> }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="w-full gap-2">
          <ChartIcon />
          Price Chart
        </Button>
      </DialogTrigger>
      <DialogContent
        variant="semi-opaque"
        className="h-[100vh] max-h-[calc(100vh-56px)] !p-4 !flex flex-col"
        hideClose
      >
        <DialogHeader className="h-fit">
          <ChartHeader />
          <DialogTitle />
          <DialogClose className="absolute top-2.5 right-2.5">
            <IconButton variant={'ghost'} icon={XMarkIcon} name="Close" />
          </DialogClose>
        </DialogHeader>
        <Chart widgetProps={widgetProps} />
      </DialogContent>
    </Dialog>
  )
}
