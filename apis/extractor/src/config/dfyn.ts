import { ChainId, LiquidityProviders } from 'sushi'
import { Address, Hex } from 'viem'

const DFYN_V2_SUPPORTED_CHAIN_IDS = [
  ChainId.POLYGON,
  ChainId.OKEX,
  ChainId.FANTOM,
  ChainId.ARBITRUM,
] as const
type DfynV2ChainId = (typeof DFYN_V2_SUPPORTED_CHAIN_IDS)[number]
const DFYN_V2_FACTORY_ADDRESS: Record<DfynV2ChainId, Address> = {
  [ChainId.POLYGON]: '0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B',
  [ChainId.OKEX]: '0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B',
  [ChainId.FANTOM]: '0xd9820a17053d6314B20642E465a84Bf01a3D64f5',
  [ChainId.ARBITRUM]: '0xA102072A4C07F06EC3B4900FDC4C7B80b6c57429',
} as const
const DFYN_V2_INIT_CODE_HASH: Record<DfynV2ChainId, Hex> = {
  [ChainId.POLYGON]:
    '0xf187ed688403aa4f7acfada758d8d53698753b998a3071b06f1b777f4330eaf3',
  [ChainId.OKEX]:
    '0xd9fecb0a9f5bfd6ce2daf90b441ed5860c3fed2fcde57ba9819eb98d2422e418',
  [ChainId.FANTOM]:
    '0xd3ab2c392f54feb4b3b2a677f449b133c188ad2f1015eff3e94ea9315282c5f5',
  [ChainId.ARBITRUM]:
    '0xd49917af2b31d70ba7bea89230a93b55d3b6a99aacd03a72c288dfe524ec2f36',
} as const
export function dfynV2Factory(chainId: DfynV2ChainId) {
  return {
    address: DFYN_V2_FACTORY_ADDRESS[chainId],
    provider: LiquidityProviders.Dfyn,
    initCodeHash: DFYN_V2_INIT_CODE_HASH[chainId],
    fee: 0.003,
  } as const
}
