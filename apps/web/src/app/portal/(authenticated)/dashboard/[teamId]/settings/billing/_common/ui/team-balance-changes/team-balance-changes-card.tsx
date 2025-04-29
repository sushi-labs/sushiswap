import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { TeamBalanceChangesTable } from './team-balance-changes-table'

export async function TeamBalanceChangesCard({ teamId }: { teamId: string }) {
  const client = await getUserStyroClient()
  const response = await client.getTeamsTeamIdBilling({
    teamId,
  })

  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="rounded-t-xl">
        <CardTitle>Balance Changes</CardTitle>
        <CardDescription>Deposits and deductions</CardDescription>
      </CardHeader>
      <CardContent className="rounded-b-xl">
        <TeamBalanceChangesTable team={response.data.team} />
      </CardContent>
    </Card>
  )
}
