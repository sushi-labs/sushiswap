import { SteerVault } from '@sushiswap/client'
import React, { FC } from 'react'
import { SteerStrategyConfig } from '../../../../Steer/constants'

export const SteerStrategyCell: FC<{ vault: SteerVault }> = ({ vault }) => {
  return <div>{SteerStrategyConfig[vault.strategy].name}</div>
}
