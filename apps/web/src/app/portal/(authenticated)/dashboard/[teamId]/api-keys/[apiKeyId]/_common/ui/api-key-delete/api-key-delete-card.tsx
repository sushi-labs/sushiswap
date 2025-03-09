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
import { ApiKeyDeleteDialog } from './api-key-delete-dialog'

interface ApiKeyDeleteCard {
  teamId: string
  apiKeyId: string
}

export async function ApiKeyDeleteCard({ teamId, apiKeyId }: ApiKeyDeleteCard) {
  const session = await getLoggedInSessionData()
  const client = await getStyroClient()

  const memberResponse = await client.getTeamsTeamIdMembersUserId({
    teamId,
    userId: session.user.id,
  })

  const error = (() => {
    if (
      memberResponse.data.member.role !== 'owner' &&
      memberResponse.data.member.role !== 'admin'
    ) {
      return 'You must be the owner or admin of the team to delete it.'
    }
  })()

  return (
    <Card className="w-full min-w-[470px]">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>Delete API Key</CardTitle>
        <CardDescription>Permanently delete the key</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <ApiKeyDeleteDialog teamId={teamId} apiKeyId={apiKeyId}>
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
        </ApiKeyDeleteDialog>
      </CardContent>
    </Card>
  )
}
