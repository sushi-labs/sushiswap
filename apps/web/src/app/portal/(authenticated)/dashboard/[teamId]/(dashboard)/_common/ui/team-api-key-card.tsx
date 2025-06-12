import {
  Button,
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
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { CheckerRoleServer } from 'src/app/portal/_common/ui/checker/checker-role/checker-role-server'
import { CreateApiKeyDialog } from './create-api-key-dialog'
import { TeamApiKeyTable } from './team-api-key-table'

export async function TeamApiKeyCard({ teamId }: { teamId: string }) {
  const client = await getUserStyroClient()

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['portal-getTeamsTeamIdApiKeys', teamId],
    queryFn: async () => {
      const response = await client.getTeamsTeamIdApiKeys({ teamId })
      return response
    },
  })

  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="!space-y-0 !flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>API Keys</CardTitle>
          <CardDescription>View, manage and delete keys</CardDescription>
        </div>
        <CheckerRoleServer
          teamId={teamId}
          message="Only admins and owners can create a new API key"
          requiredRole="admin"
        >
          {(disabled) => (
            <CreateApiKeyDialog teamId={teamId}>
              <Button disabled={disabled}>New Key</Button>
            </CreateApiKeyDialog>
          )}
        </CheckerRoleServer>
      </CardHeader>
      <CardContent>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <TeamApiKeyTable teamId={teamId} />
        </HydrationBoundary>
      </CardContent>
    </Card>
  )
}
