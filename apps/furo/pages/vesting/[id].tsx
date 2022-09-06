import { AddressZero } from '@ethersproject/constants'
import furoExports from '@sushiswap/furo/exports.json'
import { Breadcrumb, BreadcrumbLink, ProgressBar, ProgressColor } from '@sushiswap/ui'
import { useWalletState } from '@sushiswap/wagmi'
import {
  BackgroundVector,
  CancelModal,
  HistoryPopover,
  Layout,
  Overlay,
  ProgressBarCard,
  StreamDetailsPopover,
  TransferModal,
} from 'components'
import { createScheduleRepresentation, NextPaymentTimer, SchedulePopover, WithdrawModal } from 'components/vesting'
import { getRebase, getVesting, getVestingTransactions, Vesting } from 'lib'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { FC, useMemo, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'
import { useConnect } from 'wagmi'

import VestingChart2 from '../../components/vesting/VestingChart2'
import { ChartHover } from '../../types'
import type { Rebase, Transaction as TransactionDTO, Vesting as VestingDTO } from '.graphclient'

interface Props {
  fallback?: {
    vesting?: VestingDTO
    transactions?: TransactionDTO[]
  }
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query: { chainId, id } }) => {
  const vesting = (await getVesting(chainId as string, id as string)) as VestingDTO
  const [transactions, rebases] = await Promise.all([
    getVestingTransactions(chainId as string, id as string),
    getRebase(chainId as string, vesting.token.id),
  ])

  return {
    props: {
      fallback: {
        [`/furo/api/vesting/${chainId}/${id}`]: vesting,
        [`/furo/api/vesting/${chainId}/${id}/transactions`]: transactions as TransactionDTO[],
        [`/furo/api/rebase/${chainId}/${vesting.token.id}`]: rebases as Rebase,
      },
    },
  }
}

const VestingPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_VestingPage />
    </SWRConfig>
  )
}

const LINKS = (id: string): BreadcrumbLink[] => [
  {
    href: `/vesting/${id}`,
    label: `Vesting ${id}`,
  },
]

const _VestingPage: FC = () => {
  const router = useRouter()
  const chainId = Number(router.query.chainId as string)
  const id = Number(router.query.id as string)
  const connect = useConnect()
  const { connecting, reconnecting } = useWalletState(!!connect.pendingConnector)
  const [hover, setHover] = useState<ChartHover>(ChartHover.NONE)

  const { data: furo } = useSWR<VestingDTO>(`/furo/api/vesting/${chainId}/${id}`, (url) =>
    fetch(url).then((response) => response.json())
  )
  const { data: transactions } = useSWR<TransactionDTO[]>(`/furo/api/vesting/${chainId}/${id}/transactions`, (url) =>
    fetch(url).then((response) => response.json())
  )
  const { data: rebase } = useSWR<Rebase>(
    () => (furo ? `/furo/api/rebase/${chainId}/${furo.token.id}` : null),
    (url) => fetch(url).then((response) => response.json())
  )
  const vesting = useMemo(
    () => (chainId && furo && rebase ? new Vesting({ chainId, furo, rebase }) : undefined),
    [chainId, furo, rebase]
  )

  const schedule = vesting
    ? createScheduleRepresentation({
        currency: vesting.token,
        cliffEndDate: new Date(vesting.startTime.getTime() + vesting.cliffDuration * 1000),
        cliffAmount: vesting.cliffAmount,
        stepAmount: vesting.stepAmount,
        stepDuration: vesting.stepDuration * 1000,
        startDate: vesting.startTime,
        stepPayouts: vesting.steps,
      })
    : undefined

  // Sync balance to Vesting entity
  // const balance = useVestingBalance(chainId, vesting?.id, vesting?.token)
  // if (vesting && balance) {
  //   vesting.balance = balance
  // }

  if (connecting || reconnecting) return <Overlay />

  return (
    <>
      <NextSeo title={`Vesting #${id}`} />
      <Layout
        backdrop={
          <div className="fixed inset-0 right-0 z-0 pointer-events-none opacity-20">
            <BackgroundVector width="100%" preserveAspectRatio="none" />
          </div>
        }
      >
        <Breadcrumb home="/dashboard" links={LINKS(router.query.id as string)} />
        <div className="flex flex-col md:grid md:grid-cols-[430px_280px] justify-center gap-8 lg:gap-x-16 md:gap-y-8 pt-6 md:pt-24">
          <div className="flex justify-center">
            <VestingChart2 vesting={vesting} schedule={schedule} hover={hover} setHover={setHover} />
          </div>
          <div>
            <div className="flex flex-col justify-center gap-5">
              <ProgressBarCard
                aria-hidden="true"
                label="Unlocked"
                value={`${vesting?.streamedPercentage?.toSignificant(4)}%`}
                onMouseEnter={() => setHover(ChartHover.STREAMED)}
                onMouseLeave={() => setHover(ChartHover.NONE)}
              >
                <ProgressBar
                  progress={vesting ? vesting.streamedPercentage.divide(100).toSignificant(4) : 0}
                  color={ProgressColor.BLUE}
                  showLabel={false}
                />
              </ProgressBarCard>
              <ProgressBarCard
                aria-hidden="true"
                label="Withdrawn"
                value={`${vesting?.withdrawnPercentage?.toSignificant(4)}%`}
                onMouseEnter={() => setHover(ChartHover.WITHDRAW)}
                onMouseLeave={() => setHover(ChartHover.NONE)}
              >
                <ProgressBar
                  progress={vesting ? vesting.withdrawnPercentage.divide(100).toSignificant(4) : 0}
                  color={ProgressColor.PINK}
                  showLabel={false}
                />
              </ProgressBarCard>
              <div className="mt-3">
                <NextPaymentTimer vesting={vesting} />
              </div>
            </div>
          </div>
          <div className="flex items-end justify-center gap-2">
            <StreamDetailsPopover stream={vesting} />
            <HistoryPopover stream={vesting} transactionRepresentations={transactions} />
            <SchedulePopover vesting={vesting} schedule={schedule} />
          </div>
          <div className="flex flex-col gap-2">
            <WithdrawModal vesting={vesting} />
            <div className="flex gap-2">
              <TransferModal
                stream={vesting}
                abi={
                  furoExports[chainId as unknown as keyof Omit<typeof furoExports, '31337'>]?.[0]?.contracts
                    ?.FuroVesting?.abi ?? []
                }
                address={
                  furoExports[chainId as unknown as keyof Omit<typeof furoExports, '31337'>]?.[0]?.contracts
                    ?.FuroVesting?.address ?? AddressZero
                }
              />
              <CancelModal
                title="Cancel Vesting"
                stream={vesting}
                abi={
                  furoExports[chainId as unknown as keyof Omit<typeof furoExports, '31337'>]?.[0]?.contracts
                    ?.FuroVesting?.abi ?? []
                }
                address={
                  furoExports[chainId as unknown as keyof Omit<typeof furoExports, '31337'>]?.[0]?.contracts
                    ?.FuroVesting?.address ?? AddressZero
                }
                fn="stopVesting"
              />
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default VestingPage
