import { sankey, sankeyCenter, SankeyLinkMinimal, SankeyNode, SankeyNodeMinimal } from "d3-sankey";
import { useEffect, useMemo, useRef, useState } from "react";
import { getColorForSource, roundToNearestHalf } from './utils'
import { Currency, Token, Native } from "sushi/currency";
import { ChainId } from "sushi/chain";
import { CustomLink, CustomNode, Link, Node } from './sankey-diagram'
import { Icon } from "../currency/Icon";
import { SankeyLinkTooltip, ToolTipCoordinates, LinkTooltipContent } from "./link-tooltip";
import { DotGridPatternDefs } from "./dot-grid";

interface D3SankeyProps {
  chainId: ChainId;
  data: {
    nodes: Node[];
    links: Link[];
    tokens: {
      address: string;
      symbol: string;
      name: string;
      decimals: number;
    }[];
  };
}



const MARGIN_X = 50;
const MARGIN_Y = 50;

export const D3Sankey = ({ chainId, data }: D3SankeyProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  const [tooltipContent, setTooltipContent] = useState<LinkTooltipContent>({
    provider: "",
    target: "",
    source: "",
    share: "",
  });
  const [toolTipCoordinates, setToolTipCoordinates] = useState<ToolTipCoordinates>({ x: 0, y: 0 });
  const [adjustedPosition, setAdjustedPosition] = useState<ToolTipCoordinates>({ x: 0, y: 0 });

  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const width = 1000;
  const height = 600;

  const sankeyGenerator = useMemo(() => {
    return sankey<CustomNode, CustomLink>()
      .nodeWidth(26)
      .nodePadding(10)
      .extent([
        [MARGIN_X, MARGIN_Y],
        [width - MARGIN_X, height - MARGIN_Y],
      ])
      .nodeId((node) => node.id)
      .nodeAlign(sankeyCenter);
  }, [width, height]);

  const customSharpLinkPath = (link: SankeyLinkMinimal<SankeyNodeMinimal<object, object>, object>) => {
    const source = link.source as SankeyNode<SankeyNodeMinimal<object, object>, object>;
    const target = link.target as SankeyNode<SankeyNodeMinimal<object, object>, object>;

    const x0 = source.x1 || 0;
    const x1 = target.x0 || 0;
    const y0 = link.y0 || 0;
    const y1 = link.y1 || 0;

    const controlOffset = Math.abs(x1 - x0) * 0.15;
    const controlX1 = x0 + controlOffset;
    const controlX2 = x1 - controlOffset;

    return `M${x0},${y0}
            C${controlX1},${y0} ${controlX2},${y1} ${x1},${y1}`;
  };

  const { nodes, links } = sankeyGenerator({ nodes: data.nodes, links: data.links });

  const allNodes = useMemo(() => {
    return nodes.map((node) => {
      const nodeHeight = (node.y1 ?? 0) - (node.y0 ?? 0);
      const nodeWidth = sankeyGenerator.nodeWidth();
      const padding = 4;
      const cornerRadius = 8;
      const { name, index: tokenIndex } = node;
      const swapToken = data.tokens[tokenIndex ?? 0];

      let currency: Currency;
      // TODO: Check if there are any other strings that represent native tokens
      if (
        swapToken.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" ||
        swapToken.address === "NATIVE"
      ) {
        currency = Native.onChain(chainId);
      } else {
        currency = new Token({
          chainId: chainId,
          address: swapToken.address,
          decimals: swapToken.decimals,
          symbol: swapToken.symbol,
          name: swapToken.name,
        });
      }

      return (
        <g key={node.index}>
          <rect
            x={(node.x0 ?? 0) - padding}
            y={(node.y0 ?? 0) - padding}
            height={nodeHeight + 2 * padding}
            width={nodeWidth + 9.9 * padding}
            fillOpacity={1}
            rx={cornerRadius}
            ry={cornerRadius}
            className='z-50 drop-shadow-lg fill-white dark:fill-slate-800 stroke-accent'
          />
          <rect
            fill='transparent'
            className='px-32'
            fillOpacity={1}
          />
          <foreignObject
            x={node.x0}
            y={node.y0}
            width={nodeWidth + 7.8 * padding}
            height={nodeHeight}
            className='overflow-visible'
          >
            <div className='fixed flex items-center justify-center w-full h-full transform -translate-x-1/2 -translate-y-1/2 gap-x-1 top-1/2 left-1/2'>
              <Icon
                currency={currency}
                disableLink
                width={15}
                height={15}
                className='rounded-full '
              />
              <span className='text-xs text-center break-words text-primary dark:text-white'>{name}</span>
            </div>
          </foreignObject>
        </g>
      );
    });
  }, [nodes, sankeyGenerator, data.tokens, chainId]);

  const allLinks = useMemo(() => {
    return links.map((link, idx) => {
      const color = getColorForSource(link.poolName.split(" ")[0]);

      const sourceNode = link.source as SankeyNode<CustomNode, CustomLink>;
      const targetNode = link.target as SankeyNode<CustomNode, CustomLink>;

      return (
        <g key={idx}>
          <path
            d={customSharpLinkPath(link)}
            stroke={color}
            fill='none'
            strokeWidth={link.width}
            className='cursor-pointer [stroke-opacity:0.9] [transition:stroke-opacity_0.2s_ease] hover:[stroke-opacity:0.6]'
            data-link-index={idx}
            onMouseEnter={() => {
              const roundedSharePercentage = roundToNearestHalf(link.value * 100).toString();
              setIsTooltipVisible(true);
              setTooltipContent({
                provider: link.poolName.split(" ")[0],
                source: sourceNode.name,
                target: targetNode.name,
                share: roundedSharePercentage,
              });
            }}
            onMouseMove={(e) => setToolTipCoordinates({ x: e.clientX, y: e.clientY })}
            onMouseLeave={() => {
              setIsTooltipVisible(false);
            }}
          />
        </g>
      );
    });
  }, [links]);

  useEffect(() => {
    if (isTooltipVisible && tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newX = toolTipCoordinates.x + 18;
      let newY = toolTipCoordinates.y + 18;

      if (newX + tooltipRect.width > viewportWidth) {
        newX = toolTipCoordinates.x - tooltipRect.width - 18;
      }

      if (newY + tooltipRect.height > viewportHeight) {
        newY = toolTipCoordinates.y - tooltipRect.height - 18;
      }

      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [isTooltipVisible, toolTipCoordinates]);



  return (
    <div className='relative flex items-center justify-center w-full'>
      <SankeyLinkTooltip ref={tooltipRef} isVisible={isTooltipVisible} tooltipContent={tooltipContent} position={adjustedPosition} />
      <svg
        width={"100%"}
        height={"100%"}
        viewBox={`0 0 ${width} ${height}`}
      >
        <DotGridPatternDefs />
        <g transform='translate(-15, 0)'>
          <rect
            width='100%'
            height='100%'
            fill='url(#bgDotPattern)'
          ></rect>

          {allLinks}
          {allNodes}
        </g>
      </svg>
    </div>
  );
};

