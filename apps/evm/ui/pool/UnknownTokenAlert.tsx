import { ChainId } from '@sushiswap/chain'
import { Pool } from '@sushiswap/client'
import { shortenAddress } from '@sushiswap/format'
import { useCustomTokens } from '@sushiswap/hooks'
import { useTokenWithCache } from '@sushiswap/wagmi/future/hooks'
import { FC, useMemo } from 'react'

interface UnknownTokenAlert {
  pool: Pool
}

const tokenName = (token: Pool['token0']) =>
  token.name ? `${token.name} (${token.symbol})` : shortenAddress(token.address)

export const UnknownTokenAlert: FC<UnknownTokenAlert> = ({ pool }) => {
  const { token0, token1 } = pool

  const { hasToken } = useCustomTokens()

  const { data: tokenFrom } = useTokenWithCache({
    chainId: pool.chainId as ChainId,
    address: token0.address,
    withStatus: true,
  })

  const { data: tokenTo } = useTokenWithCache({
    chainId: pool.chainId as ChainId,
    address: token1.address,
    withStatus: true,
  })

  const token0NotInList = useMemo(
    () => Boolean(tokenFrom?.status !== 'APPROVED' && tokenFrom?.token && !hasToken(tokenFrom?.token)),
    [tokenFrom?.status, tokenFrom?.token]
  )

  const token1NotInList = useMemo(
    () => Boolean(tokenTo?.status !== 'APPROVED' && tokenTo?.token && !hasToken(tokenTo?.token)),
    [tokenTo?.status, tokenTo?.token]
  )

  if (!(token0NotInList || token1NotInList)) return <></>

  return (
    <div className="flex items-center justify-center bg-yellow/20 gap-6 md:gap-3 dark:text-yellow text-yellow-900 px-4 py-3 font-semibold rounded-xl">
      <div>
        {`${
          token0NotInList && token1NotInList
            ? `${tokenName(token0)} & ${tokenName(token1)} are unknown.`
            : `${tokenName(token0NotInList ? token0 : token1)} is unknown.`
        } Please conduct your own research before interacting with ${
          token0NotInList && token1NotInList ? 'these tokens.' : 'this token.'
        }`}
      </div>
    </div>
  )
}
