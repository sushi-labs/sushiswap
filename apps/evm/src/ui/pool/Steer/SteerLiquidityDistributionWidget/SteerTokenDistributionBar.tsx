import { Pool, getTokenPricesChain } from '@sushiswap/client'
import { getTokenRatios } from '@sushiswap/steer-sdk'
import React from 'react'

interface SteerTokenDistributionBarProps {
  vault: Pool['steerVaults'][0]
}

export async function SteerTokenDistributionBar({
  vault,
}: SteerTokenDistributionBarProps) {
  const prices = await getTokenPricesChain({ chainId: vault.chainId })
  const tokenRatios = await getTokenRatios({ vault, prices })

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
