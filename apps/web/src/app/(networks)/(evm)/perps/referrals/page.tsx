import { Container } from '@sushiswap/ui'
import { GeoBlockedMessage } from '../_ui/_common'
import { ReferralsPage } from './_ui/referrals-page'

export default function PerpsReferralsPage() {
  return (
    <div className="overflow-x-hidden min-h-[calc(100vh-56px)] bg-perps-background">
      <GeoBlockedMessage />
      <Container maxWidth="7xl" className="px-2 pb-4 pt-6 md:px-4 md:pt-12">
        <ReferralsPage />
      </Container>
    </div>
  )
}
