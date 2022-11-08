import { ChainId, Network, Token } from "./Network";

const tokens: { [name: string]: Token } = {
  WMATIC: new Token(
    ChainId.MATIC,
    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    18,
    "WMATIC",
    "Wrapped Matic"
  ),
  USDC: new Token(
    ChainId.MATIC,
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    6,
    "USDC",
    "USD Coin"
  ),
  WBTC: new Token(
    ChainId.MATIC,
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    8,
    "WBTC",
    "Wrapped Bitcoin"
  ),
  DAI: new Token(
    ChainId.MATIC,
    "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    18,
    "DAI",
    "Dai Stablecoin"
  ),
  WETH: new Token(
    ChainId.MATIC,
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    18,
    "WETH",
    "Wrapped Ether"
  ),
  USDT: new Token(
    ChainId.MATIC,
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    6,
    "USDT",
    "Tether USD"
  ),
  TEL: new Token(
    ChainId.MATIC,
    "0xdF7837DE1F2Fa4631D716CF2502f8b230F1dcc32",
    2,
    "TEL",
    "Telcoin"
  ),
  SUSHI: new Token(
    ChainId.MATIC,
    "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a",
    18,
    "SUSHI",
    "SushiToken"
  ),
  AAVE: new Token(
    ChainId.MATIC,
    "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    18,
    "AAVE",
    "Aave"
  ),
  FRAX: new Token(
    ChainId.MATIC,
    "0x104592a158490a9228070E0A8e5343B499e125D0",
    18,
    "FRAX",
    "Frax"
  ),
  FXS: new Token(
    ChainId.MATIC,
    "0x3e121107F6F22DA4911079845a470757aF4e1A1b",
    18,
    "FXS",
    "Frax Share"
  ),
  DMAGIC: new Token(
    ChainId.MATIC,
    "0x61dAECaB65EE2A1D5b6032df030f3fAA3d116Aa7",
    18,
    "DMAGIC",
    "Dark Magic"
  ),
  DRAX: new Token(
    ChainId.MATIC,
    "0x1Ba3510A9ceEb72E5CdBa8bcdDe9647E1f20fB4b",
    18,
    "DRAX",
    "Drax"
  ),
  AXMATIC: new Token(
    ChainId.MATIC,
    "0x1221591c1d77A9c334aBb0fe530ae6EE3aF51Af9",
    18,
    "AXMATIC",
    "axMATIC"
  ),
  KLIMA: new Token(
    ChainId.MATIC,
    "0x4e78011Ce80ee02d2c3e649Fb657E45898257815",
    9,
    "Klima DAO",
    "KLIMA"
  ),
  BCT: new Token(
    ChainId.MATIC,
    "0x2F800Db0fdb5223b3C3f354886d907A671414A7F",
    18,
    "Toucan Protocol: Base Carbon Tonne",
    "BCT"
  ),
  MIM: new Token(
    ChainId.MATIC,
    "0x49a0400587A7F65072c87c4910449fDcC5c47242",
    18,
    "MIM",
    "Magic Internet Money"
  ),
  ICE: new Token(
    ChainId.MATIC,
    "0x4e1581f01046eFDd7a1a2CDB0F82cdd7F71F2E59",
    18,
    "ICE",
    "IceToken"
  ),
  gOHM: new Token(
    ChainId.MATIC,
    "0xd8cA34fd379d9ca3C6Ee3b3905678320F5b45195",
    18,
    "gOHM",
    "Governance OHM"
  ),
  STG: new Token(
    ChainId.MATIC,
    "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
    18,
    "STG",
    "StargateToken"
  ),
};

export const POLYGON: Network = {
  name: 'POLYGON',
  chainId: ChainId.MATIC,
  alchemyProviderArgs: ["matic", process.env.ALCHEMY_POLYGON_API_KEY],
  tokens,
  baseWrappedToken: tokens.WMATIC,
  baseTokenSymbol: "MATIC",
  BASES_TO_CHECK_TRADES_AGAINST: [
    tokens.WMATIC,
    tokens.USDC,
    tokens.WBTC,
    tokens.DAI,
    tokens.WETH,
    tokens.USDT,
    tokens.MIM,
    tokens.SUSHI,
    tokens.FRAX,
    tokens.STG,
  ],
  ADDITIONAL_BASES: {
    [tokens.FRAX.address]: [tokens.FXS],
    [tokens.FXS.address]: [tokens.FRAX],
    [tokens.DRAX.address]: [tokens.DMAGIC],
    [tokens.AXMATIC.address]: [tokens.DMAGIC],
    [tokens.BCT.address]: [tokens.KLIMA],
    [tokens.KLIMA.address]: [tokens.BCT],
  },
};
