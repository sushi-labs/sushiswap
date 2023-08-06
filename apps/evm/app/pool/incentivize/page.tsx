'use client'

import { ArrowLeftIcon, SwitchHorizontalIcon } from '@heroicons/react-v1/solid'
import { Chain } from '@sushiswap/chain'
import { Token, tryParseAmount, Type } from '@sushiswap/currency'
import { useAngleRewardTokens } from '@sushiswap/react-query'
import {
  Badge,
  Button,
  ChipInput,
  classNames,
  Currency,
  DateField,
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
  Dots,
  FormError,
  IconButton,
  List,
  NetworkIcon,
  Separator,
  SkeletonText,
  Slider,
  SplashController,
  Switch,
  TextField,
  typographyVariants,
} from '@sushiswap/ui'
import { ADDRESS_ZERO, SushiSwapV3ChainId, SushiSwapV3Pool } from '@sushiswap/v3-sdk'
import { Address, readContract, useAccount, useSignMessage } from '@sushiswap/wagmi'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import { useConcentratedLiquidityPool } from '@sushiswap/wagmi/future/hooks'
import { DistributionCreator } from '@sushiswap/wagmi/future/hooks/rewards/abis/DistributionCreator'
import { useIncentivizePoolWithRewards } from '@sushiswap/wagmi/future/hooks/rewards/hooks/useIncentivizePoolWithRewards'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { useApproved, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { format } from 'date-fns'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { useWaitForTransaction } from 'wagmi'

import { ANGLE_ENABLED_NETWORKS } from '../../../config'
import { useTokenAmountDollarValues } from '../../../lib/hooks'
import { Layout, SelectNetworkWidget, SelectTokensWidget } from '../../../ui/pool'
import { ContentBlock } from '../../../ui/pool/AddPage/ContentBlock'
import { ConcentratedLiquidityProvider } from '../../../ui/pool/ConcentratedLiquidityProvider'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from '../../../ui/pool/ConcentratedLiquidityURLStateProvider'
import { SelectFeeConcentratedWidget } from '../../../ui/pool/NewPositionSection/SelectFeeConcentratedWidget'

const APPROVE_TAG = 'approve-incentivize'

export default async function Page() {
  return (
    <ConcentratedLiquidityURLStateProvider supportedNetworks={ANGLE_ENABLED_NETWORKS}>
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
  const [distro1, setDistro1] = useState<number[]>([20])
  const [distro2, setDistro2] = useState<number[]>([40])
  const [distro3, setDistro3] = useState<number[]>([40])
  const totalDistro = distro1[0] + distro2[0] + distro3[0]

  const amount = useMemo(() => [tryParseAmount(value, rewardToken)], [value, rewardToken])
  const { data: pool, isInitialLoading } = useConcentratedLiquidityPool({ chainId, token0, token1, feeAmount })

  const fiatAmounts = useMemo(() => [tryParseAmount('1', token0), tryParseAmount('1', token1)], [token0, token1])
  const fiatAmountsAsNumber = useTokenAmountDollarValues({ chainId, amounts: fiatAmounts })

  const v3Address =
    token0 && token1 && feeAmount ? SushiSwapV3Pool.getAddress(token0.wrapped, token1.wrapped, feeAmount) : undefined

  const epochs = useMemo(() => {
    return startDate && endDate ? Math.floor((endDate.getTime() - startDate.getTime()) / 3600000) : undefined
  }, [startDate, endDate])

  const { data: signature, signMessage } = useSignMessage()

  const { data: angleRewardTokens, isLoading: angleRewardTokensLoading } = useAngleRewardTokens({ chainId })

  const minAmount = useMemo(() => {
    if (!angleRewardTokens) return undefined
    const token = angleRewardTokens.find((el) => el.token.wrapped.address === rewardToken?.wrapped.address)
    if (token && epochs) return token.minimumAmountPerEpoch?.multiply(epochs)
  }, [angleRewardTokens, epochs, rewardToken])

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
              amount: amount[0].quotient,
              positionWrappers: blacklist.length > 0 ? (blacklist as Address[]) : [],
              wrapperTypes: blacklist.length > 0 ? [3] : [],
              propToken0: customize ? distro1[0] * 100 : 2000,
              propToken1: customize ? distro2[0] * 100 : 2000,
              propFees: customize ? distro3[0] * 100 : 6000,
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

  const { status } = useWaitForTransaction({ chainId, hash: data?.hash })

  const rewardTokens = useMemo(
    () =>
      angleRewardTokens
        ? angleRewardTokens.reduce<Record<string, Token>>((acc, cur) => {
            acc[cur.token.wrapped.address] = cur.token
            return acc
          }, {})
        : {},
    [angleRewardTokens]
  )

  const validStartDate = startDate ? startDate > new Date() : true
  const validEndDate = endDate && startDate ? endDate > startDate && endDate > new Date() : true

  return (
    <DialogProvider>
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
                    1 {invert ? token1.symbol : token0.symbol} ={' '}
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
          networks={ANGLE_ENABLED_NETWORKS}
        />
        <SelectTokensWidget
          title="Which token pair would you like to incentivize?"
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
            <div className="flex flex-col gap-2">
              <DateField
                selected={startDate}
                onChange={setStartDate}
                portalId="root-portal"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                startDate={new Date(Date.now() + 5 * 60 * 1000)}
                minDate={new Date(Date.now() + 5 * 60 * 1000)}
                dateFormat="MMM d, yyyy HH:mm"
                placeholderText="Start date"
                autoComplete="off"
              />
              {!validStartDate ? <FormError>Invalid start date.</FormError> : null}
            </div>
            <div className="flex flex-col gap-2">
              <DateField
                selected={endDate}
                onChange={setEndDate}
                portalId="root-portal"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                startDate={startDate ? startDate : new Date(Date.now() + 5 * 60 * 1000)}
                minDate={startDate ? startDate : new Date(Date.now() + 5 * 60 * 1000)}
                dateFormat="MMM d, yyyy HH:mm"
                placeholderText="End date"
                autoComplete="off"
              />
              {!validEndDate ? <FormError>Invalid end date.</FormError> : null}
            </div>
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
            currencies={rewardTokens}
            loading={angleRewardTokensLoading}
            currencyLoading={angleRewardTokensLoading}
            allowNative={false}
            hidePinnedTokens={true}
            hideSearch={true}
            {...(epochs &&
              rewardToken &&
              amount[0] &&
              minAmount &&
              amount[0].lessThan(minAmount) && { error: `Min. ${minAmount.toSignificant(4)} ${rewardToken.symbol}` })}
          />
          <p className={typographyVariants({ variant: 'muted', className: 'text-sm' })}>
            Rewards are distributed per hour. The minimum reward for this distribution is dependent on the selected
            duration. <br />
            <br /> Looking to get your token added here?{' '}
            <Button variant="link" asChild>
              <a target="_blank" rel="noreferrer noopener" href="https://rbieu62gj0f.typeform.com/to/KkrPkOFe">
                Get in touch with us.
              </a>
            </Button>
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
          <div className={classNames('flex flex-col gap-3', customize ? 'mt-4' : 'hidden')}>
            <div className="flex flex-col gap-10">
              <div className="flex flex-col">
                {token0 ? (
                  <span className="flex items-center gap-2">
                    <Currency.Icon currency={token0} width={20} height={20} />
                    {token0?.symbol}
                  </span>
                ) : null}
                <div className="grid grid-cols-12 items-center gap-x-4">
                  <Slider value={distro1} onValueChange={setDistro1} max={100} step={5} className="col-span-9 w-full" />
                  <div className="col-span-3">
                    <TextField
                      isError={totalDistro !== 100}
                      unit="%"
                      type="number"
                      value={distro1[0]}
                      onValueChange={(val) => setDistro1([+val])}
                    />
                  </div>
                  <span className="col-span-9 text-sm text-muted-foreground">
                    Percentage of rewards that get distributed to {token0?.symbol} liquidity
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                {token1 ? (
                  <span className="flex items-center gap-2">
                    <Currency.Icon currency={token1} width={20} height={20} />
                    {token1?.symbol}
                  </span>
                ) : null}
                <div className="grid grid-cols-12 items-center gap-x-4">
                  <Slider value={distro2} onValueChange={setDistro2} max={100} step={5} className="col-span-9 w-full" />
                  <div className="col-span-3">
                    <TextField
                      isError={totalDistro !== 100}
                      unit="%"
                      type="number"
                      value={distro2[0]}
                      onValueChange={(val) => setDistro2([+val])}
                    />
                  </div>
                  <span className="col-span-9 text-sm text-muted-foreground">
                    Percentage of rewards that get distributed to {token1?.symbol} liquidity
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="flex items-center gap-2">Fees</span>
                <div className="grid grid-cols-12 items-center gap-x-4">
                  <Slider value={distro3} onValueChange={setDistro3} max={100} step={5} className="col-span-9 w-full" />
                  <div className="col-span-3">
                    <TextField
                      isError={totalDistro !== 100}
                      unit="%"
                      type="number"
                      value={distro3[0]}
                      onValueChange={(val) => setDistro3([+val])}
                    />
                  </div>
                  <span className="col-span-9 text-sm text-muted-foreground">
                    Percentage of rewards that get distributed to fee generation
                  </span>
                </div>
              </div>
            </div>
            <h1 className={classNames(totalDistro !== 100 ? 'text-red' : 'text-muted-foreground', 'text-sm pt-4')}>
              You have assigned <b>{totalDistro}%</b> of the available <b>100%</b>.
            </h1>
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
              {blacklist.length > 0
                ? `${blacklist.length} address${blacklist.length > 1 ? 'es' : ''} blacklisted.`
                : 'The addresses to blacklist, use commas to separate addresses.'}
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
                  <Checker.Guard guardWhen={totalDistro !== 100} guardText="Invalid distribution">
                    <Checker.Guard
                      guardWhen={!validEndDate || !validStartDate}
                      guardText="Invalid distribution duration"
                    >
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
                            <DialogReview>
                              {({ confirm }) => (
                                <>
                                  <DialogTrigger asChild>
                                    <Button fullWidth size="xl" testId="incentivize-pool-review">
                                      Incentivize pool
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Incentivize Pool</DialogTitle>
                                      <DialogDescription>
                                        {token0?.symbol}/{token1?.symbol} • SushiSwap V3 • {feeAmount / 10000}%
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4">
                                      <List className="!pt-0">
                                        <List.Control>
                                          {pool ? (
                                            <List.KeyValue flex title="Network">
                                              {Chain.from(pool.chainId).name}
                                            </List.KeyValue>
                                          ) : null}
                                          {feeAmount && (
                                            <List.KeyValue title="Fee Tier">{`${+feeAmount / 10000}%`}</List.KeyValue>
                                          )}
                                        </List.Control>
                                      </List>
                                      <List className="!pt-0">
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
                                            <List.KeyValue title={'Total distributed'}>
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
                                          <List.KeyValue
                                            flex
                                            title="Exclude addresses"
                                            subtitle="Exluded addresses from receiving rewards"
                                          >
                                            {blacklist ? `${blacklist.length} Addresses` : 'No'}
                                          </List.KeyValue>
                                          {token0 && token1 ? (
                                            <List.KeyValue
                                              flex
                                              title="Customized distribution formula"
                                              subtitle={`${token0.symbol} / ${token1.symbol} / Fees`}
                                            >
                                              {customize ? `${distro1[0]}% / ${distro2[0]}% / ${distro3[0]}%` : 'No'}
                                            </List.KeyValue>
                                          ) : null}
                                        </List.Control>
                                      </List>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        fullWidth
                                        size="xl"
                                        variant={isError ? 'destructive' : 'default'}
                                        loading={isIncentivizeLoading && !isError}
                                        onClick={() => writeAsync?.().then(() => confirm())}
                                        disabled={isIncentivizeLoading || isError}
                                        testId="incentivize-pool-confirm"
                                      >
                                        {isError ? (
                                          'Shoot! Something went wrong :('
                                        ) : isIncentivizeLoading ? (
                                          <Dots>Incentivize Pool</Dots>
                                        ) : (
                                          'Incentivize Pool'
                                        )}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </>
                              )}
                            </DialogReview>
                          </Checker.Success>
                        </Checker.Custom>
                      </Checker.ApproveERC20>
                    </Checker.Guard>
                  </Checker.Guard>
                </Checker.Guard>
              </Checker.Amounts>
            </Checker.Guard>
          </Checker.Network>
        </Checker.Connect>
      </div>
      {pool && token0 && token1 ? (
        <DialogConfirm
          chainId={chainId}
          status={status}
          testId="incentivize-confirmation-modal"
          successMessage={`Successfully incentivized the ${token0.symbol}/${token1.symbol} V3 pool`}
          buttonText="Go to pool"
          buttonLink={`/pools/${pool.chainId}:${v3Address}?activeTab=myPositions`}
          txHash={data?.hash}
        />
      ) : null}
    </DialogProvider>
  )
})
