'use client'

import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { toNestErrors } from '@hookform/resolvers'
import { getLaunchpadToken } from '@sushiswap/graph-client/data-api'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import { Button, Container, Form } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { type FieldError, type Resolver, useForm } from 'react-hook-form'
import { TOAST_AUTOCLOSE_TIME } from 'src/lib/constants'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { Amount, Percent, formatUSD } from 'sushi'
import {
  type EvmAddress,
  EvmNative,
  type EvmToken,
  SUSHI,
  WNATIVE,
  getEvmChainById,
} from 'sushi/evm'
import { formatEther, isAddressEqual, parseEventLogs } from 'viem'
import {
  useConnection,
  usePublicClient,
  useReadContracts,
  useSignTypedData,
  useWriteContract,
} from 'wagmi'
import * as z from 'zod'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { formatRawAmount } from '../../_lib/format'
import type { PreparedLaunchpadLogoFile } from '../../_lib/launchpad-logo'
import {
  launchpadMetadataDescriptionSchema,
  saveLaunchpadMetadata,
} from '../../_lib/launchpad-metadata'
import {
  SUSHI_V2_FEE_DISPOSITION,
  SUSHI_V2_LAUNCHPAD_ABI,
  SUSHI_V2_LAUNCHPAD_ADDRESS,
  SUSHI_V2_LIQUIDITY_MODE,
} from '../../_providers/sushi-v2/contract'
import { PageHeading } from '../../_ui/page-heading'
import type { LaunchpadChainId } from '../../constants'
import {
  LAUNCH_FDV_LEVELS_USD,
  quoteInitialBuy,
} from '../_lib/initial-buy-quote'
import { useLaunchpadQuoteTokens } from '../_lib/use-launchpad-quote-tokens'
import {
  CreateLaunchBuyButton,
  CreateLaunchBuyStep,
} from './create-launch-buy-step'
import { CreateLaunchDetailsStep } from './create-launch-details-step'
import { CreateLaunchPreview } from './create-launch-preview'
import { CreateLaunchReviewStep } from './create-launch-review-step'
import type {
  CreateLaunchForm,
  CreateStep,
  WethPaymentMode,
} from './create-launch-types'
import { CreateStepNavigation } from './create-step-navigation'
import { LegalAcknowledgementDialog } from './legal-acknowledgement-dialog'

const STANDARD_INITIAL_FDV_USD = 5_000
const MOON_INITIAL_FDV_USD = 10_000
const INITIAL_BUY_SLIPPAGE = new Percent({ numerator: 1, denominator: 100 })
const INITIAL_BUY_OUTPUT_PERCENT = new Percent(1).sub(INITIAL_BUY_SLIPPAGE)

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
  initialBuyAmount: z
    .string()
    .trim()
    .regex(/^\d+(?:\.\d*)?$/, 'Enter a valid initial buy amount')
    .max(80, 'Initial buy amount is too large'),
  liquidityMode: z.enum(['STANDARD', 'MOON']),
  feeDisposition: z.enum([
    'DIRECT_PAYOUT',
    'BURN_LAUNCH_TOKEN_FEES',
    'BUYBACK_AND_BURN',
  ]),
})

const createLaunchDetailsSchema = createLaunchSchema.pick({
  name: true,
  symbol: true,
  description: true,
  homepage: true,
  x: true,
  telegram: true,
  liquidityMode: true,
  feeDisposition: true,
})

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
  'liquidityMode',
  'feeDisposition',
]

const INDEXING_ATTEMPTS = 10
const INDEXING_RETRY_DELAY = ms('1.5s')

