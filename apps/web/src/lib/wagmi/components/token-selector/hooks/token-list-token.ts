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

export type TokenApprovalStatus =
  | 'UNKNOWN'
  | 'APPROVED'
  | 'PERMISSIONLESS'
  | 'DISAPPROVED'

export type TokenListTokenMetadata = {
  approved: boolean
  approvalStatus?: TokenApprovalStatus
  domain?: string
}

type StellarMetadata = {
  issuer?: StellarAccountAddress | null
  domain?: string | null
}

export type TokenListTokenData<TChainId extends TokenListChainId> = {
  chainId: TChainId
  address: AddressFor<TChainId>
  symbol: string
  name: string
  decimals: number
  approved: boolean
  approvalStatus?: TokenApprovalStatus
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
        ...(token.approvalStatus
          ? { approvalStatus: token.approvalStatus }
          : {}),
      },
    })
  }

  if (isStellarChainId(chainId)) {
    const _token = token as TokenListTokenData<typeof chainId>
    return new StellarToken({
      ..._token,
      address: token.address as StellarContractAddress,
      issuer: token.stellarMetadata?.issuer ?? undefined,
      metadata: {
        approved: token.approved,
        ...(token.approvalStatus
          ? { approvalStatus: token.approvalStatus }
          : {}),
        domain: token.stellarMetadata?.domain ?? undefined,
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
