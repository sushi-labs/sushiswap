import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { getLoggedInSessionData } from 'src/app/portal/_common/lib/client-config'
import { getStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { DeleteTeamDialog } from './delete-team-dialog'

interface DeleteTeamCard {
  teamId: string
}

export async function DeleteTeamCard({ teamId }: DeleteTeamCard) {
  const session = await getLoggedInSessionData()
  const client = await getStyroClient()

  const teamResponse = await client.getTeamsTeamId({ teamId })
  const memberResponse = await client.getTeamsTeamIdMembersUserId({
    teamId,
    userId: session.user.id,
  })

  const error = (() => {
    if (memberResponse.data.member.role !== 'owner') {
      return 'You must be the owner of the team to delete it.'
    }

    if (teamResponse.data.team.type === 'personal') {
      return 'Personal teams cannot be deleted.'
    }
  })()

  return (
    <Card className="w-full min-w-[470px]">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>Delete Team</CardTitle>
        <CardDescription>Permanently delete the team</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <DeleteTeamDialog teamId={teamId}>
          <div>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <span>
                    <Button variant="destructive" fullWidth disabled={!!error}>
                      Delete
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  align="end"
                  className="!bg-background !p-4"
                  hidden={!error}
                >
                  {error}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DeleteTeamDialog>
      </CardContent>
    </Card>
  )
}
