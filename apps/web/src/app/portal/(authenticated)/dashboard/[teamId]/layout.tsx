import { Container } from '@sushiswap/ui'
import { getStyroClient } from 'src/app/portal/_common/lib/styro/styro-client'
import { DashboardSidebar } from './_common/ui/dashboard-sidebar'

export default async function Layout({
  children,
  params,
}: { children: React.ReactNode; params: Promise<{ teamId: string }> }) {
  const teamId = (await params).teamId
  const client = await getStyroClient()
  const response = await client.getTeamsTeamId({ teamId })

  return (
    <div className="flex flex-row flex-1 items-stretch">
      <DashboardSidebar team={response.data.team} />
      <Container maxWidth="5xl" className="p-8">
        {children}
      </Container>
    </div>
  )
}
