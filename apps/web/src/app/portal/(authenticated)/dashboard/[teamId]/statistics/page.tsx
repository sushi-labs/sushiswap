import { ActiveKeyCountCard } from './_common/ui/active-key-count-card'
import { UsagePerKeyChart } from './_common/ui/chart/usage-per-key-chart'
import { SuccessRateCard } from './_common/ui/success-rate-card'
import { TotalRequestsCard } from './_common/ui/total-requests-card'

export default async function Page({
  params,
}: { params: Promise<{ teamId: string }> }) {
  const teamId = (await params).teamId

  return (
    <div className="space-y-6">
      <div className="flex flex-row gap-6 w-full">
        <TotalRequestsCard />
        <SuccessRateCard />
        <ActiveKeyCountCard teamId={teamId} />
      </div>
      <UsagePerKeyChart teamId={teamId} />
    </div>
  )
}
