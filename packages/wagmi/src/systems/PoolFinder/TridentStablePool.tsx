import { FC, useEffect } from 'react'
import { Fee } from 'sushi/dex'

import { useTridentStablePool } from '../../hooks'
import { PoolFinderType, TridentPoolFinderProps } from './types'

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
