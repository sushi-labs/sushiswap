import { LiquiditySourceGradientValueType } from "./Modal/SankeyModal/SankeyDiagram/constants";

export interface PoolRoute {
  poolFee: number;
  liquidityProvider: string;
  tokenFrom: number;
  tokenTo: number;
  share: number;
  poolAddress: string;
  poolType: string;
  poolName: string;
  assumedAmountIn: string;
  assumedAmountOut: string;
}

export interface SourceLegendType {

  source: string,
  gradient: LiquiditySourceGradientValueType,

}
export interface Route {
  /** Details of each segment that routes the swap through. These translate to the edges/links in the sankey diagram. */
  fills: Fill[];
  /** Properties of the tokens involved in the swap. These translate to nodes in the sankey diagram */
  tokens: Token[];
}

export interface Fill {
  /** The contract address of the input token */
  from: string;
  /**  The contract address of the output token */
  to: string;
  /** The liquidity source used in the route */
  source: string;
  /**
   * The percentage of the fill represented as basis points (bps).
   * 1 bps = 0.01%.
   *
   * The proportionBps for each fill step doesn't need to add up to 10000 (100%).
   * Instead, the proportionBps for each fill step represents the relative size
   * of that fill compared to the total trade size.
   *
   * For example, if a fill step has a proportionBps of 5000 (50%), it means that
   * the notional value (size) of that fill is 50% of the total trade size.
   */
  proportionBps: number;
}

export interface Token {
  /** The token address. This is the unique identifier of the token */
  address: string;
  /** The token symbol. This is not guaranteed to be unique, as multiple tokens can have the same symbol */
  symbol: string;
}
export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
}

export interface SubRoute {
  sourceLink: LinkD3Custom;
  value: number;
  liquiditySource: string;
}

export interface NodeD3Custom {
  id: string | number;
  sourceLinks: LinkD3Custom[];
  targetLinks: LinkD3Custom[];
  index: number;
  symbol: string;
  logoUrl: string;

  height: number;

  x0: number;
  x1: number;
  y0: number;
  y1: number;

  hide: boolean;
  pathkey?: string;
  depth: number;
}

export interface LinkD3Custom {
  source: NodeD3Custom;
  target: NodeD3Custom;
  value: number;

  liquiditySource: string;
  pathkey: string;

  fromSymbol: string;
  toSymbol: string;

  y0: number;
  y1: number;
  x0: number;
  x1: number;
  width: number;

  gradientStart: string;
  gradientEnd: string;
}

export interface LiquidityProivderLegendType {
  source: string;
  color: string;
}
