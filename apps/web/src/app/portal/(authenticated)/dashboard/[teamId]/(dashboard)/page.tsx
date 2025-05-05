import { TeamApiKeyCard } from './_common/ui/team-api-key-card'
import { TeamMonthlyUsageCard } from './_common/ui/team-monthly-usage-card'

export default async function Page({
  params,
}: { params: Promise<{ teamId: string }> }) {
  const teamId = (await params).teamId

  return (
    <div className="space-y-6">
      <TeamMonthlyUsageCard teamId={teamId} />
      <TeamApiKeyCard teamId={teamId} />
    </div>
  )
}
