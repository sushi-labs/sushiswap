import { ChainId } from '@sushiswap/chain'

import { Token } from './Token'

export type TokenMap = Record<number | string, Token>
export type AddressMap = Record<number | string, string>

export const USDC_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.RINKEBY]: '0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4',
  [ChainId.ROPSTEN]: '0x0D9C8723B343A8368BebE0B5E89273fF8D712e3C',
  [ChainId.KOVAN]: '0xb7a4F3E9097C08dA09517b5aB877F7a917224ede',
  [ChainId.POLYGON]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  [ChainId.POLYGON_TESTNET]: '0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7',
  [ChainId.FANTOM]: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  [ChainId.BSC]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  [ChainId.HARMONY]: '0x985458E523dB3d53125813eD68c274899e9DfAb4',
  [ChainId.HECO]: '0x9362Bbef4B8313A8Aa9f0c9808B80577Aa26B73B',
  [ChainId.OKEX]: '0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85',
  [ChainId.GNOSIS]: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
  [ChainId.ARBITRUM]: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  [ChainId.AVALANCHE]: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
  [ChainId.MOONRIVER]: '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D',
  [ChainId.CELO]: '0xef4229c8c3250C675F21BCefa42f58EfbfF6002a',
  [ChainId.TELOS]: '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b',
  [ChainId.FUSE]: '0x620fd5fa44BE6af63715Ef4E65DDFA0387aD13F5',
  [ChainId.MOONBEAM]: '0x8f552a71EFE5eeFc207Bf75485b356A0b3f01eC9',
  [ChainId.OPTIMISM]: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
}

