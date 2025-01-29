import { Container } from '@sushiswap/ui'
import { DashboardSidebar } from './_common/ui/dashboard-sidebar'

export default async function Layout({
  children,
  params,
}: { children: React.ReactNode; params: Promise<{ teamId: string }> }) {
  const teamId = (await params).teamId

  return (
    <div className="flex flex-row flex-1 items-stretch">
      <DashboardSidebar teamId={teamId} />
      <Container maxWidth="5xl" className="p-8">
        {children}
      </Container>
    </div>
  )
}
