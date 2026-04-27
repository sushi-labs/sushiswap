import { GeoBlockedMessage } from '../_ui/_common'
import { SushiBackground } from './_ui/sushi-background'

export default async function PerpsPortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-perps-background min-h-[calc(100vh-56px)] relative overflow-hidden">
      <div className="z-[1] relative">
        <GeoBlockedMessage />
        {children}
      </div>
      <SushiBackground className="absolute z-[0] top-0 translate-x-[11%] -right-[11%] w-full h-full" />
    </div>
  )
}
