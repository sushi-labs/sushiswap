import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardLabel,
  CardTitle,
  List,
} from '@sushiswap/ui'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { CopyButton } from 'src/app/portal/_common/ui/copy-button'

interface TeamDetailsCard {
  teamId: string
}

export async function TeamDetailsCard({ teamId }: TeamDetailsCard) {
  const client = await getUserStyroClient()

  const response = await client.getTeamsTeamId({ teamId })

  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="rounded-t-xl">
        <CardTitle>Team Details</CardTitle>
        <CardDescription>Useful when requesting support</CardDescription>
      </CardHeader>
      <CardContent className="rounded-b-xl">
        <List>
          <List.Control>
            <List.KeyValue flex title="ID">
              <span>{teamId}</span>
              <CopyButton value={teamId} />
            </List.KeyValue>
            <List.KeyValue flex title="Type">
              <span className="capitalize">{response.data.team.type}</span>
            </List.KeyValue>
          </List.Control>
        </List>
      </CardContent>
    </Card>
  )
}
