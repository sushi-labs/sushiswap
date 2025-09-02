import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  Button,
  DialogClose,
  DialogTitle,
  IconButton,
  SkeletonBox,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { Amounts } from 'src/lib/wagmi/systems/Checker/Amounts'
import { Custom } from 'src/lib/wagmi/systems/Checker/Custom'
import { Guard } from 'src/lib/wagmi/systems/Checker/Guard'
import { Network } from 'src/lib/wagmi/systems/Checker/Network'
import { TransferERC20 } from 'src/lib/wagmi/systems/Checker/TransferERC20'
import type { EvmChainId } from 'sushi'
import { Amount } from 'sushi/currency'
import { Native } from 'sushi/currency'
import { Decimal } from 'sushi/math'
import { isAddress } from 'viem'
import { formatUnits } from 'viem'
import { useAccount, useEstimateGas, useGasPrice, usePublicClient } from 'wagmi'
import { useAmountBalances } from '~evm/_common/ui/balance-provider/use-balances'
import { RecentRecipients } from './recent-recipients'
import { RecipientInput } from './recipient-input'
import { SendTokenInput } from './send-token-input'
import { useSendTokens } from './send-token-provider'
import { VerifyContact } from './verify-contact'

export const SendView = () => {
  const { state, mutate } = useSendTokens()
  const {
    data: gasEst,
    isLoading: isGasEstLoading,
    isFetching: isGasEstFetching,
  } = useEstimateGas({
    chainId: state.token0?.chainId,
    query: {
      refetchInterval: 10000,
    },
  })

  const {
    data: gasPrice,
    isLoading: isGasPriceLoading,
    isFetching: isGasPriceFetching,
  } = useGasPrice({
    chainId: state.token0?.chainId,
    query: {
      refetchInterval: 10000,
    },
  })
  const isLoading =
    isGasEstLoading ||
    isGasPriceLoading ||
    isGasEstFetching ||
    isGasPriceFetching

  const nativeToken = Native.onChain(state.token0?.chainId as EvmChainId)

  const isRecipientValid = useMemo(() => {
    if (!state.recipientAddress) return false

    return isAddress(state.recipientAddress)
  }, [state.recipientAddress])

  const amounts = useMemo(() => {
    if (!state.token0) return []
    if (!state.amount || Number.isNaN(Number(state.amount))) return []

    return [
      Amount.fromRawAmount(
        state.token0,
        BigInt(
          new Decimal(state.amount).mul(10 ** state.token0.decimals).toFixed(0),
        ),
      ),
    ]
  }, [state.token0, state.amount])

  const formattedGasCost = useMemo(() => {
    if (!gasEst || !gasPrice) return null

    const totalCostWei = gasEst * gasPrice

    return {
      raw: totalCostWei,
      formatted: formatUnits(totalCostWei, nativeToken.decimals),
    }
  }, [gasEst, gasPrice, nativeToken.decimals])

  const [gasCostUsd] = useTokenAmountDollarValues({
    chainId: state.token0?.chainId as EvmChainId,
    amounts: formattedGasCost?.raw
      ? [Amount.fromRawAmount(nativeToken, formattedGasCost.raw)]
      : [],
  })

  return (
    <>
      <div className="flex justify-between items-center">
        <DialogTitle className="!font-medium !text-[20px] !text-slate-900 dark:!text-slate-100">
          Send
        </DialogTitle>
        <DialogClose>
          <IconButton variant={'ghost'} icon={XMarkIcon} name="Close" />
        </DialogClose>
      </div>
      <div>
        <div className="flex flex-col gap-3">
          <SendTokenInput />
          <RecipientInput isRecipientValid={isRecipientValid} />
          <VerifyContact address={state.recipientAddress} />
        </div>
      </div>
      <RecentRecipients />
      {/* <Button
        size="xl"
        variant={
          !isRecipientValid && state.recipientAddress
            ? 'destructive'
            : 'default'
        }
        disabled={
          !state.token0 ||
          !state.amount ||
          !state.recipientAddress ||
          state.amount === '0' ||
          !isRecipientValid
        }
      >
        {buttonText}
      </Button> */}
      <Network chainId={state.token0?.chainId}>
        <Amounts amounts={amounts} chainId={state.token0?.chainId}>
          <Guard
            guardText="Enter Amount"
            guardWhen={!state.amount}
            variant="default"
          >
            <Guard
              guardText="Enter Recipient"
              guardWhen={!state.recipientAddress}
              variant="default"
            >
              <Guard
                guardText="Invalid recipient"
                guardWhen={!isRecipientValid}
                variant="destructive"
              >
                <TransferERC20
                  size="xl"
                  id="send-button"
                  amount={amounts[0]}
                  sendTo={state.recipientAddress as `0x${string}`}
                  enabled={true}
                  onSuccess={() => {
                    mutate.setAmount(undefined)
                    mutate.setRecipientAddress('')
                  }}
                />
              </Guard>
            </Guard>
          </Guard>
        </Amounts>
      </Network>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Network fee</span>
          <div className="flex gap-0.5 items-center">
            {gasCostUsd && formattedGasCost && !isLoading ? (
              <>
                <span>(~${gasCostUsd.toFixed(2)})</span>
                <span className="font-medium">
                  {formattedGasCost.formatted} {nativeToken.symbol}
                </span>
              </>
            ) : (
              <SkeletonBox className="h-4 py-0.5 w-[240px]" />
            )}
          </div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Estimated Time</span>
          <div className="flex gap-0.5">
            <span className="font-medium">5 seconds</span>
          </div>
        </div>
      </div>
    </>
  )
}
