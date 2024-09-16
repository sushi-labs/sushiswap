import { ChainId, LiquidityProviders } from 'sushi'
import { PANCAKESWAP_V3_FEE_SPACING_MAP } from 'sushi/config'
import { Address, Hex } from 'viem'

const DACKIESWAP_V2_SUPPORTED_CHAIN_IDS = [
  ChainId.BASE,
  ChainId.OPTIMISM,
  ChainId.ARBITRUM,
  ChainId.BLAST,
  // ChainId.INEVM,
  // ChainId.MODE,
  // ChainId.XLAYER,
  ChainId.LINEA,
  // ChainId.SCROLL, T.B.D
  // ChainId.VICTION, T.B.D
  // ChainId.MANTLE, T.B.D
] as const
type DackieSwapV2ChainId = (typeof DACKIESWAP_V2_SUPPORTED_CHAIN_IDS)[number]
const DACKIESWAP_V2_FACTORY_ADDRESS: Record<DackieSwapV2ChainId, Address> = {
  [ChainId.BASE]: '0x591f122D1df761E616c13d265006fcbf4c6d6551',
  [ChainId.OPTIMISM]: '0xaEdc38bD52b0380b2Af4980948925734fD54FbF4',
  [ChainId.ARBITRUM]: '0x507940c2469e6E3B33032F1d4FF8d123BDDe2f5C',
  [ChainId.BLAST]: '0xF5190E64dB4cbf7ee5E72B55cC5b2297e20264c2',
  // [ChainId.INEVM]: '0x507940c2469e6E3B33032F1d4FF8d123BDDe2f5C',
  // [ChainId.MODE]: '0x757cD583004400ee67e5cC3c7A60C6a62E3F6d30',
  // [ChainId.XLAYER]: '0x757cD583004400ee67e5cC3c7A60C6a62E3F6d30',
  [ChainId.LINEA]: '0x9790713770039CeFcf4FAaf076E2846c9B7a4630',
  // [ChainId.SCROLL]: '', T.B.D
  // [ChainId.VICTION]: '', T.B.D
  // [ChainId.MANTLE]: '', T.B.D
} as const
const DACKIESWAP_V2_INIT_CODE_HASH: Record<DackieSwapV2ChainId, Hex> = {
  [ChainId.BASE]:
    '0xaaaacde43ad77b69fcbcdc68ccb757c3c634ad20e330a951b4a267f1180c6520',
  [ChainId.OPTIMISM]:
    '0x6583f40d4a27d36b2f66ec686363a3fc9a3b0f4d748e788cd6e8e2773e4ee898',
  [ChainId.ARBITRUM]:
    '0x6583f40d4a27d36b2f66ec686363a3fc9a3b0f4d748e788cd6e8e2773e4ee898',
  [ChainId.BLAST]:
    '0x08b78b4ee8893b0d52edf9be019ea4e261e38b8eb1e0d7be8940645e8f95aa28',
  // [ChainId.INEVM]: '0x6583f40d4a27d36b2f66ec686363a3fc9a3b0f4d748e788cd6e8e2773e4ee898',
  // [ChainId.MODE]: '0x6583f40d4a27d36b2f66ec686363a3fc9a3b0f4d748e788cd6e8e2773e4ee898',
  // [ChainId.XLAYER]: '0x6583f40d4a27d36b2f66ec686363a3fc9a3b0f4d748e788cd6e8e2773e4ee898',
  [ChainId.LINEA]:
    '0x6583f40d4a27d36b2f66ec686363a3fc9a3b0f4d748e788cd6e8e2773e4ee898',
  // [ChainId.SCROLL]: '', T.B.D
  // [ChainId.VICTION]: '', T.B.D
  // [ChainId.MANTLE]: '', T.B.D
} as const
export function dackieSwapV2Factory(chainId: DackieSwapV2ChainId) {
  return {
    address: DACKIESWAP_V2_FACTORY_ADDRESS[chainId],
    provider: LiquidityProviders.DackieSwapV2,
    initCodeHash: DACKIESWAP_V2_INIT_CODE_HASH[chainId],
    fee: 0.0025,
  } as const
}

