import { CONTRACT_ADDRESSES } from '~stellar/_common/lib/soroban/contracts/futurenet/contract-addresses'
import type { Token } from '~stellar/_common/lib/types/token.type'

// These are FUTURENET tokens
export const baseTokens: Token[] = [
  {
    code: 'XLM',
    issuer: '',
    contract: CONTRACT_ADDRESSES.TOKENS.XLM,
    name: 'XLM',
    org: 'stellar',
    domain: 'stellar.org',
    decimals: 7,
  },
  {
    code: 'HYPE',
    issuer: '',
    contract: 'CCXHOHY22HBRYYM6P4R67QN6SFSSLAQH2P3PKIMC35NZZKWVPX6ZPJSV',
    name: 'HYPE',
    org: 'hypotenuselabs',
    decimals: 7,
  },
  {
    code: 'SUSHI',
    issuer: '',
    contract: 'CA7WDZGXTB7ZCIGYIVIBXJQFT2U74YUTXVG274ES5ADDOUUE2NCGARUK',
    name: 'SUSHI',
    org: 'sushiswap',
    decimals: 7,
  },
  {
    code: 'STELLA',
    issuer: '',
    contract: 'CBVHSZJYCOCYCEO36U5BNQWFZYWR4HQW5OMTEARB4RXVHFQOSDPMFCW6',
    name: 'STELLA',
    org: 'hypotenuselabs',
    decimals: 7,
  },
]
