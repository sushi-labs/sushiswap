import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { BalanceTopUpDialog } from './balance-top-up-dialog'

export async function TeamBalanceCard({ teamId }: { teamId: string }) {
  const client = await getUserStyroClient()
  const response = await client.getTeamsTeamIdBilling({ teamId })

  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="rounded-t-xl">
        <CardTitle>Balance</CardTitle>
        <CardDescription>Your team's current balance</CardDescription>
      </CardHeader>
      <CardContent className="rounded-b-xl">
        <div className="space-y-1">
          <div className="text-4xl text-right">
            {response.data.team.balanceUSD.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </div>
          {/* <div className="text-sm text-slate-300 flex justify-between">
            <span>Which should last you until:</span>
            <span>29th of September 2024</span>
          </div> */}
        </div>
        <BalanceTopUpDialog teamId={teamId}>
          <Button>Top up</Button>
        </BalanceTopUpDialog>
      </CardContent>
    </Card>
  )
}
