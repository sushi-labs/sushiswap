'use client'

import { useQuery } from '@tanstack/react-query'
import React, { type FC } from 'react'

import { getSteerVaultAprTimeseries } from '../../fetchers/get-vault-apr-timeseries'
import type { SteerVaultId } from '../../types'
import SteerAPRChartInternal from './steer-apr-chart.internal'

interface SteerAPRChartProps {
  vault: SteerVaultId
}

export const SteerAPRChart: FC<SteerAPRChartProps> = ({ vault }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['steer-vault-apr-timeseries', vault.id],
    queryFn: () => getSteerVaultAprTimeseries({ vaultId: vault.id }),
  })

  return <SteerAPRChartInternal loading={isLoading} timeseries={data} />
}
