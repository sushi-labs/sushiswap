import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  Explainer,
  SkeletonBox,
} from '@sushiswap/ui'
import { Suspense } from 'react'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { formatNumber } from 'sushi'

export function TotalRequestsCard({ teamId }: { teamId: string }) {
  return (
    <Card className="!gap-2 w-full">
      <CardHeader>
        <CardDescription className="flex flex-row space-x-1 items-center">
          <span>Total Requests</span>
          <Explainer>In the last 24 hours.</Explainer>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-2xl font-medium">
        <div className="flex flex-row items-stretch justify-stretch">
          <Suspense
            fallback={
              <>
                <span className="w-0 opacity-0 select-none">3</span>
                <SkeletonBox className="text-2xl min-h-full w-full" />
              </>
            }
          >
            <TotalRequests teamId={teamId} />
          </Suspense>
        </div>
      </CardContent>
    </Card>
  )
}

async function TotalRequests({ teamId }: { teamId: string }) {
  const client = await getUserStyroClient()
  const response = await client.getTeamsTeamIdStatisticsUsagePerChain({
    teamId,
    type: '24h',
  })

  return (
    <span>
      {response.data.team.usagePerChain.total
        ? formatNumber(String(response.data.team.usagePerChain.total), 0)
        : '0'}
    </span>
  )
}
