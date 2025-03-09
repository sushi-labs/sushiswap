import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { getStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { TeamApiKeyTable } from './team-api-key-table'

export async function TeamApiKeyCard({ teamId }: { teamId: string }) {
  const queryClient = new QueryClient()

  const client = await getStyroClient()

  await queryClient.prefetchQuery({
    queryKey: ['portal-getTeamsTeamIdApiKeys', teamId],
    queryFn: async () => {
      const response = await client.getTeamsTeamIdApiKeys({ teamId })

      return response.data.team
    },
  })

  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>API Keys</CardTitle>
        <CardDescription>View, manage and delete keys</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <TeamApiKeyTable teamId={teamId} />
        </HydrationBoundary>
      </CardContent>
    </Card>
  )
}
