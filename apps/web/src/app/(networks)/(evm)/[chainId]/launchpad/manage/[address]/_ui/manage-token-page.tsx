'use client'

import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  LockClosedIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import type { LaunchpadToken } from '@sushiswap/graph-client/data-api'
import { createToast } from '@sushiswap/notifications'
import {
  Button,
  Container,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  LinkInternal,
  Message,
  TextField,
} from '@sushiswap/ui'
import ms from 'ms'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { Checker } from 'src/lib/wagmi/systems/checker'
import type { EvmAddress } from 'sushi/evm'
import { getEvmChainById } from 'sushi/evm'
import { isAddress, isAddressEqual } from 'viem'
import {
  useBytecode,
  useConnection,
  usePublicClient,
  useReadContract,
  useSignTypedData,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'
import * as z from 'zod'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { formatRawAmount, shortenAddress } from '../../../_lib/format'
import type { PreparedLaunchpadLogoFile } from '../../../_lib/launchpad-logo'
import {
  canSubmitLaunchpadMetadataSignature,
  launchpadMetadataDescriptionSchema,
  saveLaunchpadMetadata,
} from '../../../_lib/launchpad-metadata'
import {
  getLaunchpadProviderConfig,
  launchpadProviderHasCapability,
} from '../../../_lib/launchpad-provider'
import { useLaunchpadToken } from '../../../_lib/use-launchpad-token'
import { ProviderManagementActions } from '../../../_providers/provider-management-actions'
import {
  SUSHI_V1_LAUNCHPAD_ABI,
  SUSHI_V1_LAUNCHPAD_ADDRESS,
} from '../../../_providers/sushi-v1/contract'
import {
  type DistributionPreview,
  SUSHI_V2_FEE_DISPOSITION,
  SUSHI_V2_LAUNCHPAD_ABI,
  SUSHI_V2_LAUNCHPAD_ADDRESS,
  type SushiV2FeeDisposition,
  normalizeSushiV2Distribution,
} from '../../../_providers/sushi-v2/contract'
import { DetailList } from '../../../_ui/detail-list'
import { LaunchpadLogoInput } from '../../../_ui/launchpad-logo-input'
import { PageState } from '../../../_ui/state-card'
import { TokenAvatar } from '../../../_ui/token-avatar'
import type { LaunchpadChainId } from '../../../constants'
import { FeeDistributionCard } from './fee-distribution-card'

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

const SAVED_STATUS_DURATION_MS = ms('3s')

const METADATA_GUARD_TEXT = {
  pending: 'Checking creator',
  unknown: 'Creator check failed',
  contract: 'Connect authorized wallet',
  eoa: 'Connect creator wallet',
} as const

const METADATA_SIGNER_ERROR = {
  pending: 'Still checking the creator address, try again in a moment',
  unknown:
    'Could not check whether the creator is a contract, reload and try again',
  contract: 'Connect a wallet authorized by the creator contract first',
  eoa: 'Connect the creator wallet first',
} as const

export function ManageTokenPage({
  chainId,
  address,
  initialToken,
}: {
  chainId: LaunchpadChainId
  address: EvmAddress
  initialToken: LaunchpadToken
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
    refetch,
  } = useLaunchpadToken(chainId, address, initialToken)
  const canManage = token
    ? launchpadProviderHasCapability(token.provider, 'manage')
    : false
  const canManageMetadata = token
    ? launchpadProviderHasCapability(token.provider, 'metadata')
    : false
  const isSushiV2 = token?.__typename === 'SushiV2LaunchpadToken'
  const managementAddress = isSushiV2
    ? SUSHI_V2_LAUNCHPAD_ADDRESS
    : SUSHI_V1_LAUNCHPAD_ADDRESS
  const managementAbi = isSushiV2
    ? SUSHI_V2_LAUNCHPAD_ABI
    : SUSHI_V1_LAUNCHPAD_ABI
  const { data: launchpadOwner } = useReadContract({
    address: SUSHI_V2_LAUNCHPAD_ADDRESS,
    abi: SUSHI_V2_LAUNCHPAD_ABI,
    chainId,
    functionName: 'owner',
    query: {
      enabled: isSushiV2,
    },
  })
  const isLaunchpadOwner = Boolean(
    connectedAddress &&
      launchpadOwner &&
      isAddressEqual(connectedAddress, launchpadOwner),
  )
  const {
    data: creatorBytecode,
    isLoading: isCreatorBytecodeLoading,
    isError: isCreatorBytecodeError,
  } = useBytecode({
    address: token?.creator,
    chainId,
    query: {
      enabled: canManageMetadata,
    },
  })
  const canSubmitMetadataSignature =
    token && canManageMetadata
      ? canSubmitLaunchpadMetadataSignature({
          connectedAddress,
          creatorAddress: token.creator,
          creatorBytecode,
        })
      : false
  const isContractCreator = Boolean(creatorBytecode && creatorBytecode !== '0x')
  const creatorKind = isCreatorBytecodeLoading
    ? 'pending'
    : isCreatorBytecodeError
      ? 'unknown'
      : isContractCreator
        ? 'contract'
        : 'eoa'
  const {
    data: distributionSimulation,
    isError: isDistributionSimulationError,
    isPending: isDistributionSimulationPending,
    refetch: refetchDistributionSimulation,
  } = useSimulateContract({
    address: managementAddress,
    abi: managementAbi,
    chainId,
    functionName: 'distributeFees',
    args: [address],
    query: {
      enabled: canManage,
      retry: false,
      refetchInterval: ms('1m'),
      refetchOnWindowFocus: true,
    },
  })
  const distributionPreview: DistributionPreview | null = (() => {
    if (isDistributionSimulationError || !distributionSimulation?.result) {
      return null
    }
    const result = distributionSimulation.result
    return 'quoteToSushi' in result
      ? normalizeSushiV2Distribution(result)
      : { quoteCollected: result[0], tokenCollected: result[1] }
  })()
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [distributed, setDistributed] = useState(false)
  const [isDistributing, setIsDistributing] = useState(false)
  const [distributionError, setDistributionError] = useState<string | null>(
    null,
  )
  const [newCreator, setNewCreator] = useState('')
  const [newFeeReceiver, setNewFeeReceiver] = useState('')
  const [managementError, setManagementError] = useState<string | null>(null)
  const [isUpdatingManagement, setIsUpdatingManagement] = useState(false)
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
  useEffect(() => {
    if (!distributed) return

    const timeout = setTimeout(
      () => setDistributed(false),
      SAVED_STATUS_DURATION_MS,
    )
    return () => clearTimeout(timeout)
  }, [distributed])

  async function onSubmit(values: MetadataForm): Promise<void> {
    setSaved(false)
    setSaveError(null)

    try {
      if (!token) throw new Error('Launch token is no longer available')
      if (!canManageMetadata) {
        throw new Error('This provider does not support metadata updates here')
      }
      if (!connectedAddress || !canSubmitMetadataSignature) {
        throw new Error(METADATA_SIGNER_ERROR[creatorKind])
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
        signTypedData: (typedData) =>
          signTypedDataAsync({ ...typedData, account: connectedAddress }),
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
      if (!canManage) {
        throw new Error('This provider is not managed through Sushi')
      }
      if (connectedChainId !== chainId) {
        throw new Error(
          `Switch your wallet to ${getEvmChainById(chainId).name}`,
        )
      }
      if (!publicClient) {
        throw new Error('Could not connect to the launchpad network')
      }

      const distributionParameters = {
        address: managementAddress,
        abi: managementAbi,
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

  async function writeSushiV2Management(
    functionName: 'setFeeDisposition' | 'setFeeReceiver' | 'transferCreator',
    args: readonly [EvmAddress, number | EvmAddress],
  ): Promise<void> {
    if (!connectedAddress || !publicClient || !token || !isSushiV2) return
    if (connectedChainId !== chainId) {
      throw new Error(`Switch your wallet to ${getEvmChainById(chainId).name}`)
    }

    const parameters = {
      address: SUSHI_V2_LAUNCHPAD_ADDRESS,
      abi: SUSHI_V2_LAUNCHPAD_ABI,
      chainId,
      functionName,
      args,
    } as const
    await publicClient.simulateContract({
      ...parameters,
      account: connectedAddress,
    })
    const hash = await writeContractAsync(parameters)
    await publicClient.waitForTransactionReceipt({ hash })
    await refetch()
  }

  async function transferCreator(): Promise<void> {
    setManagementError(null)
    if (
      !isAddress(newCreator) ||
      newCreator === '0x0000000000000000000000000000000000000000'
    ) {
      setManagementError('Enter a non-zero EVM address')
      return
    }
    setIsUpdatingManagement(true)
    try {
      await writeSushiV2Management('transferCreator', [address, newCreator])
      setNewCreator('')
    } catch (error) {
      if (!isUserRejectedError(error)) {
        setManagementError(
          error instanceof Error ? error.message : 'Creator transfer failed',
        )
      }
    } finally {
      setIsUpdatingManagement(false)
    }
  }

  async function setFeeDisposition(next: SushiV2FeeDisposition): Promise<void> {
    setManagementError(null)
    setIsUpdatingManagement(true)
    try {
      await writeSushiV2Management('setFeeDisposition', [
        address,
        SUSHI_V2_FEE_DISPOSITION[next],
      ])
    } catch (error) {
      if (!isUserRejectedError(error)) {
        setManagementError(
          error instanceof Error ? error.message : 'Fee mode update failed',
        )
      }
    } finally {
      setIsUpdatingManagement(false)
    }
  }

  async function setFeeReceiver(): Promise<void> {
    setManagementError(null)
    if (
      !isAddress(newFeeReceiver) ||
      newFeeReceiver === '0x0000000000000000000000000000000000000000'
    ) {
      setManagementError('Enter a non-zero EVM address')
      return
    }
    if (!isLaunchpadOwner) {
      setManagementError('Connect the launchpad owner wallet first')
      return
    }
    setIsUpdatingManagement(true)
    try {
      await writeSushiV2Management('setFeeReceiver', [address, newFeeReceiver])
      setNewFeeReceiver('')
    } catch (error) {
      if (!isUserRejectedError(error)) {
        setManagementError(
          error instanceof Error
            ? error.message
            : 'Fee recipient transfer failed',
        )
      }
    } finally {
      setIsUpdatingManagement(false)
    }
  }

  if (isError) {
    return (
      <PageState
        title="Could not load launch"
        description="The launchpad API did not return a usable response."
        action={
          <Button variant="perps-secondary" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    )
  }

  if (!token) {
    return (
      <PageState
        title="Launch not found"
        description="This token is not present in the launchpad catalog."
        action={
          <LinkInternal href={`/${chainKey}/launchpad/manage`}>
            <Button asChild variant="perps-secondary" icon={ArrowLeftIcon}>
              Back to dashboard
            </Button>
          </LinkInternal>
        }
      />
    )
  }

  if (!canManage) {
    const provider = getLaunchpadProviderConfig(token.provider)
    return (
      <PageState
        title={`${provider.label} manages this launch`}
        description="Trading and market data are available here, but creator tools stay with the launch provider."
        action={
          provider.websiteUrl ? (
            <Button asChild variant="perps-secondary">
              <a href={provider.websiteUrl} target="_blank" rel="noreferrer">
                Open {provider.label}
              </a>
            </Button>
          ) : undefined
        }
      />
    )
  }
  return (
    <Container maxWidth="6xl" className="w-full px-4 py-10 sm:py-14">
      <div className="flex items-center gap-2 text-sm text-perps-muted-50">
        <LinkInternal
          href={`/${chainKey}/launchpad/manage`}
          className="flex items-center gap-1.5 transition hover:text-perps-blue"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          My Launches
        </LinkInternal>
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
        <LinkInternal
          href={`/${chainKey}/launchpad/token/${token.address}`}
          className="flex items-center gap-2 flex-row"
        >
          <Button asChild variant="perps-secondary">
            View token page
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </Button>
        </LinkInternal>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
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
                      guardWhen={!canSubmitMetadataSignature}
                      guardText={METADATA_GUARD_TEXT[creatorKind]}
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
            <DetailList
              className="mt-5"
              items={[
                ['Name', token.name],
                ['Symbol', token.symbol],
                [
                  'Supply',
                  formatRawAmount(token.initialSupply, token.decimals, 0),
                ],
                ['Decimals', `${token.decimals}`],
                ['Pool tier', `${token.pool.feeTier / 10_000}%`],
              ].map(([label, value]) => ({ label, value }))}
            />
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
              The backend verifies this {isSushiV2 ? 'current' : 'immutable'}{' '}
              address independently for every metadata and logo signature
              {isContractCreator
                ? ', including EIP-1271 signatures if this contract supports them.'
                : '.'}
            </p>
          </PerpsCard>
        </div>
      </div>

      <div className="mt-5">
        <FeeDistributionCard
          token={token}
          chainId={chainId}
          preview={distributionPreview}
          isSimulating={isDistributionSimulationPending}
          isDistributing={isDistributing}
          distributed={distributed}
          error={distributionError}
          onDistribute={() => void distributeFees()}
        />
      </div>

      <div className="mt-5">
        <ProviderManagementActions
          token={token}
          connectedAddress={connectedAddress}
          isLaunchpadOwner={isLaunchpadOwner}
          newCreator={newCreator}
          newFeeReceiver={newFeeReceiver}
          isUpdating={isUpdatingManagement}
          error={managementError}
          onNewCreatorChange={setNewCreator}
          onNewFeeReceiverChange={setNewFeeReceiver}
          onTransferCreator={() => void transferCreator()}
          onSetFeeReceiver={() => void setFeeReceiver()}
          onSetFeeDisposition={(next) => void setFeeDisposition(next)}
        />
      </div>
    </Container>
  )
}
