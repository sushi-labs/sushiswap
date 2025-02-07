import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { ManageTeamForm } from './manage-team-form'

interface ManageTeamCard {
  teamId: string
}

export async function ManageTeamCard({ teamId }: ManageTeamCard) {
  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>Manage Team</CardTitle>
        <CardDescription>Manage your team</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <ManageTeamForm
          team={{ id: teamId, name: 'Sushi Team', memberPermissions: 'none' }}
        />
      </CardContent>
    </Card>
  )
}
