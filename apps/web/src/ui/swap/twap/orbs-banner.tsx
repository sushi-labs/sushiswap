import { OrbsIcon } from '@sushiswap/ui/icons/OrbsIcon'

export const OrbsBanner = () => {
  return (
    <div className="flex justify-center items-center gap-2">
      <span>Powered by Orbs</span>
      <OrbsIcon width={21} height={21} />
    </div>
  )
}
