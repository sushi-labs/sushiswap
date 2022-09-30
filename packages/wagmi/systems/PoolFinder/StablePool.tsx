import { Fee } from '@sushiswap/exchange'
import { FC, useEffect } from 'react'

import { useStablePool } from '../../hooks'
import { PoolFinderType, TridentPoolFinderProps } from './types'

export const StablePool: FC<TridentPoolFinderProps> = ({
  chainId,
  dispatch,
  token0,
  token1,
  index,
  fee = Fee.DEFAULT,
  twap = false,
}) => {
  const state = useStablePool(chainId, token0, token1, fee, twap)
  console.log('im stable pool finder', state)
  useEffect(() => {
    if (!dispatch || index === undefined) return

    dispatch({
      type: 'update',
      payload: {
        state,
        index,
        poolType: PoolFinderType.Stable,
      },
    })
  }, [dispatch, index, state])

  return <></>
}
