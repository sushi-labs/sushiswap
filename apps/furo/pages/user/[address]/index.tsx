import { ChainId } from '@sushiswap/chain'
import { BackgroundVector, Layout } from 'components'
import { getUserStreams, getUserVestings } from 'lib'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { SWRConfig } from 'swr'
import { Streams, Vestings } from 'types'

const Dashboard = dynamic(() => import('../../../components/Dashboard').then((mod) => mod.Dashboard), { ssr: false })

import { type Stream as StreamDTO, type Transaction as TransactionDTO } from '.graphclient'

interface Props {
  fallback?: {
    vesting?: StreamDTO
    transactions?: TransactionDTO[]
  }
}
export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  if (typeof query.chainId !== 'string' || typeof query.address !== 'string') return { props: {} }

  return {
    props: {
      fallback: {
        [`/api/user/${query.chainId}/${query.address}/streams`]: (await getUserStreams(
          query.chainId,
          query.address
        )) as Streams,
        [`/api/user/${query.chainId}/${query.address}/vestings`]: (await getUserVestings(
          query.chainId,
          query.address
        )) as Vestings,
      },
    },
  }
}

const UserDashboard: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  const router = useRouter()
  const chainId = Number(router.query.chainId) || ChainId.ETHEREUM
  const address = router.query.address as string
  const show = router.query.show

  return (
    <SWRConfig value={{ fallback }}>
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
