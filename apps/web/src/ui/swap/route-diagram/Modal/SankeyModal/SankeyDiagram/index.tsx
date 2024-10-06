import { sankeyLinkHorizontal, sankey } from 'd3-sankey';
import { SankeyLink, SankeyNode } from 'd3-sankey';
import { select } from 'd3-selection';
import { Selection as D3Selection, BaseType } from 'd3-selection';
import React, { useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { transformRouteDataD3, sankeyHoverOpacityLevels, applyOpacityEffects } from './helpers';
import {
  diagramContainerClass,
  hiddenNodeClass,
  nodeClass,
  nodeTextClass,
  sankeySvgContainerClass,
  tooltipContentClass,
} from './index.css';
import SankeyTooltip from './SankeyTooltip';
import { LinkD3Custom, NodeD3Custom, SubRoute, Route } from '../../../types';
import { classNames } from '@sushiswap/ui';

function curvyLine(d: LinkD3Custom) {
  const height = d.source.y1 - d.source.y0;

  const startY = d.source.y0 + (d.source.y1 - d.source.y0) / 2;
  const endY = d.target.y0 + (d.target.y1 - d.target.y0) / 2;

  const delta = d.target.x0 - d.source.x1;

  const handleX = delta / 4;

  const middlePointX = d.source.x1 + delta / 2;
  const offsetY = startY + Math.min(height / 5, 90);
  return `M ${d.source.x1} ${startY}
  C ${d.source.x1 + handleX} ${startY} ${middlePointX - handleX} ${offsetY} ${middlePointX} ${offsetY} 
  S${d.target.x0 - handleX} ${endY} ${d.target.x0} ${endY}`;
}

interface SankeyChartProps {
  route: Route;
  chainId: number;
  width: number;
  height: number;
  isMobile: boolean;
  onSubRouteTouch: Dispatch<SetStateAction<SubRoute | undefined>>;
  isPreview?: boolean;
  className?: string;
}
const hiddenNodesMarginSize = 4;
const logoWithMarginHeight = 56;
export const TOOLTIP_WIDTH = 235;
export const TOOLTIP_HEIGHT = 70;

export const SankeyDiagram: React.FC<SankeyChartProps> = ({
  route,
  chainId,
  width,
  height,
  isMobile,
  onSubRouteTouch,
  isPreview = false,
  className,
}) => {
  const sankeyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sankeyRef.current) return;
    const data = transformRouteDataD3({ route, chainId });
    let selectedSubRoute: SubRoute | undefined;
    const svg = select(sankeyRef.current)
      .selectAll('svg')
      .data([null])
      .join('svg')
      .attr('width', width)
      .attr('height', height + (isPreview ? 0 : logoWithMarginHeight))
      .attr('aria-label', '0x sankey diagram of the current trade route')
      .attr('viewBox', [0, 0, width, height])
      .attr('class', sankeySvgContainerClass);

    // Calculate logo dimensions
    const logoHeight = 24;
    const logoWidth = 108;
    const cupLogoWidth = 24;
    const logoScale = 1.2; // Adjust this to scale the logos
    const scaledLogoHeight = logoHeight * logoScale;
    const scaledLogoWidth = logoWidth * logoScale;
    const scaledCupLogoWidth = cupLogoWidth * logoScale;
    if (!isPreview) {
      const logoGroup = svg
        .append('g')
        .attr(
          'transform',
          `translate(${width - scaledLogoWidth - scaledCupLogoWidth}, ${height - scaledLogoHeight / 2}) scale(${logoScale})`,
        );

      logoGroup.html(`

  `);
    }

    // If the data is not valid, render an error message
    if (!data.isValid) {
      const iconSize = 48;
      const iconX = width / 2 - iconSize / 2;
      const iconY = height / 2 - iconSize - 16;
      svg
        .append('g')
        .attr('transform', `translate(${iconX}, ${iconY})`)
        .html(
          renderToStaticMarkup(
            // <AlertIcon width={iconSize} height={iconSize} style={{ color: 'rgba(0,0,0,0.08)' }} />,
            <span>There was an issue loading the route diagram.</span>,
          ),
        );

      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height / 2 + iconSize / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '32px')
        .attr('fill', 'rgba(0,0,0,0.08)')
        .text('There was an issue loading the route diagram.');

      return;
    }

    const isNonMultiplexed = data.nodes.length === 2 && data.links.length === 1;

    const margin = {
      top: isPreview ? 20 : 40,
      right: isPreview ? 20 : 40,
      bottom: isPreview ? 20 : 40,
      left: isPreview ? 20 : 40,
    };
    // if we are in a single hop setting, scale down further
    if (isNonMultiplexed) {
      if (isPreview) {
        margin.top = 60;
        margin.bottom = 60;
      } else {
        margin.top = 300;
        margin.bottom = 300;
      }
    }
    const sankeyLayout = sankey<NodeD3Custom, LinkD3Custom>()
      .nodeId((d: NodeD3Custom) => d.id)
      .nodeWidth(width / 12)
      .nodePadding(isPreview ? 12 : 24)
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ]);

    // after this generator executes, each links source and target values are updated from string to NodeD3Custom objects
    const { nodes, links } = sankeyLayout({
      nodes: data.nodes,
      links: data.links,
    });

    for (const node of nodes) {
      if (!node.hide) continue;
      const incoming = node.sourceLinks[0];
      if (!incoming) {
        continue;
      }
      node.height = incoming.width || 2;
    }

    sankeyLayout.update({ links, nodes });

    select(sankeyRef.current).select('#sankeyLinks').remove();
    select(sankeyRef.current).select('#sankeyNodeGroup').remove();

    const svgDefs = svg.append('defs');

    const minNodeHeight = isPreview ? 14 : 36;

    if (!isPreview) {
      // Define a 8px dot pattern for the svg background
      const dotPattern = svgDefs
        .append('pattern')
        .attr('id', 'bgDotPattern')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 8)
        .attr('height', 8);
      dotPattern.append('circle').attr('cx', 4).attr('r', 1).attr('fill', 'rgba(0,0,0,0.08)');
      svg
        .append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('fill', 'url(#bgDotPattern)');
    }

    //Define a box-shadow-25 filter for non hidden nodes
    svgDefs.append('filter').attr('id', 'box-shadow-25').html(`
        <feDropShadow dx="0" dy="4" stdDeviation="18" flood-opacity="0.06"/>
    `);

    links.forEach((link: LinkD3Custom) => {
      const gradient = svgDefs
        .append('linearGradient')
        .attr('id', `gradient-${link.pathkey}`)
        .attr('gradientUnits', 'userSpaceOnUse');
      gradient.append('stop').attr('offset', '0%').attr('stop-color', link.gradientStart);

      gradient.append('stop').attr('offset', '100%').attr('stop-color', link.gradientEnd);
    });

    const nodePadding = 20;

    const minimumLinkWidth = 2;

    nodes.forEach((node: NodeD3Custom) => {
      if (node.hide) {
        node.height = Math.max(node.height || minimumLinkWidth, minimumLinkWidth);
      } else {
        node.height = Math.max(node.y1 - node.y0 + nodePadding, minNodeHeight);
      }
    });

    const tooltipContainer = select(sankeyRef.current).select('#tooltipContainer');
    const tooltipContentContainer = select(sankeyRef.current).select('#tooltipContent');
    /**
     * The sankeyLinkGroup will contain a group of path elements for each link.
     * The path element is created using the sankeyLinkHorizontal generator and
     * each path in the entire group can uniquely be identified by it's pathKey property.
     * The pathKey is used to connect links with hidden nodes and to apply hover effects
     * when the user hovers over a hidden-node or link which pertains to a particular sub route.
     */
    const linkGroup = svg
      .append('g')
      .attr('id', 'sankeyLinkGroup')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.5)
      .selectAll('g')
      .data(links)
      .join('g');

    const path = sankeyLinkHorizontal<NodeD3Custom, LinkD3Custom>();

    // sort the nodes so hidden nodes are rendered first.
    // this is necessary as the z positioning is determined by the drawing order in SVG
    nodes.sort((a, b) => {
      if ((a.hide && b.hide) || (!a.hide && !b.hide)) return 0;
      if (a.hide && !b.hide) return -1;
      return 1;
    });

    /**
     * The `sankeyNodeGroup` will contain a group of svg elements for each node in the sankey diagram.
     * Each group in the nodeGroup will have a datum type of NodeD3Custom which contains a `hide` attribute
     * which determines if the node should render as a "hidden" node or not.
     *
     * If the node is "hidden" (i.e. hide=true), the node's group will be contain a `rect` element with a gradient
     * background & empty text & image elements. Each hidden node's group will be identified by it's `pathKey` in the DOM
     * and is used to apply effects on users touch or hover.
     *
     * For nodes which are not hidden, the node's group contain a `rect` with a white background and include text and image elements
     * which render the node's token and symbol.
     *
     */
    const nodeGroup = svg
      .append('g')
      .attr('id', 'sankeyNodeGroup')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('id', (d: NodeD3Custom) => (d.hide && d.pathkey ? d.pathkey : d.symbol));

    linkGroup
      .append('path')
      .attr('d', isNonMultiplexed ? curvyLine : path)
      .attr('id', (d: LinkD3Custom) => d.pathkey)
      .attr('stroke', (d: LinkD3Custom) => `url(#gradient-${d.pathkey})`)
      .attr('stroke-opacity', sankeyHoverOpacityLevels.default)
      .attr('y', (d: LinkD3Custom) => d.y0 + 2)
      .attr('stroke-width', (d: LinkD3Custom) => {
        return Math.max(d.width, 2);
      })
      .on('mousemove', (event: MouseEvent | TouchEvent, d: LinkD3Custom) => {
        if (sankeyRef.current === null) return;
        const currentSubRoute: SubRoute = {
          sourceLink: d,
          value: d.value,
          liquiditySource: d.liquiditySource,
        };
        handleOnMouseOrTouchEvent({
          event,
          pathKey: d.pathkey,
          currentSubRoute,
          linkGroup,
          nodeGroup,
          sankeyRef,
          tooltipContainer,
          tooltipContentContainer,
          selectedSubRoute,
          isMobile,
          onSubRouteTouch,
        });
      })
      .on('mouseout', (_event: MouseEvent, d: LinkD3Custom) => {
        if (isMobile) onSubRouteTouch(undefined);
        applyOpacityEffects(linkGroup, nodeGroup, d.pathkey, 'exit');
        tooltipContainer.style('display', 'none');
      });

    nodeGroup
      .append('rect')
      .attr('data-hidden', (d: NodeD3Custom) => d.hide)
      .attr('id', (d: NodeD3Custom) => (d.hide && d.pathkey ? d.pathkey : d.symbol))
      .attr('class', (d: NodeD3Custom) => (d.hide ? hiddenNodeClass : nodeClass))
      //filter and 1px inset stroke help complete the Shadow25 effect
      .attr('filter', (d: NodeD3Custom) => (d.hide ? '' : 'url(#box-shadow-25)'))
      .attr('stroke', (d: NodeD3Custom) => (d.hide ? 'transparent' : 'rgba(0,0,0,0.06)'))
      .attr('stroke-width', isPreview ? '1' : '2')
      .attr('stroke-alignment', 'inner')
      .attr('id', (d: NodeD3Custom) => (d.hide && d.pathkey ? d.pathkey : d.symbol))
      .attr('rx', (d: NodeD3Custom) => (d.hide ? '0' : isPreview ? '8' : '20'))
      .attr('x', (d: NodeD3Custom) => Math.floor(d.x0))
      .attr('y', (d: NodeD3Custom) => {
        if (d.hide) {
          // if we have the minimal height, no need to offset
          if (d.height === 2) return d.y0 - 1;
          return d.y0;
        }
        return d.y0 - nodePadding / 2;
      })
      .attr('height', (d: NodeD3Custom) => d.height || d.y1 - d.y0)
      .attr('width', (d: NodeD3Custom) => Math.floor(Math.ceil(d.x1) - Math.floor(d.x0)))
      .attr('fill', (d: NodeD3Custom) => (d.hide ? `url(#gradient-${d.pathkey})` : 'white'))
      .attr('fill-opacity', (d: NodeD3Custom) => (d.hide ? sankeyHoverOpacityLevels.default : 1))
      .on('mousemove', (event: MouseEvent | TouchEvent, d: NodeD3Custom) => {
        if (!d.hide && d.symbol.length > 4) {
          tooltipContentContainer.html(`<span>${d.symbol}</span>`);
          return;
        }

        if (!d.hide || !sankeyRef.current || !d.pathkey) return;
        const currentSubRoute: SubRoute = {
          sourceLink: d.sourceLinks[0],
          value: d.sourceLinks[0].value,
          liquiditySource: d.sourceLinks[0].liquiditySource,
        };
        handleOnMouseOrTouchEvent({
          event,
          pathKey: d.pathkey,
          currentSubRoute,
          linkGroup,
          nodeGroup,
          sankeyRef,
          tooltipContainer,
          tooltipContentContainer,
          selectedSubRoute,
          isMobile,
          onSubRouteTouch,
        });

        if (isMobile) {
          onSubRouteTouch(selectedSubRoute);
          return;
        }
        if (currentSubRoute.sourceLink.pathkey !== selectedSubRoute?.sourceLink.pathkey) {
          selectedSubRoute = currentSubRoute;
          tooltipContentContainer.html(
            `${renderToStaticMarkup(<SankeyTooltip {...selectedSubRoute} />)}`,
          );
        }
        const svgRect = sankeyRef.current.getBoundingClientRect();
        let tooltipX
        let tooltipY

        if (event.type === 'touchmove' || event.type === 'touchstart') {
          const touchEvent = event as TouchEvent;
          tooltipX = touchEvent.touches[0].pageX - svgRect.left;
          tooltipY = touchEvent.touches[0].pageY - svgRect.top;
        } else {
          const mouseEvent = event as MouseEvent;
          tooltipX = mouseEvent.pageX - svgRect.left;
          tooltipY = mouseEvent.pageY - svgRect.top;
        }
        const toolTipOverflowsOnRight = tooltipX + TOOLTIP_WIDTH > svgRect.width;
        const toolTipOverflowsOnBottom = tooltipY + TOOLTIP_HEIGHT > svgRect.height;
        if (toolTipOverflowsOnRight) {
          tooltipX = tooltipX - TOOLTIP_WIDTH;
        }
        if (toolTipOverflowsOnBottom) {
          tooltipY = tooltipY - TOOLTIP_HEIGHT;
        }
        tooltipContainer
          .style('display', 'block')
          .style('transform', `translate(${tooltipX}px, ${tooltipY}px)`);
      })
      .on('mouseout', (_event: MouseEvent, d: NodeD3Custom) => {
        if (!d.hide || !sankeyRef.current || !d.pathkey) return;
        if (isMobile) onSubRouteTouch(undefined);
        applyOpacityEffects(linkGroup, nodeGroup, d.pathkey, 'exit');
        tooltipContainer.style('display', 'none');
      });

    const tokenImageSize = 34;
    const characterWidth = 14;
    const imagePadding = 12;
    if (!isPreview) {
      nodeGroup
        .append('text')
        .attr('class', nodeTextClass)
        .attr('id', (d: NodeD3Custom) => (d.hide && d.pathkey ? d.pathkey : ''))
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'start')
        .attr('pointer-events', 'none')
        .html((d: NodeD3Custom) =>
          d.hide ? ' ' : d.symbol.length > 4 ? `${d.symbol.slice(0, 3)}..` : d.symbol,
        )
        .attr('x', function (this: SVGTextElement, d: NodeD3Custom) {
          const rectWidth = Math.floor(Math.ceil(d.x1) - Math.floor(d.x0));
          return (
            Math.floor(d.x0) +
            (rectWidth -
              tokenImageSize -
              imagePadding -
              characterWidth * Math.min(d.symbol.length, 4)) /
              2 +
            tokenImageSize +
            imagePadding
          );
        })
        .attr('y', (d: NodeD3Custom) => {
          if (d.hide) return d.y0;
          const nodeHeight = d.y1 - d.y0;
          const adjustedHeight = Math.max(nodeHeight, minNodeHeight);
          return d.y0 + adjustedHeight / 2;
        })
        .style('font-size', '24px');
    }

    const imgSize = isPreview ? 12 : tokenImageSize;

    nodeGroup
      .append('image')
      .attr('dominant-baseline', 'middle')
      .attr('href', (d: NodeD3Custom) => d.logoUrl)
      .attr('width', (d: NodeD3Custom) => (d.hide ? 0 : imgSize))
      .attr('height', (d: NodeD3Custom) => (d.hide ? 0 : imgSize))
      // .each(function (this: SVGImageElement, d: NodeD3Custom) {
        // const image = select(this);
        // image.on('error', function () {
        //   image.attr('href', '/images/liquidity-providers/default.png');
        // });
      // })
      .attr('clip-path', 'circle(50% at 50% 50%)')
      .attr('x', (d: NodeD3Custom) => {
        const padding = isPreview ? 0 : imagePadding;
        const rectWidth = Math.floor(Math.ceil(d.x1) - Math.floor(d.x0));
        const textWidth = isPreview ? 0 : characterWidth * Math.min(d.symbol.length, 4);
        const totalWidth = imgSize + padding + textWidth;
        return Math.floor(d.x0) + (rectWidth - totalWidth) / 2;
      })
      .attr('y', (d: NodeD3Custom) => {
        if (d.hide) return d.y0 + hiddenNodesMarginSize / 2;
        const nodeHeight = d.height || d.y1 - d.y0;
        return d.y0 - nodePadding / 2 + (nodeHeight - imgSize) / 2;
      });

    const currentSankeyRef = sankeyRef.current;
    return () => {
      select(currentSankeyRef).select('svg').remove();
    };
  }, [route, width, height, chainId, isMobile, onSubRouteTouch, isPreview]);

  return (
    <div ref={sankeyRef} className={classNames(diagramContainerClass, className)}>
      <div
        id="tooltipContainer"
        style={{ position: 'absolute', pointerEvents: 'none', display: 'none' }}
      >
        <div id="tooltipContent" className={tooltipContentClass} />
      </div>
    </div>
  );
};
interface HandleSankeyInteractionParams {
  event: MouseEvent | TouchEvent;
  currentSubRoute: SubRoute;
  pathKey: string;
  linkGroup: D3Selection<
    BaseType | SVGGElement,
    SankeyLink<NodeD3Custom, LinkD3Custom>,
    SVGGElement,
    null
  >;
  nodeGroup: D3Selection<
    BaseType | SVGGElement,
    SankeyNode<NodeD3Custom, LinkD3Custom>,
    SVGGElement,
    null
  >;
  sankeyRef: React.RefObject<HTMLDivElement>;
  tooltipContainer: D3Selection<BaseType, unknown, null, undefined>;
  tooltipContentContainer: D3Selection<BaseType, unknown, null, undefined>;
  selectedSubRoute: SubRoute | undefined;
  isMobile: boolean;
  onSubRouteTouch: (subRoute: SubRoute | undefined) => void;
}
/**
 * Handles the interaction when the user hovers over a node or link in the sankey diagram.
 */
