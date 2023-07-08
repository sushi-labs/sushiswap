'use client'

import { ArrowLeftIcon, SwitchHorizontalIcon } from '@heroicons/react-v1/solid'
import { Chain, ChainId } from '@sushiswap/chain'
import { tryParseAmount, Type } from '@sushiswap/currency'
import { useAngleRewards } from '@sushiswap/react-query'
import {
  Badge,
  Button,
  ChipInput,
  Currency,
  Dots,
  IconButton,
  Input,
  List,
  Modal,
  NetworkIcon,
  Separator,
  SkeletonText,
  Slider,
  SplashController,
  Switch,
  typographyVariants,
} from '@sushiswap/ui'
import { classNames } from '@sushiswap/ui'
import { ADDRESS_ZERO, Pool as V3Pool, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { Address, readContract, useAccount, useSignMessage } from '@sushiswap/wagmi'
import { TxStatusModalContent } from '@sushiswap/wagmi/future/components/TxStatusModal'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import { useConcentratedLiquidityPool } from '@sushiswap/wagmi/future/hooks'
import { DistributionCreator } from '@sushiswap/wagmi/future/hooks/rewards/abis/DistributionCreator'
import { useIncentivizePoolWithRewards } from '@sushiswap/wagmi/future/hooks/rewards/hooks/useIncentivizePoolWithRewards'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { useApproved } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { format } from 'date-fns'
import { BigNumber } from 'ethers'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { useTokenAmountDollarValues } from '../../../lib/hooks'
import { Layout, SelectNetworkWidget, SelectTokensWidget } from '../../../ui/pool'
import { ContentBlock } from '../../../ui/pool/AddPage/ContentBlock'
import { ConcentratedLiquidityProvider } from '../../../ui/pool/ConcentratedLiquidityProvider'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from '../../../ui/pool/ConcentratedLiquidityURLStateProvider'
import { SelectFeeConcentratedWidget } from '../../../ui/pool/NewPositionSection/SelectFeeConcentratedWidget'

const MODAL_INCENTIVIZE_ID = 'incentivize-modal'
const APPROVE_TAG = 'approve-incentivize'

export default async function Page() {
  return (
    <ConcentratedLiquidityURLStateProvider>
      {({ token0, chainId }) => (
        <SplashController show={Boolean(!token0 || !chainId)}>
          <Layout>
            <div className="flex flex-col gap-2">
              <Link className="group flex gap-4 items-center mb-2" href={'/pool'} shallow={true}>
                <IconButton size="sm" icon={ArrowLeftIcon} name="Back" />
                <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
                  Go back to pools list
                </span>
              </Link>
              <h1 className={typographyVariants({ variant: 'h3' })}>Incentivize Pool</h1>
              <p className={typographyVariants({ variant: 'muted' })}>
                Add rewards to a pool to incentivize liquidity providers joining in.
              </p>
            </div>
            <Separator orientation="horizontal" className="mt-4 mb-10" />
            <div className="flex justify-between">
              <div className="flex lg:grid lg:grid-cols-[404px_auto] gap-20">
                <ConcentratedLiquidityProvider>
                  <Incentivize />
                </ConcentratedLiquidityProvider>
              </div>
            </div>
          </Layout>
        </SplashController>
      )}
    </ConcentratedLiquidityURLStateProvider>
  )
}

const Incentivize = withCheckerRoot(() => {
  const { address } = useAccount()
  const { push } = useRouter()
  const { chainId, token0, token1, setToken1, setToken0, setNetwork, feeAmount, setFeeAmount, tokensLoading } =
    useConcentratedLiquidityURLState()

  const { approved } = useApproved(APPROVE_TAG)
  const [value, setValue] = useState('')
  const [invert, setInvert] = useState(false)
  const [customize, setCustomize] = useState(false)
  const [customizeOOR, setCustomizeOOR] = useState(false)
  const [includeBlacklist, setIncludeBlacklist] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>()
  const [endDate, setEndDate] = useState<Date | null>()
  const [rewardToken, setRewardToken] = useState<Type>()
  const [blacklist, setBlacklist] = useState<string[]>([])
  const [distribution, setDistribution] = useState({
    thumb0: 20,
    thumb1: 60,
  })

  const amount = useMemo(() => [tryParseAmount(value, rewardToken)], [value, rewardToken])
  const { data: pool, isInitialLoading } = useConcentratedLiquidityPool({ chainId, token0, token1, feeAmount })

  const fiatAmounts = useMemo(() => [tryParseAmount('1', token0), tryParseAmount('1', token1)], [token0, token1])
  const fiatAmountsAsNumber = useTokenAmountDollarValues({ chainId, amounts: fiatAmounts })

  const v3Address =
    token0 && token1 && feeAmount ? V3Pool.getAddress(token0.wrapped, token1.wrapped, feeAmount) : undefined

  const epochs = useMemo(() => {
    return startDate && endDate ? Math.floor((endDate.getTime() - startDate.getTime()) / 3600000) : undefined
  }, [startDate, endDate])

  const { data: signature, signMessage } = useSignMessage()

  const { data: angleRewards } = useAngleRewards({ chainId, account: address })

  const minAmount = useMemo(() => {
    if (!angleRewards) return undefined
    const token = angleRewards.validRewardTokens.find((el) => el.token === rewardToken?.wrapped.address)
    if (token && epochs) return tryParseAmount(token.minimumAmountPerEpoch.toString(), rewardToken)?.multiply(epochs)
  }, [angleRewards, epochs, rewardToken])

  const {
    writeAsync,
    isLoading: isIncentivizeLoading,
    isError,
    data,
  } = useIncentivizePoolWithRewards({
    account: address,
    args:
      amount[0] && v3Address && rewardToken && epochs && startDate && signature
        ? [
            {
              uniV3Pool: v3Address as Address,
              rewardToken: rewardToken.wrapped.address as Address,
              amount: BigNumber.from(amount[0].quotient.toString()),
              positionWrappers: blacklist.length > 0 ? blacklist : [],
              wrapperTypes: blacklist.length > 0 ? [3] : [],
              propToken0: customize ? distribution.thumb0 * 100 : 2000,
              propToken1: customize ? (distribution.thumb1 - distribution.thumb0) * 100 : 2000,
              propFees: customize ? (100 - distribution.thumb1) * 100 : 6000,
              epochStart: Math.floor(startDate.getTime() / 1000) || 0,
              numEpoch: epochs,
              isOutOfRangeIncentivized: customizeOOR ? 1 : 0,
              boostedReward: 0,
              boostingAddress: ADDRESS_ZERO,
              rewardId: '0x0000000000000000000000000000000000000000000000000000000000000000',
              additionalData: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
            signature,
          ]
        : undefined,
    chainId: chainId as SushiSwapV3ChainId,
    enabled: Boolean(amount[0] && v3Address && rewardToken && epochs && startDate && approved),
  })

  const sign = useCallback(async () => {
    const message = await readContract({
      abi: DistributionCreator,
      address: '0x8BB4C975Ff3c250e0ceEA271728547f3802B36Fd',
      functionName: 'message',
    })

    signMessage({ message })
  }, [signMessage])

  const onChangeSlider = useCallback((val: number[]) => {
    setDistribution({ thumb0: val[0], thumb1: Math.max(val[0], val[1]) })
  }, [])

  return (
    <>
      <div className="hidden lg:block">
        <div className="lg:grid grid-cols-2 items-center gap-6 sticky top-[96px]">
          <div className="col-span-2 flex gap-7">
            <div className="flex min-w-[44px] mb-4">
              <Badge
                className="border-2 border-gray-100 dark:border-slate-900 rounded-full z-[11] !bottom-0 right-[-15%]"
                position="bottom-right"
                badgeContent={
                  chainId ? (
                    <NetworkIcon chainId={chainId} width={24} height={24} />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300" />
                  )
                }
              >
                <Currency.IconList iconWidth={48} iconHeight={48}>
                  {token0 && !tokensLoading ? (
                    <Currency.Icon currency={token0} />
                  ) : (
                    <div className="w-[48px] h-[48px] rounded-full bg-gray-300 dark:bg-slate-800" />
                  )}
                  {token1 && !tokensLoading ? (
                    <Currency.Icon currency={token1} />
                  ) : (
                    <div className="w-[48px] h-[48px] rounded-full bg-gray-300 dark:bg-slate-800" />
                  )}
                </Currency.IconList>
              </Badge>
            </div>
            <div className="flex flex-col flex-grow">
              {token0 && token1 ? (
                <>
                  <h1 className="text-xl text-gray-900 dark:text-slate-50 font-semibold">
                    {token0.symbol}/{token1.symbol}
                  </h1>
                  <p className="font-medium text-gray-700 dark:dark:text-slate-400 text-slate-600">
                    SushiSwap V3 • {feeAmount / 10000}%
                  </p>
                </>
              ) : tokensLoading ? (
                <>
                  <SkeletonText fontSize="xl" className="w-full" />
                  <SkeletonText className="w-full" />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <List.Label className="!px-0">Network</List.Label>
            <div className="flex font-medium items-center gap-2 rounded-xl ">
              <NetworkIcon chainId={chainId} width={24} height={24} /> {Chain.from(chainId).name}
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <List.Label className="!px-0">Fee Tier</List.Label>
            <div className="flex items-center font-medium gap-2 rounded-xl ">{feeAmount / 10000}% Fee</div>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <List.Label className="!px-0">Pool Type</List.Label>
            <div className="flex items-center font-medium gap-2 rounded-xl">Concentrated Liquidity</div>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <List.Label className="!px-0">Current Price</List.Label>
            {!isInitialLoading && !pool ? (
              <span className="">N/A</span>
            ) : isInitialLoading ? (
              <SkeletonText className="w-[120px]" />
            ) : token0 && token1 && pool ? (
              <div>
                <Button icon={SwitchHorizontalIcon} variant="link" onClick={() => setInvert((prev) => !prev)}>
                  <div className="flex items-baseline gap-1.5">
                    {invert ? token1.symbol : token0.symbol} ={' '}
                    {pool.priceOf(invert ? token1.wrapped : token0.wrapped)?.toSignificant(4)}{' '}
                    {invert ? token0.symbol : token1.symbol}
                    <span className="text-sm font-normal">${fiatAmountsAsNumber[invert ? 1 : 0].toFixed(2)}</span>
                  </div>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex flex-col order-3 gap-10 pb-40 sm:order-2">
        <SelectNetworkWidget
          title="On which network would you like to add rewards?"
          selectedNetwork={chainId}
          onSelect={setNetwork}
        />
        <SelectTokensWidget
          title="Which token pair would you like to incentivize"
          chainId={chainId}
          token0={token0}
          token1={token1}
          setToken0={setToken0}
          setToken1={setToken1}
        />
        <SelectFeeConcentratedWidget
          title="What is the fee tier for this pool?"
          feeAmount={feeAmount}
          setFeeAmount={setFeeAmount}
          token1={token1}
          token0={token0}
          disableIfNotExists={true}
        />
        <Separator />
        <ContentBlock title="What is the duration for distributing rewards?">
          <div className="grid grid-cols-2 gap-3">
            <Input.DatePicker
              selected={startDate}
              onChange={setStartDate}
              customInput={
                <Input.DatePickerCustomInput
                  id="start-date"
                  label={
                    <>
                      Start date<sup>*</sup>
                    </>
                  }
                />
              }
              portalId="root-portal"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              startDate={new Date(Date.now() + 5 * 60 * 1000)}
              minDate={new Date(Date.now() + 5 * 60 * 1000)}
              dateFormat="MMM d, yyyy HH:mm"
              placeholderText="Select date"
              autoComplete="off"
            />
            <Input.DatePicker
              selected={endDate}
              onChange={setEndDate}
              customInput={
                <Input.DatePickerCustomInput
                  id="end-date"
                  label={
                    <>
                      End date<sup>*</sup>
                    </>
                  }
                />
              }
              portalId="root-portal"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              startDate={startDate ? startDate : new Date(Date.now() + 5 * 60 * 1000)}
              minDate={startDate ? startDate : new Date(Date.now() + 5 * 60 * 1000)}
              dateFormat="MMM d, yyyy HH:mm"
              placeholderText="Select date"
              autoComplete="off"
            />
          </div>
        </ContentBlock>
        <ContentBlock title="How many rewards in total would you like to distribute?">
          <Web3Input.Currency
            id="swap-from"
            type="INPUT"
            className="p-3 bg-white dark:bg-slate-800 rounded-xl"
            chainId={chainId}
            onSelect={setRewardToken}
            value={value}
            onChange={setValue}
            currency={rewardToken}
            loading={tokensLoading}
            currencyLoading={tokensLoading}
            allowNative={false}
            {...(epochs &&
              rewardToken &&
              amount[0] &&
              minAmount &&
              amount[0].lessThan(minAmount) && { error: `Min. ${minAmount.toSignificant(4)} ${rewardToken.symbol}` })}
          />
          <p className={typographyVariants({ variant: 'muted', className: 'text-sm' })}>
            Rewards are distributed per hour. The minimum reward for this distribution is dependent on the selected
            duration.
          </p>
        </ContentBlock>
        <Separator />
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className={typographyVariants({ variant: 'p' })}>Customize the distribution formula?</h1>
            <Switch
              testdata-id="customize-distribution-switch"
              checked={customize}
              onCheckedChange={() => setCustomize((prevState) => !prevState)}
            />
          </div>
          <div className={classNames('flex flex-col gap-3', customize ? '' : 'hidden')}>
            <div className="flex flex-col gap-6">
              <Slider
                value={[distribution.thumb0, distribution.thumb1]}
                onValueChange={onChangeSlider}
                max={100}
                step={5}
                minStepsBetweenThumbs={1}
                className="w-full"
              />
              <List>
                <List.Label>Distribution</List.Label>
                <List.Control>
                  {token0 ? <List.KeyValue title={`${token0.symbol}`}>{distribution.thumb0}%</List.KeyValue> : null}
                  {token1 ? (
                    <List.KeyValue title={`${token1.symbol}`}>
                      {distribution.thumb1 - distribution.thumb0}%
                    </List.KeyValue>
                  ) : null}
                  <List.KeyValue title="Fees">{100 - distribution.thumb1}%</List.KeyValue>
                </List.Control>
              </List>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className={typographyVariants({ variant: 'p' })}>Exclude any addresses from receiving rewards?</h1>
            <Switch
              testdata-id="customize-blacklist-switch"
              checked={includeBlacklist}
              onCheckedChange={() => setIncludeBlacklist((prevState) => !prevState)}
            />
          </div>
          <div className={classNames(includeBlacklist ? 'flex flex-col gap-2' : 'hidden')}>
            <ChipInput
              delimiters={[',', ' ', ';', ':']}
              variant="secondary"
              values={blacklist}
              onValueChange={setBlacklist}
              placeholder="Address"
            />
            <p className={typographyVariants({ variant: 'muted', className: 'text-sm px-3' })}>
              The addresses to blacklist, use commas to separate addresses
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h1 className={typographyVariants({ variant: 'p' })}>
            Distribute rewards to positions that are out of range?
          </h1>
          <Switch
            testdata-id="customize-outofrange-switch"
            checked={customizeOOR}
            onCheckedChange={() => setCustomizeOOR((prevState) => !prevState)}
          />
        </div>
        <Separator />
        <Checker.Connect>
          <Checker.Network chainId={chainId}>
            <Checker.Guard guardWhen={!pool} guardText="Pool not found">
              <Checker.Amounts chainId={chainId} amounts={amount}>
                <Checker.Guard guardWhen={!startDate || !endDate} guardText="Enter duration">
                  <Checker.ApproveERC20
                    id="approve-erc20"
                    amount={amount[0]}
                    contract="0x8BB4C975Ff3c250e0ceEA271728547f3802B36Fd"
                  >
                    <Checker.Custom
                      showChildren={Boolean(signature)}
                      onClick={sign}
                      buttonText="Sign the terms & conditions"
                    >
                      <Checker.Success tag={APPROVE_TAG}>
                        <Modal.Trigger tag={MODAL_INCENTIVIZE_ID}>
                          {({ open }) => (
                            <Button size="xl" testId="swap" onClick={open}>
                              Incentivize pool
                            </Button>
                          )}
                        </Modal.Trigger>
                      </Checker.Success>
                    </Checker.Custom>
                  </Checker.ApproveERC20>
                </Checker.Guard>
              </Checker.Amounts>
            </Checker.Guard>
          </Checker.Network>
        </Checker.Connect>
      </div>
      {pool && token0 && token1 ? (
        <>
          <Modal.Review tag={MODAL_INCENTIVIZE_ID} variant="opaque">
            {({ close, confirm }) => (
              <div className="max-w-[504px] mx-auto">
                <button onClick={close} className="p-3 pl-0">
                  <ArrowLeftIcon strokeWidth={3} width={24} height={24} />
                </button>
                <div className="flex items-start justify-between gap-4 py-2">
                  <div className="flex flex-col flex-grow gap-1">
                    <h1 className="text-3xl font-semibold text-gray-900 dark:text-slate-50">Migrate Liquidity</h1>
                    <h1 className="text-lg font-medium text-gray-600 dark:text-slate-300">
                      {token0?.symbol}/{token1?.symbol} • SushiSwap V3 • {feeAmount / 10000}%
                    </h1>
                  </div>
                  <div>
                    {token0 && token1 && (
                      <Currency.IconList iconWidth={56} iconHeight={56}>
                        <Currency.Icon currency={token0} width={56} height={56} />
                        <Currency.Icon currency={token1} width={56} height={56} />
                      </Currency.IconList>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <List>
                    <List.Control>
                      <List.KeyValue flex title="Network">
                        {Chain.from(pool.chainId).name}
                      </List.KeyValue>
                      {feeAmount && <List.KeyValue title="Fee Tier">{`${+feeAmount / 10000}%`}</List.KeyValue>}
                    </List.Control>
                  </List>
                  <List>
                    <List.Control>
                      {startDate ? (
                        <List.KeyValue flex title="Start date">
                          {format(startDate, 'dd MMM yyyy hh:mmaaa')}
                        </List.KeyValue>
                      ) : null}
                      {endDate ? (
                        <List.KeyValue flex title="End date">
                          {format(endDate, 'dd MMM yyyy hh:mmaaa')}
                        </List.KeyValue>
                      ) : null}
                      {amount[0] ? (
                        <List.KeyValue title={`Total distributed`}>
                          <div className="flex items-center gap-2">
                            <Currency.Icon currency={amount[0].currency} width={18} height={18} />
                            <span>
                              {amount[0].toSignificant(6)} {amount[0].currency.symbol}
                            </span>
                          </div>
                        </List.KeyValue>
                      ) : null}
                      <List.KeyValue
                        flex
                        title="Out of range incentivization"
                        subtitle="Distribute rewards to out of range positions"
                      >
                        {customizeOOR ? 'Yes' : 'No'}
                      </List.KeyValue>
                      <List.KeyValue flex title="Exclude addresses" subtitle="Exluded addresses from receiving rewards">
                        {blacklist ? `${blacklist.length} Addresses` : 'No'}
                      </List.KeyValue>
                      <List.KeyValue
                        flex
                        title="Customized distribution formula"
                        subtitle={`${token0.symbol} / ${token1.symbol} / Fees`}
                      >
                        {customize
                          ? `${distribution.thumb0}% / ${distribution.thumb1 - distribution.thumb0}% / ${
                              100 - distribution.thumb1
                            }%`
                          : 'No'}
                      </List.KeyValue>
                    </List.Control>
                  </List>
                  <List>
                    <List.Control>
                      <span />
                    </List.Control>
                  </List>
                </div>
                <div className="pt-4">
                  <div className="space-y-4">
                    <Button
                      fullWidth
                      size="xl"
                      variant={isError ? 'destructive' : 'default'}
                      loading={isIncentivizeLoading && !isError}
                      onClick={() => writeAsync?.().then(() => confirm())}
                      disabled={isIncentivizeLoading || isError}
                      testId="confirm-swap"
                    >
                      {isError ? (
                        'Shoot! Something went wrong :('
                      ) : isIncentivizeLoading ? (
                        <Dots>Incentivize Pool</Dots>
                      ) : (
                        `Incentivize Pool`
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Modal.Review>
          <Modal.Confirm tag={MODAL_INCENTIVIZE_ID} variant="transparent">
            {({ close }) => (
              <TxStatusModalContent
                onComplete={() => push(`/pools/${pool.chainId}:${v3Address}?activeTab=myPositions`)}
                testId="migrate-confirmation-modal"
                tag={MODAL_INCENTIVIZE_ID}
                chainId={pool.chainId as ChainId}
                hash={data?.hash}
                successMessage={`Successfully migrated your ${token0.symbol}/${token1.symbol} position`}
                onClose={close}
                buttonSuccessText="Go to pool"
                buttonSuccessLink={`/pools/${pool.chainId}:${v3Address}?activeTab=myPositions`}
              />
            )}
          </Modal.Confirm>
        </>
      ) : null}
    </>
  )
})
