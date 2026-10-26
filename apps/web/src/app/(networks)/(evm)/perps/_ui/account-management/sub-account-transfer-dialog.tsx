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
import { useSpotClearinghouseState } from 'src/lib/perps/info/use-spot-clearinghouse-state'
import { useSpotMeta } from 'src/lib/perps/info/use-spot-meta'
import {
  type SubAccountTransferDirection,
  getSubAccountTransferAmountError,
  getSubAccountTransferAssets,
  getSubAccountTransferRoute,
} from 'src/lib/perps/utils'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { useAccount } from 'src/lib/wallet'
import type { EvmAddress } from 'sushi/evm'
import { PerpsChecker } from '~evm/perps/_ui/perps-checker'

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
  const [selectedToken, setSelectedToken] = useState<string>()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitting = useRef(false)
  const amountId = useId()
  const address = useAccount('evm')
  const queryClient = useQueryClient()
  const { sendAssetAsync, isPending } = useSendAsset()
  const route = getSubAccountTransferRoute({
    masterAddress,
    subAccountAddress: subAccount.subAccountUser,
    direction,
  })
  const spotQuery = useSpotClearinghouseState({
    address: open ? route.sourceAddress : undefined,
  })
  const metaQuery = useSpotMeta()
  const assetResult = useMemo(() => {
    if (!spotQuery.data || !metaQuery.data) return { assets: [] }
    try {
      return {
        assets: getSubAccountTransferAssets(spotQuery.data, metaQuery.data),
      }
    } catch (error) {
      return {
        assets: [],
        error:
          error instanceof Error ? error.message : 'Unable to read balances.',
      }
    }
  }, [spotQuery.data, metaQuery.data])
  const asset = selectedToken
    ? assetResult.assets.find((asset) => asset.token === selectedToken)
    : assetResult.assets[0]
  const amountError = getSubAccountTransferAmountError(amount, asset)
  const isLoading = spotQuery.isLoading || metaQuery.isLoading
  const dataError =
    spotQuery.isError || metaQuery.isError
      ? 'Unable to load available spot assets. Please retry.'
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
      setSelectedToken(undefined)
      setAmount('')
      setError(undefined)
    }
    setOpen(nextOpen)
  }

  function switchDirection(): void {
    setDirection(
      direction === 'to-sub-account' ? 'to-master' : 'to-sub-account',
    )
    setSelectedToken(undefined)
    setAmount('')
    setError(undefined)
  }

  async function transfer(): Promise<void> {
    if (submitting.current || isPending || !asset || amountError) return
    if (!isMasterWallet) {
      setError('Connect the master account wallet to transfer assets.')
      return
    }
    submitting.current = true
    setIsSubmitting(true)
    setError(undefined)
    try {
      // Recheck the source balance immediately before requesting a signature.
      const latest = await spotQuery.refetch()
      if (latest.isError || !latest.data || !metaQuery.data) {
        throw new Error(
          'Unable to refresh the source account balance. Please retry.',
        )
      }
      const latestAsset = getSubAccountTransferAssets(
        latest.data,
        metaQuery.data,
      ).find((entry) => entry.token === asset.token)
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
        ...[masterAddress, subAccount.subAccountUser].map((accountAddress) =>
          queryClient.invalidateQueries({
            queryKey: ['useSpotClearinghouseState', accountAddress],
          }),
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
            Transfer spot assets between your master account and{' '}
            {subAccount.name}.
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
                value={asset?.token ?? ''}
                disabled={
                  isBusy ||
                  isLoading ||
                  Boolean(dataError) ||
                  !assetResult.assets.length
                }
                onValueChange={(token) => {
                  setSelectedToken(token)
                  setAmount('')
                  setError(undefined)
                }}
              >
                <SelectTrigger
                  aria-label="Spot asset"
                  className="w-full !border-[#FFFFFF1A] !border bg-transparent"
                >
                  {isLoading
                    ? 'Loading assets...'
                    : (asset?.symbol ?? 'No available spot assets')}
                </SelectTrigger>
                <SelectContent>
                  {assetResult.assets.map((asset) => (
                    <SelectItem key={asset.token} value={asset.token}>
                      {asset.symbol} — {asset.balance}
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
                    void metaQuery.refetch()
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
