import { DeleteTeamCard } from './_common/ui/delete-team/delete-team-card'
import { ManageTeamCard } from './_common/ui/manage-team/manage-team-card'
import { TeamDetailsCard } from './_common/ui/team-details/team-details-card'
import { TeamInvitesCard } from './_common/ui/team-invites/team-invites-card'
import { TeamMembersCard } from './_common/ui/team-members/team-members-card'

export default async function Page({
  params,
}: { params: Promise<{ teamId: string }> }) {
  const teamId = (await params).teamId

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-row space-x-8">
        <div className="flex flex-col space-y-8">
          <TeamDetailsCard teamId={teamId} />
          <DeleteTeamCard teamId={teamId} />
        </div>
        <ManageTeamCard teamId={teamId} />
      </div>
      <TeamMembersCard teamId={teamId} />
      <TeamInvitesCard teamId={teamId} />
    </div>
  )
}
