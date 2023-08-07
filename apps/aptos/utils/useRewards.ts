import { useMemo } from 'react'
import { userStakes } from './useUserHandle'
import { FarmLP } from './useFarms'

export function useRewards(
  farms: FarmLP | undefined,
  stakes: userStakes | undefined,
  pIdIndex: number | undefined,
  farmIndex: number | undefined
) {
  const ACC_SUSHI_PRECISION = 1000000000000
  return useMemo(() => {
    return stakes && stakes.data.current_table_items && pIdIndex && pIdIndex !== -1 && farmIndex && farmIndex !== -1
      ? (Number(stakes.data.current_table_items[pIdIndex].decoded_value.amount) *
          Number(farms?.data?.pool_info[farmIndex].acc_sushi_per_share)) /
          ACC_SUSHI_PRECISION -
          Number(stakes.data.current_table_items[pIdIndex].decoded_value.reward_debt)
      : 0
  }, [farms, stakes, pIdIndex, farmIndex])
}
