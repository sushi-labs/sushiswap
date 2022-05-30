import { AddressZero } from '@ethersproject/constants'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid'
import furoExports from '@sushiswap/furo/exports.json'
import type { Rebase as RebaseDTO, Stream as StreamDTO, Transaction as TransactionDTO } from '@sushiswap/graph-client'
import { ProgressBar, ProgressColor, Typography } from '@sushiswap/ui'
import { useWalletState } from '@sushiswap/wagmi'
import {
  BackgroundVector,
  CancelModal,
  FuroTimer,
  HistoryPopover,
  Layout,
  Overlay,
  ProgressBarCard,
  StreamDetailsPopover,
  TransferModal,
  UpdateModal,
} from 'components'
import { BalanceChart, WithdrawModal } from 'components/stream'
import { getRebase, getStream, getStreamTransactions, Stream } from 'lib'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useMemo, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'
import { useAccount, useConnect } from 'wagmi'

interface Props {
  fallback?: {
    stream?: StreamDTO
    transactions?: TransactionDTO[]
  }
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query: { chainId, id } }) => {
  // if (typeof query.chainId !== 'string' || typeof query.id !== 'string') return { props: {} }

  const stream = (await getStream(chainId as string, id as string)) as StreamDTO
  return {
    props: {
      fallback: {
        [`/furo/api/stream/${chainId}/${id}`]: stream,
        [`/furo/api/transactions/${chainId}/${id}`]: (await getStreamTransactions(
          chainId as string,
          id as string
        )) as TransactionDTO[],
        [`/furo/api/rebase/${chainId}/${stream.token.id}`]: (await getRebase(
          chainId as string,
          stream.token.id
        )) as RebaseDTO,
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
  const router = useRouter()
  const chainId = Number(router.query.chainId as string)
  const id = Number(router.query.id as string)
  const connect = useConnect()
  const { data: account } = useAccount()
  const { connecting, reconnecting } = useWalletState(connect, account?.address)

  const { data: transactions } = useSWR<TransactionDTO[]>(`/furo/api/transactions/${chainId}/${id}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  const { data: furo } = useSWR<StreamDTO>(`/furo/api/stream/${chainId}/${id}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  const { data: rebase } = useSWR<RebaseDTO>(
    () => (chainId && furo ? `/furo/api/rebase/${chainId}/${furo.token.id}` : null),
    (url) => fetch(url).then((response) => response.json())
  )

  const [hover, setHover] = useState<BalanceChartHoverEnum>(BalanceChartHoverEnum.NONE)

  const stream = useMemo(
    () => (chainId && furo && rebase ? new Stream({ chainId, furo, rebase }) : undefined),
    [chainId, furo, rebase]
  )

  if (connecting || reconnecting) return <Overlay />

  return (
    <Layout
      backdrop={
        <div className="fixed inset-0 right-0 z-0 pointer-events-none opacity-20">
          <BackgroundVector width="100%" preserveAspectRatio="none" />
        </div>
      }
    >
      <div className="flex items-center gap-3 mt-4">
        <Link href="/dashboard" passHref={true}>
          <a className="flex items-center gap-2 group">
            <HomeIcon width={16} className="cursor-pointer group-hover:text-slate-50 text-slate-400" />
            <Typography variant="sm" weight={700} className="cursor-pointer group-hover:text-slate-50 text-slate-400">
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
          <BalanceChart stream={stream} hover={hover} setHover={setHover} />
        </div>
        <div>
          <div className="flex flex-col justify-center gap-5">
            <ProgressBarCard
              aria-hidden="true"
              label="Streamed"
              value={`${stream?.streamedPercentage?.toSignificant(4)}%`}
              onMouseEnter={() => setHover(BalanceChartHoverEnum.STREAMED)}
              onMouseLeave={() => setHover(BalanceChartHoverEnum.NONE)}
            >
              <ProgressBar
                progress={
                  stream && stream.streamedPercentage ? stream.streamedPercentage.divide(100).toSignificant(4) : 0
                }
                color={ProgressColor.BLUE}
                showLabel={false}
              />
            </ProgressBarCard>
            <ProgressBarCard
              aria-hidden="true"
              label="Withdrawn"
              value={`${stream?.withdrawnPercentage?.toSignificant(4)}%`}
              onMouseEnter={() => setHover(BalanceChartHoverEnum.WITHDRAW)}
              onMouseLeave={() => setHover(BalanceChartHoverEnum.NONE)}
            >
              <ProgressBar
                progress={stream ? stream.withdrawnPercentage.divide(100).toSignificant(4) : 0}
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
          <StreamDetailsPopover stream={stream} />
          <HistoryPopover stream={stream} transactionRepresentations={transactions} />
        </div>
        <div className="flex flex-col gap-2">
          <WithdrawModal stream={stream} />
          <div className="flex gap-2">
            <TransferModal
              stream={stream}
              abi={furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroStream?.abi ?? []}
              address={
                furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroStream?.address ??
                AddressZero
              }
            />
            <UpdateModal
              stream={stream}
              abi={furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroStream?.abi ?? []}
              address={
                furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroStream?.address ??
                AddressZero
              }
            />
            <CancelModal
              stream={stream}
              abi={furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroStream?.abi ?? []}
              address={
                furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroStream?.address ??
                AddressZero
              }
              fn="cancelStream"
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Streams
