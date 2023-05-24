import { getFuroStreamContractConfig } from '@sushiswap/wagmi'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { FC, useMemo } from 'react'
import { CancelModal, FuroTimer, Layout, TransferModal, UpdateModal } from '../../components'
import { WithdrawModal } from '../../components/stream'
import { useStream, useStreamBalance, useStreamTransactions } from '../../lib'
import { SushiIcon } from '@sushiswap/ui/future/components/icons'
import { formatNumber, shortenAddress } from '@sushiswap/format'
import { useEnsName } from 'wagmi'
import { ChainId } from '@sushiswap/chain'
import { List } from '@sushiswap/ui/future/components/list/List'
import { format } from 'date-fns'
import { Button } from '@sushiswap/ui/future/components/button'
import Link from 'next/link'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { ArrowLeftIcon, ArrowRightIcon, ArrowDownIcon, ArrowUpIcon, RefreshIcon } from '@heroicons/react/solid'
import { DownloadIcon, XIcon } from '@heroicons/react/outline'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { classNames, NetworkIcon } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { Address } from '@wagmi/core'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'
import { Blink } from '@sushiswap/ui/future/components/Blink'
import { Percent } from '@sushiswap/math'
import { queryParamsSchema } from '../../lib/zod'

const Streams = () => {
  return (
    <SplashController>
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

  const [withdrawnAmount, withdrawnPercentage] = useMemo(() => {
    if (!stream?.totalAmount || !balance) return [undefined, undefined]
    return [
      stream.totalAmount.subtract(balance),
      new Percent(stream.totalAmount.subtract(balance).quotient, stream.totalAmount.quotient),
    ]
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
              className="group flex gap-4 items-center mb-2"
              href={{
                pathname: '/',
              }}
              shallow={true}
            >
              <IconButton
                icon={ArrowLeftIcon}
                iconProps={{
                  width: 24,
                  height: 24,
                  transparent: true,
                }}
              />
              <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
                Go back to dashboard
              </span>
            </Link>
            <div className="flex gap-6 h-[52px]">
              <div className="inline-flex">
                <Skeleton.Circle radius={48} />
              </div>
              <div className="flex flex-col flex-grow">
                <Skeleton.Text fontSize="text-xl" className="w-[120px]" />
                <Skeleton.Text fontSize="text-base" className="w-[240px]" />
              </div>
            </div>
            <div>
              <div className="flex gap-2 mt-3">
                <Skeleton.Box className="w-[132px] h-[38px]" />
                <Skeleton.Box className="w-[122px] h-[38px]" />
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-5 md:my-10 h-0.5" />
          <div className="flex flex-col md:grid md:grid-cols-[460px_372px] justify-center gap-8 md:gap-y-6">
            <div className="flex justify-center">
              <Skeleton.Box className="w-[460px] h-[290px]" />
            </div>
            <div className="min-w-fit">
              <div className="flex flex-col flex-grow justify-center gap-5">
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
              className="group flex gap-4 items-center mb-2"
              href={{
                pathname: '/',
              }}
              shallow={true}
            >
              <IconButton
                icon={ArrowLeftIcon}
                iconProps={{
                  width: 24,
                  height: 24,
                  transparent: true,
                }}
              />
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
              <WithdrawModal stream={stream} chainId={chainId}>
                {({ setOpen, disabled }) => (
                  <Button
                    disabled={disabled}
                    onClick={() => setOpen(true)}
                    startIcon={<DownloadIcon width={18} height={18} />}
                    variant="outlined"
                  >
                    Withdraw
                  </Button>
                )}
              </WithdrawModal>
              <TransferModal
                stream={stream}
                abi={getFuroStreamContractConfig(chainId)?.abi}
                address={getFuroStreamContractConfig(chainId)?.address}
                chainId={chainId}
              >
                {({ setOpen }) => (
                  <Button
                    onClick={() => setOpen(true)}
                    startIcon={<ArrowRightIcon width={18} height={18} />}
                    variant="outlined"
                  >
                    Transfer
                  </Button>
                )}
              </TransferModal>
              <UpdateModal
                stream={stream}
                abi={getFuroStreamContractConfig(chainId)?.abi}
                address={getFuroStreamContractConfig(chainId)?.address}
                chainId={chainId}
              >
                {({ setOpen }) => (
                  <Button
                    onClick={() => setOpen(true)}
                    startIcon={<RefreshIcon width={18} height={18} />}
                    variant="outlined"
                  >
                    Update
                  </Button>
                )}
              </UpdateModal>
              <CancelModal
                title="Cancel Stream"
                stream={stream}
                abi={getFuroStreamContractConfig(chainId)?.abi}
                address={getFuroStreamContractConfig(chainId)?.address}
                fn="cancelStream"
                chainId={chainId}
              >
                {({ setOpen }) => (
                  <Button
                    color="red"
                    onClick={() => setOpen(true)}
                    startIcon={<XIcon width={18} height={18} />}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                )}
              </CancelModal>
            </div>
          </div>
          <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-5 md:my-10 h-0.5" />
          <div className="flex flex-col lg:grid lg:grid-cols-[460px_372px] justify-center gap-8 lg:gap-y-6">
            <div className="flex justify-center">
              <div className="shadow-lg relative w-[460px] h-[290px] bg-gradient-to-tr from-blue to-pink flex flex-col bg-slate-800 p-4 rounded-2xl">
                <span className="flex items-center justify-start gap-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{stream?.totalAmount.currency.symbol}</span>
                    <span className="text-2xl font-medium text-white">
                      {formatNumber(stream?.totalAmount.toSignificant(6))}
                    </span>
                  </div>
                </span>
                <div className="absolute bottom-4 right-4 flex gap-3 items-center justify-center">
                  <div className="bg-white/10 p-2 rounded-full shadow-md">
                    <SushiIcon width={22} height={22} />
                  </div>
                  <span className="text-2xl font-medium tracking-[-0.025em] text-white">
                    Sushi <span className="font-bold">Pay</span>
                  </span>
                </div>
                <div className="absolute left-5 bottom-4 text-lg font-semibold text-sh tracking-wide mono flex flex-col text-white">
                  <span className="text-sm font-medium">Recipient</span>
                  {ens ? ens : shortenAddress(stream?.recipient.id)}
                </div>
              </div>
            </div>
            <div className="min-w-fit">
              <div className="flex flex-col flex-grow justify-center gap-5">
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue title="Unlocked" subtitle="available for withdrawal">
                      <div className="flex flex-col">
                        <Blink dep={balance?.toSignificant()} as="span" timeout={1500}>
                          {(isBlinking) => (
                            <span className={classNames(isBlinking ? 'text-green' : '', 'flex items-center gap-1')}>
                              {balance?.toSignificant(6)}{' '}
                              {isBlinking && (
                                <ArrowUpIcon className="rotate-45" strokeWidth={3} width={14} height={14} />
                              )}
                            </span>
                          )}
                        </Blink>
                        <span className="text-[10px] font-medium text-slate-500">{balance?.currency.symbol}</span>
                      </div>
                    </List.KeyValue>
                    <List.KeyValue title="Locked" subtitle="funds in stream">
                      <div className="flex flex-col items-end">
                        <Blink dep={remainingAmount?.toSignificant()} as="span" timeout={1500}>
                          {(isBlinking) => (
                            <span className={classNames(isBlinking ? 'text-red' : '', 'flex items-center gap-1')}>
                              {remainingAmount?.toSignificant(6)}{' '}
                              {isBlinking && (
                                <ArrowDownIcon className="rotate-45" strokeWidth={3} width={14} height={14} />
                              )}
                            </span>
                          )}
                        </Blink>
                        <span className="text-[10px] font-medium text-slate-500">{balance?.currency.symbol}</span>
                      </div>
                    </List.KeyValue>
                    <List.KeyValue title="Streamed" subtitle="amount">
                      <div className="flex flex-col items-end">
                        <Blink dep={streamedPercentage?.toSignificant(3)} as="span" timeout={1500}>
                          {(isBlinking) => (
                            <span className={classNames(isBlinking ? 'text-green' : '', 'flex items-center gap-1')}>
                              {streamedPercentage?.toSignificant(3)}%
                              {isBlinking && (
                                <ArrowUpIcon className="rotate-45" strokeWidth={3} width={14} height={14} />
                              )}
                            </span>
                          )}
                        </Blink>
                        <span className="text-[10px] font-medium text-slate-500">
                          {streamedAmount?.toSignificant(6)} {stream.streamedAmount?.currency.symbol}
                        </span>
                      </div>
                    </List.KeyValue>
                    <List.KeyValue title="Withdrawn" subtitle="amount">
                      <div className="flex flex-col items-end">
                        <Blink dep={withdrawnPercentage?.toSignificant(3)} as="span" timeout={1500}>
                          {(isBlinking) => (
                            <span className={classNames(isBlinking ? 'text-green' : '', 'flex items-center gap-1')}>
                              {withdrawnPercentage?.toSignificant(3)}%
                              {isBlinking && (
                                <ArrowUpIcon className="rotate-45" strokeWidth={3} width={14} height={14} />
                              )}
                            </span>
                          )}
                        </Blink>
                        <span className="text-[10px] font-medium text-slate-500">
                          {withdrawnAmount?.toSignificant(6)} {withdrawnAmount?.currency.symbol}
                        </span>
                      </div>
                    </List.KeyValue>
                  </List.Control>
                </List>
                <List>
                  <List.Label>Details</List.Label>
                  <List.Control>
                    <List.KeyValue title="Remaining">
                      <FuroTimer furo={stream}>
                        {({ days, seconds, minutes, hours, isCompleted }) => (
                          <span className="flex gap-1 items-baseline">
                            {isCompleted ? (
                              <span className="text-green">Completed</span>
                            ) : (
                              <>
                                <span>
                                  {days}
                                  <span className="text-gray-400 dark:text-slate-400 text-xs">D</span>
                                </span>
                                <span>
                                  {hours}
                                  <span className="text-gray-400 dark:text-slate-400 text-xs">H</span>
                                </span>
                                <span>
                                  {minutes}
                                  <span className="text-gray-400 dark:text-slate-400 text-xs">M</span>
                                </span>
                                <span>
                                  {seconds}
                                  <span className="text-gray-400 dark:text-slate-400 text-xs">S</span>
                                </span>
                              </>
                            )}
                          </span>
                        )}
                      </FuroTimer>
                    </List.KeyValue>
                    <List.KeyValue title="Started on">
                      <div className="flex flex-col">
                        {format(new Date(stream.startTime), 'dd MMM yyyy')}
                        <span className="text-[10px] font-medium text-slate-500">
                          {format(new Date(stream.startTime), 'hh:mmaaa')}
                        </span>
                      </div>
                    </List.KeyValue>
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
                  <List.Label>Withdraw History</List.Label>
                  <List.Control className="max-h-[320px] scroll">
                    {transactions?.map((tx, i) => (
                      <List.KeyValue
                        key={i}
                        flex
                        title={`${format(new Date(tx.timestamp), 'dd MMM yyyy')}`}
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
