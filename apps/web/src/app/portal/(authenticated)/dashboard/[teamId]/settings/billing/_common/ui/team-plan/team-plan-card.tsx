import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FormattedNumber,
  List,
} from '@sushiswap/ui'
import { getStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'

export async function TeamPlanCard({ teamId }: { teamId: string }) {
  const client = await getStyroClient()
  const response = await client.getTeamsTeamIdPlan({ teamId })

  response.data.team.plan.name

  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>Plan</CardTitle>
        <CardDescription>The currently selected plan</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <List>
          <List.Control>
            <List.KeyValue flex title="Name">
              <span>{response.data.team.plan.name}</span>
            </List.KeyValue>
            <List.KeyValue
              flex
              title="Cost"
              subtitle="Per month"
              className="whitespace-nowrap"
            >
              <span>
                {response.data.team.plan.priceUSD.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </span>
            </List.KeyValue>
            <List.KeyValue
              flex
              title="Rate Limit"
              subtitle="Per second"
              className="whitespace-nowrap"
            >
              <span>{response.data.team.plan.swapRateLimit.perSecond}</span>
            </List.KeyValue>
            <List.KeyValue
              flex
              title="Rate Limit"
              subtitle="Per month"
              className="whitespace-nowrap"
            >
              <span>
                <FormattedNumber
                  number={response.data.team.plan.swapRateLimit.perMonth}
                />
              </span>
            </List.KeyValue>
          </List.Control>
        </List>
        <Button>Change Plan</Button>
      </CardContent>
    </Card>
  )
}
