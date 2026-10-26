'use client'

import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import {
  Button,
  IconButton,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  TextField,
} from '@sushiswap/ui'
import { useQueryClient } from '@tanstack/react-query'
import {
  type ReactElement,
  type ReactNode,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useSendAsset } from 'src/lib/perps/exchange/use-send-asset'
import { useAllPerpMetas } from 'src/lib/perps/info/use-all-perp-metas'
import { useClearinghouseState } from 'src/lib/perps/info/use-clearinghouse-state'
import { useSpotClearinghouseState } from 'src/lib/perps/info/use-spot-clearinghouse-state'
import { useSpotMeta } from 'src/lib/perps/info/use-spot-meta'
import { useUserAbstraction } from 'src/lib/perps/info/use-user-abstraction'
import { useAllDexClearinghouseState } from 'src/lib/perps/subscription/use-all-dex-clearinghouse-state'
import {
  type SubAccountTransferAsset,
  type SubAccountTransferDirection,
  getSubAccountTransferAmountError,
  getSubAccountTransferAssets,
  getSubAccountTransferRoute,
} from 'src/lib/perps/utils'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { useAccount } from 'src/lib/wallet'
import type { EvmAddress } from 'sushi/evm'
import { PerpsChecker } from '~evm/perps/_ui/perps-checker'

function getAssetLabel(asset: SubAccountTransferAsset): string {
  const market =
    asset.sourceDex === 'spot'
      ? 'Spot'
      : asset.sourceDex
        ? `${asset.sourceDex} Perps`
        : 'Perps'
  return `${asset.symbol} (${market})`
}

