'use client'

import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  BanknotesIcon,
  CheckCircleIcon,
  LockClosedIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { createToast } from '@sushiswap/notifications'
import {
  Button,
  Container,
  Dots,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Message,
  TextField,
} from '@sushiswap/ui'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { formatPercent } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import { getEvmChainById } from 'sushi/evm'
import {
  useConnection,
  usePublicClient,
  useSignTypedData,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'
import * as z from 'zod'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import type { PreparedLaunchpadLogoFile } from '../../../_lib/launchpad-logo'
import { formatRawAmount, shortenAddress } from '../../../_ui/format'
import { LaunchpadLogoInput } from '../../../_ui/launchpad-logo-input'
import { StatusPill } from '../../../_ui/status-pill'
import { TokenAvatar } from '../../../_ui/token-avatar'
import type { LaunchpadChainId } from '../../../constants'
import { useLaunchpadToken } from '../../../hooks/use-launchpad-data'
import { LAUNCHPAD_ABI, LAUNCHPAD_ADDRESS } from '../../../launchpad-contract'
import {
  launchpadMetadataDescriptionSchema,
  saveLaunchpadMetadata,
} from './metadata-signature'

const optionalHttpsUrl = z.union([
  z.literal(''),
  z.string().url().startsWith('https://'),
])

const metadataSchema = z.object({
  description: launchpadMetadataDescriptionSchema,
  homepage: optionalHttpsUrl,
  x: z.union([z.literal(''), z.string().url().startsWith('https://x.com/')]),
  telegram: z.union([
    z.literal(''),
    z.string().url().startsWith('https://t.me/'),
  ]),
})

type MetadataForm = z.infer<typeof metadataSchema>

const SAVED_STATUS_DURATION_MS = 3_000

export function ManageTokenPage({
  chainId,
  address,
}: {
  chainId: LaunchpadChainId
  address: EvmAddress
}) {
  const chainKey = getEvmChainById(chainId).key
  const { address: connectedAddress, chainId: connectedChainId } =
    useConnection()
  const publicClient = usePublicClient({ chainId })
  const { mutateAsync: signTypedDataAsync } = useSignTypedData()
  const { mutateAsync: writeContractAsync } = useWriteContract()
  const {
    data: token,
    isError,
    isPending,
    refetch,
  } = useLaunchpadToken(chainId, address)
  const {
    data: distributionSimulation,
    isError: isDistributionSimulationError,
    refetch: refetchDistributionSimulation,
  } = useSimulateContract({
    address: LAUNCHPAD_ADDRESS,
    abi: LAUNCHPAD_ABI,
    chainId,
    functionName: 'distributeFees',
    args: [address],
    query: {
      enabled: Boolean(token),
      retry: false,
      refetchInterval: 60_000,
      refetchOnWindowFocus: true,
    },
  })
  const distributionPreview =
    !isDistributionSimulationError && distributionSimulation?.result
      ? {
          quoteCollected: distributionSimulation.result[0],
          tokenCollected: distributionSimulation.result[1],
        }
      : null
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [distributed, setDistributed] = useState(false)
  const [isDistributing, setIsDistributing] = useState(false)
  const [distributionError, setDistributionError] = useState<string | null>(
    null,
  )
  const [logo, setLogo] = useState<PreparedLaunchpadLogoFile | null>(null)
  const [isLogoProcessing, setIsLogoProcessing] = useState(false)
  const metadataDefaults = useMemo<MetadataForm>(
    () => ({
      description: token?.metadata.description ?? '',
      homepage:
        token?.metadata.links.find((link) => link.kind === 'homepage')?.url ??
        '',
      x: token?.metadata.links.find((link) => link.kind === 'x')?.url ?? '',
      telegram:
        token?.metadata.links.find((link) => link.kind === 'telegram')?.url ??
        '',
    }),
    [token],
  )
  const methods = useForm<MetadataForm>({
    resolver: zodResolver(metadataSchema),
    mode: 'onChange',
    defaultValues: metadataDefaults,
  })

  useEffect(() => methods.reset(metadataDefaults), [metadataDefaults, methods])
  useEffect(() => {
    if (!saved) return

    const timeout = setTimeout(() => setSaved(false), SAVED_STATUS_DURATION_MS)
    return () => clearTimeout(timeout)
  }, [saved])

  async function onSubmit(values: MetadataForm): Promise<void> {
    setSaved(false)
    setSaveError(null)

    try {
      if (!token) throw new Error('Launch token is no longer available')
      if (!connectedAddress) throw new Error('Connect the creator wallet first')
      if (connectedAddress.toLowerCase() !== token.creator.toLowerCase()) {
        throw new Error('Connect the creator wallet first')
      }
      if (connectedChainId !== chainId) {
        throw new Error(
          `Switch your wallet to ${getEvmChainById(chainId).name}`,
        )
      }

      await saveLaunchpadMetadata({
        chainId,
        factoryAddress: token.factoryAddress,
        tokenAddress: address,
        expectedRevision: token.metadata.revision,
        values,
        logoFile: logo?.file,
        signTypedData: (typedData) => signTypedDataAsync(typedData),
      })
      await refetch()
      setSaved(true)
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : 'Metadata update failed',
      )
    }
  }

  async function distributeFees(): Promise<void> {
    if (!connectedAddress) return

    setDistributed(false)
    setDistributionError(null)
    setIsDistributing(true)

    try {
      if (!token) throw new Error('Launch token is no longer available')
      if (connectedChainId !== chainId) {
        throw new Error(
          `Switch your wallet to ${getEvmChainById(chainId).name}`,
        )
      }
      if (!publicClient) {
        throw new Error('Could not connect to the launchpad network')
      }

      const distributionParameters = {
        address: LAUNCHPAD_ADDRESS,
        abi: LAUNCHPAD_ABI,
        chainId,
        functionName: 'distributeFees',
        args: [address],
      } as const
      await publicClient.simulateContract({
        ...distributionParameters,
        account: connectedAddress,
      })

      const hash = await writeContractAsync(distributionParameters)
      const receiptPromise = publicClient.waitForTransactionReceipt({ hash })
      const timestamp = Date.now()

      void createToast({
        account: connectedAddress,
        type: 'claimRewards',
        chainId,
        txHash: hash,
        promise: receiptPromise,
        summary: {
          pending: `Distributing ${token.symbol} launch fees`,
          completed: `${token.symbol} launch fees were distributed`,
          failed: `Something went wrong distributing ${token.symbol} launch fees`,
        },
        timestamp,
        groupTimestamp: timestamp,
      })

      await receiptPromise
      await refetchDistributionSimulation()
      setDistributed(true)
    } catch (error) {
      if (!isUserRejectedError(error)) {
        const message =
          error instanceof Error ? error.message : 'Fee distribution failed'
        setDistributionError(
          message.includes('NothingToWithdraw')
            ? 'No fees are available to distribute.'
            : message,
        )
      }
    } finally {
      setIsDistributing(false)
    }
  }

  if (isPending) {
    return (
      <Container maxWidth="lg" className="w-full px-4 py-20">
        <PerpsCard className="p-8 text-center" fullWidth>
          <ArrowPathIcon className="mx-auto h-8 w-8 animate-spin text-perps-muted-50" />
          <h1 className="mt-4 text-xl font-semibold">Loading launch</h1>
        </PerpsCard>
      </Container>
    )
  }

  if (isError) {
    return (
      <Container maxWidth="lg" className="w-full px-4 py-20">
        <PerpsCard className="p-8 text-center" fullWidth>
          <h1 className="text-2xl font-semibold">Could not load launch</h1>
          <p className="mt-2 text-sm text-perps-muted-50">
            The launchpad API did not return a usable response.
          </p>
          <Button
            variant="perps-secondary"
            className="mt-6"
            onClick={() => refetch()}
          >
            Try again
          </Button>
        </PerpsCard>
      </Container>
    )
  }

  if (!token) {
    return (
      <Container maxWidth="lg" className="w-full px-4 py-20">
        <PerpsCard className="p-8 text-center" fullWidth>
          <h1 className="text-2xl font-semibold">Launch not found</h1>
          <p className="mt-2 text-sm text-perps-muted-50">
            This token is not present in the launchpad catalog.
          </p>
          <Button
            asChild
            variant="perps-secondary"
            className="mt-6"
            icon={ArrowLeftIcon}
          >
            <Link href={`/${chainKey}/launchpad/manage`}>
              Back to dashboard
            </Link>
          </Button>
        </PerpsCard>
      </Container>
    )
  }

  return (
    <Container maxWidth="6xl" className="w-full px-4 py-10 sm:py-14">
      <div className="flex items-center gap-2 text-sm text-perps-muted-50">
        <Link
          href={`/${chainKey}/launchpad/manage`}
          className="flex items-center gap-1.5 transition hover:text-perps-blue"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          My launches
        </Link>
        <span>/</span>
        <span>{token.symbol}</span>
      </div>

      <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <TokenAvatar token={token} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-3xl font-semibold tracking-tight text-perps-muted">
                Manage {token.name}
              </h1>
            </div>
            <div className="mt-1.5 text-sm text-perps-muted-50">
              {shortenAddress(token.address, 7)}
            </div>
          </div>
        </div>
        <Button asChild variant="perps-secondary">
          <Link
            href={`/${chainKey}/launchpad/token/${token.address}`}
            className="flex items-center gap-2 flex-row"
          >
            View token page
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <PerpsCard className="p-5 sm:p-7" fullWidth>
              <div>
                <h2 className="text-lg font-semibold text-perps-muted">
                  Public profile
                </h2>
                <p className="mt-2 text-sm leading-6 text-perps-muted-50">
                  Metadata updates replace the complete editable document and
                  are signed against revision {token.metadata.revision}.
                </p>
              </div>

              <div className="mt-6">
                <LaunchpadLogoInput
                  id="replacement-logo"
                  prompt="Replace token logo"
                  value={logo}
                  onChange={setLogo}
                  onProcessingChange={setIsLogoProcessing}
                />
              </div>

              <div className="mt-6 space-y-5">
                <FormField
                  control={methods.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={5}
                          className="w-full resize-none rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm text-perps-muted outline-none transition focus:border-perps-blue"
                        />
                      </FormControl>
                      <FormMessage />
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
                            className="!bg-white/[0.04] !text-perps-muted"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
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
                            className="!bg-white/[0.04] !text-perps-muted"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {saveError ? (
                <Message
                  variant="destructive"
                  className="mt-6 min-w-0 max-w-full break-words"
                >
                  {saveError}
                </Message>
              ) : null}

              <div className="mt-7 flex items-center justify-end gap-3">
                {saved ? (
                  <span
                    role="status"
                    className="flex items-center gap-1.5 text-sm font-medium text-emerald-500"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    Saved
                  </span>
                ) : null}
                <Checker.Connect
                  fullWidth={false}
                  namespace="evm"
                  size="lg"
                  type="button"
                  className="w-52"
                  variant="perps-default"
                >
                  <Checker.Network
                    chainId={chainId}
                    fullWidth={false}
                    size="lg"
                    type="button"
                    className="w-52"
                    variant="perps-default"
                    hideChainName
                  >
                    <Checker.Guard
                      guardWhen={
                        connectedAddress?.toLowerCase() !==
                        token.creator.toLowerCase()
                      }
                      guardText="Connect creator wallet"
                      fullWidth={false}
                      size="lg"
                      type="button"
                      className="w-52"
                      variant="perps-default"
                    >
                      <Button
                        className="w-52"
                        type="submit"
                        size="lg"
                        variant="perps-default"
                        disabled={
                          methods.formState.isSubmitting || isLogoProcessing
                        }
                      >
                        Sign &amp; save changes
                      </Button>
                    </Checker.Guard>
                  </Checker.Network>
                </Checker.Connect>
              </div>
            </PerpsCard>
          </form>
        </Form>

        <div className="space-y-5">
          <PerpsCard className="p-5" fullWidth>
            <div className="flex items-center gap-2">
              <LockClosedIcon className="h-5 w-5 text-perps-blue" />
              <h2 className="font-semibold text-perps-muted">
                Immutable facts
              </h2>
            </div>
            <div className="mt-5 space-y-4 text-sm">
              {[
                ['Name', token.name],
                ['Symbol', token.symbol],
                [
                  'Supply',
                  formatRawAmount(token.initialSupply, token.decimals, 0),
                ],
                ['Decimals', `${token.decimals}`],
                ['Pool tier', `${token.pool.feeTier / 10_000}%`],
                ['Positions', `${token.positions.length}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4"
                >
                  <span className="text-perps-muted-50">{label}</span>
                  <span className="text-right font-medium">{value}</span>
                </div>
              ))}
            </div>
          </PerpsCard>

          <PerpsCard className="p-5" fullWidth>
            <div className="flex items-center gap-2">
              <UserCircleIcon className="h-5 w-5 text-perps-blue" />
              <h2 className="font-semibold text-perps-muted">
                Creator authority
              </h2>
            </div>
            <p className="mt-3 break-all font-mono text-xs leading-5 text-perps-muted-50">
              {token.creator}
            </p>
            <p className="mt-3 text-xs leading-5 text-perps-muted-50">
              The backend verifies this immutable address independently for
              every metadata and logo signature.
            </p>
          </PerpsCard>
        </div>
      </div>

      <div className="mt-5">
        <PerpsCard className="overflow-hidden" fullWidth>
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <BanknotesIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-semibold text-perps-muted">
                    Distribute trading fees
                  </h2>
                  <p className="mt-0.5 text-xs text-perps-muted-50">
                    Collects every registered V3 position in one transaction
                  </p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-white/[0.04] p-4">
                  <div className="text-xs text-perps-muted-50">
                    Launch token
                  </div>
                  <div className="mt-1 font-semibold">
                    {distributionPreview
                      ? `${formatRawAmount(
                          distributionPreview.tokenCollected,
                          token.decimals,
                          6,
                        )} ${token.symbol}`
                      : 'Resolved on simulation'}
                  </div>
                </div>
                <div className="rounded-xl bg-white/[0.04] p-4">
                  <div className="text-xs text-perps-muted-50">Quote token</div>
                  <div className="mt-1 font-semibold">
                    {distributionPreview
                      ? `${formatRawAmount(
                          distributionPreview.quoteCollected,
                          token.pool.quoteToken.decimals,
                          6,
                        )} ${token.pool.quoteToken.symbol}`
                      : 'Resolved on simulation'}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-perps-muted-50">
                Distribution is permissionless. Anyone can do it.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-perps-muted-50">Sushi recipient</span>
                <span className="font-medium">
                  {formatPercent(token.feeSplit.sushiFeeBps / 10_000)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-perps-muted-50">Creator recipient</span>
                <span className="font-medium">
                  {formatPercent(token.feeSplit.creatorFeeBps / 10_000)}
                </span>
              </div>
              <Checker.Connect
                namespace="evm"
                fullWidth
                size="lg"
                variant="perps-default"
                className="mt-5"
                type="button"
              >
                <Button
                  fullWidth
                  size="lg"
                  variant="perps-default"
                  className="mt-5"
                  disabled={isDistributing || distributed}
                  onClick={() => void distributeFees()}
                >
                  {isDistributing ? (
                    <>
                      {'Distributing fees'}
                      <Dots />
                    </>
                  ) : distributed ? (
                    'Fees distributed'
                  ) : (
                    'Distribute fees'
                  )}
                </Button>
              </Checker.Connect>
              {distributionError ? (
                <Message variant="destructive" className="mt-5">
                  {distributionError}
                </Message>
              ) : null}
            </div>
          </div>
        </PerpsCard>
      </div>
    </Container>
  )
}
