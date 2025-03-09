import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TextField,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { getLoggedInSessionData } from 'src/app/portal/_common/lib/client-config'
import { getStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { ApiKeyKeyForm } from './api-key-key-form'
// import { ApiKeyDeleteDialog } from './api-key-delete-dialog'

interface ApiKeyResetCard {
  teamId: string
  apiKeyId: string
}

export async function ApiKeyKeyCard({ teamId, apiKeyId }: ApiKeyResetCard) {
  const session = await getLoggedInSessionData()
  const client = await getStyroClient()

  const keyResponse = await client.getTeamsTeamIdApiKeysApiKeyId({
    teamId,
    apiKeyId,
  })
  const memberResponse = await client.getTeamsTeamIdMembersUserId({
    teamId,
    userId: session.user.id,
  })

  return (
    <Card className="w-full min-w-[470px]">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>API Key</CardTitle>
        <CardDescription>View or reset the key</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <ApiKeyKeyForm
          teamId={teamId}
          teamMembership={memberResponse.data.member}
          apiKey={keyResponse.data.team.apiKey}
        />
      </CardContent>
    </Card>
  )
}
