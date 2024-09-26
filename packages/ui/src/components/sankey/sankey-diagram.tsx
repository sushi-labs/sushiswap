"use client";

import { useEffect, useState } from "react";
import { D3Sankey } from "./d3-sankey";
import { getColorForSource } from "./utils";
import { roundToNearestHalf } from "./utils";
import { SankeyLink, SankeyNode } from "d3-sankey";
import { ChainId } from "sushi/chain";
import { Legend } from "./legend";

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
}
interface Step {
  tokenFrom: number;
  tokenTo: number;
  share: number;
  poolName: string;
}

export interface CustomLink {
  source: string | number;
  target: string | number;
  value: number;
  poolName: string;
  sharePercentage: string;
}

export interface CustomNode {
  id: string;
  name: string;
  value: number;
}

export type Link = SankeyLink<CustomNode, CustomLink>;
export type Node = SankeyNode<CustomNode, CustomLink>;

interface SankeyDiagramProps {
  swap: {
    route: Step[];
    tokens: Token[];
  };
  chainId: ChainId;
}

export const SankeyDiagram = ({ swap, chainId }: SankeyDiagramProps) => {
  const [preparedNodes, setPreparedNodes] = useState<Node[]>([]);
  const [preparedLinks, setPreparedLinks] = useState<Link[]>([]);
  const [liquidityProviders, setLiquidityProviders] = useState<string[]>([]);

  const prepareNodes = (tokens: Token[], tokenMap: Map<string, string>) => {
    const cumulativeShares = new Map<string, number>();
    const nodes: Node[] = tokens.map((token) => {
      const symbol = tokenMap.get(token.address) ?? "Unknown";
      cumulativeShares.set(symbol, 0);

      return {
        id: symbol,
        name: symbol,
        value: 0,
      };
    });
    return { nodes, cumulativeShares };
  };

  const prepareLinks = (
    route: Step[],
    tokens: Token[],
    tokenMap: Map<string, string>,
    cumulativeShares: Map<string, number>
  ) => {
    const links: Link[] = [];
    const startSymbol = tokenMap.get(tokens[route[0].tokenFrom].address) ?? "Unknown";
    cumulativeShares.set(startSymbol, 1);

    route.forEach((step) => {
      const fromSymbol = tokenMap.get(tokens[step.tokenFrom].address) ?? "Unknown";
      const toSymbol = tokenMap.get(tokens[step.tokenTo].address) ?? "Unknown";
      const share = step.share;

      const sourceCumulativeShare = cumulativeShares.get(fromSymbol) || 0;
      const addedShare = sourceCumulativeShare * share;
      const newCumulativeShare = (cumulativeShares.get(toSymbol) || 0) + addedShare;
      cumulativeShares.set(toSymbol, newCumulativeShare);

      const shortPoolName = step.poolName.split(" ")[0];
      setLiquidityProviders((prevProviders) => {
        if (prevProviders.includes(shortPoolName)) return prevProviders;
        return [...prevProviders, shortPoolName];
      });

      const rawSharePercentage = share * 100;
      const roundedSharePercentage = roundToNearestHalf(rawSharePercentage);

      links.push({
        source: fromSymbol,
        target: toSymbol,
        value: addedShare,
        poolName: step.poolName,
        sharePercentage: roundedSharePercentage.toString(),
      });
    });

    return links;
  };

  useEffect(() => {
    const { route, tokens } = swap;

    const tokenMap = new Map(tokens.map((token) => [token.address, token.symbol]));

    // Create nodes and cumulativeShares map
    const { nodes, cumulativeShares } = prepareNodes(tokens, tokenMap);

    // Create links
    const links = prepareLinks(route, tokens, tokenMap, cumulativeShares);

    // Update node values based on cumulative shares
    nodes.forEach((node) => {
      node.value = cumulativeShares.get(node.name) || 0;
    });

    setPreparedNodes(nodes);
    setPreparedLinks(links);
  }, [swap]);

  return (
    <div className='flex-col flex justify-center w-[95%]'>
      <div className='rounded-lg border-2 border-[#E5E5E5] overflow-hidden md:p-3 p-2 w-full'>
        {preparedNodes.length > 0 && preparedLinks.length > 0 && (
          <D3Sankey
            data={{
              nodes: preparedNodes,
              links: preparedLinks,
              tokens: swap.tokens,
            }}
            chainId={chainId}
          />
        )}
      </div>
      <Legend liquidityProviders={liquidityProviders} />
    </div>
  );
};



