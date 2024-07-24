import React, { FC } from 'react'
import { SteerStrategyConfig } from '../../../../Steer/constants'
import { SteerAccountPositionVault } from 'src/lib/wagmi/hooks/steer/useSteerAccountPositionsExtended'

export const SteerStrategyCell: FC<{ vault: SteerAccountPositionVault }> = ({ vault }) => {
  return <div>{SteerStrategyConfig[vault.strategy].name}</div>
}
