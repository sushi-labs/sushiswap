import { getV4Pool } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import React, { useMemo } from 'react'
import { getPoolKey, isSushiSwapV4ChainId } from 'src/lib/pool/v4'
import { decodeHooksRegistration } from 'src/lib/pool/v4/sdk/utils/decodeHooksRegistration'
import { ConcentratedLiquidityProviderV4 } from 'src/ui/pool/ConcentratedLiquidityProviderV4'
import { NewPositionV4 } from 'src/ui/pool/NewPositionV4'
import type { EvmChainId } from 'sushi'
import { isHex, parseUnits } from 'viem'

export default async function PositionsCreatePage(props: {
  params: Promise<{ id: string; chainId: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, id } = params
  const chainId = +_chainId as EvmChainId

  if (!isSushiSwapV4ChainId(chainId) || !isHex(id, { strict: false })) {
    return notFound()
  }

  const pool = await unstable_cache(
    async () => getV4Pool({ id, chainId }),
    ['v4', 'pool', `${chainId}:${id}`],
    {
      revalidate: 60 * 15,
    },
  )()

  if (!pool) {
    return notFound()
  }

  const poolKey = getPoolKey({
    chainId: pool.chainId,
    currency0: pool.token0.address,
    currency1: pool.token1.address,
    feeAmount: Number(parseUnits(pool.lpFee.toString(), 6)),
    tickSpacing: pool.tickSpacing,
    hookData: {
      address: pool.hooks,
      hooksRegistration: decodeHooksRegistration(pool.hooksRegistration),
    },
  })

  return (
    <ConcentratedLiquidityProviderV4>
      <NewPositionV4
        id={id}
        chainId={chainId}
        poolKey={poolKey}
        currency0={pool.token0}
        currency1={pool.token1}
      />
    </ConcentratedLiquidityProviderV4>
  )
}
