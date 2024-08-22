import React, { FC } from 'react'
import { SteerAccountPositionVault } from 'src/lib/wagmi/hooks/steer/useSteerAccountPositionsExtended'

export const SteerStrategyCell: FC<{ vault: SteerAccountPositionVault }> = ({
  vault,
}) => {
  return <div>{vault.strategy}</div>
}
