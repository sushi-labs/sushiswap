import { nanoid } from 'nanoid';

export interface LiquiditySourceGradientValueType {
  start: string;
  end: string;
}

const gradient1 = { start: '#DB40E9', end: '#9A4EFC' };
const gradient2 = { start: '#53CADA', end: '#38B159' };
const gradient3 = { start: '#00B3B2', end: '#009DE6' };
const gradient4 = { start: '#53CADA', end: '#38B17E' };
const gradient5 = { start: '#FE8A49', end: '#EF4B4B' };
const gradient6 = { start: '#6FCFF8', end: '#4B8DEF' };
const gradient7 = { start: '#E9409B', end: '#E34EFC' };
const gradient8 = { start: '#F3E779', end: '#EFAD4B' };
const gradient9 = { start: '#FF6489', end: '#FD6D5A' };
const gradient10 = { start: '#202AD0', end: '#1565C2' };
const gradient11 = { start: '#514B78', end: '#5E666F' };
const gradient12 = { start: '#676767', end: '#7C7C7C' };

const gradientPool = [
  gradient1,
  gradient2,
  gradient3,
  gradient4,
  gradient5,
  gradient6,
  gradient7,
  gradient8,
  gradient9,
  gradient10,
  gradient11,
  gradient12,
];
const sourceGradients: Map<string, LiquiditySourceGradientValueType> = new Map();

/**
 * Retrieves or assigns a gradient for a given liquidity source.
 * This function ensures that the same source always gets the same gradient, per session.
 */
export function getGradientForSource(liquiditySource: string): LiquiditySourceGradientValueType {
  if (liquiditySource in SourceGradients) {
    return SourceGradients[liquiditySource];
  }
  if (sourceGradients.has(liquiditySource)) {
    return sourceGradients.get(liquiditySource)!;
  }
  const index =
    Array.from(nanoid(2)).reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradientPool.length;
  const newGradient = gradientPool[index];
  sourceGradients.set(liquiditySource, newGradient);
  return newGradient;
}

/**
 * Mapping of source to image name for the Sankey diagram tooltips.
 */
export const RouteSourceToImageName: Record<string, string> = {
  '0x_RFQ': '0x',
  'Aerodrome_V2': 'aerodrome',
  'Aerodrome_V3': 'aerodrome',
  'AlienBase_Stable': 'alienbase',
  'AlienBase_V2': 'alienbase',
  'AlienBase_V3': 'alienbase',
  'Ambient': 'ambient',
  'Balancer_V1': 'balancer',
  'Balancer_V2': 'balancer',
  'Bancor_V3': 'bancor',
  'BaseSwap': 'baseswap',
  'BaseX': 'basex',
  'Camelot_V2': 'camelot',
  'Camelot_V3': 'camelot',
  'Curve': 'curve',
  'DODO_V1': 'dodo',
  'DODO_V2': 'dodo',
  'Fraxswap_V2': 'fraxswap',
  'GMX_V1': 'gmx',
  'Infusion': 'infusion',
  'Integral': 'integral',
  'Lido': 'lido',
  'Maker_PSM': 'maker',
  'Maverick': 'maverick',
  'Morphex': 'morphex',
  'Origin': 'origin',
  'Overnight': 'overnight',
  'PancakeSwap_V2': 'pancakeswap',
  'PancakeSwap_V3': 'pancakeswap',
  'Pangolin': 'pangolin',
  'Pharaoh_CL': 'pharaoh',
  'QuickSwap_V2': 'quickswap',
  'QuickSwap_V3': 'quickswap',
  'Ramses_V2': 'ramses',
  'Retro': 'retro',
  'RocketPool': 'rocketpool',
  'ShibaSwap': 'shibaswap',
  'Solidly_V3': 'solidly',
  'SushiSwap': 'sushiswap',
  'SushiSwap_V3': 'sushiswap',
  'Synapse': 'synapse',
  'Thena': 'thena',
  'TraderJoe_V1': 'traderjoe',
  'TraderJoe_V2.1': 'traderjoe',
  'Uniswap_V2': 'uniswap',
  'Uniswap_V3': 'uniswapv3',
  'Velodrome_V2': 'velodrome',
  'Velodrome_V3': 'velodrome',
  'WOOFi_V2': 'woofi',
};

/**
 * Mapping of source to gradient color for the Sankey diagram links & legend.
 * */
export const SourceGradients: Record<string, LiquiditySourceGradientValueType> = {
  '0x_RFQ': gradient11,
  'Aerodrome_V2': gradient2,
  'Aerodrome_V3': gradient2,
  'AlienBase_Stable': gradient2,
  'AlienBase_V2': gradient2,
  'AlienBase_V3': gradient2,
  'Ambient': gradient11,
  'Balancer_V1': gradient11,
  'Balancer_V2': gradient11,
  'Bancor_V3': gradient11,
  'BaseSwap': gradient10,
  'BaseX': gradient10,
  'Camelot_V2': gradient11,
  'Camelot_V3': gradient11,
  'Curve': gradient10,
  'DODO_V1': gradient8,
  'DODO_V2': gradient8,
  'Fraxswap_V2': gradient11,
  'GMX_V1': gradient6,
  'Infusion': gradient11,
  'Integral': gradient1,
  'Lido': gradient5,
  'Maker_PSM': gradient4,
  'Maverick': gradient4,
  'Morphex': gradient2,
  'Origin': gradient4,
  'Overnight': gradient3,
  'PancakeSwap_V2': gradient3,
  'PancakeSwap_V3': gradient3,
  'Pangolin': gradient1,
  'Pharaoh_CL': gradient8,
  'QuickSwap_V2': gradient2,
  'QuickSwap_V3': gradient2,
  'Ramses_V2': gradient11,
  'Retro': gradient9,
  'RocketPool': gradient2,
  'ShibaSwap': gradient6,
  'Solidly_V3': gradient11,
  'SushiSwap': gradient2,
  'SushiSwap_V3': gradient7,
  'Synapse': gradient1,
  'Thena': gradient7,
  'TraderJoe_V1': gradient5,
  'TraderJoe_V2.1': gradient2,
  'Uniswap_V2': gradient1,
  'Uniswap_V3': gradient1,
  'Velodrome_V2': gradient11,
  'Velodrome_V3': gradient11,
  'WOOFi_V2': gradient6,
  '__default__': gradient12,
};
