import { forwardRef } from 'react';
import Image from 'next/image';
import React from 'react';
import { getImageForSource } from './utils'

export interface LinkTooltipContent {
  provider: string;
  share: string;
  source: string;
  target: string;
}

export interface LinkTooltipProps {
  isVisible: boolean;
  tooltipContent: LinkTooltipContent;
  position: { x: number; y: number };
}

export interface ToolTipCoordinates {
  x: number;
  y: number;
}

export const SankeyLinkTooltip = forwardRef<HTMLDivElement, LinkTooltipProps>(
  ({ isVisible, tooltipContent, position }, ref) => {
    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        role="tooltip"
        className="fixed font-semibold flex flex-col gap-y-2 w-48 sm:w-56 bg-white border border-gray-300 p-2 rounded-lg shadow-lg text-[.625rem] sm:text-sm z-50 text-[#616161]"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Image
              src={getImageForSource(tooltipContent.provider)}
              alt={`${tooltipContent.provider}-icon`}
              className="overflow-hidden rounded-sm"
              width={21}
              height={21}
            />
            {tooltipContent.provider}
          </div>
          <span>{tooltipContent.share}%</span>
        </section>
        <section className="flex items-center justify-between text-[#919191]">
          <p>Trading pair</p>
          <span>
            {tooltipContent.source}/{tooltipContent.target}
          </span>
        </section>
      </div>
    );
  }
);

SankeyLinkTooltip.displayName = 'SankeyLinkTooltip';

