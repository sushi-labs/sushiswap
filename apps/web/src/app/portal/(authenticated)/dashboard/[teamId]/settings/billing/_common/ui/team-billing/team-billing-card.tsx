import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  List,
} from '@sushiswap/ui'
import { formatDistance } from 'date-fns/esm'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'

export async function TeamBillingCard({ teamId }: { teamId: string }) {
  const client = await getUserStyroClient()
  const response = await client.getTeamsTeamIdBilling({ teamId })

  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>Billing</CardTitle>
        <CardDescription>Plan renewal and billing details</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <List>
          <List.Control>
            <List.KeyValue
              flex
              title="Last Renewed"
              className="whitespace-nowrap"
            >
              <HoverCard openDelay={0} closeDelay={0}>
                <HoverCardTrigger>
                  <span className="decoration-dotted underline underline-offset-2">
                    {formatDistance(
                      response.data.team.lastRenewalDate,
                      new Date(),
                      { addSuffix: true },
                    )}
                  </span>
                </HoverCardTrigger>
                <HoverCardContent side="top">
                  {response.data.team.lastRenewalDate.toLocaleDateString(
                    undefined,
                    { hour: 'numeric', minute: 'numeric' },
                  )}
                </HoverCardContent>
              </HoverCard>
            </List.KeyValue>
            <List.KeyValue
              flex
              title="Next Renewal"
              className="whitespace-nowrap"
            >
              <HoverCard openDelay={0} closeDelay={0}>
                <HoverCardTrigger>
                  <span className="decoration-dotted underline underline-offset-2">
                    {formatDistance(
                      response.data.team.nextRenewalDate,
                      new Date(),
                      { addSuffix: true },
                    )}
                  </span>
                </HoverCardTrigger>
                <HoverCardContent side="top">
                  {response.data.team.nextRenewalDate.toLocaleDateString(
                    undefined,
                    { hour: 'numeric', minute: 'numeric' },
                  )}
                </HoverCardContent>
              </HoverCard>
            </List.KeyValue>
          </List.Control>
        </List>
      </CardContent>
    </Card>
  )
}
