import { Container } from '@sushiswap/ui'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { getLoggedInSessionData } from 'src/app/portal/_common/lib/client-config'
import { getStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { DashboardSidebar } from './_common/ui/dashboard-sidebar'

export default async function Layout({
  children,
  params,
}: { children: React.ReactNode; params: Promise<{ teamId: string }> }) {
  const teamId = (await params).teamId
  const client = await getStyroClient()
  const session = await getLoggedInSessionData()

  const teamResponse = await client.getTeamsTeamId({
    teamId,
  })

  const teamMemberShipResponse = await client.getTeamsTeamIdMembersUserId({
    teamId,
    userId: session.user.id,
  })

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['portal-getTeamsTeamIdMembersUserId', teamId, session.user.id],
    queryFn: () => {
      return teamMemberShipResponse.data
    },
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="inline-flex flex-1 overflow-y-auto">
        <DashboardSidebar team={teamResponse.data.team} />
        <div className="overflow-y-auto w-full [scrollbar-gutter:stable]">
          <Container maxWidth="5xl" className="p-8">
            {children}
          </Container>
        </div>
      </div>
    </HydrationBoundary>
  )
}
