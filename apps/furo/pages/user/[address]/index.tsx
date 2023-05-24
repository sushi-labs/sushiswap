import { ChainId } from '@sushiswap/chain'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { Layout } from '../../../components'

const Dashboard = dynamic(() => import('../../../components/Dashboard').then((mod) => mod.Dashboard), { ssr: false })

import { NextSeo } from 'next-seo'

import { FuroStreamChainId } from '@sushiswap/furo'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'

const UserDashboard = () => {
  const router = useRouter()
  const chainId = (router.query.chainId ? Number(router.query.chainId) : ChainId.ETHEREUM) as FuroStreamChainId
  const address = router.query.address as string
  const show = router.query.show

  return (
    <SplashController>
      <NextSeo title="User" />
      <Layout>
        <Dashboard chainId={chainId} address={address} showOutgoing={show === 'outgoing'} />
      </Layout>
    </SplashController>
  )
}

export default UserDashboard
