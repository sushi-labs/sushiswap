import { classNames, NetworkIcon } from '@sushiswap/ui'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { FC, useMemo } from 'react'
import { CancelModal, FuroTimer, Layout, TransferModal } from '../../components'
import { createScheduleRepresentation, NextPaymentTimer, WithdrawModal } from '../../components/vesting'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'
import Link from 'next/link'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from '@heroicons/react/solid'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { formatNumber, shortenAddress } from '@sushiswap/format'
import { SushiIcon } from '@sushiswap/ui/future/components/icons'
import { Blink } from '@sushiswap/ui/future/components/Blink'
import { format } from 'date-fns'
import { useEnsName } from 'wagmi'
import { Address } from '@wagmi/core'
import { ChainId } from '@sushiswap/chain'
import { Percent } from '@sushiswap/math'
import { getFuroVestingContractConfig } from '@sushiswap/wagmi'
import { Button } from '@sushiswap/ui/future/components/button'
import { DownloadIcon, XIcon } from '@heroicons/react/outline'
import { useVesting, useVestingBalance, useVestingTransactions } from '../../lib'
import { queryParamsSchema } from '../../lib/zod'

const VestingPage = () => {
  return (
    <SplashController>
      <_VestingPage />
    </SplashController>
  )
}

const _VestingPage: FC = () => {
  const { query } = useRouter()

  const {
    id: [chainId, vestingId],
  } = queryParamsSchema.parse(query)

  const { data: transactions, isLoading: isTxLoading } = useVestingTransactions({ chainId, vestingId })
  const { data: vesting, isLoading: isVestingLoading } = useVesting({ chainId, vestingId })
  const { data: balance, isLoading: isBalanceLoading } = useVestingBalance({
    chainId,
    vestingId,
    token: vesting?.token,
  })

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

  const { data: ens } = useEnsName({
    enabled: Boolean(vesting),
    address: vesting?.recipient.id as Address | undefined,
    chainId: ChainId.ETHEREUM,
  })

  const [streamedAmount, streamedPercentage] = useMemo(() => {
    if (!vesting || !balance) return [undefined, undefined]
    return [
      vesting.withdrawnAmount.add(balance),
      new Percent(vesting.withdrawnAmount.add(balance).quotient, vesting.totalAmount.quotient),
    ]
  }, [balance, vesting])

  const [withdrawnAmount, withdrawnPercentage] = useMemo(() => {
    if (!vesting || !balance) return [undefined, undefined]
    return [
      vesting.totalAmount.subtract(balance),
      new Percent(vesting.totalAmount.subtract(balance).quotient, vesting.totalAmount.quotient),
    ]
  }, [balance, vesting])

  const remainingAmount = useMemo(() => {
    if (!vesting?.totalAmount || !balance || !withdrawnAmount) return undefined
    return vesting.remainingAmount.subtract(balance)
  }, [balance, vesting?.remainingAmount, vesting?.totalAmount, withdrawnAmount])

  const isLoading = isTxLoading || isVestingLoading || isBalanceLoading

  if (isLoading) {
    return (
      <>
        <NextSeo title={`Stream #${vestingId}`} />
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

  if (vesting) {
    return (
      <>
        <NextSeo title={`Stream #${vestingId}`} />
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
                    <Currency.Icon currency={vesting?.totalAmount.currency} />
                  </Currency.IconList>
                </Badge>
              </div>
              <div className="flex flex-col flex-grow gap-0.5">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-50">Vesting {vestingId}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-400">
                  {formatNumber(vesting?.totalAmount.toSignificant(6))}
                </div>
              </div>
            </div>{' '}
            <div className="flex flex-wrap gap-2 mt-3">
              <WithdrawModal vesting={vesting} chainId={chainId}>
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
                stream={vesting}
                abi={getFuroVestingContractConfig(chainId)?.abi}
                address={getFuroVestingContractConfig(chainId)?.address}
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
              <CancelModal
                title="Cancel Vesting"
                stream={vesting}
                abi={getFuroVestingContractConfig(chainId)?.abi}
                address={getFuroVestingContractConfig(chainId)?.address}
                fn="stopVesting"
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
                    <span className="font-medium text-white">{vesting?.totalAmount.currency.symbol}</span>
                    <span className="text-2xl font-medium text-white">
                      {formatNumber(vesting?.totalAmount.toSignificant(6))}
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
                  {ens ? ens : shortenAddress(vesting?.recipient.id)}
                </div>
              </div>
            </div>
            <div className="min-w-fit">
              <div className="flex flex-col flex-grow justify-center gap-5">
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue title="Next unlock">
                      <div className="flex flex-col">
                        <NextPaymentTimer schedule={schedule}>
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
                        </NextPaymentTimer>
                      </div>
                    </List.KeyValue>
                    <List.KeyValue title="Unlocked" subtitle="available for withdrawal">
                      <div className="flex flex-col items-end">
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
                    <List.KeyValue title="Locked" subtitle="funds in vest">
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
                  </List.Control>
                </List>
                <List>
                  <List.Label>Details</List.Label>
                  <List.Control>
                    <List.KeyValue title="Remaining">
                      <FuroTimer furo={vesting}>
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
                        {format(new Date(vesting.startTime), 'dd MMM yyyy')}
                        <span className="text-[10px] font-medium text-slate-500">
                          {format(new Date(vesting.startTime), 'hh:mmaaa')}
                        </span>
                      </div>
                    </List.KeyValue>
                    <List.KeyValue title="Ending on">
                      <div className="flex flex-col">
                        {format(new Date(vesting.endTime), 'dd MMM yyyy')}
                        <span className="text-[10px] font-medium text-slate-500">
                          {format(new Date(vesting.endTime), 'hh:mmaaa')}
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

export default VestingPage
