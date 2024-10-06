
import dynamic from 'next/dynamic';
import { useState } from 'react';

import { SankeyLegend } from '../SankeyDiagram/SankeyLegend';
import SankeyTooltip from '../SankeyDiagram/SankeyTooltip';
import { SubRoute, Route } from '../../../types';



import { modalTitleClass, modalContainerClass, modalSVGContainerClass } from '../index.css';
import { Dialog } from '@sushiswap/ui';
import { useIsSmScreen } from '@sushiswap/hooks';

const SankeyDiagram = dynamic(
  () => import('../SankeyDiagram').then((mod) => mod.SankeyDiagram),
  {
    ssr: false,
  },
);

interface SankeyModalProps {
  route: Route;
  chainId: number;
  isOpen: boolean;
  onClose: () => void;
}

const svgHeight = 1000;
const svgWidth = svgHeight * 1.91;

export const SankeyModal = ({ route, chainId, isOpen, onClose }: SankeyModalProps) => {
  const [subRoute, onSubRouteTouch] = useState<SubRoute | undefined>(undefined);
  const isMobile = useIsSmScreen()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    {/* variant="XLARGE"> */}
      <div className={modalContainerClass}>
        <div className={modalSVGContainerClass}>
          <h5 className={modalTitleClass}>Order route plan</h5>
          {/* <Dialog.Close className={''}>
            X
            {/* <XIcon aria-hidden className={dialogCloseBtnIconClass} /> */}
          {/* </Dialog.Close> */} 
          <SankeyDiagram
            isMobile={isMobile}
            onSubRouteTouch={onSubRouteTouch}
            route={route}
            width={svgWidth}
            height={svgHeight}
            chainId={chainId}
          />
        </div>
        {subRoute && isMobile ? <SankeyTooltip {...subRoute} /> : <SankeyLegend route={route} />}
      </div>
    </Dialog>
  );
};
