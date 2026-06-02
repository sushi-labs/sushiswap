import {
  ClipboardCheckIcon,
  ClipboardCopyIcon,
} from '@heroicons/react-v1/solid'
import { useCopyClipboard } from '@sushiswap/hooks'
import {
  Button,
  IconButton,
  LinkExternal,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import { useDepositAddress, useHUEstimateFees } from 'src/lib/perps'
import { useMyTokens } from 'src/lib/wagmi/components/token-selector/hooks/use-my-tokens'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount, formatUSD, getNativeAddress } from 'sushi'
import {
  type EvmAddress,
  EvmChainId,
  EvmToken,
  WBTC,
  WETH9,
  isEvmChainId,
} from 'sushi/evm'
import {
  SvmChainId,
  type SvmToken,
  WSOL,
  isSvmChainId,
  svmNativeAddress,
} from 'sushi/svm'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { InputWithKeyboard, PerpsCard } from '../../_common'
import { PerpsChecker } from '../../perps-checker'
import type { HyperunitDepositOption } from './deposit-dialog'
import {
  EvmNativeSendButton,
  EvmTokenSendButton,
  SvmNativeSendButton,
  SvmTokenSendButton,
} from './hyperunit-send-buttons'

const ChainToToken = {
  bitcoin: WBTC[EvmChainId.ETHEREUM],
  ethereum: WETH9[EvmChainId.ETHEREUM],
  avalanche: new EvmToken({
    chainId: EvmChainId.AVALANCHE,
    address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    decimals: 18,
    symbol: 'WAVAX',
    name: 'Wrapped AVAX',
  }),
  solana: WSOL[SvmChainId.SOLANA],
  monad: new EvmToken({
    chainId: EvmChainId.MONAD,
    address: '0x3bd359c1119da7da1d913d1c4d2b7c461115433a',
    decimals: 18,
    symbol: 'WMONAD',
    name: 'Wrapped MONAD',
  }),
  base: WETH9[EvmChainId.ETHEREUM],
  plasma: new EvmToken({
    chainId: EvmChainId.PLASMA,
    address: '0x6100e367285b01f48d07953803a2d8dca5d19873',
    decimals: 18,
    symbol: 'WPLASMA',
    name: 'Wrapped PLASMA',
  }),
  zcash: new EvmToken({
    chainId: EvmChainId.ETHEREUM,
    address: '0x4A64515E5E1d1073e83f30cB97BEd20400b66E10',
    decimals: 18,
    symbol: 'ZEC',
    name: 'Zcash',
  }),
}

const TRANSFER_TYPES = ['connected-wallet', 'send'] as const
type TransferType = (typeof TRANSFER_TYPES)[number]

