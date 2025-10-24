import type { PortfolioV2PositionPoolType } from '@sushiswap/graph-client/data-api'
import { Positions } from '../positions'

export const V2PositionDetail = ({
  position,
}: { position: PortfolioV2PositionPoolType }) => {
  return (
    <div className="flex flex-col gap-3">
      <Positions position={position} />
    </div>
  )
}
