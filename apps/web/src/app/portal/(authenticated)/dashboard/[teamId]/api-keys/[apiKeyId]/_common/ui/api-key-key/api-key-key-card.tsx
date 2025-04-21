import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { ApiKeyKeyForm } from './api-key-key-form'

interface ApiKeyResetCard {
  teamId: string
  apiKeyId: string
}

export async function ApiKeyKeyCard({ teamId, apiKeyId }: ApiKeyResetCard) {
  const client = await getUserStyroClient()

  const response = await client.getTeamsTeamIdApiKeysApiKeyId({
    teamId,
    apiKeyId,
  })

  return (
    <Card className="w-full min-w-[470px]">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>API Key</CardTitle>
        <CardDescription>View or reset the key</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <ApiKeyKeyForm teamId={teamId} apiKey={response.data.team.apiKey} />
      </CardContent>
    </Card>
  )
}
