import { SteerVault } from '@sushiswap/client/src/pure/steer-vault/vault'
import React, { FC } from 'react'
import { SteerStrategyConfig } from 'ui/pool/Steer/constants'

export const SteerStrategyCell: FC<{ vault: SteerVault }> = ({ vault }) => {
  return <div>{SteerStrategyConfig[vault.strategy].name}</div>
}
