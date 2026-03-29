import { GeoBlockedMessage } from '../_ui/_common'
import { Topographic } from './_ui/topographic'

export default async function PerpsPortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#0D1421] min-h-[calc(100vh-56px)] relative overflow-hidden">
      <div className="z-[1] relative">
        <GeoBlockedMessage />
        {children}
      </div>
      <Topographic className="absolute z-[0] top-0 translate-x-[11%] -right-[11%] w-full h-full" />
    </div>
  )
}