const V3_SUPPORTED_CHAIN_IDS = [
  ChainId.BASE,
  ChainId.OPTIMISM,
  ChainId.ARBITRUM,
  ChainId.BLAST,
  // ChainId.INEVM,
  // ChainId.MODE,
  // ChainId.XLAYER,
  ChainId.LINEA,
  // ChainId.SCROLL, T.B.D
  // ChainId.VICTION, T.B.D
  // ChainId.MANTLE, T.B.D
] as const
type V3ChainId = (typeof V3_SUPPORTED_CHAIN_IDS)[number]
const V3_FACTORY_ADDRESS: Record<V3ChainId, Address> = {
  [ChainId.BASE]: '0x3D237AC6D2f425D2E890Cc99198818cc1FA48870',
  [ChainId.OPTIMISM]: '0xc2BC7A73613B9bD5F373FE10B55C59a69F4D617B',
  [ChainId.ARBITRUM]: '0xaEdc38bD52b0380b2Af4980948925734fD54FbF4',
  [ChainId.BLAST]: '0xd1575B2e0C82fba9Eddc3de9c9AAF923AFA670cC',
  // [ChainId.INEVM]: '0xf79A36F6f440392C63AD61252a64d5d3C43F860D',
  // [ChainId.MODE]: '0xc6f3966E5D08Ced98aC30f8B65BeAB5882Be54C7',
  // [ChainId.XLAYER]: '0xc6f3966E5D08Ced98aC30f8B65BeAB5882Be54C7',
  [ChainId.LINEA]: '0xc6255ec7CDb11C890d02EBfE77825976457B2470',
  // [ChainId.SCROLL]: '', T.B.D
  // [ChainId.VICTION]: '', T.B.D
  // [ChainId.MANTLE]: '', T.B.D
} as const
const V3_DEPLOYER_ADDRESS: Record<V3ChainId, Address> = {
  [ChainId.BASE]: '0x4f205D69834f9B101b9289F7AFFAc9B77B3fF9b7',
  [ChainId.OPTIMISM]: '0xa466ebCfa58848Feb6D8022081f1C21a884889bB',
  [ChainId.ARBITRUM]: '0xf79A36F6f440392C63AD61252a64d5d3C43F860D',
  [ChainId.BLAST]: '0x6510E68561F04C1d111e616750DaC2a063FF5055',
  // [ChainId.INEVM]: '0xB9010964301326160173da694c0697a2FcE82F39',
  // [ChainId.MODE]: '0xE4EFb979968AE4B85a166E5e083f7B166e70Fe20',
  // [ChainId.XLAYER]: '0xE4EFb979968AE4B85a166E5e083f7B166e70Fe20',
  [ChainId.LINEA]: '0x46B22CD275967DDf055A567E7f36EC89eE3F1139',
  // [ChainId.SCROLL]: '', T.B.D
  // [ChainId.VICTION]: '', T.B.D
  // [ChainId.MANTLE]: '', T.B.D
} as const
const V3_INIT_CODE_HASH: Record<V3ChainId, Hex> = {
  [ChainId.BASE]:
    '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
  [ChainId.OPTIMISM]:
    '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
  [ChainId.ARBITRUM]:
    '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2', // might not be right, couldn't verify
  [ChainId.BLAST]:
    '0x9173e4373ab542649f2f059b10eaab2181ad82cc2e70cf51cf9d9fa8a144a2af',
  // [ChainId.INEVM]: '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
  // [ChainId.MODE]: '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
  // [ChainId.XLAYER]: '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
  [ChainId.LINEA]:
    '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
  // [ChainId.SCROLL]: '', T.B.D
  // [ChainId.VICTION]: '', T.B.D
  // [ChainId.MANTLE]: '', T.B.D
} as const
export function dackieSwapV3Factory(chainId: V3ChainId) {
  return {
    address: V3_FACTORY_ADDRESS[chainId],
    provider: LiquidityProviders.DackieSwapV3,
    initCodeHash: V3_INIT_CODE_HASH[chainId],
    deployer: V3_DEPLOYER_ADDRESS[chainId],
    feeSpacingMap: PANCAKESWAP_V3_FEE_SPACING_MAP,
  } as const
}
// PoolAddress
