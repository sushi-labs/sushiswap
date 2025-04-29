import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { ManageTeamForm } from './manage-team-form'

interface ManageTeamCard {
  teamId: string
}

export async function ManageTeamCard({ teamId }: ManageTeamCard) {
  const client = await getUserStyroClient()
  const team = await client.getTeamsTeamId({ teamId })

  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="rounded-t-xl">
        <CardTitle>Manage Team</CardTitle>
        <CardDescription>Manage your team</CardDescription>
      </CardHeader>
      <CardContent className="rounded-b-xl">
        <ManageTeamForm team={{ id: teamId, name: team.data.team.name }} />
      </CardContent>
    </Card>
  )
}
