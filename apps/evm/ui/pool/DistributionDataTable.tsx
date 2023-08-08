import { AngleRewardsPool } from '@sushiswap/react-query'
import { DataTable } from '@sushiswap/ui'
import { ColumnDef } from '@tanstack/react-table'
import { FC, useMemo } from 'react'

import {
  DISTRIBUTION_DATA_END_COLUMN,
  DISTRIBUTION_DATA_OOR_INCENTIVIZED_COLUMN,
  DISTRIBUTION_DATA_REWARD_COLUMN,
  DISTRIBUTION_DATA_START_COLUMN,
} from './columns'

interface DistributionDataTableProps {
  isLoading: boolean
  data?: AngleRewardsPool['distributionData']
}

const COLUMNS = [
  DISTRIBUTION_DATA_REWARD_COLUMN,
  DISTRIBUTION_DATA_START_COLUMN,
  DISTRIBUTION_DATA_END_COLUMN,
  DISTRIBUTION_DATA_OOR_INCENTIVIZED_COLUMN,
] satisfies ColumnDef<AngleRewardsPool['distributionData'][0], unknown>[]

export const DistributionDataTable: FC<DistributionDataTableProps> = ({ isLoading, data }) => {
  const _data = useMemo(() => {
    return data ?? []
  }, [data])

  return <DataTable loading={isLoading} columns={COLUMNS} data={_data} />
}