export const HyperunitOptions = ({
  depositOption,
  setOpen,
}: {
  depositOption: HyperunitDepositOption
  setOpen: (open: boolean) => void
}) => {
  const [swapAmount, setSwapAmount] = useState<string>('')
  const [transferType, setTransferType] =
    useState<TransferType>('connected-wallet')
  const [isCopied, staticCopy] = useCopyClipboard()
  const { data: _estimateData, isLoading: isLoadingEstimates } =
    useHUEstimateFees()
  const { data: networkTokenPrice } = usePrice({
    chainId: ChainToToken[depositOption.chainName].chainId,
    address: ChainToToken[depositOption.chainName].address,
  })
  const address = useAccount('evm')
  const svmAddress = useAccount('svm')
  const { data: depositData, isLoading: isLoadingDepositData } =
    useDepositAddress({
      address,
      chainName: depositOption.chainName,
      token: depositOption.token,
    })

  const { data: myTokenData, isLoading: isMyTokensLoading } = useMyTokens({
    account:
      typeof depositOption.chainId === 'string'
        ? undefined
        : isEvmChainId(depositOption.chainId)
          ? address
          : svmAddress,
    chainId:
      typeof depositOption.chainId === 'string'
        ? undefined
        : depositOption.chainId,
    includeNative: true,
  })

  const tokenBalance = useMemo(() => {
    if (!myTokenData) return undefined
    if (!depositOption.asset) return undefined
    const balancesMap = myTokenData.balanceMap
    const currency = depositOption.asset

    //type error if not done this way for native
    const nativeAdress = isEvmChainId(depositOption.chainId)
      ? getNativeAddress(depositOption.chainId)
      : svmNativeAddress

    const balance = balancesMap?.get(
      currency.type === 'native' ? nativeAdress : currency.address,
    )
    return balance
  }, [myTokenData, depositOption.asset, depositOption.chainId])

  const _amount = useMemo(() => {
    const token = depositOption.asset
    if (!token) return undefined
    return Amount.tryFromHuman(token, swapAmount)
  }, [swapAmount, depositOption.asset])

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: clear input on asset change
  useEffect(() => {
    setSwapAmount('')
  }, [depositOption?.asset?.id])

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

  // The actual send action is delegated to a per-(namespace, asset-type) leaf
  // component so that the heavy wagmi mutate generics are never co-resolved in
  // a single closure (see hyperunit-send-buttons.tsx).
  const sendButton = useMemo(() => {
    const asset = depositOption.asset
    const depositAddress = depositData?.address
    if (!asset || !_amount?.amount || !depositAddress) {
      return (
        <Button
          variant="perps-tertiary"
          size="default"
          className="w-full"
          disabled
        >
          Send
        </Button>
      )
    }

    const amount = _amount.amount
    const amountText = _amount.toSignificant(6)

    if (asset.type === 'native') {
      if (isEvmChainId(asset.chainId)) {
        return (
          <EvmNativeSendButton
            chainId={asset.chainId}
            symbol={asset.symbol}
            amount={amount}
            amountText={amountText}
            depositAddress={depositAddress}
            setOpen={setOpen}
          />
        )
      }
      return (
        <SvmNativeSendButton
          amount={amount}
          amountText={amountText}
          depositAddress={depositAddress}
          setOpen={setOpen}
        />
      )
    }

    if (isEvmChainId(asset.chainId)) {
      return (
        <EvmTokenSendButton
          chainId={asset.chainId}
          tokenAddress={asset.address as EvmAddress}
          symbol={asset.symbol}
          amount={amount}
          amountText={amountText}
          depositAddress={depositAddress}
          setOpen={setOpen}
        />
      )
    }
    return (
      <SvmTokenSendButton
        token={asset as SvmToken}
        amount={amount}
        amountText={amountText}
        depositAddress={depositAddress}
        setOpen={setOpen}
      />
    )
  }, [depositOption.asset, depositData?.address, _amount, setOpen])

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
        <>
          <InputWithKeyboard
            amount={swapAmount}
            setAmount={setSwapAmount}
            balance={tokenBalance}
            currency={depositOption.asset}
            error={undefined}
            isLoading={isMyTokensLoading}
            address={address}
          />
          {DepositInfo}
          <PerpsChecker.Legal size="default" variant="perps-tertiary">
            <Checker.Connect
              size="default"
              variant="perps-tertiary"
              namespace={isEvmChainId(depositOption.chainId) ? 'evm' : 'svm'}
            >
              <Checker.Network
                size="default"
                chainId={depositOption.chainId}
                variant="perps-tertiary"
              >
                <Checker.Amounts
                  size="default"
                  chainId={depositOption.chainId}
                  amount={_amount}
                  variant="perps-tertiary"
                >
                  <Checker.Custom
                    size="default"
                    showChildren={Boolean(
                      _amount?.gte(
                        Amount.fromHuman(
                          depositOption.asset,
                          depositOption.minDeposit,
                        ),
                      ),
                    )}
                    buttonText={`Minimum Deposit is ${depositOption.minDeposit} ${depositOption.token.toUpperCase()}`}
                    variant="perps-tertiary"
                    onClick={() => {}}
                    disabled={_amount?.lt(
                      Amount.fromHuman(
                        depositOption.asset,
                        depositOption.minDeposit,
                      ),
                    )}
                  >
                    {sendButton}
                  </Checker.Custom>
                </Checker.Amounts>
              </Checker.Network>
            </Checker.Connect>
          </PerpsChecker.Legal>
        </>
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
              <div className=" gap-2 w-full flex items-center justify-center">
                {isLoadingDepositData ? (
                  <SkeletonText className="w-full" />
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
