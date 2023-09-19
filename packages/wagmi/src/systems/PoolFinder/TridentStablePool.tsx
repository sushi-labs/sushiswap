import { Fee } from '@sushiswap/amm'
import { FC, useEffect } from 'react'

import { useTridentStablePool } from '../../hooks/index.js'
import { PoolFinderType, TridentPoolFinderProps } from './types.js'

export const TridentStablePool: FC<TridentPoolFinderProps> = ({
  chainId,
  dispatch,
  token0,
  token1,
  index,
  fee = Fee.DEFAULT,
  twap = false,
}) => {
  const state = useTridentStablePool(chainId, token0, token1, fee, twap)
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
