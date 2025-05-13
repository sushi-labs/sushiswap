import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TextField,
} from '@sushiswap/ui'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { ApiKeyRateLimitForm } from './api-key-rate-limit-form'

export async function ApiKeyRateLimitCard({
  teamId,
  apiKeyId,
}: {
  teamId: string
  apiKeyId: string
}) {
  const client = await getUserStyroClient()
  const [apiKeyResponse, planResponse] = await Promise.all([
    client.getTeamsTeamIdApiKeysApiKeyId({
      teamId,
      apiKeyId,
    }),
    client.getTeamsTeamIdPlan({
      teamId,
    }),
  ])

  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="rounded-t-xl">
        <CardTitle>Rate Limit</CardTitle>
        <CardDescription>Change the key's rate limit settings</CardDescription>
      </CardHeader>
      <CardContent className="rounded-b-xl">
        <ApiKeyRateLimitForm
          teamId={teamId}
          apiKey={apiKeyResponse.data.team.apiKey}
          plan={planResponse.data.team.plan}
        />
      </CardContent>
    </Card>
  )
}
