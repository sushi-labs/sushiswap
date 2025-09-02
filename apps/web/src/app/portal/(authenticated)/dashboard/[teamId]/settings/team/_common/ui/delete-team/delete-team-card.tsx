import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { CheckerCustom } from 'src/app/portal/_common/ui/checker/checker-custom/checker-custom'
import { CheckerRoleServer } from 'src/app/portal/_common/ui/checker/checker-role/checker-role-server'
import { DeleteTeamDialog } from './delete-team-dialog'

interface DeleteTeamCard {
  teamId: string
}

export async function DeleteTeamCard({ teamId }: DeleteTeamCard) {
  const client = await getUserStyroClient()

  const teamResponse = await client.getTeamsTeamId({ teamId })

  return (
    <Card className="h-min">
      <CardHeader className="rounded-t-xl">
        <CardTitle>Delete Team</CardTitle>
        <CardDescription>Permanently delete the team</CardDescription>
      </CardHeader>
      <CardContent className="rounded-b-xl">
        <DeleteTeamDialog teamId={teamId}>
          <div>
            <CheckerCustom
              disableWhen={teamResponse.data.team.type === 'personal'}
              message="Personal teams cannot be deleted."
            >
              {(disabled) => (
                <CheckerRoleServer
                  disabled={disabled}
                  message="You must be the owner of the team to delete it."
                  requiredRole="owner"
                  teamId={teamId}
                >
                  {(disabled) => (
                    <Button variant="destructive" fullWidth disabled={disabled}>
                      Delete
                    </Button>
                  )}
                </CheckerRoleServer>
              )}
            </CheckerCustom>
          </div>
        </DeleteTeamDialog>
      </CardContent>
    </Card>
  )
}