export function handleOnMouseOrTouchEvent({
  event,
  pathKey,
  currentSubRoute,
  linkGroup,
  nodeGroup,
  sankeyRef,
  tooltipContainer,
  tooltipContentContainer,
  selectedSubRoute,
  isMobile,
  onSubRouteTouch,
}: HandleSankeyInteractionParams): void {
  if (sankeyRef.current === null) return;
  if (!pathKey) return;
  applyOpacityEffects(linkGroup, nodeGroup, pathKey, 'enter');
  if (isMobile) {
    onSubRouteTouch(currentSubRoute);
    return;
  }
  if (currentSubRoute.sourceLink.pathkey !== selectedSubRoute?.sourceLink.pathkey) {
    selectedSubRoute = currentSubRoute;
    tooltipContentContainer.html(`${renderToStaticMarkup(<SankeyTooltip {...currentSubRoute} />)}`);
  }
  const svgRect = sankeyRef.current.getBoundingClientRect();
  let tooltipX
  let tooltipY
  if (event.type === 'touchmove' || event.type === 'touchstart') {
    const touchEvent = event as TouchEvent;
    tooltipX = touchEvent.touches[0].pageX - svgRect.left;
    tooltipY = touchEvent.touches[0].pageY - svgRect.top;
  } else {
    const mouseEvent = event as MouseEvent;
    tooltipX = mouseEvent.pageX - svgRect.left;
    tooltipY = mouseEvent.pageY - svgRect.top;
  }
  const toolTipOverflowsOnRight = tooltipX + TOOLTIP_WIDTH > svgRect.width - TOOLTIP_WIDTH;
  const toolTipOverflowsOnBottom = tooltipY + TOOLTIP_HEIGHT > svgRect.height - TOOLTIP_HEIGHT;
  if (toolTipOverflowsOnRight) {
    tooltipX = tooltipX - TOOLTIP_WIDTH;
  }
  if (toolTipOverflowsOnBottom) {
    tooltipY = tooltipY - TOOLTIP_HEIGHT;
  }
  tooltipContainer
    .style('display', 'block')
    .style('transform', `translate(${tooltipX}px, ${tooltipY}px)`);
}
