import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  SkeletonBox,
} from '@sushiswap/ui'
import { Suspense } from 'react'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'

export function TeamMonthlyUsageCard({ teamId }: { teamId: string }) {
  return (
    <Card>
      <CardContent className="pt-6 text-sm">
        <div className="space-y-2 items-end flex flex-col">
          <Suspense fallback={<MonthlyUsageLoading />}>
            <MonthlyUsage teamId={teamId} />
          </Suspense>
        </div>
      </CardContent>
    </Card>
  )
}

function MonthlyUsageLoading() {
  return (
    <>
      <div className="flex flex-row justify-between w-full">
        <span>Monthly Requests</span>
        <span>
          <SkeletonBox className="w-40 h-[20px]" />
        </span>
      </div>

      <SkeletonBox className="rounded-full h-[16px] w-full" />
    </>
  )
}

async function MonthlyUsage({ teamId }: { teamId: string }) {
  const client = await getUserStyroClient()

  const [teamBillingResponse, teamPlanResponse] = await Promise.all([
    client.getTeamsTeamIdBilling({ teamId }),
    client.getTeamsTeamIdPlan({ teamId }),
  ])

  const used = teamBillingResponse.data.team.swapRequestsUsed
  const allowance = teamPlanResponse.data.team.plan.swapRateLimit.perMonth

  const percentage = Number(used / allowance) * 100

  return (
    <>
      <div className="flex flex-row justify-between w-full">
        <span>Monthly Requests</span>
        <span>
          {used.toLocaleString()} / {allowance.toLocaleString()}
        </span>
      </div>

      <Progress value={percentage} />
    </>
  )
}
