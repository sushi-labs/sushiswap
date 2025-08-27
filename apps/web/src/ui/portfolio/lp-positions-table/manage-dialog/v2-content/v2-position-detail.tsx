import { Positions } from '../positions'

export const V2PositionDetail = ({ position }: { position: any }) => {
  return (
    <div className="flex flex-col gap-3">
      <Positions position={position} />
    </div>
  )
}
