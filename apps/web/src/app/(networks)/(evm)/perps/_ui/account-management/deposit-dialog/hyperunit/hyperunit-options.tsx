import {
  ClipboardCheckIcon,
  ClipboardCopyIcon,
} from '@heroicons/react-v1/solid'
import { useCopyClipboard } from '@sushiswap/hooks'
import {
  Button,
  IconButton,
  LinkExternal,
  SkeletonBox,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import { useDepositAddress, useHUEstimateFees } from 'src/lib/perps'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { formatUSD } from 'sushi'
import { isEvmChainId } from 'sushi/evm'
import { isSvmChainId } from 'sushi/svm'
import { PerpsCard } from '../../../_common'
import type { HyperunitDepositOption } from '../deposit-dialog'
import { HyperunitTransferTypeWallet } from './hyperunit-transfer-type-wallet'
import { useHyperunitPrice } from './use-hyperunit-price'

const TRANSFER_TYPES = ['connected-wallet', 'send'] as const
type TransferType = (typeof TRANSFER_TYPES)[number]

export const HyperunitOptions = ({
  depositOption,
  setOpen,
}: {
  depositOption: HyperunitDepositOption
  setOpen: (open: boolean) => void
}) => {
  const [transferType, setTransferType] =
    useState<TransferType>('connected-wallet')
  const [isCopied, staticCopy] = useCopyClipboard()
  const { data: _estimateData, isLoading: isLoadingEstimates } =
    useHUEstimateFees()
  const { data: networkTokenPrice } = useHyperunitPrice(depositOption.chainName)

  const address = useAccount('evm')
  const { data: depositData, isLoading: isLoadingDepositData } =
    useDepositAddress({
      address,
      chainName: depositOption.chainName,
      token: depositOption.token,
    })

  const estimateData = useMemo(() => {
    if (isLoadingEstimates || !_estimateData) {
      return null
    }
    return _estimateData[depositOption.tokenType]
  }, [_estimateData, isLoadingEstimates, depositOption.tokenType])

  const eta = useMemo(
    () =>
      String(estimateData?.[`${depositOption.tokenType}-depositEta`])?.replace(
        'm',
        '',
      ),
    [estimateData, depositOption.tokenType],
  )
  const fee = useMemo(() => {
    const feeInUnits = Number(
      estimateData?.[`${depositOption.tokenType}-deposit-fee-in-units`] || 0,
    )
    return feeInUnits * (networkTokenPrice || 0)
  }, [estimateData, depositOption.tokenType, networkTokenPrice])

  const canUseConnectedWallet = useMemo(() => {
    if (typeof depositOption.chainId === 'string') return false
    return (
      isEvmChainId(depositOption.chainId) || isSvmChainId(depositOption.chainId)
    )
  }, [depositOption.chainId])

  useEffect(() => {
    if (!canUseConnectedWallet && transferType === 'connected-wallet') {
      setTransferType('send')
    }
  }, [canUseConnectedWallet, transferType])

  const DepositInfo = useMemo(() => {
    return (
      <p className="text-center text-xs text-perps-muted-50">
        Deposits should arrive after ~{eta || 'N/A'} minute
        {Number(eta) === 1 ? '' : 's'}. This service is provided by Unit, an
        independent third-party. Unit charges an estimated fee of{' '}
        {fee ? `~${formatUSD(fee)}` : '$1-$2'} depending on the{' '}
        <span className="capitalize">{depositOption.chainName} </span> network.
        Pending deposits will be shown after they are reflected by Unit&apos;s
        API. For support with your deposit, open a ticket with{' '}
        <LinkExternal href="https://app.hyperunit.xyz/support">
          Unit.
        </LinkExternal>
      </p>
    )
  }, [fee, eta, depositOption.chainName])

  return (
    <div className="flex flex-col gap-4 items-center">
      {canUseConnectedWallet ? (
        <PerpsCard
          className="flex items-center gap-1 hide-scrollbar overflow-x-auto p-0.5"
          rounded="full"
          fullWidth
        >
          {TRANSFER_TYPES.map((v) => (
            <Button
              key={v}
              size="xs"
              variant={v === transferType ? 'perps-secondary' : 'ghost'}
              onClick={() => setTransferType(v)}
              className={classNames(
                'w-full capitalize !text-xs !rounded-full  !border-0',
                v === transferType
                  ? 'text-white bg-accent'
                  : 'text-muted-foreground',
              )}
            >
              {v === 'connected-wallet'
                ? 'Use connected wallet'
                : `Send from another wallet`}
            </Button>
          ))}
        </PerpsCard>
      ) : null}

      {transferType === 'connected-wallet' && depositOption.asset ? (
        <HyperunitTransferTypeWallet
          depositOption={depositOption}
          depositAddress={depositData?.address}
          depositInfo={DepositInfo}
          setOpen={setOpen}
        />
      ) : (
        <>
          <img
            src={`https://app.hyperliquid.xyz/coins/${depositOption.value.toUpperCase()}.svg`}
            alt={depositOption.token}
            className={classNames(
              'rounded-full w-10 h-10',
              depositOption.value === 'eth' ? 'bg-white' : '',
            )}
          />
          {DepositInfo}
          {address ? (
            <PerpsCard className="p-2" fullWidth rounded="xl">
              <div className="gap-2 w-full flex items-center justify-center">
                {isLoadingDepositData ? (
                  <SkeletonBox className="md:!w-4/5 h-5" />
                ) : (
                  <div className="text-xs break-all">
                    {depositData?.address}
                  </div>
                )}
                <IconButton
                  name="share"
                  size="xs"
                  icon={isCopied ? ClipboardCheckIcon : ClipboardCopyIcon}
                  onClick={() => staticCopy(depositData?.address || '')}
                  variant="perps-tertiary"
                  className="rounded-xl !text-perps-muted-50"
                />
              </div>
            </PerpsCard>
          ) : null}
          <Checker.Connect
            size="default"
            variant="perps-tertiary"
            namespace="evm"
          >
            <Button
              variant="perps-tertiary"
              size="default"
              className="w-full"
              onClick={() => {
                setOpen(false)
              }}
            >
              Done
            </Button>
          </Checker.Connect>
          <p className="text-center text-xs text-red">
            IMPORTANT: There is a minimum deposit of {depositOption.minDeposit}{' '}
            {depositOption.token.toUpperCase()}. This address can only receive{' '}
            {depositOption.token.toUpperCase()} on the{' '}
            <span className="capitalize">{depositOption.chainName} </span>{' '}
            network. Any other asset (e.g., USDC, USDT) sent from{' '}
            <span className="capitalize">{depositOption.chainName} </span> will
            be lost. Deposits below {depositOption.minDeposit}{' '}
            {depositOption.token.toUpperCase()} will result in a loss of funds.
          </p>
        </>
      )}
    </div>
  )
}
