import { Container } from '@sushiswap/ui'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { getLoggedInSessionData } from 'src/app/portal/_common/lib/client-config'
import { getUserStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { DashboardSidebar } from './_common/ui/dashboard-sidebar'
import { TeamCookieUpdater } from './_common/ui/team-cookie-updater'

export default async function Layout({
  children,
  params,
}: { children: React.ReactNode; params: Promise<{ teamId: string }> }) {
  const teamId = (await params).teamId

  const client = await getUserStyroClient()
  const session = await getLoggedInSessionData()

  const [teamResponse, teamMembershipResponse] = await Promise.all([
    client.getTeamsTeamId({
      teamId,
    }),
    client.getTeamsTeamIdMembersUserId({
      teamId,
      userId: session.user.id,
    }),
  ])

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['portal-getTeamsTeamIdMembersUserId', teamId, session.user.id],
    queryFn: () => {
      return teamMembershipResponse.data
    },
  })

  return (
    <>
      <TeamCookieUpdater teamId={teamId} />
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
    </>
  )
}
