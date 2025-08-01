import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { CheckerRoleServer } from 'src/app/portal/_common/ui/checker/checker-role/checker-role-server'
import { NewInviteDialog } from './new-invite-dialog'
import { TeamInvitesTable } from './team-invites-table'

export async function TeamInvitesCard({ teamId }: { teamId: string }) {
  const client = await getUserStyroClient()
  const [teamResponse, invitesResponse] = await Promise.all([
    client.getTeamsTeamId({ teamId }),
    client.getTeamsTeamIdInvites({ teamId }),
  ])

  if (teamResponse.data.team.type === 'personal') {
    return null
  }

  return (
    <Card className="h-min">
      <CardHeader className="!space-y-0 !flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Team Invites</CardTitle>
          <CardDescription>Create and delete invites</CardDescription>
        </div>
        <CheckerRoleServer
          teamId={teamId}
          message="Only admins and owners can create new invites"
          requiredRole="admin"
        >
          {(disabled) => (
            <NewInviteDialog teamId={teamId}>
              <Button disabled={disabled}>New Invite</Button>
            </NewInviteDialog>
          )}
        </CheckerRoleServer>
      </CardHeader>
      <CardContent>
        <TeamInvitesTable
          team={{ id: teamId, invites: invitesResponse.data.invites }}
        />
      </CardContent>
    </Card>
  )
}
