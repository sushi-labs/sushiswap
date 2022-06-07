import { type Stream as StreamDTO, type Transaction as TransactionDTO } from '@sushiswap/graph-client'
import { Dashboard } from 'components'
import { getUserStreams, getUserVestings } from 'lib'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { SWRConfig } from 'swr'
import { Streams, Vestings } from 'types'

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
  const chainId = Number(router.query.chainId)
  const address = router.query.address as string

  return (
    <SWRConfig value={{ fallback }}>
      <Dashboard chainId={chainId} address={address} />
    </SWRConfig>
  )
}

export default UserDashboard
