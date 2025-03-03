'use client'

import {
  type SteerVaultId,
  getSteerVaultAprTimeseries,
} from '@sushiswap/steer-sdk'
import { useQuery } from '@tanstack/react-query'
import React, { type FC } from 'react'

import { _SteerAPRChart } from './_SteerAPRChart'

interface SteerAPRChartProps {
  vault: SteerVaultId
}

export const SteerAPRChart: FC<SteerAPRChartProps> = ({ vault }) => {
  const { data, isInitialLoading } = useQuery({
    queryKey: ['steer-vault-apr-timeseries', vault.id],
    queryFn: () => getSteerVaultAprTimeseries({ vaultId: vault.id }),
  })

  return <_SteerAPRChart loading={isInitialLoading} timeseries={data} />
}
