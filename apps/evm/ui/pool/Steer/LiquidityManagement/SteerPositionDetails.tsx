'use client'

import { SteerVault } from '@sushiswap/client/src/pure/steer-vault/vault'
import React, { FC } from 'react'

interface SteerPositionDetails {
  vault: SteerVault
}

export const SteerPositionDetails: FC<SteerPositionDetails> = ({ vault }) => {
  return <div>SteerPositionDetails</div>
}
