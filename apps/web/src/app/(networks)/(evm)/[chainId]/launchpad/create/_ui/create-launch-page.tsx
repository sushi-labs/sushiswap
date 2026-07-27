'use client'

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  InformationCircleIcon,
  LockClosedIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { toNestErrors } from '@hookform/resolvers'
import { getLaunchpadToken } from '@sushiswap/graph-client/data-api'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  Button,
  Container,
  Currency,
  Dots,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSection,
  Message,
  SelectIcon,
  Slider,
  TextField,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import { getUnixTime } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { type FieldError, type Resolver, useForm } from 'react-hook-form'
import { TokenSelector } from 'src/lib/wagmi/components/token-selector/token-selector'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import {
  formatPercent as formatPercentValue,
  formatUSD,
  withoutScientificNotation,
} from 'sushi'
import { type EvmAddress, EvmToken, WNATIVE, getEvmChainById } from 'sushi/evm'
import {
  formatEther,
  formatUnits,
  isAddressEqual,
  parseEventLogs,
  parseUnits,
} from 'viem'
import {
  useConnection,
  usePublicClient,
  useReadContracts,
  useSignTypedData,
  useWriteContract,
} from 'wagmi'
import * as z from 'zod'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import type { PreparedLaunchpadLogoFile } from '../../_lib/launchpad-logo'
import {
  launchpadMetadataDescriptionSchema,
  saveLaunchpadMetadata,
} from '../../_lib/launchpad-metadata'
import { formatRawAmount } from '../../_ui/format'
import { LaunchpadLogoInput } from '../../_ui/launchpad-logo-input'
import { PageHeading } from '../../_ui/page-heading'
import type { LaunchpadChainId } from '../../constants'
import { useLaunchpadQuoteTokens } from '../../hooks/use-launchpad-data'
import { LAUNCHPAD_ABI, LAUNCHPAD_ADDRESS } from '../../launchpad-contract'
import {
  ALLOCATION_DENOMINATOR_BPS,
  CURVE_PRESETS,
  type CurvePreset,
  MAX_BOUNDARY_OFFSET,
  USD_PRICE_DECIMALS,
  alignInitialTick,
  generatePresetRanges,
  liquidityAllocationForReserve,
  quoteRawToUsdRaw,
  realizedInitialFdvQuoteRaw,
  usdFdvToQuoteRaw,
} from './curve-presets'

const MIN_STARTING_FDV_USD = 1_000
const MAX_STARTING_FDV_USD = 100_000
const STARTING_FDV_STEP_USD = 500
const DEFAULT_STARTING_FDV_USD = 4_000

const optionalHttpsUrl = z.union([
  z.literal(''),
  z.string().url().startsWith('https://'),
])

const createLaunchSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Enter a token name')
    .max(64)
    .refine(
      (value) => new TextEncoder().encode(value).length <= 64,
      'Token name must be 64 UTF-8 bytes or fewer',
    ),
  symbol: z
    .string()
    .trim()
    .min(1, 'Enter a symbol')
    .max(12)
    .refine(
      (value) => new TextEncoder().encode(value).length <= 16,
      'Symbol must be 16 UTF-8 bytes or fewer',
    ),
  description: launchpadMetadataDescriptionSchema.default(''),
  homepage: optionalHttpsUrl,
  x: z.union([z.literal(''), z.string().url().startsWith('https://x.com/')]),
  telegram: z.union([
    z.literal(''),
    z.string().url().startsWith('https://t.me/'),
  ]),
  initialFdvUsd: z
    .number()
    .int()
    .min(
      MIN_STARTING_FDV_USD,
      `Starting FDV must be at least $${MIN_STARTING_FDV_USD.toLocaleString()}`,
    )
    .max(
      MAX_STARTING_FDV_USD,
      `Starting FDV must be at most $${MAX_STARTING_FDV_USD.toLocaleString()}`,
    ),
  curvePresetId: z.enum([
    'classic',
    'steady-price-discovery',
    'fast-price-discovery',
  ]),
})

const createLaunchDetailsSchema = createLaunchSchema.pick({
  name: true,
  symbol: true,
  description: true,
  homepage: true,
  x: true,
  telegram: true,
})

type CreateLaunchForm = z.infer<typeof createLaunchSchema>
type CreateStep = 'details' | 'curve' | 'review'

const createLaunchResolver: Resolver<CreateLaunchForm> = async (
  values,
  _context,
  options,
) => {
  const result = await createLaunchSchema.safeParseAsync(values)
  if (result.success) {
    return { values: result.data, errors: {} }
  }

  const errors = result.error.issues.reduce<Record<string, FieldError>>(
    (fieldErrors, issue) => {
      const path = issue.path.join('.')
      if (path && !fieldErrors[path]) {
        fieldErrors[path] = {
          type: issue.code,
          message: issue.message,
        }
      }
      return fieldErrors
    },
    {},
  )

  return {
    values: {},
    errors: toNestErrors(errors, options),
  }
}

