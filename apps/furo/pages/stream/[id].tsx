import { ArrowLeftIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { formatNumber, shortenAddress } from 'sushi'
import { Percent } from 'sushi'
import { SplashController } from '@sushiswap/ui'
import { Badge } from '@sushiswap/ui/components/Badge'
import { Currency } from '@sushiswap/ui/components/currency'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { NetworkIcon, SushiIcon } from '@sushiswap/ui/components/icons'
import { List } from '@sushiswap/ui/components/list/List'
import { SkeletonBox, SkeletonCircle, SkeletonText } from '@sushiswap/ui/components/skeleton'
import { Address, getFuroStreamContractConfig, useEnsName } from '@sushiswap/wagmi'
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { FC, useMemo } from 'react'

import { BalancePredictor, CancelModal, FuroTimer, Layout, TransferModal, UpdateModal } from '../../components'
import { WithdrawModal } from '../../components/stream'
import { useStream, useStreamBalance, useStreamTransactions } from '../../lib'
import { queryParamsSchema } from '../../lib/zod'

const Streams = () => {
  const { isReady } = useRouter()
  return (
    <SplashController show={!isReady}>
      <_Streams />
    </SplashController>
  )
}

const _Streams: FC = () => {
  const { query } = useRouter()
  const {
    id: [chainId, streamId],
  } = queryParamsSchema.parse(query)

  const { data: transactions, isLoading: isTxLoading } = useStreamTransactions({ chainId, streamId })
  const { data: stream, isLoading: isStreamLoading } = useStream({ chainId, streamId })
  const { data: balance, isLoading: isBalanceLoading } = useStreamBalance({
    chainId,
    streamId,
    token: stream?.token,
  })

  const { data: ens } = useEnsName({
    enabled: Boolean(stream),
    address: stream?.recipient.id as Address | undefined,
    chainId: ChainId.ETHEREUM,
  })

  const [streamedAmount, streamedPercentage] = useMemo(() => {
    if (!stream?.withdrawnAmount || !balance) return [undefined, undefined]
    return [
      stream.withdrawnAmount.add(balance),
      new Percent(stream.withdrawnAmount.add(balance).quotient, stream.totalAmount.quotient),
    ]
  }, [balance, stream])

  const [withdrawnAmount] = useMemo(() => {
    if (!stream?.totalAmount || !balance) return [undefined]
    return [stream.totalAmount.subtract(balance)]
  }, [balance, stream])

  const remainingAmount = useMemo(() => {
    if (!stream?.totalAmount || !balance || !withdrawnAmount) return undefined
    return stream.remainingAmount.subtract(balance)
  }, [balance, stream?.remainingAmount, stream?.totalAmount, withdrawnAmount])

  const isLoading = isTxLoading || isBalanceLoading || isStreamLoading

  if (isLoading) {
    return (
      <>
        <NextSeo title={`Stream #${streamId}`} />
        <Layout maxWidth="4xl">
          <div className="flex flex-col gap-2">
            <Link
              className="flex items-center gap-4 mb-2 group"
              href={{
                pathname: '/',
              }}
              shallow={true}
            >
              <IconButton size="sm" icon={ArrowLeftIcon} name="Back" />
              <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
                Go back to dashboard
              </span>
            </Link>
            <div className="flex gap-6 h-[52px]">
              <div className="inline-flex">
                <SkeletonCircle radius={48} />
              </div>
              <div className="flex flex-col flex-grow">
                <SkeletonText fontSize="xl" className="w-[120px]" />
                <SkeletonText className="w-[240px]" />
              </div>
            </div>
            <div>
              <div className="flex gap-2 mt-3">
                <SkeletonBox className="w-[132px] h-[38px]" />
                <SkeletonBox className="w-[122px] h-[38px]" />
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-5 md:my-10 h-0.5" />
          <div className="flex flex-col md:grid md:grid-cols-[460px_372px] justify-center gap-8 md:gap-y-6">
            <div className="flex justify-center">
              <SkeletonBox className="w-full lg:w-[460px] h-fit aspect-[460/290]" />
            </div>
            <div className="min-w-fit">
              <div className="flex flex-col justify-center flex-grow gap-5">
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue skeleton />
                    <List.KeyValue skeleton />
                    <List.KeyValue skeleton />
                  </List.Control>
                </List>
                <List>
                  <List.Label>Details</List.Label>
                  <List.Control>
                    <List.KeyValue skeleton />
                    <List.KeyValue skeleton />
                    <List.KeyValue skeleton />
                  </List.Control>
                </List>
                <List>
                  <List.Label>Withdraw History</List.Label>
                  <List.Control className="max-h-[320px] scroll">
                    <List.KeyValue skeleton />
                    <List.KeyValue skeleton />
                    <List.KeyValue skeleton />
                  </List.Control>
                </List>
              </div>
            </div>
          </div>
        </Layout>
      </>
    )
  }

  if (stream) {
    return (
      <>
        <NextSeo title={`Stream #${streamId}`} />
        <Layout maxWidth="4xl">
          <div className="flex flex-col gap-2">
            <Link
              className="flex items-center gap-4 mb-2 group"
              href={{
                pathname: '/',
              }}
              shallow={true}
            >
              <IconButton size="sm" icon={ArrowLeftIcon} name="Back" />
              <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
                Go back to dashboard
              </span>
            </Link>
            <div className="flex gap-6 h-[52px]">
              <div className="flex min-w-[44px]">
                <Badge
                  className="border-2 dark:border-slate-900 border-gray-100 rounded-full z-[11] !bottom-0 right-[-15%]"
                  position="bottom-right"
                  badgeContent={<NetworkIcon chainId={chainId} width={24} height={24} />}
                >
                  <Currency.IconList iconWidth={48} iconHeight={48}>
                    <Currency.Icon currency={stream?.totalAmount.currency} />
                  </Currency.IconList>
                </Badge>
              </div>
              <div className="flex flex-col flex-grow gap-0.5">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-50">Stream {streamId}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-400">
                  {formatNumber(stream?.totalAmount.toSignificant(6))}
                </div>
              </div>
            </div>{' '}
            <div className="flex flex-wrap gap-2 mt-3">
              <WithdrawModal stream={stream} chainId={chainId} />
              <UpdateModal
                stream={stream}
                abi={getFuroStreamContractConfig(chainId)?.abi}
                address={getFuroStreamContractConfig(chainId)?.address}
                chainId={chainId}
              />
              <TransferModal
                stream={stream}
                abi={getFuroStreamContractConfig(chainId)?.abi}
                address={getFuroStreamContractConfig(chainId)?.address}
                chainId={chainId}
              />
              <CancelModal
                title="Cancel Stream"
                stream={stream}
                abi={getFuroStreamContractConfig(chainId)?.abi}
                address={getFuroStreamContractConfig(chainId)?.address}
                fn="cancelStream"
                chainId={chainId}
              />
            </div>
          </div>
          <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-5 md:my-10 h-0.5" />
          <div className="flex flex-col lg:grid lg:grid-cols-[460px_372px] justify-center gap-8 lg:gap-y-6">
            <div className="flex justify-center">
              <div className="shadow-lg relative w-full lg:w-[460px] h-fit aspect-[460/290] bg-gradient-to-tr from-blue to-pink flex flex-col bg-slate-800 p-4 rounded-2xl">
                <span className="flex items-center justify-start gap-2">
                  <span className="flex items-center gap-2 text-lg font-semibold text-white">
                    <div className="rounded-full shadow-md shadow-black/30 -mt-0.5">
                      <Currency.Icon currency={stream?.totalAmount.currency} width={20} height={20} />
                    </div>
                    {formatNumber(stream?.totalAmount.toSignificant(6))}
                  </span>
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h1 className="text-4xl font-bold text-white">
                    <BalancePredictor
                      startTime={stream.startTime}
                      endTime={stream.endTime}
                      balance={balance}
                      totalAmount={stream.totalAmount}
                    >
                      {(val) => {
                        const [first, latter] = (+(val?.toSignificant(7) || 0))
                          .toLocaleString('en-US', { minimumFractionDigits: 2 })
                          .split('.')
                        return (
                          <>
                            <span>{first}</span>.<span className="text-2xl">{latter}</span>
                          </>
                        )
                      }}
                    </BalancePredictor>
                  </h1>
                </div>
                <div className="absolute flex items-center justify-center gap-3 bottom-4 right-4">
                  <div className="p-2 rounded-full shadow-md bg-white/10">
                    <SushiIcon width={22} height={22} />
                  </div>
                  <span className="text-2xl font-medium tracking-[-0.025em] text-white">
                    Sushi <span className="font-bold">Pay</span>
                  </span>
                </div>
                <div className="absolute flex flex-col text-lg font-semibold tracking-wide text-white left-5 bottom-4 text-sh mono">
                  <span className="text-sm font-medium">Recipient</span>
                  {ens ? ens : shortenAddress(stream?.recipient.id)}
                </div>
              </div>
            </div>
            <div className="min-w-fit">
              <div className="flex flex-col justify-center flex-grow gap-5">
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue title="Unlocked" subtitle="available for withdrawal">
                      <div className="flex flex-col">
                        <BalancePredictor
                          balance={balance}
                          startTime={stream.startTime}
                          endTime={stream.endTime}
                          totalAmount={stream.totalAmount}
                        >
                          {(val) => +(val?.toSignificant(7) || 0).toLocaleString('en-US')}
                        </BalancePredictor>
                        <span className="text-[10px] font-medium text-slate-500">{balance?.currency.symbol}</span>
                      </div>
                    </List.KeyValue>
                    <List.KeyValue title="Locked" subtitle="funds in stream">
                      <div className="flex flex-col items-end">
                        <span className="flex items-center gap-1">{remainingAmount?.toSignificant(6)} </span>
                        <span className="text-[10px] font-medium text-slate-500">{balance?.currency.symbol}</span>
                      </div>
                    </List.KeyValue>
                    <List.KeyValue title="Streamed" subtitle="amount">
                      <div className="flex flex-col items-end">
                        <span className="flex items-center gap-1">{streamedPercentage?.toSignificant(3)}%</span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {streamedAmount?.toSignificant(6)} {stream.streamedAmount?.currency.symbol}
                        </span>
                      </div>
                    </List.KeyValue>
                  </List.Control>
                </List>
                <List>
                  <List.Label>Details</List.Label>
                  <List.Control>
                    <List.KeyValue flex title={stream.startTime.getTime() > Date.now() ? 'Starting in' : 'Remaining'}>
                      <FuroTimer furo={stream}>
                        {({ days, seconds, minutes, hours, isCompleted }) => (
                          <span className="flex items-baseline gap-1">
                            {isCompleted ? (
                              <span className="text-green">Completed</span>
                            ) : (
                              <>
                                <span>
                                  {days} <span className="text-xs text-gray-400 dark:text-slate-400">day</span>
                                </span>
                                <span>
                                  {hours} <span className="text-xs text-gray-400 dark:text-slate-400">hours</span>
                                </span>
                                <span>
                                  {minutes} <span className="text-xs text-gray-400 dark:text-slate-400">mins</span>
                                </span>
                                <span>
                                  {seconds} <span className="text-xs text-gray-400 dark:text-slate-400">secs</span>
                                </span>
                              </>
                            )}
                          </span>
                        )}
                      </FuroTimer>
                    </List.KeyValue>
                    {stream.startTime.getTime() < Date.now() && (
                      <List.KeyValue title="Started on">
                        <div className="flex flex-col">
                          {format(new Date(stream.startTime), 'dd MMM yyyy')}
                          <span className="text-[10px] font-medium text-slate-500">
                            {format(new Date(stream.startTime), 'hh:mmaaa')}
                          </span>
                        </div>
                      </List.KeyValue>
                    )}
                    <List.KeyValue title="Ending on">
                      <div className="flex flex-col">
                        {format(new Date(stream.endTime), 'dd MMM yyyy')}
                        <span className="text-[10px] font-medium text-slate-500">
                          {format(new Date(stream.endTime), 'hh:mmaaa')}
                        </span>
                      </div>
                    </List.KeyValue>
                  </List.Control>
                </List>
                <List>
                  <List.Label>History</List.Label>
                  <List.Control className="max-h-[320px] scroll">
                    {transactions?.map((tx, i) => (
                      <List.KeyValue
                        key={i}
                        flex
                        className="!items-end"
                        title={
                          <div className="flex flex-col gap-0.5">
                            <div className="text-xs text-gray-500 capitalize dark:text-slate-400">
                              {tx.status?.toLowerCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                              {format(new Date(tx.timestamp), 'dd MMM yyyy')}
                            </span>
                          </div>
                        }
                        subtitle={`${format(new Date(tx.timestamp), 'hh:mmaaa')}`}
                      >
                        <div className="flex flex-col">
                          {tx.amount.toSignificant(6)}{' '}
                          <span className="text-[10px] font-medium text-slate-500">{tx.amount.currency.symbol}</span>
                        </div>
                      </List.KeyValue>
                    ))}
                  </List.Control>
                </List>
              </div>
            </div>
          </div>
        </Layout>
      </>
    )
  }

  return <></>
}

export default Streams
