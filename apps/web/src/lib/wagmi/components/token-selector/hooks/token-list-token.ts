import type { TokenListChainId } from '@sushiswap/graph-client/data-api'
import { getNativeAddress, getNativeFor, getTokenFor } from 'sushi'
import { isEvmChainId } from 'sushi/evm'
import {
  type StellarAccountAddress,
  type StellarContractAddress,
  StellarToken,
  isStellarChainId,
} from 'sushi/stellar'
import { isSvmChainId } from 'sushi/svm'

export type TokenListTokenMetadata = {
  approved: boolean
  domain?: string
}

type StellarMetadata = {
  issuer: StellarAccountAddress
  domain: string
}

export type TokenListTokenData<TChainId extends TokenListChainId> = {
  chainId: TChainId
  address: AddressFor<TChainId>
  symbol: string
  name: string
  decimals: number
  approved: boolean
  stellarMetadata?: StellarMetadata | null
}

export function createTokenListToken<TChainId extends TokenListChainId>(
  chainId: TChainId,
  token: TokenListTokenData<TChainId>,
): TokenFor<TChainId, TokenListTokenMetadata> {
  if (isEvmChainId(chainId) || isSvmChainId(chainId)) {
    return getTokenFor(chainId, {
      ...token,
      metadata: {
        approved: token.approved,
      },
    })
  }

  if (isStellarChainId(chainId)) {
    const _token = token as TokenListTokenData<typeof chainId>
    return new StellarToken({
      ..._token,
      address: token.address as StellarContractAddress,
      issuer: token.stellarMetadata?.issuer,
      metadata: {
        approved: token.approved,
        domain: token.stellarMetadata?.domain,
      },
    }) as TokenFor<TChainId, TokenListTokenMetadata>
  }

  throw new Error(`Unsupported token list chainId: ${chainId}`)
}

export function createTokenListCurrency<TChainId extends TokenListChainId>(
  chainId: TChainId,
  token: TokenListTokenData<TChainId>,
): CurrencyFor<TChainId, TokenListTokenMetadata> {
  if (
    (isEvmChainId(chainId) || isSvmChainId(chainId)) &&
    token.address === getNativeAddress(chainId)
  ) {
    return getNativeFor(chainId, {
      approved: true,
    })
  }

  return createTokenListToken(chainId, token)
}
