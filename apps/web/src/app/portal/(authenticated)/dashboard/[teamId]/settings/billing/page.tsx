import { TeamBalanceChangesCard } from './_common/ui/team-balance-changes/team-balance-changes-card'
import { TeamBalanceCard } from './_common/ui/team-balance/team-balance-card'
import { TeamBillingCard } from './_common/ui/team-billing/team-billing-card'
import { TeamPlanCard } from './_common/ui/team-plan/team-plan-card'

export default async function Page({
  params,
}: { params: Promise<{ teamId: string }> }) {
  const teamId = (await params).teamId

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <TeamBalanceCard teamId={teamId} />
          <TeamBillingCard teamId={teamId} />
        </div>
        <TeamPlanCard teamId={teamId} />
      </div>
      <TeamBalanceChangesCard teamId={teamId} />
    </div>
  )
}
