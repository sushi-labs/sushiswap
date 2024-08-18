import { ChainId } from '../chain/index.js'
import {
  ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
} from '../config/index.js'
//import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from 'sushi/config'
import { Native, Token } from '../currency/index.js'

let _nativeToken: Token | undefined
export function nativeToken(chainId: ChainId): Token {
  if (_nativeToken?.chainId === chainId) return _nativeToken
  _nativeToken = new Token({
    ...Native.onChain(chainId),
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  })
  return _nativeToken
}

let _baseTokensWithNativeChain: number | undefined = undefined
let _baseTokensWithNative: Token[] | undefined
export function baseTokens(chainId: ChainId, withNative = false): Token[] {
  if (withNative) return BASES_TO_CHECK_TRADES_AGAINST[chainId]
  if (_baseTokensWithNativeChain === chainId)
    return _baseTokensWithNative as Token[]
  _baseTokensWithNativeChain = chainId
  _baseTokensWithNative = BASES_TO_CHECK_TRADES_AGAINST[chainId].concat([
    nativeToken(chainId),
  ])
  return _baseTokensWithNative as Token[]
}

export function baseAgainstTokens(token: Token, withNative = false): Token[] {
  const chainId = token.chainId
  const set = new Set([
    ...baseTokens(chainId, withNative),
    ...(ADDITIONAL_BASES?.[chainId]?.[token.address] ?? []),
  ])
  return Array.from(set)
}

export function baseAgainstAllTokens(
  chainId: ChainId,
  withNative = false,
): Token[] {
  const additional = Object.values(ADDITIONAL_BASES[chainId] ?? []).flat()
  const set = new Set([...baseTokens(chainId, withNative), ...additional])
  return Array.from(set)
}

export function baseAgainstTokensForPair(
  t0: Token,
  t1: Token,
  withNative = false,
): Token[] {
  const chainId = t0.chainId
  const set = new Set([
    ...baseTokens(chainId, withNative),
    ...(ADDITIONAL_BASES?.[chainId]?.[t0.address] ?? []),
    ...(ADDITIONAL_BASES?.[chainId]?.[t1.address] ?? []),
  ])
  return Array.from(set)
}
