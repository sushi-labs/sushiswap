import { nativeFromChainId } from 'src/lib/currency-from-chain-id'
import { EvmToken, isEvmAddress, isEvmChainId } from 'sushi/evm'
import {
  STELLAR_USDT0,
  StellarChainId,
  StellarToken,
  isStellarContractAddress,
} from 'sushi/stellar'
import { SvmChainId, SvmToken, isSvmAddress } from 'sushi/svm'
import type { ValueTransferChain, ValueTransferToken } from './schemas'
import { type ValueTransferChainId, isValueTransferChainId } from './types'

export interface ValueTransferCurrencyEntry {
  currency: CurrencyFor<ValueTransferChainId>
  token: ValueTransferToken
}

export function getValueTransferChainId(
  chain: ValueTransferChain,
): ValueTransferChainId | undefined {
  if (chain.chainType === 'STELLAR' && chain.chainKey === 'stellar')
    return StellarChainId.STELLAR
  if (chain.chainType === 'SOLANA' && chain.chainKey === 'solana')
    return SvmChainId.SOLANA
  // Some VMs share a numerical ID (HyperCore and HyperEVM, for example).
  if (
    chain.chainType === 'EVM' &&
    typeof chain.chainId === 'number' &&
    isEvmChainId(chain.chainId) &&
    isValueTransferChainId(chain.chainId)
  )
    return chain.chainId
  return undefined
}

export function getValueTransferCurrencyKey(
  chainId: number,
  tokenParam: string,
): string {
  return `${chainId}:${isEvmChainId(chainId) ? tokenParam.toLowerCase() : tokenParam}`
}

export function getValueTransferCurrencyParam(
  currency: CurrencyFor<ValueTransferChainId>,
): string {
  return currency.type === 'native' ? 'NATIVE' : currency.address
}

export function mapValueTransferToken(
  token: ValueTransferToken,
  chain: ValueTransferChain,
): ValueTransferCurrencyEntry | undefined {
  const chainId = getValueTransferChainId(chain)
  if (!chainId || !token.isSupported || token.chainKey !== chain.chainKey)
    return undefined
  const icon = token.icon ?? token.logoURI ?? token.logoUrl
  const metadata = {
    ...(icon ? { icon } : {}),
    approved: false,
    approvalStatus: 'UNKNOWN' as const,
  }
  if (chainId === StellarChainId.STELLAR) {
    if (!isStellarContractAddress(token.address)) return undefined
    const known = STELLAR_USDT0[StellarChainId.STELLAR]
    return {
      token,
      currency:
        token.address === known.address
          ? new StellarToken({
              ...known.toJSON(),
              metadata: { ...known.metadata, ...metadata },
            })
          : new StellarToken({
              chainId,
              address: token.address,
              decimals: token.decimals,
              symbol: token.symbol,
              name: token.name,
              metadata,
            }),
    }
  }
  if (chainId === SvmChainId.SOLANA) {
    if (!isSvmAddress(token.address)) return undefined
    return {
      token,
      currency:
        token.address === chain.nativeCurrency?.address
          ? nativeFromChainId(chainId)
          : new SvmToken({
              ...token,
              chainId,
              address: token.address,
              metadata,
            }),
    }
  }
  if (!isEvmAddress(token.address)) return undefined
  return {
    token,
    currency:
      token.address.toLowerCase() ===
      chain.nativeCurrency?.address.toLowerCase()
        ? nativeFromChainId(chainId)
        : new EvmToken({ ...token, chainId, address: token.address, metadata }),
  }
}
