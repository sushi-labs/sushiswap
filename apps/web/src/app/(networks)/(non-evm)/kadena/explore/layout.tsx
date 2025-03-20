import { Container } from '@sushiswap/ui'
import {  POOL_SUPPORTED_NETWORKS } from 'src/config'
import { SidebarContainer, SidebarProvider } from '../_common/ui/sidebar'
import { Header } from '../header'

import { GlobalStatsCharts } from 'src/ui/explore/global-stats-charts'
import { PoolsFiltersProvider } from 'src/ui/pool'

export const metadata = {
  title: 'Pools 💦',
}

export default function PoolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Header />
         <SidebarContainer
           supportedNetworks={POOL_SUPPORTED_NETWORKS}
           unsupportedNetworkHref={'/ethereum/explore/pools'}
           shiftContent
         >
           <main className="flex flex-col h-full flex-1">
             <Container maxWidth="7xl" className="px-4 py-4">
               <GlobalStatsCharts chainId={1} />
             </Container>
             <Container maxWidth="7xl" className="px-4 flex gap-2 pb-4">
             </Container>
             <section className="flex flex-col flex-1">
               <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10 min-h-screen">
                 <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
               </div>
             </section>
           </main>
         </SidebarContainer>
    </SidebarProvider>
  )
}
