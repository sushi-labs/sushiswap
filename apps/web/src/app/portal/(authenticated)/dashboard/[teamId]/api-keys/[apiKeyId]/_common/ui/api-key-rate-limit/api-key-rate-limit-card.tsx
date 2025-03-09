import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TextField,
} from '@sushiswap/ui'
import { getStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { ApiKeyRateLimitForm } from './api-key-rate-limit-form'

export async function ApiKeyRateLimitCard({
  teamId,
  apiKeyId,
}: {
  teamId: string
  apiKeyId: string
}) {
  const client = await getStyroClient()
  const apiKeyResponse = await client.getTeamsTeamIdApiKeysApiKeyId({
    teamId,
    apiKeyId,
  })
  const planResponse = await client.getTeamsTeamIdPlan({
    teamId,
  })

  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>Rate Limit</CardTitle>
        <CardDescription>Change the key's rate limit settings</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <ApiKeyRateLimitForm
          teamId={teamId}
          apiKey={apiKeyResponse.data.team.apiKey}
          plan={planResponse.data.team.plan}
        />
      </CardContent>
    </Card>
  )
}
