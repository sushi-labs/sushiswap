// import * as Dialog from '@radix-ui/react-dialog';
import dynamic from 'next/dynamic'
import { useState } from 'react'

import { SankeyLegend } from './SankeyDiagram/SankeyLegend'
import SankeyTooltip from './SankeyDiagram/SankeyTooltip'

import { useIsSmScreen } from '@sushiswap/hooks'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
// import { dialogCloseBtnClass, dialogCloseBtnIconClass } from '@/styles/dialog.css';
// import { breakpoints } from '../../utils';
// import { modalTitleClass, modalContainerClass, modalSVGContainerClass } from './index.css';
import type { Route, SubRoute } from '../../types'

const SankeyDiagram = dynamic(
  () => import('../SankeyModal/SankeyDiagram').then((mod) => mod.SankeyDiagram),
  {
    ssr: false,
  },
)

interface SankeyModalProps {
  route: Route | null
  chainId: number
  isOpen: boolean
  onClose: () => void
}

const svgHeight = 1000
const svgWidth = svgHeight * 1.91

export const SankeyModal = ({ route, chainId }: SankeyModalProps) => {
  const [subRoute, onSubRouteTouch] = useState<SubRoute | undefined>(undefined)
  const isMobile = useIsSmScreen()

  return (
    <Dialog>
      {/* <div className={modalContainerClass}>
      <div className={modalSVGContainerClass}>
        <h5 className={modalTitleClass}>Order route plan</h5> */}

      <DialogTrigger asChild>
        <Button>View</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[65vw] max-h-[90vh] p-4">
        <DialogHeader>
          <DialogTitle>Route</DialogTitle>
        </DialogHeader>
        <DialogClose asChild />
        <div className="flex items-center justify-center overflow-hidden max-h-[60vh]">
          {route ? (
            <SankeyDiagram
              isMobile={isMobile}
              onSubRouteTouch={onSubRouteTouch}
              route={route}
              width={svgWidth}
              height={svgHeight}
              chainId={chainId}
              className="scale-50"
            />
          ) : (
            <>No route available</>
          )}
        </div>
        {subRoute && isMobile ? (
          <SankeyTooltip {...subRoute} />
        ) : (
          <SankeyLegend route={route} />
        )}
      </DialogContent>
    </Dialog>
  )
}
