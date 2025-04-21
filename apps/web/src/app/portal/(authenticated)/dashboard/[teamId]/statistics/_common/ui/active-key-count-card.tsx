import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  SkeletonBox,
} from '@sushiswap/ui'
import { Suspense } from 'react'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'

export async function ActiveKeyCountCard({ teamId }: { teamId: string }) {
  return (
    <Card className="!gap-2 w-full">
      <CardHeader>
        <CardDescription>Active Key Count</CardDescription>
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
            <KeyCount teamId={teamId} />
          </Suspense>
        </div>
      </CardContent>
    </Card>
  )
}

async function KeyCount({ teamId }: { teamId: string }) {
  const client = await getUserStyroClient()
  const response = await client.getTeamsTeamIdApiKeys({
    teamId,
  })

  return (
    <span>
      {response.data.team.apiKeys.filter((key) => key.enabled).length}
    </span>
  )
}
