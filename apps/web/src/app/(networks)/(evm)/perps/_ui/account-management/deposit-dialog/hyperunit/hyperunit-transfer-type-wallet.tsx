import type { TokenListChainId } from '@sushiswap/graph-client/data-api'
import { Button } from '@sushiswap/ui'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { useMyTokens } from 'src/lib/wagmi/components/token-selector/hooks/use-my-tokens'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { getNamespaceForChainId } from 'src/lib/wallet/namespaces/namespace-for-chain-id'
import { Amount, getNativeAddress } from 'sushi'
import { type EvmChainId, isEvmChainId } from 'sushi/evm'
import type { SvmChainId } from 'sushi/svm'
import { InputWithKeyboard } from '../../../_common'
import { PerpsChecker } from '../../../perps-checker'
import type { HyperunitDepositOption } from '../deposit-dialog'
import {
  EvmNativeSendButton,
  EvmTokenSendButton,
  SvmNativeSendButton,
  SvmTokenSendButton,
} from './hyperunit-send-buttons'

type HyperunitTokenListChainId = Extract<
  TokenListChainId,
  EvmChainId | SvmChainId
>

type DepositOption<TChainId extends HyperunitTokenListChainId> = Omit<
  HyperunitDepositOption,
  'chainId' | 'asset'
> & { chainId: TChainId; asset: CurrencyFor<TChainId> }

export function HyperunitTransferTypeWallet<
  TChainId extends HyperunitTokenListChainId,
>({
  depositOption,
  depositAddress,
  depositInfo,
  setOpen,
}: {
  depositOption: DepositOption<TChainId>
  depositAddress: AddressFor<TChainId> | undefined
  depositInfo: ReactNode
  setOpen: (open: boolean) => void
}) {
  const [swapAmount, setSwapAmount] = useState<string>('')

  const address = useAccount(depositOption.chainId)

  const { data: myTokenData, isLoading: isMyTokensLoading } = useMyTokens({
    account: address,
    chainId: depositOption.chainId,
    includeNative: true,
  })

  const tokenBalance = useMemo(() => {
    if (!myTokenData) return undefined
    if (!depositOption.asset) return undefined
    const balancesMap = myTokenData.balanceMap
    const currency = depositOption.asset

    const nativeAdress = getNativeAddress(depositOption.chainId)

    const balance = balancesMap?.get(
      currency.type === 'native'
        ? nativeAdress
        : (currency.address as AddressFor<TChainId>),
    )
    return balance
  }, [myTokenData, depositOption.asset, depositOption.chainId])

  useEffect(() => {
    if (depositOption.asset.id) {
      setSwapAmount('')
    }
  }, [depositOption?.asset?.id])

  const _amount = useMemo(() => {
    const token = depositOption.asset
    if (!token) return undefined
    return Amount.tryFromHuman(token, swapAmount)
  }, [swapAmount, depositOption.asset])

  // The actual send action is delegated to a per-(namespace, asset-type) leaf
  // component so that the heavy wagmi mutate generics are never co-resolved in
  // a single closure (see hyperunit-send-buttons.tsx).
  const sendButton = useMemo(() => {
    const asset = depositOption.asset
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
            depositAddress={depositAddress as AddressFor<typeof asset.chainId>}
            setOpen={setOpen}
          />
        )
      }
      return (
        <SvmNativeSendButton
          amount={amount}
          amountText={amountText}
          depositAddress={depositAddress as AddressFor<typeof asset.chainId>}
          setOpen={setOpen}
        />
      )
    }

    if (isEvmChainId(asset.chainId)) {
      return (
        <EvmTokenSendButton
          chainId={asset.chainId}
          tokenAddress={asset.address as AddressFor<typeof asset.chainId>}
          symbol={asset.symbol}
          amount={amount}
          amountText={amountText}
          depositAddress={depositAddress as AddressFor<typeof asset.chainId>}
          setOpen={setOpen}
        />
      )
    }
    return (
      <SvmTokenSendButton
        token={asset as TokenFor<typeof asset.chainId>}
        amount={amount}
        amountText={amountText}
        depositAddress={depositAddress as AddressFor<typeof asset.chainId>}
        setOpen={setOpen}
      />
    )
  }, [depositOption.asset, depositAddress, _amount, setOpen])

  if (!depositOption.asset) return null

  return (
    <>
      <InputWithKeyboard
        amount={swapAmount}
        setAmount={setSwapAmount}
        balance={tokenBalance}
        currency={depositOption.asset}
        isLoading={isMyTokensLoading}
        address={address}
      />
      {depositInfo}
      <PerpsChecker.Legal size="default" variant="perps-tertiary">
        <Checker.Connect
          size="default"
          variant="perps-tertiary"
          namespace={getNamespaceForChainId(depositOption.chainId)}
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
  )
}
