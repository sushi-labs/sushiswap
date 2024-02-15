'use client'

import { Pool } from '@sushiswap/client'
import { getSteerVaultAprTimeseries } from '@sushiswap/steer-sdk'
import { useQuery } from '@tanstack/react-query'
import React, { FC } from 'react'

import { _SteerAPRChart } from './_SteerAPRChart'

interface SteerAPRChartProps {
  vault: Pool['steerVaults'][0]
}

export const SteerAPRChart: FC<SteerAPRChartProps> = ({ vault }) => {
  const { data, isInitialLoading } = useQuery({
    queryKey: ['steer-vault-apr-timeseries', vault.id],
    queryFn: () => getSteerVaultAprTimeseries({ vaultId: vault.id }),
  })

  return <_SteerAPRChart loading={isInitialLoading} timeseries={data} />
}
