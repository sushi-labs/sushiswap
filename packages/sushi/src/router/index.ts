import { LSDS, STABLES } from '../config/index.js'
import { Native } from '../currency/native.js'
import type { Token } from '../currency/token.js'
import type { Type } from '../currency/type.js'

export const isWrap = ({
  fromToken,
  toToken,
}: { fromToken: Type; toToken: Type }) =>
  fromToken.isNative &&
  toToken.wrapped.address === Native.onChain(toToken.chainId).wrapped.address
export const isUnwrap = ({
  fromToken,
  toToken,
}: { fromToken: Type; toToken: Type }) =>
  toToken.isNative &&
  fromToken.wrapped.address ===
    Native.onChain(fromToken.chainId).wrapped.address
export const isWrapOrUnwrap = ({
  fromToken,
  toToken,
}: { fromToken: Type; toToken: Type }) =>
  isWrap({ fromToken, toToken }) || isUnwrap({ fromToken, toToken })

export const isStable = ({
  fromToken,
  toToken,
}: { fromToken: Type; toToken: Type }) => {
  const fromTokenIsStable = STABLES[fromToken.chainId].some((t: Token) =>
    t.equals(fromToken),
  )
  const toTokenIsStable = STABLES[toToken.chainId].some((t: Token) =>
    t.equals(toToken),
  )
  return fromTokenIsStable && toTokenIsStable
}
export const isLsd = ({
  fromToken,
  toToken,
}: { fromToken: Type; toToken: Type }) => {
  const fromTokenIsLsd = LSDS[fromToken.chainId].some((t: Token) =>
    t.equals(fromToken),
  )
  const toTokenIsLsd = LSDS[toToken.chainId].some((t: Token) =>
    t.equals(toToken),
  )
  return (
    (fromToken.isNative && toTokenIsLsd) || (fromTokenIsLsd && toToken.isNative)
  )
}

export * from './pool-type.js'
export * from './router-liquidity-source.js'
export * from './route-status.js'
export * from './get-currency-combinations.js'
