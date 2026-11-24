'use client'

import {
  Button,
  ChipInput,
  Currency,
  DateField,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dots,
  FormError,
  FormSection,
  LinkExternal,
  List,
  MultiStepForm,
  Slider,
  Switch,
  TextField,
  classNames,
} from '@sushiswap/ui'
import format from 'date-fns/format'
import getUnixTime from 'date-fns/getUnixTime'
import ms from 'ms'
import { useRouter } from 'next/navigation'
import { use, useMemo, useState } from 'react'
import { LiquidityDepositInput } from 'src/lib/components/liquidity-deposit-input'
import { SelectTokensWidget } from 'src/lib/components/select-tokens-widget'
import { useRewardTokens } from 'src/lib/hooks/react-query/rewards/use-reward-tokens'
import {
  DialogConfirm,
  DialogProvider,
  DialogReview,
} from 'src/lib/transaction-dialog'
import { useConcentratedLiquidityPool } from 'src/lib/wagmi/hooks/pools/hooks/use-concentrated-liquidity-pool'
import {
  AngleConditionsState,
  useAcceptAngleConditions,
} from 'src/lib/wagmi/hooks/rewards/hooks/use-accept-angle-conditions'
import { useIncentivizePoolWithRewards } from 'src/lib/wagmi/hooks/rewards/hooks/use-incentivize-pool-with-rewards'
import { Checker } from 'src/lib/wagmi/systems/checker'
import {
  useApproved,
  withCheckerRoot,
} from 'src/lib/wagmi/systems/checker/provider'
import { Amount } from 'sushi'
import {
  type EvmAddress,
  EvmChainId,
  type EvmCurrency,
  type EvmToken,
  MERKL_SUPPORTED_CHAIN_IDS,
  type SushiSwapV3ChainId,
  SushiSwapV3Pool,
  getEvmChainById,
  isEvmWNativeSupported,
  isMerklChainId,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import { zeroAddress } from 'viem'
import { useConnection, useWaitForTransactionReceipt } from 'wagmi'
import { ConcentratedLiquidityProvider } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from '../_ui/concentrated-liquidity-url-state-provider'
import { PoolFormSession } from '../_ui/pool-form-session'
import { PoolSetupSummary } from '../_ui/pool-setup-summary'
import { SelectFeeConcentratedWidget } from '../_ui/select-fee-concentrated-widget'
import { SelectNetworkWidget } from '../_ui/select-network-widget'

const APPROVE_TAG = 'approve-incentivize'

export default function Page(props: { params: Promise<{ chainId: string }> }) {
  const params = use(props.params)
  const chainId = +params.chainId as EvmChainId
  return (
    <PoolFormSession>
      <ConcentratedLiquidityURLStateProvider
        chainId={
          isSushiSwapV3ChainId(chainId) && isMerklChainId(chainId)
            ? chainId
            : EvmChainId.ETHEREUM
        }
        supportedNetworks={MERKL_SUPPORTED_CHAIN_IDS}
      >
        <ConcentratedLiquidityProvider>
          <Incentivize />
        </ConcentratedLiquidityProvider>
      </ConcentratedLiquidityURLStateProvider>
    </PoolFormSession>
  )
}

const Incentivize = withCheckerRoot(() => {
  const { address } = useConnection()
  const {
    chainId,
    token0,
    token1,
    setToken1,
    setToken0,
    feeAmount,
    setFeeAmount,
  } = useConcentratedLiquidityURLState()

  const router = useRouter()
  const { approved } = useApproved(APPROVE_TAG)
  const [value, setValue] = useState('')
  const [customize, setCustomize] = useState(false)
  const [customizeOOR, setCustomizeOOR] = useState(false)
  const [includeBlacklist, setIncludeBlacklist] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>()
  const [endDate, setEndDate] = useState<Date | null>()
  const [rewardToken, setRewardToken] = useState<EvmCurrency>()
  const [blacklist, setBlacklist] = useState<EvmAddress[]>([])
  const [distro1, setDistro1] = useState<number[]>([0])
  const [distro2, setDistro2] = useState<number[]>([0])
  const [distro3, setDistro3] = useState<number[]>([100])
  const totalDistro = distro1[0] + distro2[0] + distro3[0]

  const amount = useMemo(
    () => (rewardToken ? [Amount.tryFromHuman(rewardToken, value)] : []),
    [value, rewardToken],
  )
  const { data: pool } = useConcentratedLiquidityPool({
    chainId,
    token0,
    token1,
    feeAmount,
  })

  const v3Address =
    token0 && token1 && feeAmount
      ? SushiSwapV3Pool.getAddress(token0.wrap(), token1.wrap(), feeAmount)
      : undefined

  const numHours = useMemo(() => {
    return startDate && endDate
      ? Math.floor((endDate.getTime() - startDate.getTime()) / ms('1h'))
      : undefined
  }, [startDate, endDate])

  const [angleConditionsState, { write }] = useAcceptAngleConditions()

  const { data: angleRewardTokens, isLoading: angleRewardTokensLoading } =
    useRewardTokens({ chainId })

  const minAmount = useMemo(() => {
    if (!angleRewardTokens) return undefined
    const token = angleRewardTokens.find(
      (el) => el.token.wrap().address === rewardToken?.wrap().address,
    )
    if (token && numHours) return token.minimumAmountPerHour?.mul(`${numHours}`)
  }, [angleRewardTokens, numHours, rewardToken])

  const {
    simulation: { isError, data: simulationData },
    write: {
      mutateAsync: writeContractAsync,
      isPending: isIncentivizeLoading,
      data,
    },
  } = useIncentivizePoolWithRewards({
    account: address,
    args:
      amount[0] && v3Address && rewardToken && numHours && startDate
        ? [
            {
              uniV3Pool: v3Address,
              rewardToken: rewardToken.wrap().address,
              amount: amount[0].amount,
              positionWrappers: blacklist.length > 0 ? blacklist : [],
              wrapperTypes: blacklist.length > 0 ? [3] : [],
              propToken0: customize ? distro1[0] * 100 : 2000,
              propToken1: customize ? distro2[0] * 100 : 2000,
              propFees: customize ? distro3[0] * 100 : 6000,
              epochStart: getUnixTime(startDate),
              numEpoch: numHours,
              isOutOfRangeIncentivized: customizeOOR ? 1 : 0,
              boostedReward: 0,
              boostingAddress: zeroAddress,
              rewardId:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              additionalData:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
          ]
        : undefined,
    chainId: chainId as SushiSwapV3ChainId,
    enabled: Boolean(
      amount[0] &&
        v3Address &&
        rewardToken &&
        numHours &&
        startDate &&
        approved &&
        angleConditionsState === AngleConditionsState.ACCEPTED,
    ),
  })

  const { status } = useWaitForTransactionReceipt({ chainId, hash: data })

  const rewardTokens = useMemo(
    () =>
      angleRewardTokens
        ? angleRewardTokens.reduce<Record<string, EvmToken>>((acc, cur) => {
            acc[cur.token.wrap().address] = cur.token
            return acc
          }, {})
        : {},
    [angleRewardTokens],
  )

  const validStartDate = startDate ? startDate > new Date() : true
  const validEndDate =
    endDate && startDate ? endDate > startDate && endDate > new Date() : true

  const poolStep = {
    id: 'pool',
    label: 'Select pool',
    canContinue: Boolean(token0 && token1 && feeAmount),
    editLabel: 'Edit pool setup',
    summary: (
      <PoolSetupSummary
        version="V3"
        chainId={chainId}
        token0={token0}
        token1={token1}
        feeAmount={feeAmount}
      />
    ),
    content: (
      <>
        <div className="grid gap-x-6 py-3 sm:grid-cols-2">
          <SelectNetworkWidget
            description="Choose the network where the pool is deployed."
            selectedNetwork={chainId}
            onSelect={(chainId) =>
              router.push(`/${getEvmChainById(chainId).key}/pool/incentivize`)
            }
            networks={MERKL_SUPPORTED_CHAIN_IDS}
          />
          <SelectTokensWidget
            title="Token pair"
            description="Select the two tokens in the pool you want to reward."
            chainId={chainId}
            token0={token0}
            token1={token1}
            setToken0={setToken0}
            setToken1={setToken1}
            includeNative={isEvmWNativeSupported(chainId)}
          />
        </div>
        <div className="py-3">
          <SelectFeeConcentratedWidget
            description="Choose the fee tier of the existing pool."
            chainId={chainId}
            feeAmount={feeAmount}
            setFeeAmount={setFeeAmount}
            token1={token1}
            token0={token0}
            disableIfNotExists
          />
        </div>
      </>
    ),
  }

  const rewardsStep = {
    id: 'rewards',
    label: 'Configure rewards',
    content: (
      <>
        <div className="py-3">
          <FormSection
            title="Reward schedule"
            description="Choose when rewards start and end."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-2">
                <label
                  htmlFor="reward-start-date"
                  className="text-sm font-medium"
                >
                  Start date
                </label>
                <DateField
                  id="reward-start-date"
                  variant="outline"
                  className="pr-10"
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
                  placeholderText="Select date and time"
                  autoComplete="off"
                />
                {!validStartDate ? (
                  <FormError>Invalid start date.</FormError>
                ) : null}
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <label
                  htmlFor="reward-end-date"
                  className="text-sm font-medium"
                >
                  End date
                </label>
                <DateField
                  id="reward-end-date"
                  variant="outline"
                  className="pr-10"
                  selected={endDate}
                  onChange={setEndDate}
                  portalId="root-portal"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  startDate={
                    startDate ? startDate : new Date(Date.now() + 5 * 60 * 1000)
                  }
                  minDate={
                    startDate ? startDate : new Date(Date.now() + 5 * 60 * 1000)
                  }
                  dateFormat="MMM d, yyyy HH:mm"
                  placeholderText="Select date and time"
                  autoComplete="off"
                />
                {!validEndDate ? (
                  <FormError>Invalid end date.</FormError>
                ) : null}
              </div>
            </div>
          </FormSection>
        </div>
        <div className="py-3">
          <FormSection
            title="Reward amount"
            description="Rewards are distributed hourly. The minimum amount depends on the reward token and the duration."
          >
            <LiquidityDepositInput
              id="swap-from"
              label="Total rewards"
              chainId={chainId}
              onSelect={setRewardToken}
              value={value}
              onChange={setValue}
              currency={rewardToken}
              currencies={rewardTokens}
              loading={angleRewardTokensLoading}
              currencyLoading={angleRewardTokensLoading}
              allowNative={false}
              hideSearch={true}
              {...(numHours &&
                rewardToken &&
                amount[0] &&
                minAmount &&
                amount[0].lt(minAmount) && {
                  error: `Min. ${minAmount.toSignificant(4)} ${
                    rewardToken.symbol
                  }`,
                })}
            />
            <p className="text-sm text-muted-foreground">
              Can&apos;t find your token?{' '}
              <LinkExternal href="https://rbieu62gj0f.typeform.com/to/KkrPkOFe">
                Request a reward token
              </LinkExternal>
            </p>
          </FormSection>
        </div>
        <div className="py-3">
          <FormSection
            title="Distribution settings"
            description="Choose how rewards are split and which positions can earn them."
          >
            <div className="divide-y divide-accent rounded-2xl border border-accent px-4">
              <div className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="customize-distribution"
                    className="text-sm font-medium"
                  >
                    Customize reward split
                  </label>
                  <Switch
                    id="customize-distribution"
                    testdata-id="customize-distribution-switch"
                    checked={customize}
                    onCheckedChange={setCustomize}
                  />
                </div>
                {customize && (
                  <div className="mt-4 space-y-4">
                    {[
                      {
                        id: 'token0',
                        label: `${token0?.symbol ?? 'Token 1'} liquidity`,
                        currency: token0,
                        value: distro1,
                        setValue: setDistro1,
                      },
                      {
                        id: 'token1',
                        label: `${token1?.symbol ?? 'Token 2'} liquidity`,
                        currency: token1,
                        value: distro2,
                        setValue: setDistro2,
                      },
                      {
                        id: 'fees',
                        label: 'Fees generated',
                        currency: undefined,
                        value: distro3,
                        setValue: setDistro3,
                      },
                    ].map(({ id, label, currency, value, setValue }) => (
                      <fieldset key={id} className="min-w-0">
                        <legend className="mb-1 text-sm font-medium">
                          <span className="flex items-center gap-2">
                            {currency && (
                              <Currency.Icon
                                disableLink
                                currency={currency}
                                width={16}
                                height={16}
                              />
                            )}
                            {label}
                          </span>
                        </legend>
                        <div className="grid grid-cols-[minmax(0,1fr)_6rem] items-center gap-4">
                          <Slider
                            value={value}
                            onValueChange={setValue}
                            max={100}
                            step={5}
                          />
                          <TextField
                            aria-label={`${label} percentage`}
                            variant="outline"
                            isError={totalDistro !== 100}
                            unit="%"
                            type="number"
                            value={value[0]}
                            onValueChange={(val) => setValue([+val])}
                          />
                        </div>
                      </fieldset>
                    ))}
                    <p
                      className={classNames(
                        'text-sm',
                        totalDistro !== 100
                          ? 'text-red'
                          : 'text-muted-foreground',
                      )}
                    >
                      Allocated {totalDistro}% of 100%
                    </p>
                  </div>
                )}
              </div>
              <div className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="exclude-addresses"
                    className="text-sm font-medium"
                  >
                    Exclude addresses from rewards
                  </label>
                  <Switch
                    id="exclude-addresses"
                    testdata-id="customize-blacklist-switch"
                    checked={includeBlacklist}
                    onCheckedChange={setIncludeBlacklist}
                  />
                </div>
                <div hidden={!includeBlacklist} className="mt-3 space-y-2">
                  <ChipInput
                    aria-label="Excluded addresses"
                    variant="outline"
                    delimiters={[',', ' ', ';', ':']}
                    values={blacklist}
                    onValueChange={(value) =>
                      setBlacklist(value as EvmAddress[])
                    }
                    placeholder="Address"
                  />
                  <p className="text-sm text-muted-foreground">
                    {blacklist.length > 0
                      ? `${blacklist.length} address${blacklist.length > 1 ? 'es' : ''} excluded.`
                      : 'Separate addresses with commas.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <label
                  htmlFor="include-out-of-range"
                  className="text-sm font-medium"
                >
                  Reward out-of-range positions
                </label>
                <Switch
                  id="include-out-of-range"
                  testdata-id="customize-outofrange-switch"
                  checked={customizeOOR}
                  onCheckedChange={setCustomizeOOR}
                />
              </div>
            </div>
          </FormSection>
        </div>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            To incentivize a pool, review and agree to{' '}
            <LinkExternal href="https://docs.angle.money/merkl/incentivizor-tc">
              Merkl’s Terms &amp; Conditions
            </LinkExternal>
            .
          </p>
          <Checker.Connect>
            <Checker.Network chainId={chainId}>
              <Checker.Guard guardWhen={!pool} guardText="Pool not found">
                <Checker.Amounts chainId={chainId} amounts={amount}>
                  <Checker.Guard
                    guardWhen={!startDate || !endDate}
                    guardText="Enter duration"
                  >
                    <Checker.Guard
                      guardWhen={totalDistro !== 100}
                      guardText="Invalid distribution"
                    >
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
                            showChildren={
                              angleConditionsState ===
                              AngleConditionsState.ACCEPTED
                            }
                            onClick={write!}
                            buttonText="Sign the terms & conditions"
                            loading={[
                              AngleConditionsState.PENDING,
                              AngleConditionsState.LOADING,
                              AngleConditionsState.UNKNOWN,
                            ].includes(angleConditionsState)}
                            disabled={
                              angleConditionsState !==
                                AngleConditionsState.NOT_ACCEPTED || !write
                            }
                          >
                            <Checker.Success tag={APPROVE_TAG}>
                              <DialogReview>
                                {({ confirm }) => (
                                  <>
                                    <DialogTrigger asChild>
                                      <Button
                                        fullWidth
                                        size="xl"
                                        testId="incentivize-pool-review"
                                      >
                                        Incentivize pool
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Incentivize Pool
                                        </DialogTitle>
                                        <DialogDescription>
                                          {token0?.symbol}/{token1?.symbol} •
                                          SushiSwap V3 • {feeAmount / 10000}%
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="flex flex-col gap-4">
                                        <List className="!pt-0">
                                          <List.Control>
                                            {pool ? (
                                              <List.KeyValue
                                                flex
                                                title="Network"
                                              >
                                                {
                                                  getEvmChainById(pool.chainId)
                                                    .name
                                                }
                                              </List.KeyValue>
                                            ) : null}
                                            {feeAmount && (
                                              <List.KeyValue title="Fee Tier">{`${
                                                +feeAmount / 10000
                                              }%`}</List.KeyValue>
                                            )}
                                          </List.Control>
                                        </List>
                                        <List className="!pt-0">
                                          <List.Control>
                                            {startDate ? (
                                              <List.KeyValue
                                                flex
                                                title="Start date"
                                              >
                                                {format(
                                                  startDate,
                                                  'dd MMM yyyy hh:mmaaa',
                                                )}
                                              </List.KeyValue>
                                            ) : null}
                                            {endDate ? (
                                              <List.KeyValue
                                                flex
                                                title="End date"
                                              >
                                                {format(
                                                  endDate,
                                                  'dd MMM yyyy hh:mmaaa',
                                                )}
                                              </List.KeyValue>
                                            ) : null}
                                            {amount[0] ? (
                                              <List.KeyValue
                                                title={'Total distributed'}
                                              >
                                                <div className="flex items-center gap-2">
                                                  <Currency.Icon
                                                    currency={
                                                      amount[0].currency
                                                    }
                                                    width={18}
                                                    height={18}
                                                  />
                                                  <span>
                                                    {amount[0].toSignificant(6)}{' '}
                                                    {amount[0].currency.symbol}
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
                                              subtitle="Excluded addresses from receiving rewards"
                                            >
                                              {blacklist
                                                ? `${blacklist.length} Addresses`
                                                : 'No'}
                                            </List.KeyValue>
                                            {token0 && token1 ? (
                                              <List.KeyValue
                                                flex
                                                title="Customized distribution formula"
                                                subtitle={`${token0.symbol} / ${token1.symbol} / Fees`}
                                              >
                                                {customize
                                                  ? `${distro1[0]}% / ${distro2[0]}% / ${distro3[0]}%`
                                                  : 'No'}
                                              </List.KeyValue>
                                            ) : null}
                                          </List.Control>
                                        </List>
                                      </div>
                                      <DialogFooter>
                                        <Button
                                          fullWidth
                                          size="xl"
                                          variant={
                                            isError ? 'destructive' : 'default'
                                          }
                                          loading={
                                            isIncentivizeLoading && !isError
                                          }
                                          onClick={async () => {
                                            // Typecheck speedup
                                            const _simulationData: any =
                                              simulationData

                                            if (
                                              !writeContractAsync ||
                                              !_simulationData
                                            ) {
                                              return
                                            }

                                            try {
                                              await writeContractAsync(
                                                _simulationData.request,
                                              )
                                              confirm()
                                            } catch {}
                                          }}
                                          disabled={
                                            isIncentivizeLoading || isError
                                          }
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
      </>
    ),
  }

  return (
    <DialogProvider>
      <MultiStepForm
        progressLabel="Incentive setup progress"
        steps={[poolStep, rewardsStep]}
      />
      {pool && token0 && token1 ? (
        <DialogConfirm
          chainId={chainId}
          status={status}
          testId="incentivize-confirmation-modal"
          successMessage={`Successfully incentivized the ${token0.symbol}/${token1.symbol} V3 pool`}
          buttonText="Go to pool"
          buttonLink={`/${getEvmChainById(pool.chainId).key}/pool/v3/${v3Address}`}
          txHash={data}
        />
      ) : null}
    </DialogProvider>
  )
})
