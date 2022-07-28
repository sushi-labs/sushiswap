import { Button } from '@sushiswap/ui'
import { FC } from 'react'

import { Pair } from '../../.graphclient'

interface PoolButtonsProps {
  pair: Pair
}

// TODO buttons
export const PoolButtons: FC<PoolButtonsProps> = ({ pair }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button>Earn</Button>
      <Button variant="outlined">Trade</Button>
    </div>
  )
}
