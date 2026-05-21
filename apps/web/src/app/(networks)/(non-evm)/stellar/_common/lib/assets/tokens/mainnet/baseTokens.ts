import { StellarChainId, StellarToken } from 'sushi/stellar'
import { CONTRACT_ADDRESSES } from '~stellar/_common/lib/soroban/contracts/mainnet/contract-addresses'

// These are MAINNET tokens
export const baseTokens: StellarToken<{
  domain: string
  icon: string
  isStable?: boolean
}>[] = [
  new StellarToken({
    chainId: StellarChainId.STELLAR,
    issuer: 'GDMTVHLWJTHSUDMZVVMXXH6VJHA2ZV3HNG5LYNAZ6RTWB7GISM6PGTUV',
    address: CONTRACT_ADDRESSES.TOKENS.XLM as `C${string}`,
    symbol: 'XLM',
    name: 'XLM',
    origin: 'stellar',
    decimals: 7,
    metadata: {
      domain: 'stellar.org',
      icon: 'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png',
    },
  }),
  new StellarToken({
    chainId: StellarChainId.STELLAR,
    issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    address: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
    symbol: 'USDC',
    name: 'USDC',
    origin: 'centre',
    decimals: 7,
    metadata: {
      domain: 'centre.io',
      icon: 'https://stellar.myfilebase.com/ipfs/QmNcfZxs8e9uVyhEa3xoPWCsj3ZogGirtixMEC9Km4Fjm2',
      isStable: true,
    },
  }),
  new StellarToken({
    chainId: StellarChainId.STELLAR,
    issuer: 'GDHU6WRG4IEQXM5NZ4BMPKOXHW76MZM4Y2IEMFDVXBSDP6SJY4ITNPP2',
    address: 'CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV',
    symbol: 'EURC',
    name: 'EURC',
    origin: 'centre',
    decimals: 7,
    metadata: {
      domain: 'circle.com',
      icon: 'https://stellar.myfilebase.com/ipfs/QmeRk7LG85cozSNey9QGARgbxYi1cG1dA1G6SNJGMTMdF2',
    },
  }),
  new StellarToken({
    chainId: StellarChainId.STELLAR,
    issuer: 'GDQE7IXJ4HUHV6RQHIUPRJSEZE4DRS5WY577O2FY6YQ5LVWZ7JZTU2V5',
    address: 'CCCRWH6Q3FNP3I2I57BDLM5AFAT7O6OF6GKQOC6SSJNDAVRZ57SPHGU2',
    symbol: 'PYUSD',
    name: 'PYUSD',
    origin: 'paxos',
    decimals: 7,
    metadata: {
      domain: 'paxos.com',
      icon: 'https://assets.coingecko.com/coins/images/31212/standard/PYUSD_Token_Logo_2x.png',
    },
  }),
  new StellarToken({
    chainId: StellarChainId.STELLAR,
    issuer: 'GAJMPX5NBOG6TQFPQGRABJEEB2YE7RFRLUKJDZAZGAD5GFX4J7TADAZ6',
    address: 'CB3YA656OYIHU57657I5KGSBRHE5I3OZU4VFC22PYAOANFZHEWNYGAGP',
    symbol: 'USDY',
    name: 'USDY',
    origin: 'ondo',
    decimals: 7,
    metadata: {
      domain: 'ondo.finance',
      icon: 'https://assets.coingecko.com/coins/images/31700/standard/usdy_(1).png',
    },
  }),
  new StellarToken({
    chainId: StellarChainId.STELLAR,
    issuer: 'GCRYUGD5NVARGXT56XEZI5CIFCQETYHAPQQTHO2O3IQZTHDH4LATMYWC',
    address: 'CBLV4ATSIWU67CFSQU2NVRKINQIKUZ2ODSZBUJTJ43VJVRSBTZYOPNUR',
    symbol: 'USTRY',
    name: 'USTRY',
    origin: 'etherfuse',
    decimals: 7,
    metadata: {
      domain: 'etherfuse.com',
      icon: 'https://assets.coingecko.com/coins/images/52361/standard/-STABLEBOND-06.jpg',
    },
  }),
  new StellarToken({
    chainId: StellarChainId.STELLAR,
    issuer: 'GCRYUGD5NVARGXT56XEZI5CIFCQETYHAPQQTHO2O3IQZTHDH4LATMYWC',
    address: 'CAL6ER2TI6CTRAY6BFXWNWA7WTYXUXTQCHUBCIBU5O6KM3HJFG6Z6VXV',
    symbol: 'CETES',
    name: 'CETES',
    origin: 'etherfuse',
    decimals: 7,
    metadata: {
      domain: 'etherfuse.com',
      icon: 'https://assets.coingecko.com/coins/images/37855/standard/cetes.png',
    },
  }),
  new StellarToken({
    chainId: StellarChainId.STELLAR,
    address: 'CBIJBDNZNF4X35BJ4FFZWCDBSCKOP5NB4PLG4SNENRMLAPYG4P5FM6VN',
    symbol: 'SolvBTC',
    name: 'Solv BTC',
    origin: 'solv',
    decimals: 8,
    metadata: {
      domain: 'solv.finance',
      icon: 'https://raw.githubusercontent.com/solv-finance/solv-resources/main/SolvBTC/SolvBTC.svg',
    },
  }),
  new StellarToken({
    chainId: StellarChainId.STELLAR,
    address: 'CAUP7NFABXE5TJRL3FKTPMWRLC7IAXYDCTHQRFSCLR5TMGKHOOQO772J',
    symbol: 'xSolvBTC',
    name: 'xSolvBTC',
    origin: 'solv',
    decimals: 8,
    metadata: {
      domain: 'solv.finance',
      icon: 'https://raw.githubusercontent.com/solv-finance/solv-resources/main/xSolvBTC/xSolvBTC.svg',
    },
  }),
]