const DETAIL_FIELDS: Array<keyof z.infer<typeof createLaunchDetailsSchema>> = [
  'name',
  'symbol',
  'description',
  'homepage',
  'x',
  'telegram',
]

const INDEXING_ATTEMPTS = 10
const INDEXING_RETRY_DELAY = 1_500
const CURVE_CHART_WIDTH = 240
const CURVE_CHART_HEIGHT = 96
const CURVE_CHART_PADDING = 8
const CURVE_CHART_SAMPLES_PER_RANGE = 8
const HALF_TICK_LOG_PRICE = Math.log(1.0001) / 2

const STEPS: Array<{ id: CreateStep; label: string }> = [
  { id: 'details', label: 'Token details' },
  { id: 'curve', label: 'Launch pool' },
  { id: 'review', label: 'Review' },
]

interface LaunchPricing {
  quotePriceUsdRaw: bigint
  requestedFdvQuoteRaw: bigint
  realizedFdvQuoteRaw: bigint
  realizedFdvUsdRaw: bigint
  initialTick: number
}

function deriveLaunchPricing({
  initialFdvUsd,
  quoteDecimals,
  quotePriceUsd,
}: {
  initialFdvUsd: number
  quoteDecimals: number
  quotePriceUsd: number | undefined
}): LaunchPricing | undefined {
  if (
    !Number.isInteger(initialFdvUsd) ||
    quotePriceUsd === undefined ||
    !Number.isFinite(quotePriceUsd) ||
    quotePriceUsd <= 0
  ) {
    return undefined
  }

  const decimalQuotePrice = withoutScientificNotation(String(quotePriceUsd))
  if (!decimalQuotePrice) return undefined

  try {
    // The shared price feed exposes a JS number. Serialize it once into an
    // 18-decimal bigint; every transaction-affecting calculation stays integer.
    const quotePriceUsdRaw = parseUnits(decimalQuotePrice, USD_PRICE_DECIMALS)
    const initialFdvUsdRaw = parseUnits(
      String(initialFdvUsd),
      USD_PRICE_DECIMALS,
    )
    const requestedFdvQuoteRaw = usdFdvToQuoteRaw({
      initialFdvUsdRaw,
      quotePriceUsdRaw,
      quoteDecimals,
    })
    const initialTick = alignInitialTick({
      initialFdvQuoteRaw: requestedFdvQuoteRaw,
    })
    const realizedFdvQuoteRaw = realizedInitialFdvQuoteRaw(initialTick)

    return {
      quotePriceUsdRaw,
      requestedFdvQuoteRaw,
      realizedFdvQuoteRaw,
      realizedFdvUsdRaw: quoteRawToUsdRaw({
        quoteAmountRaw: realizedFdvQuoteRaw,
        quotePriceUsdRaw,
        quoteDecimals,
      }),
      initialTick,
    }
  } catch {
    return undefined
  }
}

function formatUsdRaw(amount: bigint): string {
  return formatUSD(formatUnits(amount, USD_PRICE_DECIMALS))
}

function formatStartingTokenPrice(initialFdvUsd: number): string {
  const price = (initialFdvUsd / 1_000_000_000).toFixed(9)
  return `$${price.replace(/0+$/, '').replace(/\.$/, '')}`
}

interface CurveChartPoint {
  x: number
  y: number
}

function getCurveChartPoints(curve: CurvePreset): CurveChartPoint[] {
  const points: CurveChartPoint[] = [
    { x: CURVE_CHART_PADDING, y: CURVE_CHART_HEIGHT - CURVE_CHART_PADDING },
  ]
  const drawableWidth = CURVE_CHART_WIDTH - CURVE_CHART_PADDING * 2
  const drawableHeight = CURVE_CHART_HEIGHT - CURVE_CHART_PADDING * 2
  let cumulativeAllocationBps = 0

  for (const range of curve.ranges) {
    if (range.startOffset >= MAX_BOUNDARY_OFFSET) break

    const visibleEndOffset = Math.min(
      range.endOffset ?? MAX_BOUNDARY_OFFSET,
      MAX_BOUNDARY_OFFSET,
    )
    const inverseSqrtPriceAtRangeEnd =
      range.endOffset === null
        ? 0
        : Math.exp(-(range.endOffset - range.startOffset) * HALF_TICK_LOG_PRICE)

    for (let sample = 1; sample <= CURVE_CHART_SAMPLES_PER_RANGE; sample++) {
      const tickOffset =
        range.startOffset +
        ((visibleEndOffset - range.startOffset) * sample) /
          CURVE_CHART_SAMPLES_PER_RANGE
      const inverseSqrtPrice = Math.exp(
        -(tickOffset - range.startOffset) * HALF_TICK_LOG_PRICE,
      )
      const rangeSoldShare =
        (1 - inverseSqrtPrice) / (1 - inverseSqrtPriceAtRangeEnd)
      const soldAllocationBps =
        cumulativeAllocationBps + range.allocationBps * rangeSoldShare

      points.push({
        x:
          CURVE_CHART_PADDING +
          (soldAllocationBps / ALLOCATION_DENOMINATOR_BPS) * drawableWidth,
        y:
          CURVE_CHART_HEIGHT -
          CURVE_CHART_PADDING -
          (tickOffset / MAX_BOUNDARY_OFFSET) * drawableHeight,
      })
    }

    cumulativeAllocationBps += range.allocationBps
  }

  const finalX = points.at(-1)?.x ?? CURVE_CHART_PADDING
  const usedWidth = finalX - CURVE_CHART_PADDING
  if (usedWidth <= 0) return points

  return points.map((point) => ({
    ...point,
    x:
      CURVE_CHART_PADDING +
      ((point.x - CURVE_CHART_PADDING) / usedWidth) * drawableWidth,
  }))
}

