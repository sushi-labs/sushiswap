import { ActiveKeyCountCard } from './_common/ui/active-key-count-card'
import { UsagePerChainChart } from './_common/ui/chart/usage-per-chain-chart'
import { UsagePerKeyChart } from './_common/ui/chart/usage-per-key-chart'
import { SuccessRateCard } from './_common/ui/success-rate-card'
import { TotalRequestsCard } from './_common/ui/total-requests-card'
import { UsagePerIpTable } from './_common/ui/usage-per-ip-table'
import { UsagePerOriginTable } from './_common/ui/usage-per-origin-table'

export default async function Page({
  params,
}: { params: Promise<{ teamId: string }> }) {
  const teamId = (await params).teamId

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <TotalRequestsCard teamId={teamId} />
        <SuccessRateCard teamId={teamId} />
        <ActiveKeyCountCard teamId={teamId} />
      </div>
      <UsagePerKeyChart teamId={teamId} />
      <UsagePerChainChart teamId={teamId} />
      {/* <div className="flex flex-row gap-6 [&>*]:flex-1"> */}
      {/* <UsagePerIpTable teamId={teamId} /> */}
      <UsagePerOriginTable teamId={teamId} />
      {/* </div> */}
    </div>
  )
}
