import { ProgressBar, ProgressColor,Typography } from '@sushiswap/ui'
import Layout from 'components/Layout'
import { StreamRepresentation, TransactionRepresentation } from 'features/context/representations'
import { Stream } from 'features/context/Stream'
import FuroTimer from 'features/FuroTimer'
import HistoryPopover from 'features/HistoryPopover'
import LinkPopover from 'features/LinkPopover'
import BalanceChart from 'features/stream/BalanceChart'
import CancelStreamModal from 'features/stream/CancelStreamModal'
import StreamDetailsPopover from 'features/stream/StreamDetailsPopover'
import TransferStreamModal from 'features/stream/TransferStreamModal'
import UpdateStreamModal from 'features/stream/UpdateStreamModal'
import WithdrawModal from 'features/stream/WithdrawModal'
import { getStream, getStreamTransactions } from 'graph/graph-client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC, useMemo, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

interface Props {
  fallback?: {
    stream?: StreamRepresentation
    transactions?: TransactionRepresentation[]
  }
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  if (typeof query.chainId !== 'string' || typeof query.id !== 'string') return { props: {} }
  return {
    props: {
      fallback: {
        [`/furo/api/stream/${query.chainId}/${query.id}`]: (await getStream(
          query.chainId,
          query.id,
        )) as StreamRepresentation,
        [`/furo/api/transactions/${query.chainId}/${query.id}`]: (await getStreamTransactions(
          query.chainId,
          query.id,
        )) as TransactionRepresentation[],
      },
    },
  }
}

const Streams: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Streams />
    </SWRConfig>
  )
}

const _Streams: FC = () => {
  const router = useRouter()
  const chainId = router.query.chainId as string
  const id = router.query.id as string

  const { data: transactions } = useSWR(`/furo/api/transactions/${chainId}/${id}`, (url) =>
    fetch(url).then((response) => response.json()),
  )
  const { data: streamRepresentation } = useSWR(`/furo/api/stream/${chainId}/${id}`, (url) =>
    fetch(url).then((response) => response.json()),
  )
  const [withdrawHovered, setWithdrawHovered] = useState(false)
  const stream = useMemo(
    () => (streamRepresentation ? new Stream({ stream: streamRepresentation }) : undefined),
    [streamRepresentation],
  )

  return (
    <Layout>
      <div className="flex flex-col md:grid md:grid-cols-[430px_280px] justify-center gap-8 lg:gap-x-16 md:gap-y-0 pt-6 md:pt-24">
        <div className="relative flex justify-center">
          <div className="absolute right-0 w-[140px] h-[180px] bg-pink/20 blur-[100px] pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-[140px] h-[180px] bg-blue/20 blur-[100px] pointer-events-none" />
          <BalanceChart stream={stream} withdrawHovered={withdrawHovered} setWithdrawHovered={setWithdrawHovered} />
        </div>
        <div>
          <div className="flex flex-col justify-center gap-5">
            <div className="flex flex-col gap-2 p-5 border shadow-md cursor-pointer bg-slate-800 border-slate-700 hover:border-slate-600 rounded-2xl">
              <div className="flex items-center justify-between gap-2">
                <Typography variant="sm" weight={400}>
                  Streamed:
                </Typography>
                <Typography variant="lg" weight={700} className="text-slate-200">
                  {(Number(stream?.streamedPercentage) * 100).toFixed(2)}%
                </Typography>
              </div>
              <ProgressBar
                progress={stream ? stream.streamedPercentage.toFixed(4) : 0}
                color={ProgressColor.BLUE}
                showLabel={false}
              />
            </div>
            <div
              aria-hidden="true"
              className="flex flex-col gap-2 p-5 border shadow-md cursor-pointer bg-slate-800 border-slate-700 hover:border-slate-600 rounded-2xl"
              onMouseEnter={() => setWithdrawHovered(true)}
              onMouseLeave={() => setWithdrawHovered(false)}
            >
              <div className="flex items-center justify-between gap-2">
                <Typography variant="sm" weight={400}>
                  Withdrawn:
                </Typography>
                <Typography variant="lg" weight={700} className="text-slate-200">
                  {(Number(stream?.withdrawnPercentage) * 100).toFixed(2)}%
                </Typography>
              </div>
              <ProgressBar
                progress={stream ? stream.withdrawnPercentage : 0}
                color={ProgressColor.PINK}
                showLabel={false}
              />
            </div>
            <div className="mt-3">
              <FuroTimer furo={stream} />
            </div>
          </div>
        </div>
        <div className="flex items-end justify-center gap-2">
          <LinkPopover furo={stream} />
          <StreamDetailsPopover stream={stream} />
          <HistoryPopover transactionRepresentations={transactions} />
        </div>
        <div className="flex flex-col gap-2">
          <WithdrawModal stream={stream} />
          <div className="flex gap-2">
            <TransferStreamModal stream={stream} />
            <UpdateStreamModal stream={stream} />
            <CancelStreamModal stream={stream} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Streams
