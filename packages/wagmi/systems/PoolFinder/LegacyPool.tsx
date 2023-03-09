import { FC, useEffect } from 'react'

import { usePair } from '../../hooks'
import { LegacyPoolFinderProps, PoolFinderType } from './types'

export const LegacyPool: FC<LegacyPoolFinderProps> = ({ chainId, dispatch, token0, token1, index }) => {
  const { data: state } = usePair(chainId, token0, token1)

  useEffect(() => {
    if (!dispatch || index === undefined) return

    dispatch({
      type: 'update',
      payload: {
        state,
        index,
        poolType: PoolFinderType.Classic,
      },
    })
  }, [dispatch, index, state])

  return <></>
}