export function SubAccountTransferDialog({
  masterAddress,
  subAccount,
  trigger,
}: {
  masterAddress: EvmAddress
  subAccount: { subAccountUser: EvmAddress; name: string }
  trigger?: ReactNode
}): ReactElement {
  const [open, setOpen] = useState(false)
  const [direction, setDirection] =
    useState<SubAccountTransferDirection>('to-sub-account')
  const [selectedAssetId, setSelectedAssetId] = useState<string>()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitting = useRef(false)
  const amountId = useId()
  const address = useAccount('evm')
  const queryClient = useQueryClient()
  const { sendAssetAsync, isPending } = useSendAsset()
  const sourceAddress =
    direction === 'to-sub-account' ? masterAddress : subAccount.subAccountUser
  const spotQuery = useSpotClearinghouseState({
    address: open ? sourceAddress : undefined,
  })
  const allPerpsQuery = useAllDexClearinghouseState({
    address: open ? sourceAddress : undefined,
  })
  const abstractionQuery = useUserAbstraction({
    address: open ? sourceAddress : undefined,
  })
  const metaQuery = useSpotMeta()
  const perpMetaQuery = useAllPerpMetas()
  const assetResult = useMemo(() => {
    if (
      !spotQuery.data ||
      !allPerpsQuery.data ||
      !abstractionQuery.data ||
      !metaQuery.data ||
      !perpMetaQuery.data
    ) {
      return { assets: [] }
    }
    try {
      return {
        assets: getSubAccountTransferAssets(spotQuery.data, metaQuery.data, {
          clearinghouseStates: allPerpsQuery.data.clearinghouseStates,
          perpMetas: perpMetaQuery.data,
          abstraction: abstractionQuery.data,
        }),
      }
    } catch (error) {
      return {
        assets: [],
        error:
          error instanceof Error ? error.message : 'Unable to read balances.',
      }
    }
  }, [
    spotQuery.data,
    allPerpsQuery.data,
    abstractionQuery.data,
    metaQuery.data,
    perpMetaQuery.data,
  ])
  const asset = selectedAssetId
    ? assetResult.assets.find((asset) => asset.id === selectedAssetId)
    : assetResult.assets[0]
  const perpQuery = useClearinghouseState({
    address:
      open && asset && asset.sourceDex !== 'spot' ? sourceAddress : undefined,
    dex: asset?.sourceDex,
  })
  const amountError = getSubAccountTransferAmountError(amount, asset)
  const route = getSubAccountTransferRoute({
    masterAddress,
    subAccountAddress: subAccount.subAccountUser,
    direction,
    sourceDex: asset?.sourceDex,
  })
  const isLoading =
    spotQuery.isLoading ||
    allPerpsQuery.isLoading ||
    perpQuery.isLoading ||
    abstractionQuery.isLoading ||
    metaQuery.isLoading ||
    perpMetaQuery.isLoading
  const dataError =
    spotQuery.isError ||
    allPerpsQuery.isError ||
    perpQuery.isError ||
    abstractionQuery.isError ||
    metaQuery.isError ||
    perpMetaQuery.isError
      ? 'Unable to load available assets. Please retry.'
      : assetResult.error
  const isBusy = isSubmitting || isPending
  const isMasterWallet = address?.toLowerCase() === masterAddress.toLowerCase()
  const sourceName =
    direction === 'to-sub-account' ? 'Master Account' : subAccount.name
  const destinationName =
    direction === 'to-sub-account' ? subAccount.name : 'Master Account'

  function handleOpenChange(nextOpen: boolean): void {
    if (submitting.current || isPending) return
    if (nextOpen) {
      setDirection('to-sub-account')
      setSelectedAssetId(undefined)
      setAmount('')
      setError(undefined)
    }
    setOpen(nextOpen)
  }

  function switchDirection(): void {
    setDirection(
      direction === 'to-sub-account' ? 'to-master' : 'to-sub-account',
    )
    setSelectedAssetId(undefined)
    setAmount('')
    setError(undefined)
  }

  async function transfer(): Promise<void> {
    if (
      submitting.current ||
      isPending ||
      isLoading ||
      dataError ||
      !asset ||
      amountError
    ) {
      return
    }
    if (!isMasterWallet) {
      setError('Connect the master account wallet to transfer assets.')
      return
    }
    submitting.current = true
    setIsSubmitting(true)
    setError(undefined)
    try {
      // Recheck the source balance immediately before requesting a signature.
      const [latestSpot, latestPerp, latestAbstraction] = await Promise.all([
        spotQuery.refetch(),
        asset.sourceDex === 'spot' ? undefined : perpQuery.refetch(),
        abstractionQuery.refetch(),
      ])
      if (
        latestSpot.isError ||
        latestAbstraction.isError ||
        !latestSpot.data ||
        !latestAbstraction.data ||
        !metaQuery.data ||
        !perpMetaQuery.data ||
        (asset.sourceDex !== 'spot' &&
          (latestPerp?.isError || !latestPerp?.data))
      ) {
        throw new Error(
          'Unable to refresh the source account balance. Please retry.',
        )
      }
      const latestAsset = getSubAccountTransferAssets(
        latestSpot.data,
        metaQuery.data,
        {
          clearinghouseStates: latestPerp?.data
            ? [[asset.sourceDex, latestPerp.data]]
            : [],
          perpMetas: perpMetaQuery.data,
          abstraction: latestAbstraction.data,
        },
      ).find((entry) => entry.id === asset.id)
      const validationError = getSubAccountTransferAmountError(
        amount,
        latestAsset,
      )
      if (validationError) throw new Error(validationError)

      await sendAssetAsync({
        destination: route.destination,
        sourceDex: route.sourceDex,
        destinationDex: route.destinationDex,
        fromSubAccount: route.fromSubAccount,
        token: asset.token,
        decimals: asset.decimals,
        amount,
        expectedWalletAddress: masterAddress,
      })
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['useSubAccounts', masterAddress],
        }),
        ...[masterAddress, subAccount.subAccountUser].flatMap(
          (accountAddress) => [
            queryClient.invalidateQueries({
              queryKey: ['useSpotClearinghouseState', accountAddress],
            }),
            queryClient.invalidateQueries({
              queryKey: ['useClearinghouseState', accountAddress],
            }),
          ],
        ),
      ])
      setAmount('')
      setOpen(false)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to transfer assets.',
      )
    } finally {
      submitting.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <PerpsDialog open={open} onOpenChange={handleOpenChange}>
      <PerpsDialogTrigger asChild>
        {trigger ?? (
          <Button variant="perps-secondary" size="sm">
            Transfer
          </Button>
        )}
      </PerpsDialogTrigger>
      <PerpsDialogContent>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Transfer Assets</PerpsDialogTitle>
          <PerpsDialogDescription>
            Transfer assets between your master account and {subAccount.name}.
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void transfer()
            }}
          >
            <fieldset disabled={isBusy} className="flex min-w-0 flex-col gap-4">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="min-w-0 text-sm">
                  <p className="text-perps-muted-50">From</p>
                  <p className="truncate" title={sourceName}>
                    {sourceName}
                  </p>
                </div>
                <IconButton
                  type="button"
                  name="Reverse transfer direction"
                  variant="perps-secondary"
                  icon={ArrowsUpDownIcon}
                  iconProps={{ className: 'w-4 h-4 rotate-90' }}
                  className="!rounded-full"
                  disabled={isBusy}
                  onClick={switchDirection}
                />
                <div className="min-w-0 text-sm text-right">
                  <p className="text-perps-muted-50">To</p>
                  <p className="truncate" title={destinationName}>
                    {destinationName}
                  </p>
                </div>
              </div>
              <Select
                value={asset?.id ?? ''}
                disabled={
                  isBusy ||
                  isLoading ||
                  Boolean(dataError) ||
                  !assetResult.assets.length
                }
                onValueChange={(id) => {
                  setSelectedAssetId(id)
                  setAmount('')
                  setError(undefined)
                }}
              >
                <SelectTrigger
                  aria-label="Asset"
                  className="w-full !border-[#FFFFFF1A] !border bg-transparent"
                >
                  {isLoading
                    ? 'Loading assets...'
                    : asset
                      ? getAssetLabel(asset)
                      : 'No available assets'}
                </SelectTrigger>
                <SelectContent className="!bg-black/10">
                  {assetResult.assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {getAssetLabel(asset)} — {asset.balance}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={amountId}
                  className="text-sm text-perps-muted-50"
                >
                  Amount {asset?.symbol ? `(${asset.symbol})` : ''}
                </label>
                <div className="relative">
                  <TextField
                    id={amountId}
                    type="number"
                    inputMode="decimal"
                    variant="outline"
                    value={amount}
                    maxDecimals={asset?.decimals ?? 0}
                    onValueChange={(value) => {
                      setAmount(value)
                      setError(undefined)
                    }}
                    placeholder="0.0"
                    disabled={
                      isBusy || !asset || isLoading || Boolean(dataError)
                    }
                    className="!border-[#FFFFFF1A] !bg-transparent !pr-16"
                  />
                  <Button
                    type="button"
                    size="xs"
                    variant="perps-secondary"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    disabled={
                      isBusy || !asset || isLoading || Boolean(dataError)
                    }
                    onClick={() => {
                      if (asset) {
                        setAmount(asset.balance)
                        setError(undefined)
                      }
                    }}
                  >
                    Max{asset?.balance ? `: ${asset?.balance}` : ''}
                  </Button>
                </div>
              </div>
              {(error || dataError || (amount && amountError)) && (
                <p role="alert" className="text-sm text-perps-red break-words">
                  {error || dataError || amountError}
                </p>
              )}
              {dataError && (
                <Button
                  type="button"
                  size="sm"
                  variant="perps-secondary"
                  onClick={() => {
                    void spotQuery.refetch()
                    if (asset && asset.sourceDex !== 'spot') {
                      void perpQuery.refetch()
                    }
                    void abstractionQuery.refetch()
                    void metaQuery.refetch()
                    void perpMetaQuery.refetch()
                  }}
                >
                  Retry
                </Button>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="perps-secondary"
                  disabled={isBusy}
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <PerpsChecker.Legal size="default" variant="perps-tertiary">
                  <Checker.Connect
                    size="default"
                    variant="perps-tertiary"
                    namespace="evm"
                  >
                    <Button
                      type="submit"
                      variant="perps-tertiary"
                      loading={isBusy}
                      disabled={
                        isBusy ||
                        isLoading ||
                        Boolean(dataError) ||
                        Boolean(amountError) ||
                        !isMasterWallet
                      }
                    >
                      Confirm
                    </Button>
                  </Checker.Connect>
                </PerpsChecker.Legal>
              </div>
            </fieldset>
          </form>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
