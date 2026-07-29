'use client'

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  LockClosedIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { toNestErrors } from '@hookform/resolvers'
import { getLaunchpadToken } from '@sushiswap/graph-client/data-api'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  Button,
  Checkbox,
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
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  SelectIcon,
  Slider,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { getUnixTime } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { type FieldError, type Resolver, useForm } from 'react-hook-form'
import { TOAST_AUTOCLOSE_TIME } from 'src/lib/perps'
import { TokenSelector } from 'src/lib/wagmi/components/token-selector/token-selector'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { Amount, formatUSD, withoutScientificNotation } from 'sushi'
import {
  type EvmAddress,
  EvmNative,
  EvmToken,
  WNATIVE,
  getEvmChainById,
} from 'sushi/evm'
import { formatEther, isAddressEqual, parseEventLogs, parseUnits } from 'viem'
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

const INITIAL_FDV_USD = 5_000
const MAX_INITIAL_BUY_USD = 1_000
const INITIAL_BUY_STEP_USD = 10
const INITIAL_BUY_SLIPPAGE_BPS = 100n
const BPS_DENOMINATOR = 10_000n
const USD_PRICE_DECIMALS = 18

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
  initialBuyUsd: z
    .number()
    .int()
    .min(0)
    .max(
      MAX_INITIAL_BUY_USD,
      `Initial buy must be at most $${MAX_INITIAL_BUY_USD.toLocaleString()}`,
    ),
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
type CreateStep = 'details' | 'buy' | 'review'
type WethPaymentMode = 'native' | 'wrapped'

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

const STEPS: Array<{ id: CreateStep; label: string }> = [
  { id: 'details', label: 'Token details' },
  { id: 'buy', label: 'Initial buy' },
  { id: 'review', label: 'Review' },
]

function deriveInitialBuyAmount({
  initialBuyUsd,
  quoteDecimals,
  quotePriceUsd,
}: {
  initialBuyUsd: number
  quoteDecimals: number
  quotePriceUsd: number | undefined
}): bigint | undefined {
  if (initialBuyUsd === 0) return 0n

  if (
    !Number.isInteger(initialBuyUsd) ||
    quotePriceUsd === undefined ||
    !Number.isFinite(quotePriceUsd) ||
    quotePriceUsd <= 0
  ) {
    return undefined
  }

  const decimalQuotePrice = withoutScientificNotation(String(quotePriceUsd))
  if (!decimalQuotePrice) return undefined

  try {
    const quotePriceUsdRaw = parseUnits(decimalQuotePrice, USD_PRICE_DECIMALS)
    const initialBuyUsdRaw = parseUnits(
      String(initialBuyUsd),
      USD_PRICE_DECIMALS,
    )

    return (initialBuyUsdRaw * 10n ** BigInt(quoteDecimals)) / quotePriceUsdRaw
  } catch {
    return undefined
  }
}

