import { SplashController } from '@sushiswap/ui'
import { Address } from '@sushiswap/wagmi'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import { Layout } from '../../../components'

const Dashboard = dynamic(() => import('../../../components/Dashboard').then((mod) => mod.Dashboard), { ssr: false })

const UserDashboard = () => {
  const router = useRouter()
  const address = router.query.address as Address

  return (
    <SplashController>
      <NextSeo title="User" />
      <Layout>
        <Dashboard address={address} />
      </Layout>
    </SplashController>
  )
}

export default UserDashboard
