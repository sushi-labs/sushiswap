import { AddressZero } from '@ethersproject/constants'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid'
import { useIsMounted } from '@sushiswap/hooks'
import { ProgressBar, ProgressColor, Typography } from '@sushiswap/ui'
import FUROSTREAM_ABI from 'abis/FuroStream.json'
import { BackgroundVector } from 'components'
import Layout from 'components/Layout'
import { ProgressBarCard } from 'components/ProgressBarCard'
import { Stream, StreamRepresentation, TransactionRepresentation } from 'features'
import CancelStreamModal from 'features/CancelStreamModal'
import FuroTimer from 'features/FuroTimer'
import HistoryPopover from 'features/HistoryPopover'
import LinkPopover from 'features/LinkPopover'
import BalanceChart from 'features/stream/BalanceChart'
import StreamDetailsPopover from 'features/stream/StreamDetailsPopover'
import TransferStreamModal from 'features/TransferStreamModal'
import UpdateStreamModal from 'features/UpdateStreamModal'
import WithdrawModal from 'features/WithdrawModal'
import { getStream, getStreamTransactions } from 'graph/graph-client'
import { STREAM_ADDRESS, useStreamBalance } from 'hooks'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
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

export enum BalanceChartHoverEnum {
  NONE,
  WITHDRAW,
  STREAMED,
}

const _Streams: FC = () => {
  const isMounted = useIsMounted()
  const router = useRouter()
  const chainId = Number(router.query.chainId as string)
  const id = Number(router.query.id as string)

  const { data: transactions } = useSWR(`/furo/api/transactions/${chainId}/${id}`, (url) =>
    fetch(url).then((response) => response.json()),
  )
  const { data: streamRepresentation } = useSWR(`/furo/api/stream/${chainId}/${id}`, (url) =>
    fetch(url).then((response) => response.json()),
  )
  const [hover, setHover] = useState<BalanceChartHoverEnum>(BalanceChartHoverEnum.NONE)
  const stream = useMemo(
    () => (streamRepresentation ? new Stream({ stream: streamRepresentation }) : undefined),
    [streamRepresentation],
  )

  console.log(streamRepresentation)
  const balance = useStreamBalance(stream?.id, stream?.token)

  if (!isMounted) return null

  return (
    <Layout
      backdrop={
        <div className="fixed inset-0 z-0 pointer-events-none right-0 opacity-20">
          <BackgroundVector width="100%" preserveAspectRatio="none" />
        </div>
      }
    >
      <div className="flex gap-3 items-center mt-4">
        <Link href="/dashboard" passHref={true}>
          <a className="group flex items-center gap-2">
            <HomeIcon width={16} className="group-hover:text-slate-50 text-slate-400 cursor-pointer" />
            <Typography variant="sm" weight={700} className="group-hover:text-slate-50 text-slate-400 cursor-pointer">
              Dashboard
            </Typography>
          </a>
        </Link>
        <ChevronRightIcon width={24} className="text-slate-400" />
        <Typography variant="sm" weight={700} className="text-slate-600">
          Stream
        </Typography>
      </div>
      <div className="flex flex-col md:grid md:grid-cols-[430px_280px] justify-center gap-8 lg:gap-x-16 md:gap-y-0 pt-6 md:pt-24">
        <div className="flex justify-center">
          <BalanceChart stream={stream} hover={hover} setHover={setHover} balance={balance} />
        </div>
        <div>
          <div className="flex flex-col justify-center gap-5">
            <ProgressBarCard
              aria-hidden="true"
              label="Streamed"
              value={`${(Number(stream?.streamedPercentage) * 100).toFixed(2)}%`}
              onMouseEnter={() => setHover(BalanceChartHoverEnum.STREAMED)}
              onMouseLeave={() => setHover(BalanceChartHoverEnum.NONE)}
            >
              <ProgressBar
                progress={stream ? stream.streamedPercentage.toFixed(4) : 0}
                color={ProgressColor.BLUE}
                showLabel={false}
              />
            </ProgressBarCard>
            <ProgressBarCard
              aria-hidden="true"
              label="Withdrawn"
              value={`${(Number(stream?.withdrawnPercentage) * 100).toFixed(2)}%`}
              onMouseEnter={() => setHover(BalanceChartHoverEnum.WITHDRAW)}
              onMouseLeave={() => setHover(BalanceChartHoverEnum.NONE)}
            >
              <ProgressBar
                progress={stream ? stream.withdrawnPercentage : 0}
                color={ProgressColor.PINK}
                showLabel={false}
              />
            </ProgressBarCard>
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
            <TransferStreamModal
              stream={stream}
              abi={FUROSTREAM_ABI}
              address={chainId ? STREAM_ADDRESS[chainId] : AddressZero}
            />
            <UpdateStreamModal
              stream={stream}
              abi={FUROSTREAM_ABI}
              address={chainId ? STREAM_ADDRESS[chainId] : AddressZero}
            />
            <CancelStreamModal
              stream={stream}
              abi={FUROSTREAM_ABI}
              address={chainId ? STREAM_ADDRESS[chainId] : AddressZero}
              fn="cancelStream"
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Streams
