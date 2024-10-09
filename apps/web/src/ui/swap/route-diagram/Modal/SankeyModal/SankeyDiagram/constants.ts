import { nanoid } from 'nanoid';

export interface LiquiditySourceGradientValueType {
  start: string;
  end: string;
}

const defaultGradient = { start: '#999999', end: '#8f8f8f' };
const elkGradient = { start: '#1e8f5a', end: '#1b804f' };
const vVSGradient = { start: '#2f3e56', end: '#2a384e' };
const shibaSwapGradient = { start: '#f19812', end: '#d98910' };
const uniswapGradient = { start: '#f40cb4', end: '#dc0b9f' };
const apeSwapGradient = { start: '#986454', end: '#8a594b' };
const baseSwapGradient = { start: '#203bc4', end: '#1c34b0' };
const methLabGradient = { start: '#0b0b0b', end: '#090909' };
const fusionXGradient = { start: '#c4c4c4', end: '#b2b2b2' };
const alienBaseGradient = { start: '#68adfa', end: '#5e9de1' };
const thrusterGradient = { start: '#d56058', end: '#c0544e' };
const solarbeamGradient = { start: '#ed8c90', end: '#d97e82' };
const pancakeSwapGradient = { start: '#53DEE9', end: '#4bc8d2' };
const kwikswapGradient = { start: '#1f8dcc', end: '#1c7fb6' };
const dackieSwapGradient = { start: '#dce3fb', end: '#cfd6e2' };
const sushiSwapGradient = { start: '#AF74B9', end: '#9e68a6' };
const jetSwapGradient = { start: '#e3e3e3', end: '#cccccc' };
const wagmiGradient = { start: '#232827', end: '#202422' };
const dfynGradient = { start: '#fbfbfb', end: '#e2e2e2' };
const wigoswapGradient = { start: '#e5e7fc', end: '#d0d2e3' };
const swapsicleGradient = { start: '#0c1425', end: '#0a111f' };
const spookySwapGradient = { start: '#6262d5', end: '#5858c1' };
const quickSwapGradient = { start: '#e3eaf2', end: '#cdd3da' };
const glyphV4Gradient = { start: '#848484', end: '#787878' };
const cORExGradient = { start: '#dd6f20', end: '#c5621c' };
const dovishGradient = { start: '#040404', end: '#030303' };
const kinetixGradient = { start: '#fb5f1f', end: '#e0541b' };
const horizonGradient = { start: '#666bc1', end: '#5d61ae' };
const hyperBlastGradient = { start: '#f8f00c', end: '#dfd00b' };
const monoswapGradient = { start: '#67f4cc', end: '#5ddbb8' };
const zebraGradient = { start: '#eeeeee', end: '#d5d5d5' };
const kimGradient = { start: '#f94504', end: '#e03e04' };
const pangolinGradient = { start: '#e6b404', end: '#cf9f03' };
const traderJoeGradient = { start: '#ede9eb', end: '#d4d0d1' };
const dyorGradient = { start: '#2294ec', end: '#1f85d4' };
const scribeGradient = { start: '#232424', end: '#1f2020' };
const fenixGradient = { start: '#f7f7f7', end: '#dedede' };
const etherVistaGradient = { start: '#040405', end: '#030304' };
const biswapGradient = { start: '#1d80ee', end: '#1a73d5' };
const bladeSwapGradient = { start: '#b2a48d', end: '#a39580' };
const agniGradient = { start: '#f9bfb0', end: '#dea99b' };


const gradientPool = [
  defaultGradient,
  elkGradient,
  vVSGradient,
  shibaSwapGradient,
  uniswapGradient,
  apeSwapGradient,
  baseSwapGradient,
  methLabGradient,
  fusionXGradient,
  alienBaseGradient,
  thrusterGradient,
  solarbeamGradient,
  pancakeSwapGradient,
  kwikswapGradient,
  dackieSwapGradient,
  sushiSwapGradient,
  jetSwapGradient,
  wagmiGradient,
  dfynGradient,
  wigoswapGradient,
  swapsicleGradient,
  spookySwapGradient,
  quickSwapGradient,
  glyphV4Gradient,
  cORExGradient,
  dovishGradient,
  kinetixGradient,
  horizonGradient,
  hyperBlastGradient,
  monoswapGradient,
  zebraGradient,
  kimGradient,
  pangolinGradient,
  traderJoeGradient,
  dyorGradient,
  scribeGradient,
  fenixGradient,
  etherVistaGradient,
  biswapGradient,
  bladeSwapGradient,
  agniGradient,
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


/**
 * Mapping of source to gradient color for the Sankey diagram links & legend.
 * */
export const SourceGradients: Record<string, LiquiditySourceGradientValueType> = {
  'PancakeSwapV2': pancakeSwapGradient,
  'PancakeSwapV3': pancakeSwapGradient,
  'Biswap': biswapGradient,
  'CroDefiSwap': defaultGradient,
  'Swapsicle': swapsicleGradient,
  'BlastDEX': defaultGradient,
  'FusionXV2': fusionXGradient,
  'BaseSwap': baseSwapGradient,
  'SushiSwapV3': sushiSwapGradient,
  'Solarbeam': solarbeamGradient,
  'MonoswapV3': monoswapGradient,
  'Fenix': fenixGradient,
  'DackieSwapV2': dackieSwapGradient,
  'GlyphV4': glyphV4Gradient,
  'UniswapV2': uniswapGradient,
  'SushiSwapV2': sushiSwapGradient,
  'Wagmi': wagmiGradient,
  'ZebraV2': zebraGradient,
  'FusionXV3': fusionXGradient,
  'Kwikswap': kwikswapGradient,
  'SpookySwap': spookySwapGradient,
  'Pangolin': pangolinGradient,
  'HyperBlast': hyperBlastGradient,
  'KimV4': kimGradient,
  'TraderJoe': traderJoeGradient,
  'SilverSwap': defaultGradient,
  'Dfyn': dfynGradient,
  'AlienBaseV2': alienBaseGradient,
  'Scribe': scribeGradient,
  'RingExchangeV2': defaultGradient,
  'VVSStandard': vVSGradient,
  'VVSFlawless': vVSGradient,
  'KinetixV2': kinetixGradient,
  'ThrusterV3': thrusterGradient,
  'EtherVista': etherVistaGradient,
  'UniswapV3': uniswapGradient,
  'RingExchangeV3': defaultGradient,
  'COREx': cORExGradient,
  'MonoswapV2': monoswapGradient,
  'Elk': elkGradient,
  'ThrusterV2': thrusterGradient,
  'KinetixV3': kinetixGradient,
  'Wigoswap': wigoswapGradient,
  'MethLab': methLabGradient,
  'JetSwap': jetSwapGradient,
  'ShibaSwap': shibaSwapGradient,
  'QuickSwap': quickSwapGradient,
  'DovishV3': dovishGradient,
  'SwapBlast': defaultGradient,
  'DackieSwapV3': dackieSwapGradient,
  'Horizon': horizonGradient,
  'Agni': agniGradient,
  'BladeSwap': bladeSwapGradient,
  'AlienBaseV3': alienBaseGradient,
  'BaseSwapV3': baseSwapGradient,
  'ApeSwap': apeSwapGradient,
  'DyorV2': dyorGradient,
};
