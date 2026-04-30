import { GeoBlockedMessage } from '../_ui/_common'

export default async function PerpsPortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-perps-background min-h-[calc(100vh-56px)] overflow-hidden">
      <GeoBlockedMessage />
      {children}
    </div>
  )
}