function formatBps(bps: number): string {
  return `${bps / 100}%`
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
  const [isLegalDialogOpen, setIsLegalDialogOpen] = useState(false)
  const [hasAcceptedLegalNotice, setHasAcceptedLegalNotice] = useState(false)
  const [launchedTokenAddress, setLaunchedTokenAddress] = useState<EvmAddress>()
  const [selectedQuoteTokenAddress, setSelectedQuoteTokenAddress] =
    useState<EvmAddress>()
  const [wethPaymentMode, setWethPaymentMode] =
    useState<WethPaymentMode>('native')
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
  const { data: quotePriceUsd, isLoading: isQuotePriceLoading } = usePrice({
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
      initialBuyUsd: 0,
    },
  })
  const values = methods.watch()
  const initialBuyAmountRaw = useMemo(
    () =>
      selectedQuoteToken
        ? deriveInitialBuyAmount({
            initialBuyUsd: values.initialBuyUsd,
            quoteDecimals: selectedQuoteToken.decimals,
            quotePriceUsd,
          })
        : undefined,
    [quotePriceUsd, selectedQuoteToken, values.initialBuyUsd],
  )
  const isWethQuoteToken = Boolean(
    selectedQuoteToken &&
      isAddressEqual(selectedQuoteToken.address, WNATIVE[chainId].address),
  )
  const isNativeInitialBuy = isWethQuoteToken && wethPaymentMode === 'native'
  const nativeCurrency = useMemo(
    () => EvmNative.fromChainId(chainId),
    [chainId],
  )
  const initialBuyCurrency = isNativeInitialBuy
    ? nativeCurrency
    : selectedQuoteToken
  const initialBuyAmount = useMemo(
    () =>
      initialBuyCurrency && initialBuyAmountRaw !== undefined
        ? new Amount(initialBuyCurrency, initialBuyAmountRaw)
        : undefined,
    [initialBuyAmountRaw, initialBuyCurrency],
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
      {
        address: LAUNCHPAD_ADDRESS,
        abi: LAUNCHPAD_ABI,
        chainId,
        functionName: 'calculateStartTick',
        args: [selectedQuoteToken?.address ?? WNATIVE[chainId].address],
      },
    ],
    query: {
      enabled: step !== 'details' && Boolean(selectedQuoteToken),
      refetchInterval: 15_000,
    },
  })
  const [launchFee, protocolReserveBps, defaultSushiFeeBps, startTick] =
    factoryTerms ?? []
  const launchFeeAmount = useMemo(
    () =>
      launchFee === undefined
        ? undefined
        : new Amount(nativeCurrency, launchFee),
    [launchFee, nativeCurrency],
  )
  const buyStepCheckerAmounts = useMemo(() => {
    if (
      !launchFeeAmount ||
      !initialBuyAmount ||
      initialBuyAmountRaw === undefined
    ) {
      return [undefined]
    }

    if (isNativeInitialBuy) {
      return [
        new Amount(
          nativeCurrency,
          launchFeeAmount.amount + initialBuyAmount.amount,
        ),
      ]
    }

    return initialBuyAmountRaw > 0n
      ? [launchFeeAmount, initialBuyAmount]
      : [launchFeeAmount]
  }, [
    initialBuyAmount,
    initialBuyAmountRaw,
    isNativeInitialBuy,
    launchFeeAmount,
    nativeCurrency,
  ])
  const canNavigateToBuy = createLaunchDetailsSchema.safeParse(values).success
  const canNavigateToReview = Boolean(
    createLaunchSchema.safeParse(values).success &&
      selectedQuoteToken &&
      initialBuyAmountRaw !== undefined &&
      !isFactoryTermsPending &&
      !isFactoryTermsError,
  )

  async function continueFromDetails(): Promise<void> {
    const valid = await methods.trigger(DETAIL_FIELDS)
    if (valid) setStep('buy')
  }

  async function navigateToStep(nextStep: CreateStep): Promise<void> {
    if (nextStep === 'details') {
      setStep('details')
      return
    }

    const valid = await methods.trigger(
      nextStep === 'buy' ? DETAIL_FIELDS : undefined,
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
      const amountIn = deriveInitialBuyAmount({
        initialBuyUsd: formValues.initialBuyUsd,
        quoteDecimals: selectedQuoteToken.decimals,
        quotePriceUsd,
      })
      if (amountIn === undefined) {
        throw new Error(
          `A trusted USD price for ${selectedQuoteToken.symbol} is required to calculate the initial buy.`,
        )
      }

      const currentLaunchFee = await publicClient.readContract({
        address: LAUNCHPAD_ADDRESS,
        abi: LAUNCHPAD_ABI,
        functionName: 'launchFee',
      })
      const deadline = BigInt(getUnixTime(new Date()) + 15 * 60)
      const tokenConfig = {
        name: formValues.name,
        symbol: formValues.symbol,
      } as const
      let hash: `0x${string}`

      if (amountIn === 0n) {
        const launchParameters = {
          address: LAUNCHPAD_ADDRESS,
          abi: LAUNCHPAD_ABI,
          functionName: 'launch',
          args: [tokenConfig, selectedQuoteToken.address, deadline],
          value: currentLaunchFee,
        } as const

        await publicClient.simulateContract({
          ...launchParameters,
          account,
        })
        hash = await writeContractAsync(launchParameters)
      } else if (isNativeInitialBuy) {
        const quoteParameters = {
          address: LAUNCHPAD_ADDRESS,
          abi: LAUNCHPAD_ABI,
          functionName: 'launchAndBuyNative',
          args: [
            tokenConfig,
            deadline,
            {
              amountIn,
              amountOutMinimum: 0n,
              recipient: account,
            },
          ],
          value: currentLaunchFee + amountIn,
        } as const
        const quoteSimulation = await publicClient.simulateContract({
          ...quoteParameters,
          account,
        })
        const amountOutMinimum =
          (quoteSimulation.result[3] *
            (BPS_DENOMINATOR - INITIAL_BUY_SLIPPAGE_BPS)) /
          BPS_DENOMINATOR
        const launchParameters = {
          ...quoteParameters,
          args: [
            tokenConfig,
            deadline,
            {
              amountIn,
              amountOutMinimum,
              recipient: account,
            },
          ],
        } as const

        await publicClient.simulateContract({
          ...launchParameters,
          account,
        })
        hash = await writeContractAsync(launchParameters)
      } else {
        const quoteParameters = {
          address: LAUNCHPAD_ADDRESS,
          abi: LAUNCHPAD_ABI,
          functionName: 'launchAndBuy',
          args: [
            tokenConfig,
            selectedQuoteToken.address,
            deadline,
            {
              amountIn,
              amountOutMinimum: 0n,
              recipient: account,
            },
          ],
          value: currentLaunchFee,
        } as const
        const quoteSimulation = await publicClient.simulateContract({
          ...quoteParameters,
          account,
        })
        const amountOutMinimum =
          (quoteSimulation.result[3] *
            (BPS_DENOMINATOR - INITIAL_BUY_SLIPPAGE_BPS)) /
          BPS_DENOMINATOR
        const launchParameters = {
          ...quoteParameters,
          args: [
            tokenConfig,
            selectedQuoteToken.address,
            deadline,
            {
              amountIn,
              amountOutMinimum,
              recipient: account,
            },
          ],
        } as const

        await publicClient.simulateContract({
          ...launchParameters,
          account,
        })
        hash = await writeContractAsync(launchParameters)
      }
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
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
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

  function handleLegalDialogOpenChange(open: boolean): void {
    setIsLegalDialogOpen(open)
    if (!open) setHasAcceptedLegalNotice(false)
  }

  function submitAcceptedLaunch(): void {
    if (!hasAcceptedLegalNotice) return

    handleLegalDialogOpenChange(false)
    void methods.handleSubmit(createLaunch)()
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
              (item.id === 'buy' ? canNavigateToBuy : canNavigateToReview)
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
        <form className="mt-6" onSubmit={(event) => event.preventDefault()}>
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
                  Choose initial buy
                </Button>
              </div>
            </PerpsCard>
          ) : null}

          {step === 'buy' ? (
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

              {isWethQuoteToken ? (
                <div className="mb-6 border-t border-white/[0.06] pt-6">
                  <div className="text-sm font-medium text-perps-muted">
                    Pay with
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-white/[0.03] p-1.5 sm:max-w-sm">
                    {(
                      [
                        ['native', nativeCurrency.symbol],
                        ['wrapped', selectedQuoteToken?.symbol ?? 'WETH'],
                      ] as const
                    ).map(([mode, label]) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setWethPaymentMode(mode)}
                        className={classNames(
                          'rounded-lg px-4 py-2.5 text-sm font-medium transition',
                          wethPaymentMode === mode
                            ? 'bg-perps-blue text-white'
                            : 'text-perps-muted-50 hover:text-perps-muted',
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-perps-muted-50">
                    Paying with {nativeCurrency.symbol} wraps it inside the
                    launch transaction. Paying with{' '}
                    {selectedQuoteToken?.symbol ?? 'WETH'} requires an ERC-20
                    approval before launch.
                  </p>
                </div>
              ) : null}

              <FormField
                control={methods.control}
                name="initialBuyUsd"
                render={({ field }) => (
                  <FormItem className="border-t border-white/[0.06] pt-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-perps-muted">
                          Buy your token at launch
                        </h2>
                        <p className="mt-1 max-w-xl text-sm leading-6 text-perps-muted-50">
                          Optionally make the first purchase atomically with the
                          token launch. Move the slider to choose how much to
                          spend.
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-xl font-semibold tabular-nums text-perps-muted">
                          {formatUSD(field.value)}
                        </div>
                        <div className="mt-1 text-xs tabular-nums text-perps-muted-50">
                          {initialBuyAmountRaw !== undefined &&
                          selectedQuoteToken
                            ? `${formatRawAmount(
                                initialBuyAmountRaw,
                                selectedQuoteToken.decimals,
                                6,
                              )} ${initialBuyCurrency?.symbol ?? selectedQuoteToken.symbol}`
                            : 'Price unavailable'}
                        </div>
                      </div>
                    </div>

                    <FormControl>
                      <Slider
                        aria-label="Initial token purchase in USD"
                        className="mt-6"
                        min={0}
                        max={MAX_INITIAL_BUY_USD}
                        step={INITIAL_BUY_STEP_USD}
                        value={[field.value]}
                        disabled={!selectedQuoteToken}
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
                      <span>No buy</span>
                      <span>{formatUSD(MAX_INITIAL_BUY_USD / 2)}</span>
                      <span>{formatUSD(MAX_INITIAL_BUY_USD)}</span>
                    </div>

                    {isQuotePriceLoading ? (
                      <div className="mt-5 border-t border-white/[0.06] pt-4 text-sm text-perps-muted-50">
                        Loading the quote-token price…
                      </div>
                    ) : quotePriceUsd !== undefined && selectedQuoteToken ? (
                      <div className="mt-5 border-t border-white/[0.06] pt-4 text-sm text-perps-muted-50">
                        Current conversion: {formatUSD(quotePriceUsd)} per{' '}
                        {selectedQuoteToken.symbol}. The exact minimum token
                        output is simulated immediately before submission with
                        1% tolerance.
                      </div>
                    ) : selectedQuoteToken ? (
                      <Message variant="destructive" size="sm" className="mt-5">
                        No trusted USD price is available for{' '}
                        {selectedQuoteToken.symbol}. Leave the initial buy at
                        zero, choose another quote asset, or try again.
                      </Message>
                    ) : null}
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
                <div className="sm:min-w-52">
                  <Checker.Connect
                    namespace="evm"
                    fullWidth
                    size="lg"
                    variant="perps-default"
                    type="button"
                  >
                    <Checker.Network
                      chainId={chainId}
                      fullWidth
                      size="lg"
                      variant="perps-default"
                      type="button"
                    >
                      <Checker.Amounts
                        chainId={chainId}
                        amounts={buyStepCheckerAmounts}
                        fullWidth
                        size="lg"
                        variant="perps-default"
                        type="button"
                      >
                        <Button
                          type="button"
                          fullWidth
                          size="lg"
                          variant="perps-default"
                          icon={ArrowRightIcon}
                          iconPosition="end"
                          disabled={!canNavigateToReview}
                          onClick={() => setStep('review')}
                        >
                          Review launch
                        </Button>
                      </Checker.Amounts>
                    </Checker.Network>
                  </Checker.Connect>
                </div>
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
                    ['Starting FDV', formatUSD(INITIAL_FDV_USD)],
                    [
                      'Initial buy',
                      initialBuyAmountRaw !== undefined &&
                      selectedQuoteToken &&
                      initialBuyAmountRaw > 0n
                        ? `${formatRawAmount(
                            initialBuyAmountRaw,
                            selectedQuoteToken.decimals,
                            6,
                          )} ${initialBuyCurrency?.symbol ?? selectedQuoteToken.symbol} · ${formatUSD(values.initialBuyUsd)}`
                        : 'None',
                    ],
                    [
                      'Contract start tick',
                      startTick?.toString() ?? 'Loading…',
                    ],
                    ['Pool fee tier', '1%'],
                    ['Liquidity position', 'Single maximum-bound range'],
                    [
                      'Protocol reserve',
                      protocolReserveBps === undefined
                        ? 'Loading…'
                        : `${formatBps(protocolReserveBps)} · locked 365 days`,
                    ],
                    [
                      'LP fee split',
                      defaultSushiFeeBps === undefined
                        ? 'Loading…'
                        : `${formatBps(defaultSushiFeeBps)} Sushi · ${formatBps(
                            10_000 - defaultSushiFeeBps,
                          )} creator`,
                    ],
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
                    Token name, symbol, supply, fixed starting valuation, quote
                    asset, creator, and liquidity position are immutable.
                    Description, links, and logo can be updated later.
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
                        <Checker.ApproveERC20
                          id="approve-launchpad-initial-buy"
                          amount={
                            !isNativeInitialBuy && initialBuyAmountRaw !== 0n
                              ? initialBuyAmount
                              : undefined
                          }
                          contract={LAUNCHPAD_ADDRESS}
                          enabled={
                            !isNativeInitialBuy &&
                            initialBuyAmountRaw !== undefined &&
                            initialBuyAmountRaw > 0n
                          }
                        >
                          <Button
                            type="button"
                            fullWidth
                            size="xl"
                            variant="perps-default"
                            disabled={
                              isLaunching ||
                              isLogoProcessing ||
                              isFactoryTermsPending ||
                              isFactoryTermsError ||
                              !selectedQuoteToken ||
                              initialBuyAmountRaw === undefined
                            }
                            onClick={() => setIsLegalDialogOpen(true)}
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
                        </Checker.ApproveERC20>
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
                  onClick={() => setStep('buy')}
                >
                  Back to initial buy
                </Button>
              </div>
            </div>
          ) : null}
        </form>
      </Form>

      <PerpsDialog
        open={isLegalDialogOpen}
        onOpenChange={handleLegalDialogOpenChange}
      >
        <PerpsDialogContent>
          <PerpsDialogHeader>
            <PerpsDialogTitle>Legal Acknowledgment</PerpsDialogTitle>
            <PerpsDialogDescription className="sr-only">
              Review and accept the token creation terms.
            </PerpsDialogDescription>
          </PerpsDialogHeader>
          <PerpsDialogInnerContent>
            <div className="space-y-5 text-sm leading-6 text-perps-muted-50">
              <div className="space-y-3">
                <p className="font-medium text-perps-muted">I accept that:</p>
                <ul className="list-disc space-y-3 pl-5">
                  <li>The token is not being offered as an investment.</li>
                  <li>
                    The token does not represent equity, debt, profit-sharing,
                    or other ownership rights.
                  </li>
                  <li>
                    The creator is responsible for compliance with all
                    applicable laws and regulations, including securities laws.
                  </li>
                  <li>
                    The creator will not market the token using promises of
                    appreciation or investment returns.
                  </li>
                </ul>
              </div>

              <label
                htmlFor="launch-legal-acceptance"
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] p-4 text-perps-muted"
              >
                <Checkbox
                  id="launch-legal-acceptance"
                  checked={hasAcceptedLegalNotice}
                  onCheckedChange={(checked) =>
                    setHasAcceptedLegalNotice(checked === true)
                  }
                  className='mt-0.5 !rounded-md !border-perps-muted-50 text-black data-[state="checked"]:!border-perps-muted data-[state="checked"]:!bg-perps-muted'
                />
                <span>I have read and accept the statements above.</span>
              </label>

              <Button
                type="button"
                fullWidth
                size="xl"
                variant="perps-default"
                disabled={!hasAcceptedLegalNotice}
                onClick={submitAcceptedLaunch}
              >
                Agree &amp; Create token
              </Button>
            </div>
          </PerpsDialogInnerContent>
        </PerpsDialogContent>
      </PerpsDialog>
    </Container>
  )
}
