import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { getStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { ManageTeamForm } from './manage-team-form'

interface ManageTeamCard {
  teamId: string
}

export async function ManageTeamCard({ teamId }: ManageTeamCard) {
  const client = await getStyroClient()
  const team = await client.getTeamsTeamId({ teamId })

  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>Manage Team</CardTitle>
        <CardDescription>Manage your team</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <ManageTeamForm team={{ id: teamId, name: team.data.team.name }} />
      </CardContent>
    </Card>
  )
}
