import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { TeamMembersTable } from './team-members-table'

export async function TeamMembersCard({ teamId }: { teamId: string }) {
  const client = await getUserStyroClient()
  const response = await client.getTeamsTeamIdMembers({ teamId })

  return (
    <Card className="h-min">
      <CardHeader className="rounded-t-xl">
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Explore and manage members</CardDescription>
      </CardHeader>
      <CardContent className="rounded-b-xl">
        <TeamMembersTable team={response.data.team} />
      </CardContent>
    </Card>
  )
}
