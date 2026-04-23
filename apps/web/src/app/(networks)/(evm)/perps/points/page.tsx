import { Container } from '@sushiswap/ui'
import { GeoBlockedMessage } from '../_ui/_common'
import { PointsPage } from './_ui/points-page'

export default function PerpsPointsPage() {
  return (
    <div className="overflow-x-hidden min-h-[calc(100vh-56px)] bg-[#0D1421]">
      <GeoBlockedMessage />
      <Container maxWidth="7xl" className="px-2 pb-4 pt-6 md:px-4 md:pt-12">
        <PointsPage />
      </Container>
    </div>
  )
}
