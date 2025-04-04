import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { ApiKeyRestrictionsForm } from './api-key-restrictions-form'

export async function ApiKeyRestrictionsCard({
  teamId,
  apiKeyId,
}: {
  teamId: string
  apiKeyId: string
}) {
  const client = await getUserStyroClient()
  const response = await client.getTeamsTeamIdApiKeysApiKeyId({
    teamId,
    apiKeyId,
  })

  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>Restrictions</CardTitle>
        <CardDescription>
          Limit the key to specific IP addresses and origins
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl pb-0">
        <ApiKeyRestrictionsForm
          teamId={teamId}
          apiKey={response.data.team.apiKey}
        />
      </CardContent>
    </Card>
  )
}
