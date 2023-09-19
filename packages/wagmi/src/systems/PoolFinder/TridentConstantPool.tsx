import { Fee } from '@sushiswap/amm'
import { FC, useEffect } from 'react'

import { useTridentConstantPool } from '../../hooks/index.js'
import { PoolFinderType, TridentPoolFinderProps } from './types.js'

export const TridentConstantPool: FC<TridentPoolFinderProps> = ({
  chainId,
  dispatch,
  token0,
  token1,
  index,
  fee = Fee.DEFAULT,
  twap = false,
}) => {
  const state = useTridentConstantPool(chainId, token0, token1, fee, twap)

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
