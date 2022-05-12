import Layout from 'components/Layout'
import { FuroTable, FuroTableType } from 'features/FuroTable'
import CreateVestingModal from 'features/vesting/CreateVestingModal'
import { FC } from 'react'
import { Typography } from '@sushiswap/ui'
import { getStreams, getVestings } from 'graph/graph-client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { CreateStreamModal } from 'features/stream'
import useSWR, { SWRConfig } from 'swr'
import { useRouter } from 'next/router'
import { Streams } from '../../api/streams/[chainId]/[address]'
import { Vestings } from '../../api/vestings/[chainId]/[address]'

interface Props {
  fallback?: Record<string, any>
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  if (typeof query.chainId !== 'string' || typeof query.address !== 'string') return { props: {} }

  return {
    props: {
      fallback: {
        [`/api/streams/${query.chainId}/${query.address}`]: (await getStreams(query.chainId, query.address)) as Streams,
        [`/api/vestings/${query.chainId}/${query.address}`]: (await getVestings(
          query.chainId,
          query.address,
        )) as Vestings,
      },
    },
  }
}

const _Dashboard: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  const router = useRouter()
  const chainId = Number(router.query.chainId)
  const address = router.query.address as string

  return (
    <SWRConfig value={{ fallback }}>
      <Dashboard chainId={chainId} address={address} />
    </SWRConfig>
  )
}

export const Dashboard: FC<{ chainId: number; address: string }> = ({ chainId, address }) => {
  const { data: streams } = useSWR<Streams>(`/api/streams/${chainId}/${address}`)
  const { data: vestings } = useSWR<Vestings>(`/api/vestings/${chainId}/${address}`)

  return (
    <Layout>
      <div className="flex flex-col h-full gap-12 pt-10">
        <div className="flex justify-between items-center border-b border-dark-900 pb-4">
          <Typography variant="h3" weight={700} className="text-high-emphesis">
            Dashboard
          </Typography>
          <div className="flex gap-3">
            <CreateStreamModal />
            <CreateVestingModal />
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              Incoming
            </Typography>
            <FuroTable
              streams={streams?.incomingStreams ?? []}
              vestings={vestings?.incomingVestings ?? []}
              type={FuroTableType.INCOMING}
              placeholder="No incoming streams found"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              Outgoing
            </Typography>
            <FuroTable
              streams={streams?.outgoingStreams ?? []}
              vestings={vestings?.outgoingVestings ?? []}
              type={FuroTableType.OUTGOING}
              placeholder="No outgoing streams found"
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default _Dashboard
