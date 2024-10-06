import { SankeyLink, SankeyNode } from 'd3-sankey';
import { Selection as D3Selection, BaseType } from 'd3-selection';

import { getGradientForSource } from './constants';
import { NodeD3Custom, LinkD3Custom, SourceLegendType, Route } from '../../../types';


export const sankeyHoverOpacityLevels = { default: 0.7, selected: 1, unselected: 0.4 };

/**
 * Handles the opacity effects when the user hovers over a node or link in the sankey diagram.
 *
 * @param linkGroup - Selection of all the link elements in the sankey diagram
 * @param nodeGroup - Selection of all the node elements in the sankey diagram
 * @param pathKey - The pathKey of the node or link which is being hovered over
 * @param mode - The mode of the hover effect, either 'enter' or 'exit'
 */
export function applyOpacityEffects(
  linkGroup: D3Selection<
    BaseType | SVGGElement,
    SankeyLink<NodeD3Custom, LinkD3Custom>,
    SVGGElement,
    null
  >,
  nodeGroup: D3Selection<
    BaseType | SVGGElement,
    SankeyNode<NodeD3Custom, LinkD3Custom>,
    SVGGElement,
    null
  >,
  pathKey: string,
  mode: 'enter' | 'exit',
) {
  const selectedLinkElements = linkGroup.selectAll(`[id="${pathKey}"]`);
  const selectedNodeElements = nodeGroup.selectAll(`[id="${pathKey}"]`);
  const unselectedHiddenNodeElements = nodeGroup.selectAll(
    `[data-hidden="true"]:not([id="${pathKey}"])`,
  );
  const unselectedLinkElements = linkGroup.selectAll(`:not([id="${pathKey}"])`);
  if (mode === 'enter') {
    selectedLinkElements.attr('stroke-opacity', sankeyHoverOpacityLevels.selected);
    selectedNodeElements.attr('fill-opacity', sankeyHoverOpacityLevels.selected);
    unselectedLinkElements.attr('stroke-opacity', sankeyHoverOpacityLevels.unselected);
    unselectedHiddenNodeElements.attr('fill-opacity', sankeyHoverOpacityLevels.unselected);
  } else {
    selectedLinkElements.attr('stroke-opacity', sankeyHoverOpacityLevels.default);
    selectedNodeElements.attr('fill-opacity', sankeyHoverOpacityLevels.default);
    unselectedLinkElements.attr('stroke-opacity', sankeyHoverOpacityLevels.default);
    unselectedHiddenNodeElements.attr('fill-opacity', sankeyHoverOpacityLevels.default);
  }
}


/**
 * Transforms a Route object into a SankeyRouteDataD3 object for use with D3.js.
 *
 * @param route - The Route object to transform
 * @param chainId - The chain ID associated with the route
 * @returns A SankeyRouteDataD3 object containing nodes and links for the Sankey diagram
 */

interface SankeyRouteDataD3 {
  nodes: NodeD3Custom[];
  links: LinkD3Custom[];
  isValid: boolean;
}

interface SankeyRouteDataD3Props {
  route: Route;
  chainId: number;
}

export function transformRouteDataD3({
  route,
  chainId,
}: SankeyRouteDataD3Props): SankeyRouteDataD3 {
  const addressToNode = new Map<string, NodeD3Custom>();
  const nodes: NodeD3Custom[] = [];
  const links: LinkD3Custom[] = [];

  // Create nodes for each token
  route.tokens.forEach((token, index) => {
    const node: NodeD3Custom = {
      id: token.address,
      sourceLinks: [],
      targetLinks: [],
      index,
      symbol: token.symbol,
      logoUrl: `https://cdn.sushi.com/tokens/${chainId}/${token.address}`,
      hide: false,
      depth: 0,
      x0: 0,
      x1: 0,
      y0: 0,
      y1: 0,
      height: 0
    };
    nodes.push(node);
    addressToNode.set(token.address, node);
  });

  // Create hidden-nodes and links for each fill
  let isValid = true;
  route.fills.forEach((fill, index) => {
    const fromNode = addressToNode.get(fill.from);
    const toNode = addressToNode.get(fill.to);
    if (!fromNode || !toNode) {
      isValid = false;
      return;
    }
    const fromLevel = fromNode.index;
    const toLevel = toNode.index;
    const elementId = `${fill.from}-${fill.to}-${index}`;
    let currentFromNode = fromNode;
    const gradient = getGradientForSource(fill.source);

    for (let i = fromLevel + 1; i < toLevel; i++) {
      const hiddenNodeId = `${fill.from}-${i}-${fill.source}-${index}`;
      const hiddenNode: NodeD3Custom = {
        id: hiddenNodeId,
        sourceLinks: [],
        targetLinks: [],
        index: i,
        symbol: '',
        logoUrl: '',
        hide: true,
        pathkey: elementId,
        depth: 0,
        x0: 0,
        x1: 0,
        y0: 0,
        y1: 0,
        height: 0
      };
      nodes.push(hiddenNode);

      const link: LinkD3Custom = {
        source: currentFromNode,
        target: hiddenNode,
        value: fill.proportionBps / 100,
        liquiditySource: fill.source,
        pathkey: elementId,
        fromSymbol: fromNode.symbol,
        toSymbol: toNode.symbol,
        y0: 0,
        y1: 0,
        x0: 0,
        x1: 0,
        width: 0,
        gradientStart: gradient.start,
        gradientEnd: gradient.end,
      };
      links.push(link);
      currentFromNode.sourceLinks.push(link);
      hiddenNode.targetLinks.push(link);

      currentFromNode = hiddenNode;
    }

    const finalLink: LinkD3Custom = {
      source: currentFromNode,
      target: toNode,
      value: fill.proportionBps / 100,
      liquiditySource: fill.source,
      y0: 0,
      y1: 0,
      x0: 0,
      x1: 0,
      width: 0,
      pathkey: elementId,
      fromSymbol: fromNode.symbol,
      toSymbol: toNode.symbol,
      gradientStart: gradient.start,
      gradientEnd: gradient.end,
    };
    links.push(finalLink);
    currentFromNode.sourceLinks.push(finalLink);
    toNode.targetLinks.push(finalLink);
  });

  return { nodes, links, isValid };
}

export function transformRouteToSankeyLegend({ route }: { route: Route }): SourceLegendType[] {
  return Object.values(
    route.fills.reduce<Record<string, SourceLegendType>>((acc, fill) => {
      const gradient = getGradientForSource(fill.source);
      acc[fill.source] = {
        source: fill.source,
        gradient: gradient,
      };
      return acc;
    }, {}),
  );
}
