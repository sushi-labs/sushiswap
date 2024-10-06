import Image from 'next/image';
import React, { useMemo } from 'react';

import { RouteSourceToImageName } from '../constants';
import { SubRoute } from '../../../../types';
import {
  liquiditySourceImageClass,
  tooltipTradingPairLine,
  tooltipContainerClass,
  imageContainerClass,
} from './index.css';

const SankeyTooltip: React.FC<SubRoute> = React.memo(({ liquiditySource, value, sourceLink }) => {
  const tooltipContent = useMemo(() => {
    const formattedLiquiditySource = liquiditySource.replaceAll('_', ' ');
    const imageSrc = `/images/liquidity-providers/${RouteSourceToImageName[liquiditySource] ?? 'default'}.png`;

    return {
      formattedLiquiditySource,
      imageSrc,
      tradingPair: `${sourceLink.fromSymbol}/${sourceLink.toSymbol}`,
    };
  }, [liquiditySource, sourceLink.fromSymbol, sourceLink.toSymbol]);

  return (
    <div className={tooltipContainerClass}>
      <div className={imageContainerClass}>
        <div className={imageContainerClass}>
          <Image
            src={tooltipContent.imageSrc}
            // onError={(e) => {
            //   e.currentTarget.src = '/images/liquidity-providers/default.png';
            // }}
            alt=""
            width={20}
            height={20}
            className={liquiditySourceImageClass}
          />
          <span>{tooltipContent.formattedLiquiditySource}</span>
        </div>
        <span>{value}%</span>
      </div>
      <div className={tooltipTradingPairLine}>
        <span>Trading pair</span>
        <span>{tooltipContent.tradingPair}</span>
      </div>
    </div>
  );
});

SankeyTooltip.displayName = 'SankeyTooltip';

export default SankeyTooltip;