function formatBps(bps: number): string {
  const percent = new Percent({ numerator: bps, denominator: 10_000 })
  return `${Number(percent.toString({ fixed: 2 }))}%`
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

export function SushiV2CreateLaunchPage({
  chainId,
}: {
  chainId: LaunchpadChainId
}) {
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
    data: quoteTokens,
    isError: isQuoteTokenListError,
    isPending: isQuoteTokenListPending,
  } = useLaunchpadQuoteTokens(chainId)

  const quoteTokenMap = useMemo(
    () =>
      Object.fromEntries(
        quoteTokens.map((quoteToken) => [quoteToken.id, quoteToken]),
      ),
    [quoteTokens],
  )
  const defaultQuoteToken =
    quoteTokens.find((quoteToken) =>
      isAddressEqual(quoteToken.address, SUSHI[chainId].address),
    ) ??
    quoteTokens.find((quoteToken) =>
      isAddressEqual(quoteToken.address, WNATIVE[chainId].address),
    ) ??
    quoteTokens[0]
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
      initialBuyAmount: '0',
      liquidityMode: 'MOON',
      feeDisposition: 'BUYBACK_AND_BURN',
    },
  })
  const values = methods.watch()
  const isWethQuoteToken = Boolean(
    selectedQuoteToken &&
      isAddressEqual(selectedQuoteToken.address, WNATIVE[chainId].address),
  )
  const isSushiQuoteToken = Boolean(
    selectedQuoteToken &&
      isAddressEqual(selectedQuoteToken.address, SUSHI[chainId].address),
  )
  const isNativeInitialBuy = isWethQuoteToken && wethPaymentMode === 'native'
  const nativeCurrency = useMemo(
    () => EvmNative.fromChainId(chainId),
    [chainId],
  )
  const initialBuyCurrency = isNativeInitialBuy
    ? nativeCurrency
    : selectedQuoteToken
  const initialBuyAmountRaw = useMemo(
    () =>
      initialBuyCurrency
        ? Amount.tryFromHuman(initialBuyCurrency, values.initialBuyAmount)
            ?.amount
        : undefined,
    [initialBuyCurrency, values.initialBuyAmount],
  )
  const initialBuyCurrencyAmount = useMemo(
    () =>
      initialBuyCurrency && initialBuyAmountRaw !== undefined
        ? new Amount(initialBuyCurrency, initialBuyAmountRaw)
        : undefined,
    [initialBuyAmountRaw, initialBuyCurrency],
  )
  const {
    data: factoryTerms,
    isError: isFactoryTermsError,
    isPending: isFactoryTermsPending,
  } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: SUSHI_V2_LAUNCHPAD_ADDRESS,
        abi: SUSHI_V2_LAUNCHPAD_ABI,
        chainId,
        functionName: 'launchFee',
      },
      {
        address: SUSHI_V2_LAUNCHPAD_ADDRESS,
        abi: SUSHI_V2_LAUNCHPAD_ABI,
        chainId,
        functionName: 'defaultSushiFeeBps',
      },
      {
        address: SUSHI_V2_LAUNCHPAD_ADDRESS,
        abi: SUSHI_V2_LAUNCHPAD_ABI,
        chainId,
        functionName: 'canonicalSushi',
      },
    ],
    query: {
      enabled: step !== 'details' && Boolean(selectedQuoteToken),
      refetchInterval: ms('15s'),
    },
  })
  const [launchFee, defaultSushiFeeBps, canonicalSushi] = factoryTerms ?? []
  const {
    data: fdvTickResults,
    isPending: areFdvTicksPending,
    isError: areFdvTicksError,
  } = useReadContracts({
    allowFailure: false,
    contracts: LAUNCH_FDV_LEVELS_USD.map(
      (fdvUsd) =>
        ({
          address: SUSHI_V2_LAUNCHPAD_ADDRESS,
          abi: SUSHI_V2_LAUNCHPAD_ABI,
          chainId,
          functionName: 'calculateFdvTick',
          args: [
            selectedQuoteToken?.address ?? SUSHI_V2_LAUNCHPAD_ADDRESS,
            BigInt(fdvUsd),
          ],
        }) as const,
    ),
    query: {
      enabled: step === 'buy' && Boolean(selectedQuoteToken),
      staleTime: ms('30s'),
    },
  })
  const fdvTicks = useMemo(
    () => fdvTickResults?.map((tick) => Number(tick)),
    [fdvTickResults],
  )
  const initialBuyUsd = useMemo(() => {
    if (quotePriceUsd === undefined) return undefined

    const quoteAmount = Number(values.initialBuyAmount)
    if (!Number.isFinite(quoteAmount)) return undefined
    return quoteAmount * quotePriceUsd
  }, [quotePriceUsd, values.initialBuyAmount])
  const {
    data: quotedInitialBuyOutput,
    isFetching: isInitialBuyQuoteFetching,
    isError: isInitialBuyQuoteError,
  } = useQuery({
    queryKey: [
      'launchpad',
      'initial-buy-output',
      chainId,
      selectedQuoteToken?.address,
      values.liquidityMode,
      initialBuyAmountRaw?.toString(),
      fdvTicks,
    ],
    queryFn: () => {
      if (
        !selectedQuoteToken ||
        initialBuyAmountRaw === undefined ||
        !fdvTicks
      ) {
        return undefined
      }

      return quoteInitialBuy({
        chainId,
        quoteToken: selectedQuoteToken,
        amountIn: initialBuyAmountRaw,
        liquidityMode: values.liquidityMode,
        fdvTicks,
      })
    },
    enabled: Boolean(
      selectedQuoteToken &&
        initialBuyAmountRaw &&
        initialBuyAmountRaw > 0n &&
        fdvTicks?.length === LAUNCH_FDV_LEVELS_USD.length,
    ),
  })
  const estimatedInitialBuyOutputRaw =
    initialBuyAmountRaw === 0n ? 0n : quotedInitialBuyOutput
  const initialSushiFeeBps =
    canonicalSushi &&
    selectedQuoteToken &&
    isAddressEqual(canonicalSushi, selectedQuoteToken.address)
      ? 2_000
      : defaultSushiFeeBps
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
      !initialBuyCurrencyAmount ||
      initialBuyAmountRaw === undefined
    ) {
      return [undefined]
    }

    if (isNativeInitialBuy) {
      return [
        new Amount(
          nativeCurrency,
          launchFeeAmount.amount + initialBuyCurrencyAmount.amount,
        ),
      ]
    }

    return initialBuyAmountRaw > 0n
      ? [launchFeeAmount, initialBuyCurrencyAmount]
      : [launchFeeAmount]
  }, [
    initialBuyCurrencyAmount,
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
      const amountIn = initialBuyCurrency
        ? Amount.tryFromHuman(initialBuyCurrency, formValues.initialBuyAmount)
            ?.amount
        : undefined
      if (amountIn === undefined) {
        throw new Error(
          `Enter a valid ${initialBuyCurrency?.symbol ?? selectedQuoteToken.symbol} initial buy amount.`,
        )
      }

      const currentLaunchFee = await publicClient.readContract({
        address: SUSHI_V2_LAUNCHPAD_ADDRESS,
        abi: SUSHI_V2_LAUNCHPAD_ABI,
        functionName: 'launchFee',
      })
      const tokenConfig = {
        name: formValues.name,
        symbol: formValues.symbol,
      } as const
      const liquidityMode = SUSHI_V2_LIQUIDITY_MODE[formValues.liquidityMode]
      const feeDisposition = SUSHI_V2_FEE_DISPOSITION[formValues.feeDisposition]
      let hash: `0x${string}`

      if (amountIn === 0n) {
        const launchParameters = {
          address: SUSHI_V2_LAUNCHPAD_ADDRESS,
          abi: SUSHI_V2_LAUNCHPAD_ABI,
          functionName: 'launch',
          args: [
            tokenConfig,
            selectedQuoteToken.address,
            liquidityMode,
            feeDisposition,
          ],
          value: currentLaunchFee,
        } as const

        await publicClient.simulateContract({
          ...launchParameters,
          account,
        })
        hash = await writeContractAsync(launchParameters)
      } else if (isNativeInitialBuy) {
        const quoteParameters = {
          address: SUSHI_V2_LAUNCHPAD_ADDRESS,
          abi: SUSHI_V2_LAUNCHPAD_ABI,
          functionName: 'launchAndBuyNative',
          args: [
            tokenConfig,
            liquidityMode,
            feeDisposition,
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
        const amountOutMinimum = INITIAL_BUY_OUTPUT_PERCENT.mul(
          quoteSimulation.result[3],
        ).quotient
        const launchParameters = {
          ...quoteParameters,
          args: [
            tokenConfig,
            liquidityMode,
            feeDisposition,
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
          address: SUSHI_V2_LAUNCHPAD_ADDRESS,
          abi: SUSHI_V2_LAUNCHPAD_ABI,
          functionName: 'launchAndBuy',
          args: [
            tokenConfig,
            selectedQuoteToken.address,
            liquidityMode,
            feeDisposition,
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
        const amountOutMinimum = INITIAL_BUY_OUTPUT_PERCENT.mul(
          quoteSimulation.result[3],
        ).quotient
        const launchParameters = {
          ...quoteParameters,
          args: [
            tokenConfig,
            selectedQuoteToken.address,
            liquidityMode,
            feeDisposition,
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
        abi: SUSHI_V2_LAUNCHPAD_ABI,
        eventName: 'TokenLaunched',
        logs: receipt.logs.filter((log) =>
          isAddressEqual(log.address, SUSHI_V2_LAUNCHPAD_ADDRESS),
        ),
        strict: true,
      })
      const launchEvent = launchEvents.find(
        (event) =>
          isAddressEqual(event.args.launchCreator, account) &&
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

  const reviewDetails = [
    { label: 'Network', value: chain.name },
    {
      label: 'Quote asset',
      value: selectedQuoteToken?.symbol ?? 'Unavailable',
    },
    {
      label: 'Trusted quote price',
      value:
        quotePriceUsd === undefined || !selectedQuoteToken
          ? 'Unavailable'
          : `${formatUSD(quotePriceUsd)} / ${selectedQuoteToken.symbol}`,
    },
    {
      label: 'Starting FDV',
      value: formatUSD(
        values.liquidityMode === 'MOON'
          ? MOON_INITIAL_FDV_USD
          : STANDARD_INITIAL_FDV_USD,
      ),
    },
    {
      label: 'Initial buy',
      value:
        initialBuyAmountRaw !== undefined &&
        selectedQuoteToken &&
        initialBuyAmountRaw > 0n
          ? `${formatRawAmount(
              initialBuyAmountRaw,
              selectedQuoteToken.decimals,
              6,
            )} ${initialBuyCurrency?.symbol ?? selectedQuoteToken.symbol}${
              initialBuyUsd === undefined
                ? ''
                : ` · ${formatUSD(initialBuyUsd)}`
            }`
          : 'None',
    },
    { label: 'Pool fee tier', value: '1%' },
    {
      label: 'Liquidity mode',
      value:
        values.liquidityMode === 'MOON'
          ? 'Moon · seven contiguous ranges'
          : 'Standard · single maximum-bound range',
    },
    {
      label: 'Creator fee mode',
      value: values.feeDisposition
        .replaceAll('_', ' ')
        .toLowerCase()
        .replace(/\b\w/g, (character) => character.toUpperCase()),
    },
    {
      label: 'LP fee split',
      value:
        initialSushiFeeBps === undefined
          ? 'Loading…'
          : `${formatBps(10_000 - initialSushiFeeBps)} Creator`,
    },
    {
      label: 'Launch fee',
      value:
        launchFee === undefined
          ? 'Loading…'
          : `${formatEther(launchFee)} ${chain.viemChain.nativeCurrency.symbol}`,
    },
  ]

  return (
    <Container maxWidth="5xl" className="w-full px-4 py-10 sm:py-14">
      <PageHeading
        eyebrow="Create a token"
        title="Bring a token to life"
        description="Deploy a fixed one-billion-token supply and open a Sushi V3 market in one transaction. Editable metadata is saved after deployment."
      />

      <CreateStepNavigation
        step={step}
        canNavigateToBuy={canNavigateToBuy}
        canNavigateToReview={canNavigateToReview}
        onNavigate={(nextStep) => void navigateToStep(nextStep)}
      />

      <Form {...methods}>
        <form className="mt-6" onSubmit={(event) => event.preventDefault()}>
          {step === 'details' ? (
            <CreateLaunchDetailsStep
              methods={methods}
              logo={logo}
              onLogoChange={setLogo}
              onLogoProcessingChange={setIsLogoProcessing}
              previewImageUrl={previewImageUrl}
              values={values}
              onContinue={() => void continueFromDetails()}
            />
          ) : null}

          {step === 'buy' ? (
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
              <CreateLaunchBuyStep
                chainId={chainId}
                methods={methods}
                selectedQuoteToken={selectedQuoteToken}
                quoteTokenMap={quoteTokenMap}
                quoteTokenCount={quoteTokens.length}
                isQuoteTokenListPending={isQuoteTokenListPending}
                isQuoteTokenListError={isQuoteTokenListError}
                onQuoteTokenSelect={setSelectedQuoteTokenAddress}
                isSushiQuoteToken={isSushiQuoteToken}
                isWethQuoteToken={isWethQuoteToken}
                wethPaymentMode={wethPaymentMode}
                onWethPaymentModeChange={setWethPaymentMode}
                nativeCurrencySymbol={nativeCurrency.symbol}
                initialBuyCurrency={initialBuyCurrency}
                launchFeeRaw={launchFee}
                initialBuyUsd={initialBuyUsd}
                isQuotePriceLoading={isQuotePriceLoading}
                estimatedInitialBuyOutputRaw={estimatedInitialBuyOutputRaw}
                isInitialBuyQuoteLoading={
                  areFdvTicksPending || isInitialBuyQuoteFetching
                }
                isInitialBuyQuoteError={
                  areFdvTicksError || isInitialBuyQuoteError
                }
              />
              <div className="space-y-4">
                <CreateLaunchPreview
                  name={values.name}
                  symbol={values.symbol}
                  liquidityMode={values.liquidityMode}
                  feeDisposition={values.feeDisposition}
                  previewImageUrl={previewImageUrl}
                  footer={
                    <CreateLaunchBuyButton
                      chainId={chainId}
                      checkerAmounts={buyStepCheckerAmounts}
                      canNavigateToReview={canNavigateToReview}
                      onReview={() => setStep('review')}
                    />
                  }
                />
                <Button
                  type="button"
                  fullWidth
                  variant="perps-secondary"
                  icon={ArrowLeftIcon}
                  onClick={() => setStep('details')}
                >
                  Back to token details
                </Button>
              </div>
            </div>
          ) : null}

          {step === 'review' ? (
            <CreateLaunchReviewStep
              chainId={chainId}
              values={values}
              previewImageUrl={previewImageUrl}
              details={reviewDetails}
              isFactoryTermsError={isFactoryTermsError}
              launchedTokenAddress={launchedTokenAddress}
              isWaitingForIndexing={isWaitingForIndexing}
              tokenHref={
                launchedTokenAddress
                  ? `/${chain.key}/launchpad/token/${launchedTokenAddress}`
                  : undefined
              }
              isNativeInitialBuy={isNativeInitialBuy}
              initialBuyAmountRaw={initialBuyAmountRaw}
              initialBuyAmount={initialBuyCurrencyAmount}
              isLaunching={isLaunching}
              isLogoProcessing={isLogoProcessing}
              isFactoryTermsPending={isFactoryTermsPending}
              selectedQuoteTokenAvailable={Boolean(selectedQuoteToken)}
              onOpenLegalDialog={() => setIsLegalDialogOpen(true)}
              onBack={() => setStep('buy')}
            />
          ) : null}
        </form>
      </Form>

      <LegalAcknowledgementDialog
        open={isLegalDialogOpen}
        accepted={hasAcceptedLegalNotice}
        onOpenChange={handleLegalDialogOpenChange}
        onAcceptedChange={setHasAcceptedLegalNotice}
        onSubmit={submitAcceptedLaunch}
      />
    </Container>
  )
}
