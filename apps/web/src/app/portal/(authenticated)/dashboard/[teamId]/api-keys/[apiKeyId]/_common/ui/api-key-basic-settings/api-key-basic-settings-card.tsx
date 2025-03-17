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
import { ApiKeyBasicSettingsForm } from './api-key-basic-settings-form'

export async function ApiKeyBasicSettingsCard({
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
        <CardTitle>Basic Settings</CardTitle>
        <CardDescription>
          Change the name of the key, enable or disable it
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <ApiKeyBasicSettingsForm
          teamId={teamId}
          apiKey={response.data.team.apiKey}
        />
      </CardContent>
    </Card>
  )
}
