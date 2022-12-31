import bentoBoxExports from '@sushiswap/bentobox/exports.json'
import { ChainId } from '@sushiswap/chain'

// TODO: Generate from exports will full type safety
// import { z } from 'zod'
// const schema = z.object({
//   [z.string()]: z.array(
//     z.object({
//       chainId: z.string(),
//       name: z.string(),
//       contracts: z.object({
//         [z.string()]: z.object({
//           address: z.string(),
//           abi: z.array(z.unknown()),
//           linkedData: z.unknown(),
//         }),
//       }),
//     })
//   ),
// })

// const { chainId } = schema.parse(request.query)

export type BentoBoxChainId = keyof typeof bentoBoxExports | number

// TODO: Generate from exports will full type safety
export const BENTOBOX_ADDRESS: Partial<Record<BentoBoxChainId, `0x${string}`>> = {
  [ChainId.ETHEREUM]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.GÖRLI]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.FANTOM]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.POLYGON]: '0x0319000133d3AdA02600f0875d2cf03D442C3367',
  [ChainId.POLYGON_TESTNET]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.GNOSIS]: '0xE2d7F5dd869Fc7c126D21b13a9080e75a4bDb324',
  [ChainId.BSC]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.BSC_TESTNET]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.ARBITRUM]: '0x74c764D41B77DBbb4fe771daB1939B00b146894A',
  [ChainId.AVALANCHE]: '0x0711B6026068f736bae6B213031fCE978D48E026',
  [ChainId.HECO]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.CELO]: '0x0711B6026068f736bae6B213031fCE978D48E026',
  [ChainId.HARMONY]: '0xA28cfF72b04f83A7E3f912e6ad34d5537708a2C2',
  [ChainId.MOONBEAM]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
  [ChainId.MOONRIVER]: '0x145d82bCa93cCa2AE057D1c6f26245d1b9522E6F',
  [ChainId.OPTIMISM]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  [ChainId.KAVA]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  [ChainId.METIS]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  [ChainId.BTTC]: '0x8dacffa7F69Ce572992132697252E16254225D38',
} as const

export const STABLE_POOL_FACTORY_ADDRESS: Partial<Record<BentoBoxChainId, `0x${string}`>> = {
  [ChainId.METIS]: '0x2f686751b19a9d91cc3d57d90150Bc767f050066',
  [ChainId.KAVA]: '0x9B3fF703FA9C8B467F5886d7b61E61ba07a9b51c',
  [ChainId.POLYGON]: '0x2A0Caa28331bC6a18FF195f06694f90671dE70f2',
  [ChainId.OPTIMISM]: '0x827179dD56d07A7eeA32e3873493835da2866976',
  [ChainId.BTTC]: '0x120140d0c1EBC938befc84840575EcDc5fE55aFe',
  [ChainId.ARBITRUM]: '0xc2fB256ABa36852DCcEA92181eC6b355f09A0288',
  [ChainId.AVALANCHE]: '0x7770978eED668a3ba661d51a773d3a992Fc9DDCB',
  [ChainId.BSC]: '0xA4C0363edD74F55AC8f316a3Bf447F8aa09607D3',
} as const

export const CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS: Partial<Record<BentoBoxChainId, `0x${string}`>> = {
  [ChainId.OPTIMISM]: '0x93395129bd3fcf49d95730D3C2737c17990fF328',
  [ChainId.POLYGON]: '0x28890e3C0aA9B4b48b1a716f46C9abc9B12abfab',
  [ChainId.METIS]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  [ChainId.KAVA]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  [ChainId.BTTC]: '0x752Dc00ABa9c930c84aC81D288dB5E2a02Afe633',
  [ChainId.ARBITRUM]: '0xc79Ae87E9f55761c08e346B98dDdf070C9872787',
  [ChainId.AVALANCHE]: '0xb84a043bc4fCA97B7a74eD7dAaB1Bf12A8DF929F',
  [ChainId.BSC]: '0x3D2f8ae0344d38525d2AE96Ab750B83480c0844F',
} as const

export { addressMapToTokenMap } from './addressMapToTokenMap'
