import { StellarChainId, StellarToken } from 'sushi/stellar'
import { CONTRACT_ADDRESSES } from '~stellar/_common/lib/soroban/contracts/futurenet/contract-addresses'

// These are FUTURENET tokens. Sushi only models a single Stellar chainId,
// so futurenet tokens reuse StellarChainId.STELLAR; the rest of the app
// already treats Stellar as a single chain.
export const baseTokens: StellarToken[] = [
  new StellarToken({
    chainId: StellarChainId.STELLAR,
    address: CONTRACT_ADDRESSES.TOKENS.XLM as `C${string}`,
    symbol: 'XLM',
    name: 'XLM',
    origin: 'stellar',
    decimals: 7,
    metadata: { domain: 'stellar.org' },
  }),
  new StellarToken({
    chainId: StellarChainId.STELLAR,
    issuer: 'GBPQPDWLM7PU42ISCDYSX3LESWYMVPI6A7ACHRFACEPR3QSFL47AKAMV',
    address: 'CCXHOHY22HBRYYM6P4R67QN6SFSSLAQH2P3PKIMC35NZZKWVPX6ZPJSV',
    symbol: 'HYPE',
    name: 'HYPE',
    origin: 'hypotenuselabs',
    decimals: 7,
  }),
  new StellarToken({
    chainId: StellarChainId.STELLAR,
    issuer: 'GBPQPDWLM7PU42ISCDYSX3LESWYMVPI6A7ACHRFACEPR3QSFL47AKAMV',
    address: 'CA7WDZGXTB7ZCIGYIVIBXJQFT2U74YUTXVG274ES5ADDOUUE2NCGARUK',
    symbol: 'SUSHI',
    name: 'SUSHI',
    origin: 'sushiswap',
    decimals: 7,
  }),
  new StellarToken({
    chainId: StellarChainId.STELLAR,
    issuer: 'GBPQPDWLM7PU42ISCDYSX3LESWYMVPI6A7ACHRFACEPR3QSFL47AKAMV',
    address: 'CBVHSZJYCOCYCEO36U5BNQWFZYWR4HQW5OMTEARB4RXVHFQOSDPMFCW6',
    symbol: 'STELLA',
    name: 'STELLA',
    origin: 'hypotenuselabs',
    decimals: 7,
  }),
]
