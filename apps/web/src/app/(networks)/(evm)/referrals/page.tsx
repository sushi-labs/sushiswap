import { Container } from '@sushiswap/ui'
import { ReferralLink } from './_ui/referral-link'
import { ReferralTable } from './_ui/referral-table'
import { Stats } from './_ui/stats'

export default function ReferralsPage() {
  return (
    <Container maxWidth="7xl" className="px-4 pt-16 pb-8 flex flex-col gap-6">
      <ReferralLink />
      <Stats />
      <ReferralTable />
    </Container>
  )
}
