import { TeamBalanceChangesCard } from './_common/ui/team-balance-changes/team-balance-changes-card'
import { TeamBalanceCard } from './_common/ui/team-balance/team-balance-card'
import { TeamBillingCard } from './_common/ui/team-billing/team-billing-card'
import { TeamPlanCard } from './_common/ui/team-plan/team-plan-card'

export default async function Page({
  params,
}: { params: Promise<{ teamId: string }> }) {
  const teamId = (await params).teamId

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-row space-x-8">
        <div className="flex flex-col space-y-8">
          <TeamBalanceCard teamId={teamId} />
          <TeamBillingCard teamId={teamId} />
        </div>
        <TeamPlanCard teamId={teamId} />
      </div>
      <TeamBalanceChangesCard teamId={teamId} />
    </div>
  )
}
