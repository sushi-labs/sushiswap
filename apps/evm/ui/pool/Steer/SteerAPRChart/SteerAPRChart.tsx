import { Pool } from '@sushiswap/client'
import { getSteerVaultAprTimeseries } from '@sushiswap/steer-sdk'
import { unstable_cache } from 'next/cache'
import React from 'react'

import { _SteerAPRChart } from './_SteerAPRChart'

interface SteerAPRChartProps {
  vault: Pool['steerVaults'][0]
}

export async function SteerAPRChart({ vault }: SteerAPRChartProps) {
  const timeseries = await unstable_cache(
    async () => getSteerVaultAprTimeseries({ vaultId: vault.id }),
    ['steer-vault-apr-timeseries', vault.id],
    {
      revalidate: 60 * 60,
    }
  )()

  return <_SteerAPRChart timeseries={timeseries} />
}
