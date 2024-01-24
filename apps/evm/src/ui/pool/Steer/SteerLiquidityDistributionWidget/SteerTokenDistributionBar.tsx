import { Pool, TOKEN_PRICE_API } from '@sushiswap/client'
import { getTokenRatios } from '@sushiswap/steer-sdk'
import React from 'react'

interface SteerTokenDistributionBarProps {
  vault: Pool['steerVaults'][0]
}

export async function SteerTokenDistributionBar({
  vault,
}: SteerTokenDistributionBarProps) {
  let tokenRatios = {
    token0: 0,
    token1: 0,
  }

  try {
    const prices = await fetch(`${TOKEN_PRICE_API}/api/v2/${vault.chainId}`, {
      next: { revalidate: 60 },
    }).then((res) => res.json())
    tokenRatios = await getTokenRatios({ vault, prices })
  } catch (e) {
    console.error(e)
  }

  return (
    <div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500"
          style={{ width: tokenRatios ? `${tokenRatios.token0 * 100}%` : '0%' }}
        />
      </div>
      <div className="flex justify-between text-sm font-extralight">
        <div>{vault.token0.symbol}</div>
        <div>{vault.token1.symbol}</div>
      </div>
    </div>
  )
}