export const USDC: Record<keyof typeof USDC_ADDRESS, Token> = {
  [ChainId.ETHEREUM]: new Token({
    chainId: ChainId.ETHEREUM,
    address: USDC_ADDRESS[ChainId.ETHEREUM],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.ROPSTEN]: new Token({
    chainId: ChainId.ROPSTEN,
    address: USDC_ADDRESS[ChainId.ROPSTEN],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.RINKEBY]: new Token({
    chainId: ChainId.RINKEBY,
    address: USDC_ADDRESS[ChainId.RINKEBY],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.KOVAN]: new Token({
    chainId: ChainId.KOVAN,
    address: USDC_ADDRESS[ChainId.KOVAN],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.POLYGON]: new Token({
    chainId: ChainId.POLYGON,
    address: USDC_ADDRESS[ChainId.POLYGON],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.POLYGON_TESTNET]: new Token({
    chainId: ChainId.POLYGON_TESTNET,
    address: USDC_ADDRESS[ChainId.POLYGON_TESTNET],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.FANTOM]: new Token({
    chainId: ChainId.FANTOM,
    address: USDC_ADDRESS[ChainId.FANTOM],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.BSC]: new Token({
    chainId: ChainId.BSC,
    address: USDC_ADDRESS[ChainId.BSC],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.HARMONY]: new Token({
    chainId: ChainId.HARMONY,
    address: USDC_ADDRESS[ChainId.HARMONY],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.HECO]: new Token({
    chainId: ChainId.HECO,
    address: USDC_ADDRESS[ChainId.HECO],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.OKEX]: new Token({
    chainId: ChainId.OKEX,
    address: USDC_ADDRESS[ChainId.OKEX],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.GNOSIS]: new Token({
    chainId: ChainId.GNOSIS,
    address: USDC_ADDRESS[ChainId.GNOSIS],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.ARBITRUM]: new Token({
    chainId: ChainId.ARBITRUM,
    address: USDC_ADDRESS[ChainId.ARBITRUM],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.MOONRIVER]: new Token({
    chainId: ChainId.MOONRIVER,
    address: USDC_ADDRESS[ChainId.MOONRIVER],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.AVALANCHE]: new Token({
    chainId: ChainId.AVALANCHE,
    address: USDC_ADDRESS[ChainId.AVALANCHE],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.FUSE]: new Token({
    chainId: ChainId.FUSE,
    address: USDC_ADDRESS[ChainId.FUSE],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.TELOS]: new Token({
    chainId: ChainId.TELOS,
    address: USDC_ADDRESS[ChainId.TELOS],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.MOONBEAM]: new Token({
    chainId: ChainId.MOONBEAM,
    address: USDC_ADDRESS[ChainId.MOONBEAM],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
  [ChainId.OPTIMISM]: new Token({
    chainId: ChainId.OPTIMISM,
    address: USDC_ADDRESS[ChainId.OPTIMISM],
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  }),
}

export const USDT_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  [ChainId.ROPSTEN]: '0x110a13FC3efE6A245B50102D2d79B3E76125Ae83',
  [ChainId.KOVAN]: '0x07de306FF27a2B630B1141956844eB1552B956B5',
  [ChainId.POLYGON]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  [ChainId.FANTOM]: '0x049d68029688eAbF473097a2fC38ef61633A3C7A',
  [ChainId.BSC]: '0x55d398326f99059fF775485246999027B3197955',
  [ChainId.HARMONY]: '0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f',
  [ChainId.HECO]: '0xa71EdC38d189767582C38A3145b5873052c3e47a',
  [ChainId.OKEX]: '0x382bB369d343125BfB2117af9c149795C6C65C50',
  [ChainId.GNOSIS]: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
  [ChainId.ARBITRUM]: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  [ChainId.AVALANCHE]: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
  [ChainId.CELO]: '0x88eeC49252c8cbc039DCdB394c0c2BA2f1637EA0',
  [ChainId.MOONRIVER]: '0xB44a9B6905aF7c801311e8F4E76932ee959c663C',
  [ChainId.TELOS]: '0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73',
  [ChainId.FUSE]: '0xFaDbBF8Ce7D5b7041bE672561bbA99f79c532e10',
  [ChainId.MOONBEAM]: '0x8e70cd5b4ff3f62659049e74b6649c6603a0e594',
  [ChainId.OPTIMISM]: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
}

export const USDT: Record<keyof typeof USDT_ADDRESS, Token> = {
  [ChainId.ETHEREUM]: new Token({
    chainId: ChainId.ETHEREUM,
    address: USDT_ADDRESS[ChainId.ETHEREUM],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.ROPSTEN]: new Token({
    chainId: ChainId.ROPSTEN,
    address: USDT_ADDRESS[ChainId.ROPSTEN],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.KOVAN]: new Token({
    chainId: ChainId.KOVAN,
    address: USDT_ADDRESS[ChainId.KOVAN],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.POLYGON]: new Token({
    chainId: ChainId.POLYGON,
    address: USDT_ADDRESS[ChainId.POLYGON],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.FANTOM]: new Token({
    chainId: ChainId.FANTOM,
    address: USDT_ADDRESS[ChainId.FANTOM],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.BSC]: new Token({
    chainId: ChainId.BSC,
    address: USDT_ADDRESS[ChainId.BSC],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.HARMONY]: new Token({
    chainId: ChainId.HARMONY,
    address: USDT_ADDRESS[ChainId.HARMONY],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.HECO]: new Token({
    chainId: ChainId.HECO,
    address: USDT_ADDRESS[ChainId.HECO],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.OKEX]: new Token({
    chainId: ChainId.OKEX,
    address: USDT_ADDRESS[ChainId.OKEX],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.GNOSIS]: new Token({
    chainId: ChainId.GNOSIS,
    address: USDT_ADDRESS[ChainId.GNOSIS],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.ARBITRUM]: new Token({
    chainId: ChainId.ARBITRUM,
    address: USDT_ADDRESS[ChainId.ARBITRUM],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.AVALANCHE]: new Token({
    chainId: ChainId.AVALANCHE,
    address: USDT_ADDRESS[ChainId.AVALANCHE],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.CELO]: new Token({
    chainId: ChainId.CELO,
    address: USDT_ADDRESS[ChainId.CELO],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.MOONRIVER]: new Token({
    chainId: ChainId.MOONRIVER,
    address: USDT_ADDRESS[ChainId.MOONRIVER],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.TELOS]: new Token({
    chainId: ChainId.TELOS,
    address: USDT_ADDRESS[ChainId.TELOS],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.FUSE]: new Token({
    chainId: ChainId.FUSE,
    address: USDT_ADDRESS[ChainId.FUSE],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.MOONBEAM]: new Token({
    chainId: ChainId.MOONBEAM,
    address: USDT_ADDRESS[ChainId.MOONBEAM],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  [ChainId.OPTIMISM]: new Token({
    chainId: ChainId.OPTIMISM,
    address: USDT_ADDRESS[ChainId.OPTIMISM],
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
}

export const DAI_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  [ChainId.ROPSTEN]: '0xc2118d4d90b274016cB7a54c03EF52E6c537D957',
  [ChainId.KOVAN]: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
  [ChainId.POLYGON]: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  [ChainId.FANTOM]: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
  [ChainId.BSC]: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
  [ChainId.HARMONY]: '0xEf977d2f931C1978Db5F6747666fa1eACB0d0339',
  [ChainId.HECO]: '0x3D760a45D0887DFD89A2F5385a236B29Cb46ED2a',
  [ChainId.OKEX]: '0x21cDE7E32a6CAF4742d00d44B07279e7596d26B9',
  [ChainId.GNOSIS]: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
  [ChainId.ARBITRUM]: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  [ChainId.AVALANCHE]: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
  [ChainId.CELO]: '0x90Ca507a5D4458a4C6C6249d186b6dCb02a5BCCd',
  [ChainId.MOONRIVER]: '0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844',
  // [ChainId.TELOS]: '',
  [ChainId.FUSE]: '0x94Ba7A27c7A95863d1bdC7645AC2951E0cca06bA',
  [ChainId.MOONBEAM]: '0xc234A67a4F840E61adE794be47de455361b52413',
  [ChainId.OPTIMISM]: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
}

export interface ContractExport {
  address: string
  abi: any[]
  linkedData?: any
}

export interface Export {
  chainId: string
  name: string
  contracts: { [name: string]: ContractExport }
}

export type MultiExport = {
  [chainId: string]: Export[]
}

// TODO: Use to generate typed address maps from hardhat-deploy exports
export function exportToContractMap(name: string, multiExport: MultiExport) {
  return Object.fromEntries(Object.entries(multiExport).map((entry) => [entry[0], entry[1][0].contracts[name]]))
}

export function addressMapToTokenMap(
  { decimals, symbol, name }: { decimals: number; symbol?: string; name?: string },
  map: AddressMap
) {
  return Object.fromEntries(
    Object.entries(map).map(([chainId, address]) => [
      chainId,
      new Token({
        chainId,
        address,
        decimals,
        symbol,
        name,
      }),
    ])
  )
}

export const DAI: Record<keyof typeof DAI_ADDRESS, Token> = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
  },
  DAI_ADDRESS
)

export const WETH9_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [ChainId.ROPSTEN]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  [ChainId.RINKEBY]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  [ChainId.GÖRLI]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  [ChainId.KOVAN]: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
  [ChainId.ARBITRUM]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  [ChainId.BSC]: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  [ChainId.FANTOM]: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
  [ChainId.POLYGON]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  [ChainId.OKEX]: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  [ChainId.HECO]: '0x64FF637fB478863B7468bc97D30a5bF3A428a1fD',
  [ChainId.HARMONY]: '0x6983D1E6DEf3690C4d616b13597A09e6193EA013',
  [ChainId.GNOSIS]: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
  [ChainId.AVALANCHE]: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
  [ChainId.PALM]: '0x726138359C17F1E56bA8c4F737a7CAf724F6010b',
  [ChainId.CELO]: '0x122013fd7dF1C6F636a5bb8f03108E876548b455',
  [ChainId.MOONRIVER]: '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C',
  [ChainId.TELOS]: '0xfA9343C3897324496A05fC75abeD6bAC29f8A40f',
  [ChainId.FUSE]: '0xa722c13135930332Eb3d749B2F0906559D2C5b99',
  [ChainId.MOONBEAM]: '0x30D2a9F5FDf90ACe8c17952cbb4eE48a55D916A7',
  [ChainId.OPTIMISM]: '0x4200000000000000000000000000000000000006',
}

export const WETH9: Record<keyof typeof WETH9_ADDRESS, Token> = {
  [ChainId.ETHEREUM]: new Token({
    chainId: ChainId.ETHEREUM,
    address: WETH9_ADDRESS[ChainId.ETHEREUM],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.ROPSTEN]: new Token({
    chainId: ChainId.ROPSTEN,
    address: WETH9_ADDRESS[ChainId.ROPSTEN],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.RINKEBY]: new Token({
    chainId: ChainId.RINKEBY,
    address: WETH9_ADDRESS[ChainId.RINKEBY],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.GÖRLI]: new Token({
    chainId: ChainId.GÖRLI,
    address: WETH9_ADDRESS[ChainId.GÖRLI],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.KOVAN]: new Token({
    chainId: ChainId.KOVAN,
    address: WETH9_ADDRESS[ChainId.KOVAN],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.ARBITRUM]: new Token({
    chainId: ChainId.ARBITRUM,
    address: WETH9_ADDRESS[ChainId.ARBITRUM],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.BSC]: new Token({
    chainId: ChainId.BSC,
    address: WETH9_ADDRESS[ChainId.BSC],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.FANTOM]: new Token({
    chainId: ChainId.FANTOM,
    address: WETH9_ADDRESS[ChainId.FANTOM],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.POLYGON]: new Token({
    chainId: ChainId.POLYGON,
    address: WETH9_ADDRESS[ChainId.POLYGON],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.OKEX]: new Token({
    chainId: ChainId.OKEX,
    address: WETH9_ADDRESS[ChainId.OKEX],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.HECO]: new Token({
    chainId: ChainId.HECO,
    address: WETH9_ADDRESS[ChainId.HECO],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.HARMONY]: new Token({
    chainId: ChainId.HARMONY,
    address: WETH9_ADDRESS[ChainId.HARMONY],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.GNOSIS]: new Token({
    chainId: ChainId.GNOSIS,
    address: WETH9_ADDRESS[ChainId.GNOSIS],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.AVALANCHE]: new Token({
    chainId: ChainId.AVALANCHE,
    address: WETH9_ADDRESS[ChainId.AVALANCHE],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.PALM]: new Token({
    chainId: ChainId.PALM,
    address: WETH9_ADDRESS[ChainId.PALM],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.TELOS]: new Token({
    chainId: ChainId.TELOS,
    address: WETH9_ADDRESS[ChainId.TELOS],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.FUSE]: new Token({
    chainId: ChainId.FUSE,
    address: WETH9_ADDRESS[ChainId.FUSE],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.MOONBEAM]: new Token({
    chainId: ChainId.MOONBEAM,
    address: WETH9_ADDRESS[ChainId.MOONBEAM],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.OPTIMISM]: new Token({
    chainId: ChainId.OPTIMISM,
    address: WETH9_ADDRESS[ChainId.OPTIMISM],
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
}

export const WNATIVE_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: WETH9_ADDRESS[ChainId.ETHEREUM],
  [ChainId.ROPSTEN]: WETH9_ADDRESS[ChainId.ROPSTEN],
  [ChainId.RINKEBY]: WETH9_ADDRESS[ChainId.RINKEBY],
  [ChainId.GÖRLI]: WETH9_ADDRESS[ChainId.GÖRLI],
  [ChainId.KOVAN]: WETH9_ADDRESS[ChainId.KOVAN],
  [ChainId.OPTIMISM]: WETH9_ADDRESS[ChainId.OPTIMISM],
  [ChainId.ARBITRUM]: WETH9_ADDRESS[ChainId.ARBITRUM],
  [ChainId.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
  [ChainId.POLYGON]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  [ChainId.POLYGON_TESTNET]: '0x5B67676a984807a212b1c59eBFc9B3568a474F0a',
  [ChainId.GNOSIS]: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
  [ChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  [ChainId.AVALANCHE]: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  [ChainId.HECO]: '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F',
  [ChainId.HARMONY]: '0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a',
  [ChainId.OKEX]: '0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15',
  [ChainId.OKEX_TESTNET]: '0x2219845942d28716c0F7C605765fABDcA1a7d9E0',
  [ChainId.PALM]: '0xF98cABF0a963452C5536330408B2590567611a71',
  [ChainId.CELO]: '0x471EcE3750Da237f93B8E339c536989b8978a438',
  [ChainId.MOONRIVER]: '0xf50225a84382c74CbdeA10b0c176f71fc3DE0C4d',
  [ChainId.FUSE]: '0x0BE9e53fd7EDaC9F859882AfdDa116645287C629',
  [ChainId.TELOS]: '0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E',
  [ChainId.MOONBEAM]: '0xAcc15dC74880C9944775448304B263D191c6077F',
  [ChainId.KAVA]: '0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b',
}

export const WNATIVE: Record<keyof typeof WNATIVE_ADDRESS, Token> = {
  [ChainId.ETHEREUM]: WETH9[ChainId.ETHEREUM],
  [ChainId.ROPSTEN]: WETH9[ChainId.ROPSTEN],
  [ChainId.RINKEBY]: WETH9[ChainId.RINKEBY],
  [ChainId.GÖRLI]: WETH9[ChainId.GÖRLI],
  [ChainId.KOVAN]: WETH9[ChainId.KOVAN],
  [ChainId.OPTIMISM]: WETH9[ChainId.OPTIMISM],
  [ChainId.FANTOM]: new Token({
    chainId: ChainId.FANTOM,
    address: WNATIVE_ADDRESS[ChainId.FANTOM],
    decimals: 18,
    symbol: 'WFTM',
    name: 'Wrapped FTM',
  }),
  [ChainId.POLYGON]: new Token({
    chainId: ChainId.POLYGON,
    address: WNATIVE_ADDRESS[ChainId.POLYGON],
    decimals: 18,
    symbol: 'WMATIC',
    name: 'Wrapped Matic',
  }),
  [ChainId.POLYGON_TESTNET]: new Token({
    chainId: ChainId.POLYGON_TESTNET,
    address: WNATIVE_ADDRESS[ChainId.POLYGON_TESTNET],
    decimals: 18,
    symbol: 'WMATIC',
    name: 'Wrapped Matic',
  }),
  [ChainId.GNOSIS]: new Token({
    chainId: ChainId.GNOSIS,
    address: WNATIVE_ADDRESS[ChainId.GNOSIS],
    decimals: 18,
    symbol: 'WXDAI',
    name: 'Wrapped xDai',
  }),
  [ChainId.BSC]: new Token({
    chainId: ChainId.BSC,
    address: WNATIVE_ADDRESS[ChainId.BSC],
    decimals: 18,
    symbol: 'WBNB',
    name: 'Wrapped BNB',
  }),
  [ChainId.ARBITRUM]: WETH9[ChainId.ARBITRUM],
  [ChainId.AVALANCHE]: new Token({
    chainId: ChainId.AVALANCHE,
    address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    decimals: 18,
    symbol: 'WAVAX',
    name: 'Wrapped AVAX',
  }),
  [ChainId.HECO]: new Token({
    chainId: ChainId.HECO,
    address: WNATIVE_ADDRESS[ChainId.HECO],
    decimals: 18,
    symbol: 'WHT',
    name: 'Wrapped HT',
  }),
  [ChainId.HARMONY]: new Token({
    chainId: ChainId.HARMONY,
    address: WNATIVE_ADDRESS[ChainId.HARMONY],
    decimals: 18,
    symbol: 'WONE',
    name: 'Wrapped ONE',
  }),
  [ChainId.OKEX]: new Token({
    chainId: ChainId.OKEX,
    address: WNATIVE_ADDRESS[ChainId.OKEX],
    decimals: 18,
    symbol: 'WOKT',
    name: 'Wrapped OKExChain',
  }),
  [ChainId.CELO]: new Token({
    chainId: ChainId.CELO,
    address: WNATIVE_ADDRESS[ChainId.CELO],
    decimals: 18,
    symbol: 'CELO',
    name: 'Celo',
  }),
  [ChainId.PALM]: new Token({
    chainId: ChainId.PALM,
    address: WNATIVE_ADDRESS[ChainId.PALM],
    decimals: 18,
    symbol: 'WPALM',
    name: 'Wrapped Palm',
  }),
  [ChainId.MOONRIVER]: new Token({
    chainId: ChainId.MOONRIVER,
    address: WNATIVE_ADDRESS[ChainId.MOONRIVER],
    decimals: 18,
    symbol: 'WMOVR',
    name: 'Wrapped Moonriver',
  }),
  [ChainId.FUSE]: new Token({
    chainId: ChainId.FUSE,
    address: WNATIVE_ADDRESS[ChainId.FUSE],
    decimals: 18,
    symbol: 'WFUSE',
    name: 'Wrapped Fuse',
  }),
  [ChainId.TELOS]: new Token({
    chainId: ChainId.TELOS,
    address: WNATIVE_ADDRESS[ChainId.TELOS],
    decimals: 18,
    symbol: 'WTLOS',
    name: 'Wrapped Telos',
  }),
  [ChainId.MOONBEAM]: new Token({
    chainId: ChainId.MOONBEAM,
    address: WNATIVE_ADDRESS[ChainId.MOONBEAM],
    decimals: 18,
    symbol: 'WGLMR',
    name: 'Wrapped Glimmer',
  }),
  [ChainId.KAVA]: new Token({
    chainId: ChainId.KAVA,
    address: WNATIVE_ADDRESS[ChainId.KAVA],
    decimals: 18,
    symbol: 'WKAVA',
    name: 'Wrapped Kava',
  }),
}