function getCurveChartPath(points: CurveChartPoint[]): string {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

async function waitForLaunchpadIndexing(
  chainId: LaunchpadChainId,
  tokenAddress: EvmAddress,
): ReturnType<typeof getLaunchpadToken> {
  for (let attempt = 0; attempt < INDEXING_ATTEMPTS; attempt++) {
    try {
      const token = await getLaunchpadToken({ chainId, address: tokenAddress })
      if (token) return token
    } catch {
      // A confirmed launch is independent of temporary catalog availability.
    }

    await wait(INDEXING_RETRY_DELAY)
  }

  return null
}

export function CreateLaunchPage({ chainId }: { chainId: LaunchpadChainId }) {
  const chain = getEvmChainById(chainId)
  const router = useRouter()
  const { address: account } = useConnection()
  const publicClient = usePublicClient({ chainId })
  const { mutateAsync: signTypedDataAsync } = useSignTypedData()
  const { mutateAsync: writeContractAsync } = useWriteContract()
  const [step, setStep] = useState<CreateStep>('details')
  const [logo, setLogo] = useState<PreparedLaunchpadLogoFile | null>(null)
  const [isLogoProcessing, setIsLogoProcessing] = useState(false)
  const [isLaunching, setIsLaunching] = useState(false)
  const [isWaitingForIndexing, setIsWaitingForIndexing] = useState(false)
  const [launchedTokenAddress, setLaunchedTokenAddress] = useState<EvmAddress>()
  const [selectedQuoteTokenAddress, setSelectedQuoteTokenAddress] =
    useState<EvmAddress>()
  const {
    data: quoteTokenRefs,
    isError: isQuoteTokenListError,
    isPending: isQuoteTokenListPending,
  } = useLaunchpadQuoteTokens(chainId)

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to the top of the form everytime step changes
  useEffect(() => {
    window.scrollTo({ top: 185, behavior: 'smooth' })
  }, [step])

  const quoteTokens = useMemo(
    () =>
      quoteTokenRefs.map(
        (quoteToken) => new EvmToken({ chainId, ...quoteToken }),
      ),
    [chainId, quoteTokenRefs],
  )
  const quoteTokenMap = useMemo(
    () =>
      Object.fromEntries(
        quoteTokens.map((quoteToken) => [quoteToken.id, quoteToken]),
      ),
    [quoteTokens],
  )
  const defaultQuoteToken =
    quoteTokens.find(
      (quoteToken) => quoteToken.address === WNATIVE[chainId].address,
    ) ?? quoteTokens[0]
  const selectedQuoteToken =
    quoteTokens.find(
      (quoteToken) => quoteToken.address === selectedQuoteTokenAddress,
    ) ?? defaultQuoteToken
  const {
    data: quotePriceUsd,
    isError: isQuotePriceError,
    isLoading: isQuotePriceLoading,
  } = usePrice({
    chainId,
    address: selectedQuoteToken?.address,
    enabled: Boolean(selectedQuoteToken),
  })
  const methods = useForm<CreateLaunchForm>({
    resolver: createLaunchResolver,
    mode: 'onChange',
    defaultValues: {
      name: '',
      symbol: '',
      description: '',
      homepage: '',
      x: '',
      telegram: '',
      initialFdvUsd: DEFAULT_STARTING_FDV_USD,
      curvePresetId: 'classic',
    },
  })
  const values = methods.watch()
  const launchPricing = useMemo(
    () =>
      selectedQuoteToken
        ? deriveLaunchPricing({
            initialFdvUsd: values.initialFdvUsd,
            quoteDecimals: selectedQuoteToken.decimals,
            quotePriceUsd,
          })
        : undefined,
    [quotePriceUsd, selectedQuoteToken, values.initialFdvUsd],
  )
  const stepIndex = STEPS.findIndex((item) => item.id === step)
  const {
    data: factoryTerms,
    isError: isFactoryTermsError,
    isPending: isFactoryTermsPending,
  } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: LAUNCHPAD_ADDRESS,
        abi: LAUNCHPAD_ABI,
        chainId,
        functionName: 'launchFee',
      },
      {
        address: LAUNCHPAD_ADDRESS,
        abi: LAUNCHPAD_ABI,
        chainId,
        functionName: 'protocolReserveBps',
      },
      {
        address: LAUNCHPAD_ADDRESS,
        abi: LAUNCHPAD_ABI,
        chainId,
        functionName: 'defaultSushiFeeBps',
      },
    ],
    query: {
      enabled: step === 'review',
      refetchInterval: 15_000,
    },
  })
  const [launchFee] = factoryTerms ?? []
  const selectedCurve =
    CURVE_PRESETS.find((curve) => curve.id === values.curvePresetId) ??
    CURVE_PRESETS[0]
  const canNavigateToCurve = createLaunchDetailsSchema.safeParse(values).success
  const canNavigateToReview = Boolean(
    createLaunchSchema.safeParse(values).success &&
      selectedQuoteToken &&
      !isQuotePriceLoading &&
      launchPricing,
  )

  async function continueFromDetails(): Promise<void> {
    const valid = await methods.trigger(DETAIL_FIELDS)
    if (valid) setStep('curve')
  }

  async function navigateToStep(nextStep: CreateStep): Promise<void> {
    if (nextStep === 'details') {
      setStep('details')
      return
    }

    const valid = await methods.trigger(
      nextStep === 'curve' ? DETAIL_FIELDS : undefined,
    )
    if (!valid) return

    if (nextStep === 'review' && !canNavigateToReview) return
    setStep(nextStep)
  }

  async function createLaunch(formValues: CreateLaunchForm): Promise<void> {
    if (!account || !publicClient || !selectedQuoteToken) return

    setIsLaunching(true)
    setLaunchedTokenAddress(undefined)

    try {
      const pricing = deriveLaunchPricing({
        initialFdvUsd: formValues.initialFdvUsd,
        quoteDecimals: selectedQuoteToken.decimals,
        quotePriceUsd,
      })
      if (!pricing) {
        throw new Error(
          `A trusted USD price for ${selectedQuoteToken.symbol} is required to build the launch curve.`,
        )
      }

      // Reserve terms can change between review and submission. Reading them
      // beside the fee keeps the range amounts aligned with the factory values
      // that the imminent transaction will use.
      const [currentLaunchFee, currentReserveBps] = await Promise.all([
        publicClient.readContract({
          address: LAUNCHPAD_ADDRESS,
          abi: LAUNCHPAD_ABI,
          functionName: 'launchFee',
        }),
        publicClient.readContract({
          address: LAUNCHPAD_ADDRESS,
          abi: LAUNCHPAD_ABI,
          functionName: 'protocolReserveBps',
        }),
      ])
      const curve =
        CURVE_PRESETS.find((item) => item.id === formValues.curvePresetId) ??
        CURVE_PRESETS[0]
      const ranges = generatePresetRanges({
        preset: curve,
        initialTick: pricing.initialTick,
        liquidityAllocation: liquidityAllocationForReserve(
          Number(currentReserveBps),
        ),
      })
      const deadline = BigInt(getUnixTime(new Date()) + 15 * 60)
      const launchParameters = {
        address: LAUNCHPAD_ADDRESS,
        abi: LAUNCHPAD_ABI,
        functionName: 'launch',
        args: [
          { name: formValues.name, symbol: formValues.symbol },
          selectedQuoteToken.address,
          ranges,
          deadline,
        ],
        value: currentLaunchFee,
      } as const

      await publicClient.simulateContract({
        ...launchParameters,
        account,
      })
      const hash = await writeContractAsync(launchParameters)
      const receiptPromise = publicClient.waitForTransactionReceipt({ hash })
      const timestamp = Date.now()

      void createToast({
        account,
        type: 'mint',
        chainId,
        txHash: hash,
        promise: receiptPromise,
        summary: {
          pending: `Creating ${formValues.symbol}`,
          completed: `${formValues.symbol} was created successfully`,
          failed: `Something went wrong creating ${formValues.symbol}`,
        },
        timestamp,
        groupTimestamp: timestamp,
      })

      const receipt = await receiptPromise
      const launchEvents = parseEventLogs({
        abi: LAUNCHPAD_ABI,
        eventName: 'TokenLaunched',
        logs: receipt.logs.filter((log) =>
          isAddressEqual(log.address, LAUNCHPAD_ADDRESS),
        ),
        strict: true,
      })
      const launchEvent = launchEvents.find(
        (event) =>
          isAddressEqual(event.args.creator, account) &&
          event.args.name === formValues.name &&
          event.args.symbol === formValues.symbol,
      )

      if (!launchEvent) {
        throw new Error(
          'The launch was confirmed, but its matching TokenLaunched event was not found.',
        )
      }

      const tokenAddress = launchEvent.args.token as EvmAddress
      setLaunchedTokenAddress(tokenAddress)
      setIsWaitingForIndexing(true)

      const token = await waitForLaunchpadIndexing(chainId, tokenAddress)
      if (token) {
        if (
          !isAddressEqual(token.address, tokenAddress) ||
          token.creationTransactionHash.toLowerCase() !== hash.toLowerCase()
        ) {
          throw new Error(
            'The launch catalog returned a token that does not match this transaction.',
          )
        }

        await saveLaunchpadMetadata({
          chainId,
          factoryAddress: token.factoryAddress,
          tokenAddress,
          expectedRevision: token.metadata.revision,
          values: formValues,
          logoFile: logo?.file,
          signTypedData: (typedData) => signTypedDataAsync(typedData),
        })
        router.push(`/${chain.key}/launchpad/token/${tokenAddress}`)
      }
    } catch (error) {
      if (!isUserRejectedError(error)) {
        createErrorToast(
          error instanceof Error ? error.message : 'Could not create token',
          true,
        )
      }
    } finally {
      setIsWaitingForIndexing(false)
      setIsLaunching(false)
    }
  }

  const previewImageUrl = useMemo(() => {
    if (!logo?.file) return undefined
    return URL.createObjectURL(logo.file)
  }, [logo?.file])

  return (
    <Container maxWidth="5xl" className="w-full px-4 py-10 sm:py-14">
      <PageHeading
        title="Bring a token to life"
        description="Deploy a fixed one-billion-token supply and open a Sushi V3 market in one transaction. Editable metadata is saved after deployment."
      />

      <div className="mt-7">
        <PerpsCard className="grid grid-cols-3 gap-2 p-2" fullWidth>
          {STEPS.map((item, index) => {
            const isAvailable =
              item.id === 'details' ||
              (item.id === 'curve' ? canNavigateToCurve : canNavigateToReview)
            const isNavigable = isAvailable && item.id !== step

            return (
              <button
                key={item.id}
                type="button"
                disabled={!isNavigable}
                aria-current={step === item.id ? 'step' : undefined}
                onClick={() => void navigateToStep(item.id)}
                className={classNames(
                  'flex min-h-11 items-center justify-center gap-2 rounded-xl px-2 text-xs font-medium transition sm:text-sm',
                  isNavigable
                    ? 'cursor-pointer hover:bg-white/[0.04] hover:text-perps-muted'
                    : 'cursor-default',
                  step === item.id
                    ? 'bg-white/[0.07] text-perps-muted shadow-sm'
                    : index < stepIndex
                      ? 'text-perps-blue'
                      : 'text-perps-muted-50',
                )}
              >
                <span
                  className={classNames(
                    'grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] leading-none',
                    index < stepIndex
                      ? 'border-perps-blue bg-perps-blue text-white'
                      : 'border-current',
                  )}
                >
                  {index < stepIndex ? (
                    <CheckIcon className="h-3 w-3" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            )
          })}
        </PerpsCard>
      </div>

      <Form {...methods}>
        <form className="mt-6" onSubmit={methods.handleSubmit(createLaunch)}>
          {step === 'details' ? (
            <PerpsCard className="p-5 sm:p-7" fullWidth>
              <FormSection
                title="Onchain identity"
                description="Name and symbol are permanent after launch."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={methods.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token name</FormLabel>
                        <FormControl>
                          <TextField
                            type="text"
                            placeholder="e.g. Nori Club"
                            className="!bg-white/[0.04] !text-perps-muted"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symbol</FormLabel>
                        <FormControl>
                          <TextField
                            type="text"
                            placeholder="e.g. NORI"
                            className="!bg-white/[0.04] !text-perps-muted"
                            {...field}
                            onChange={(event) =>
                              field.onChange(event.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3 rounded-xl bg-white/[0.04] p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.05)] grid-cols-2">
                  <div>
                    <div className="text-xs text-perps-muted-50">
                      Total supply
                    </div>
                    <div className="mt-1 font-semibold">1B</div>
                  </div>
                  <div>
                    <div className="text-xs text-perps-muted-50">Decimals</div>
                    <div className="mt-1 font-semibold">18</div>
                  </div>
                </div>
              </FormSection>

              <div className="my-3 border-t border-white/[0.06]" />

              <FormSection
                title="Project details"
                description="This metadata can be edited later by the immutable creator wallet."
              >
                <LaunchpadLogoInput
                  id="launch-logo"
                  prompt="Choose a token logo"
                  value={logo}
                  onChange={setLogo}
                  onProcessingChange={setIsLogoProcessing}
                />
                <FormField
                  control={methods.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={4}
                          placeholder="Tell traders what your token is about…"
                          className="w-full resize-none rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm text-perps-muted outline-none transition focus:border-perps-blue"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={methods.control}
                    name="homepage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <TextField
                            type="text"
                            placeholder="https://example.com"
                            className="!bg-white/[0.04] !text-perps-muted"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="x"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X profile</FormLabel>
                        <FormControl>
                          <TextField
                            type="text"
                            placeholder="https://x.com/project"
                            className="!bg-white/[0.04] !text-perps-muted"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="telegram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telegram</FormLabel>
                        <FormControl>
                          <TextField
                            type="text"
                            placeholder="https://t.me/project"
                            className="!bg-white/[0.04] !text-perps-muted"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <div className="mt-7 flex justify-end">
                <Button
                  type="button"
                  size="lg"
                  variant="perps-default"
                  icon={ArrowRightIcon}
                  iconPosition="end"
                  onClick={() => void continueFromDetails()}
                >
                  Choose price curve
                </Button>
              </div>
            </PerpsCard>
          ) : null}

          {step === 'curve' ? (
            <PerpsCard className="p-5 sm:p-7" fullWidth>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xl font-semibold text-perps-muted">
                    Quote asset
                  </div>
                  <p className="mt-1 text-sm text-perps-muted-50">
                    Choose the asset paired with your token in its launch pool.
                  </p>
                </div>
                <TokenSelector
                  chainId={chainId}
                  selected={selectedQuoteToken}
                  currencies={quoteTokenMap}
                  includeNative={false}
                  hideSearch
                  theme="perps"
                  onSelect={(currency) =>
                    setSelectedQuoteTokenAddress(currency.wrap().address)
                  }
                >
                  <Button
                    type="button"
                    variant="perps-secondary"
                    className="min-w-36"
                    disabled={
                      isQuoteTokenListPending || quoteTokens.length === 0
                    }
                  >
                    {selectedQuoteToken ? (
                      <>
                        <Currency.Icon
                          disableLink
                          currency={selectedQuoteToken}
                          width={20}
                          height={20}
                        />
                        {selectedQuoteToken.symbol}
                      </>
                    ) : isQuoteTokenListPending ? (
                      'Loading assets…'
                    ) : (
                      'No assets available'
                    )}
                    <SelectIcon />
                  </Button>
                </TokenSelector>
              </div>
              {isQuoteTokenListError ? (
                <Message variant="destructive" size="sm" className="mb-6">
                  Quote assets could not be loaded. Try again before reviewing
                  your launch.
                </Message>
              ) : null}

              <FormField
                control={methods.control}
                name="initialFdvUsd"
                render={({ field }) => (
                  <FormItem className="mb-8 border-t border-white/[0.06] pt-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-xl font-semibold text-perps-muted">
                            Starting fully diluted valuation
                          </h2>
                          <TooltipProvider>
                            <Tooltip delayDuration={150}>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  aria-label="What does fully diluted valuation mean?"
                                  className="rounded-full text-perps-muted-50 transition hover:text-perps-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-perps-blue/50"
                                >
                                  <InformationCircleIcon className="h-5 w-5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                align="start"
                                className="max-w-[320px] !border-white/[0.06] !bg-black/10 !p-3 font-normal leading-5 !text-perps-muted-50 shadow-xl backdrop-blur-2xl"
                              >
                                FDV is the opening price multiplied by the fixed
                                1 billion token supply. At{' '}
                                {formatUSD(field.value)}, each token starts
                                around {formatStartingTokenPrice(field.value)}.
                                This is not the amount of liquidity deposited or
                                money raised.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <p className="mt-1 max-w-xl text-sm leading-6 text-perps-muted-50">
                          Choose the opening valuation in USD. The trusted{' '}
                          {selectedQuoteToken?.symbol ?? 'quote-token'}
                          {` `}price converts it into the pool&apos;s quote
                          units.
                        </p>
                      </div>
                      <div className="shrink-0 text-right text-xl font-semibold tabular-nums text-perps-muted">
                        {formatUSD(field.value)}
                      </div>
                    </div>

                    <FormControl>
                      <Slider
                        aria-label="Starting fully diluted valuation in USD"
                        className="mt-5"
                        min={MIN_STARTING_FDV_USD}
                        max={MAX_STARTING_FDV_USD}
                        step={STARTING_FDV_STEP_USD}
                        value={[field.value]}
                        onValueChange={(nextValues) => {
                          const nextValue = nextValues[0]
                          if (nextValue !== undefined) {
                            field.onChange(nextValue)
                          }
                        }}
                        onValueCommit={field.onBlur}
                        rangeClassName="!bg-perps-blue"
                        thumbClassName="!border-white !bg-perps-blue"
                      />
                    </FormControl>
                    <div className="mt-3 flex justify-between text-xs text-perps-muted-50">
                      <span>{formatUSD(MIN_STARTING_FDV_USD)}</span>
                      <span>{formatUSD(MAX_STARTING_FDV_USD / 2)}</span>
                      <span>{formatUSD(MAX_STARTING_FDV_USD)}</span>
                    </div>

                    {isQuotePriceLoading ? (
                      <div className="mt-5 border-t border-white/[0.06] pt-4 text-sm text-perps-muted-50">
                        Loading the trusted quote-token price…
                      </div>
                    ) : launchPricing && selectedQuoteToken ? (
                      <div className="mt-5 grid gap-4 border-t border-white/[0.06] pt-4 sm:grid-cols-3">
                        <div>
                          <div className="text-xs text-perps-muted-50">
                            Trusted quote price
                          </div>
                          <div className="mt-1 text-sm font-semibold text-perps-muted">
                            {formatUSD(quotePriceUsd ?? 0)} /{' '}
                            {selectedQuoteToken.symbol}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-perps-muted-50">
                            Required quote FDV
                          </div>
                          <div className="mt-1 text-sm font-semibold text-perps-muted">
                            {formatRawAmount(
                              launchPricing.requestedFdvQuoteRaw,
                              selectedQuoteToken.decimals,
                              6,
                            )}{' '}
                            {selectedQuoteToken.symbol}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-perps-muted-50">
                            Tick-aligned FDV
                          </div>
                          <div className="mt-1 text-sm font-semibold text-perps-muted">
                            {formatUsdRaw(launchPricing.realizedFdvUsdRaw)}
                          </div>
                        </div>
                      </div>
                    ) : selectedQuoteToken ? (
                      <Message variant="destructive" size="sm" className="mt-5">
                        {isQuotePriceError
                          ? `The trusted USD price for ${selectedQuoteToken.symbol} could not be loaded.`
                          : `No trusted USD price is available for ${selectedQuoteToken.symbol}. Choose another quote asset or try again.`}
                      </Message>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-perps-muted">
                  Price curve
                </h2>
                <p className="mt-2 text-sm leading-6 text-perps-muted-50">
                  Choose how quickly buys move the price after the shared
                  USD-derived starting point. Raw V3 ticks are generated
                  automatically.
                </p>
              </div>
              <FormField
                control={methods.control}
                name="curvePresetId"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-4 lg:grid-cols-3">
                      {CURVE_PRESETS.map((curve) => {
                        const selected = field.value === curve.id
                        const chartPoints = getCurveChartPoints(curve)
                        return (
                          <button
                            key={curve.id}
                            type="button"
                            onClick={() => field.onChange(curve.id)}
                            className={classNames(
                              'flex h-full flex-col items-stretch justify-start rounded-2xl border p-4 text-left transition',
                              selected
                                ? 'border-perps-blue bg-perps-blue/[0.06] ring-1 ring-perps-blue'
                                : 'border-white/[0.07] bg-white/[0.02] hover:border-perps-blue/30',
                            )}
                          >
                            <div className="flex min-h-12 items-start font-semibold text-perps-muted">
                              {curve.name}
                            </div>
                            <div className="relative h-24 overflow-hidden rounded-xl bg-gradient-to-b from-blue/10 to-transparent">
                              <svg
                                viewBox="0 0 240 96"
                                className="h-full w-full"
                                aria-hidden="true"
                              >
                                <path
                                  d={getCurveChartPath(chartPoints)}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-perps-blue"
                                />
                              </svg>
                            </div>
                            <p className="mt-4 min-h-[4.5rem] text-sm leading-6 text-perps-muted-50">
                              {curve.description}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="perps-secondary"
                  icon={ArrowLeftIcon}
                  onClick={() => setStep('details')}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="perps-default"
                  icon={ArrowRightIcon}
                  iconPosition="end"
                  disabled={
                    !selectedQuoteToken || isQuotePriceLoading || !launchPricing
                  }
                  onClick={() => setStep('review')}
                >
                  Review launch
                </Button>
              </div>
            </PerpsCard>
          ) : null}

          {step === 'review' ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
              <PerpsCard className="p-5 sm:p-7" fullWidth>
                <div className="flex items-start gap-4">
                  {previewImageUrl ? (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/[0.08] bg-black/20">
                      <img
                        src={previewImageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </span>
                  ) : (
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-perps-blue/10 text-perps-blue">
                      <SparklesIcon className="h-6 w-6" />
                    </span>
                  )}

                  <div>
                    <div className="text-xl font-semibold text-perps-muted">
                      {values.name || 'Untitled token'}
                    </div>
                    <div className="mt-1 text-sm text-perps-muted-50">
                      {values.symbol || 'TOKEN'} · 1,000,000,000 supply
                    </div>
                  </div>
                </div>
                <div className="mt-7 divide-y divide-white/[0.06] rounded-xl border border-white/[0.06]">
                  {[
                    ['Network', chain.name],
                    [
                      'Quote asset',
                      selectedQuoteToken?.symbol ?? 'Unavailable',
                    ],
                    [
                      'Trusted quote price',
                      quotePriceUsd === undefined || !selectedQuoteToken
                        ? 'Unavailable'
                        : `${formatUSD(quotePriceUsd)} / ${selectedQuoteToken.symbol}`,
                    ],
                    ['Requested starting FDV', formatUSD(values.initialFdvUsd)],
                    [
                      'Tick-aligned starting FDV',
                      launchPricing && selectedQuoteToken
                        ? `${formatUsdRaw(launchPricing.realizedFdvUsdRaw)} · ${formatRawAmount(
                            launchPricing.realizedFdvQuoteRaw,
                            selectedQuoteToken.decimals,
                            6,
                          )} ${selectedQuoteToken.symbol}`
                        : 'Unavailable',
                    ],
                    ['Pool fee tier', '1%'],
                    ['Price curve', selectedCurve.name],
                    // [
                    //   'Protocol reserve',
                    //   protocolReserveBps === undefined
                    //     ? 'Loading…'
                    //     : `${formatBps(protocolReserveBps)} · locked 365 days`,
                    // ],
                    [
                      'Launch fee',
                      launchFee === undefined
                        ? 'Loading…'
                        : `${formatEther(launchFee)} ${chain.viemChain.nativeCurrency.symbol}`,
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-5 px-4 py-3 text-sm"
                    >
                      <span className="text-perps-muted-50">{label}</span>
                      <span className="text-right font-medium text-perps-muted">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-start gap-3 rounded-xl bg-white/[0.04] p-4 text-sm text-perps-muted-50">
                  <LockClosedIcon className="mt-0.5 h-5 w-5 shrink-0 text-perps-blue" />
                  <p className="leading-6">
                    Token name, symbol, supply, starting valuation, quote asset,
                    curve, creator, and liquidity positions are immutable.
                    Description, links, and logo can be updated by the creator.
                  </p>
                </div>
                {isFactoryTermsError ? (
                  <Message variant="destructive" className="mt-6">
                    The current factory terms could not be loaded. Try again
                    before creating your token.
                  </Message>
                ) : null}
                {launchedTokenAddress ? (
                  <Message variant="success" className="mt-6">
                    <span>
                      Launch confirmed at {launchedTokenAddress}.{' '}
                      {isWaitingForIndexing
                        ? 'Waiting for the launch catalog to index it…'
                        : 'Catalog indexing is taking longer than expected.'}
                    </span>
                  </Message>
                ) : null}
              </PerpsCard>

              <div className="space-y-4">
                <PerpsCard className="p-5 space-y-4" fullWidth>
                  <div className="text-sm font-semibold text-perps-muted">
                    Ready to launch
                  </div>
                  {launchedTokenAddress && !isWaitingForIndexing ? (
                    <Button
                      asChild
                      fullWidth
                      size="xl"
                      variant="perps-default"
                      className="mt-5"
                      icon={ArrowTopRightOnSquareIcon}
                      iconPosition="end"
                    >
                      <Link
                        href={`/${chain.key}/launchpad/token/${launchedTokenAddress}`}
                      >
                        View launch
                      </Link>
                    </Button>
                  ) : (
                    <Checker.Connect
                      namespace="evm"
                      fullWidth
                      size="xl"
                      variant="perps-default"
                      className="mt-5"
                      type="button"
                    >
                      <Checker.Network
                        chainId={chainId}
                        fullWidth
                        size="xl"
                        variant="perps-default"
                        type="button"
                      >
                        <Button
                          type="submit"
                          fullWidth
                          size="xl"
                          variant="perps-default"
                          disabled={
                            isLaunching ||
                            isLogoProcessing ||
                            isFactoryTermsPending ||
                            isFactoryTermsError ||
                            !selectedQuoteToken ||
                            isQuotePriceLoading ||
                            !launchPricing
                          }
                        >
                          {isWaitingForIndexing ? (
                            <>
                              Waiting for indexing
                              <Dots />
                            </>
                          ) : isLaunching ? (
                            'Creating token…'
                          ) : (
                            'Create token'
                          )}
                        </Button>
                      </Checker.Network>
                    </Checker.Connect>
                  )}
                  <div className="mt-3 text-center text-xs text-perps-muted-50">
                    Estimated network cost appears after simulation
                  </div>
                </PerpsCard>
                <Button
                  type="button"
                  fullWidth
                  variant="perps-secondary"
                  icon={ArrowLeftIcon}
                  onClick={() => setStep('curve')}
                >
                  Back to curve
                </Button>
              </div>
            </div>
          ) : null}
        </form>
      </Form>
    </Container>
  )
}
