import { ChainId } from '@sushiswap/chain'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { SWRConfig } from 'swr'

import { BackgroundVector, Layout } from '../../../components'
import { getUserStreams, getUserVestings } from '../../../lib'

const Dashboard = dynamic(() => import('../../../components/Dashboard').then((mod) => mod.Dashboard), { ssr: false })

import { NextSeo } from 'next-seo'

import { type Stream as StreamDTO, type Transaction as TransactionDTO } from '../../../.graphclient'
import { FuroStreamChainId } from '@sushiswap/furo'

interface Props {
  fallback?: {
    vesting?: StreamDTO
    transactions?: TransactionDTO[]
  }
}
export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  if (typeof query.address !== 'string') return { props: { fallback: {} } }
  const chainId = ((query.chainId as string) || ChainId.ETHEREUM).toString()

  return {
    props: {
      fallback: {
        [`/api/user/${chainId}/${query.address}/streams`]: await getUserStreams(chainId, query.address),
        [`/api/user/${chainId}/${query.address}/vestings`]: await getUserVestings(chainId, query.address),
      },
    },
  }
}

const UserDashboard: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  const router = useRouter()
  const chainId = (router.query.chainId ? Number(router.query.chainId) : ChainId.ETHEREUM) as FuroStreamChainId
  const address = router.query.address as string
  const show = router.query.show

  return (
    <SWRConfig value={{ fallback }}>
      <NextSeo title="User" />
      <Layout
        backdrop={
          <div className="fixed inset-0 right-0 z-0 pointer-events-none opacity-20">
            <BackgroundVector width="100%" preserveAspectRatio="none" />
          </div>
        }
      >
        <Dashboard chainId={chainId} address={address} showOutgoing={show === 'outgoing'} />
      </Layout>
    </SWRConfig>
  )
}

export default UserDashboard
