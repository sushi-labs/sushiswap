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
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { TeamChangePlanDialog } from './team-change-plan-dialog'

export async function TeamPlanCard({ teamId }: { teamId: string }) {
  const client = await getUserStyroClient()

  const [teamBillingResponse, teamPlanResponse, plansResponse] =
    await Promise.all([
      client.getTeamsTeamIdBilling({ teamId }),
      client.getTeamsTeamIdPlan({ teamId }),
      client.getPlans(),
    ])

  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="rounded-t-xl">
        <CardTitle>Plan</CardTitle>
        <CardDescription>The currently selected plan</CardDescription>
      </CardHeader>
      <CardContent className="rounded-b-xl">
        <List>
          <List.Control>
            <List.KeyValue flex title="Name">
              <span>{teamPlanResponse.data.team.plan.name}</span>
            </List.KeyValue>
            <List.KeyValue
              flex
              title="Cost"
              subtitle="Per month"
              className="whitespace-nowrap"
            >
              <span>
                {teamPlanResponse.data.team.plan.priceUSD.toLocaleString(
                  'en-US',
                  {
                    style: 'currency',
                    currency: 'USD',
                  },
                )}
              </span>
            </List.KeyValue>
            <List.KeyValue
              flex
              title="Rate Limit"
              subtitle="Per second"
              className="whitespace-nowrap"
            >
              <span>
                {teamPlanResponse.data.team.plan.swapRateLimit.perSecond}
              </span>
            </List.KeyValue>
            <List.KeyValue
              flex
              title="Rate Limit"
              subtitle="Per month"
              className="whitespace-nowrap"
            >
              <span>
                <FormattedNumber
                  number={String(
                    teamPlanResponse.data.team.plan.swapRateLimit.perMonth,
                  )}
                />
              </span>
            </List.KeyValue>
          </List.Control>
        </List>
        <TeamChangePlanDialog
          teamId={teamId}
          teamBalance={teamBillingResponse.data.team.balanceUSD}
          teamPlan={teamPlanResponse.data.team.plan}
          plans={plansResponse.data.plans}
        >
          <Button>Change Plan</Button>
        </TeamChangePlanDialog>
      </CardContent>
    </Card>
  )
}
