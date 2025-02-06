import { ManageTeamCard } from './_common/ui/manage-team/manage-team-card'
import { TeamDetailsCard } from './_common/ui/team-details/team-details-card'

export default async function Page({
  params,
}: { params: Promise<{ teamId: string }> }) {
  const teamId = (await params).teamId

  return (
    <div className="flex flex-row space-x-8">
      <TeamDetailsCard teamId={teamId} />
      <ManageTeamCard teamId={teamId} />
    </div>
  )
}
