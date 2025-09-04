import { type FC, useEffect } from 'react'

import { useSushiSwapV2Pool } from '../../hooks/pools/hooks/useSushiSwapV2Pools'
import { PoolFinderType, type SushiSwapV2PoolFinderProps } from './types'

export const SushiSwapV2Pool: FC<SushiSwapV2PoolFinderProps> = ({
  chainId,
  dispatch,
  token0,
  token1,
  index,
}) => {
  const { data: state } = useSushiSwapV2Pool(chainId, token0, token1)

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
