import { nanoid } from "nanoid";
// NOTE: leaving previous solutions in place as reference until they are replaced

export interface LiquiditySourceGradientValueType {
  start: string;
  end: string;
}

// TODO: sushi team will provide a system for colors
const color1 = "#DB40E9";
const color2 = "#9A4EFC";
const color3 = "#53CADA";
const color4 = "#38B159";
const color5 = "#00B3B2";
const color6 = "#009DE6";
const color7 = "#FE8A49";
const color8 = "#EF4B4B";
const color9 = "#6FCFF8";
const color10 = "#4B8DEF";
const color11 = "#514B78";
const color12 = "#5E666F";
const color13 = "#c2c2c2";

const colorPool = [
  color1,
  color2,
  color3,
  color4,
  color5,
  color6,
  color7,
  color8,
  color9,
  color10,
  color11,
  color12,
];

const sourceGradients: Map<string, string> = new Map();

// TODO: sushi team will provide a system for images
export const RouteSourceToImageName: Record<string, string> = {
  "0x_RFQ": "0x",
  AerodromeV2: "aerodrome",
  AerodromeV3: "aerodrome",
  AlienBaseStable: "alienbase",
  AlienBaseV2: "alienbase",
  AlienBaseV3: "alienbase",
  Ambient: "ambient",
  BalancerV1: "balancer",
  BalancerV2: "balancer",
  BancorV3: "bancor",
  BaseSwap: "baseswap",
  BaseX: "basex",
  CamelotV2: "camelot",
  CamelotV3: "camelot",
  Curve: "curve",
  DODOV1: "dodo",
  DODOV2: "dodo",
  FraxswapV2: "fraxswap",
  GMXV1: "gmx",
  Infusion: "infusion",
  Integral: "integral",
  Lido: "lido",
  MakerPSM: "maker",
  Maverick: "maverick",
  Morphex: "morphex",
  Origin: "origin",
  Overnight: "overnight",
  PancakeSwapV2: "pancakeswap",
  PancakeSwapV3: "pancakeswap",
  Pangolin: "pangolin",
  PharaohCL: "pharaoh",
  QuickSwapV2: "quickswap",
  QuickSwapV3: "quickswap",
  RamsesV2: "ramses",
  Retro: "retro",
  RocketPool: "rocketpool",
  ShibaSwap: "shibaswap",
  SolidlyV3: "solidly",
  SushiSwapV2: "sushiswap",
  SushiSwapV3: "sushiswap",
  Synapse: "synapse",
  Thena: "thena",
  TraderJoeV1: "traderjoe",
  "TraderJoeV2.1": "traderjoe",
  UniswapV2: "uniswap",
  UniswapV3: "uniswap",
  VelodromeV2: "velodrome",
  VelodromeV3: "velodrome",
  WOOFiV2: "woofi",
};

// TODO: sushi team will provide a system for colors
export const SourceColors: Record<string, string> = {
  "0x_RFQ": color11,
  AerodromeV2: color2,
  AerodromeV3: color2,
  AlienBaseStable: color2,
  AlienBaseV2: color2,
  AlienBaseV3: color2,
  Ambient: color11,
  BalancerV1: color11,
  BalancerV2: color11,
  BancorV3: color11,
  BaseSwap: color10,
  BaseX: color10,
  CamelotV2: color11,
  CamelotV3: color11,
  DODOV1: color8,
  DODOV2: color8,
  FraxswapV2: color11,
  GMXV1: color6,
  Infusion: color11,
  Integral: color12,
  Lido: color5,
  MakerPSM: color4,
  Maverick: color4,
  Morphex: color2,
  Origin: color4,
  Overnight: color3,
  PancakeSwapV2: color3,
  PancakeSwapV3: color3,
  Pangolin: color1,
  PharaohCL: color8,
  QuickSwapV2: color2,
  QuickSwapV3: color2,
  RamsesV2: color11,
  Retro: color9,
  RocketPool: color2,
  ShibaSwap: color6,
  SolidlyV3: color11,
  SushiSwapV2: color2,
  SushiSwapV3: color7,
  Synapse: color1,
  Thena: color7,
  TraderJoeV1: color5,
  "TraderJoeV2.1": color2,
  UniswapV2: color1,
  UniswapV3: color1,
  VelodromeV2: color11,
  VelodromeV3: color11,
  WOOFi_V2: color6,
  __default__: color12,
  Wrap: color13,
};

// TODO: sushi team will provide a system for colors
export function getColorForSource(liquiditySource: string): string {
  if (liquiditySource in SourceColors) {
    return SourceColors[liquiditySource];
  }
  if (sourceGradients.has(liquiditySource)) {
    return sourceGradients.get(liquiditySource)!;
  }
  const index = Array.from(nanoid(2)).reduce((acc, char) => acc + char.charCodeAt(0), 0) % colorPool.length;
  const newGradient = colorPool[index];
  sourceGradients.set(liquiditySource, newGradient);
  
  return newGradient;
}

// TODO: sushi team will provide a system for images
export function getImageForSource(liquiditySource: string): string {
  const imageName = RouteSourceToImageName[liquiditySource] ?? "default";

  const src = `/images/liquidity-providers/${imageName}.png`;

  return src;
}


export function roundToNearestHalf(value: number): number {
  return Math.round(value * 2) / 2;
}


