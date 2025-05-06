'use client'

import type { V2Pool } from '@sushiswap/graph-client/data-api'
import { useCustomTokens } from '@sushiswap/hooks'
import { Message } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { shortenAddress } from 'sushi/format'

interface UnknownTokenAlert {
  pool: V2Pool
}

const tokenName = (token: V2Pool['token0']) =>
  token.name ? `${token.name} (${token.symbol})` : shortenAddress(token.address)

export const UnknownTokenAlert: FC<UnknownTokenAlert> = ({ pool }) => {
  const { token0, token1 } = pool

  const { hasToken } = useCustomTokens()

  const { data: tokenFrom } = useTokenWithCache({
    chainId: pool.chainId,
    address: token0.address,
  })

  const { data: tokenTo } = useTokenWithCache({
    chainId: pool.chainId,
    address: token1.address,
  })

  const token0NotInList = useMemo(
    () => Boolean(tokenFrom && !tokenFrom.approved && !hasToken(tokenFrom)),
    [hasToken, tokenFrom],
  )

  const token1NotInList = useMemo(
    () => Boolean(tokenTo && !tokenTo.approved && hasToken(tokenTo)),
    [hasToken, tokenTo],
  )

  if (!(token0NotInList || token1NotInList)) return <></>

  return (
    <Message size="sm" variant="warning">
      {`${
        token0NotInList && token1NotInList
          ? `${tokenName(token0)} & ${tokenName(token1)} are unknown.`
          : `${tokenName(token0NotInList ? token0 : token1)} is unknown.`
      } Please conduct your own research before interacting with ${
        token0NotInList && token1NotInList ? 'these tokens.' : 'this token.'
      }`}
    </Message>
  )
}
