import { PositionCard } from './PositionCard'
import React from 'react'
import { useUserPositions } from '../../lib/hooks'
import { SUPPORTED_CHAIN_IDS } from '../../config'
import { useAccount } from 'wagmi'

export const PositionCardList = () => {
  const { address } = useAccount()
  const { data: userPositions } = useUserPositions({ id: address, chainIds: SUPPORTED_CHAIN_IDS })

  return (
    <div className="grid grid-cols-3 gap-5">
      {userPositions
        ?.filter((el) => el.pool.version === 'LEGACY')
        .map((el, i) => (
          <PositionCard position={el} key={i} />
        ))}
    </div>
  )
}
