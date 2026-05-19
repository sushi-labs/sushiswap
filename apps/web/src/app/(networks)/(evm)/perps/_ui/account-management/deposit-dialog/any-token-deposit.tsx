import { createToast } from '@sushiswap/notifications'
import {
  Button,
  Currency,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SkeletonBox,
} from '@sushiswap/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  type UseEvmTradeReturn,
  useEvmTrade,
  useEvmTradeQuote,
} from 'src/lib/hooks/react-query'
import { useMyTokens } from 'src/lib/wagmi/components/token-selector/hooks/use-my-tokens'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import {
  Amount,
  type Fraction,
  Percent,
  ZERO,
  formatNumber,
  formatUSD,
  getNativeAddress,
} from 'sushi'
import {
  DEFAULT_SLIPPAGE,
  EvmChainId,
  type EvmCurrency,
  RED_SNWAPPER_ADDRESS,
  USDC,
  addGasMargin,
  isRedSnwapperChainId,
} from 'sushi/evm'
import { useGasPrice, useSendTransaction, useSimulateContract } from 'wagmi'
import { usePublicClient } from 'wagmi'
import { useWriteContract } from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { InputWithKeyboard } from '../../_common'
import { PerpsChecker } from '../../perps-checker'
import type { AnyTokenDepositOption } from './deposit-dialog'
import { getMinDepositAmount, getUSDCArgs } from './usdc-options'

type TokenToSwap = {
  currency: EvmCurrency<{
    approved: boolean
  }>
  balance: Amount<EvmCurrency> | undefined
  price: Fraction | undefined
  usd: string | undefined
}

const SLIPPAGE = new Percent({
  numerator: Math.floor(Number(DEFAULT_SLIPPAGE) * 100),
  denominator: 10_000,
})

const toToken = (chainId: AnyTokenDepositOption['chainId']) => {
  switch (chainId) {
    case EvmChainId.ARBITRUM:
      return USDC[EvmChainId.ARBITRUM]
    // case EvmChainId.HYPEREVM:
    //   return HYPEREVM_USDC
    default:
      return undefined
  }
}

export const AnyTokenDeposit = ({
  depositOption,
  setOpen,
}: {
  depositOption: AnyTokenDepositOption
  setOpen: (open: boolean) => void
}) => {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [token, setToken] = useState<TokenToSwap | undefined>(undefined)
  const [swapAmount, setSwapAmount] = useState<string>('')
  const _amount = useMemo(
    () =>
      token && token.currency.chainId === depositOption.chainId
        ? Amount.tryFromHuman(token.currency, swapAmount)
        : undefined,
    [swapAmount, token, depositOption.chainId],
  )
  const { data: gasPrice } = useGasPrice({ chainId: depositOption.chainId })
  const client = usePublicClient({ chainId: depositOption.chainId })
  const { mutateAsync: writeContractAsync, isPending: isWriteContractPending } =
    useWriteContract()
  const address = useAccount('evm')
  const tradeRef = useRef<UseEvmTradeReturn | null>(null)

  const tradeArgs = useMemo(() => {
    return {
      chainId: depositOption.chainId,
      fromToken: token?.currency,
      toToken: toToken(depositOption.chainId),
      amount: _amount,
      slippagePercentage: SLIPPAGE.toString({ fixed: 2 }),
      gasPrice,
      recipient: address,
      enabled: Boolean(_amount?.gt(ZERO) && token?.currency),
      carbonOffset: false,
    }
  }, [token, _amount, gasPrice, address, depositOption.chainId])

  const { data: tradeQuote, isLoading: isLoadingTradeQuote } = useEvmTradeQuote(
    !token?.currency ? undefined : tradeArgs,
  )
  const { data: tradeData, isLoading: isLoadingTrade } = useEvmTrade({
    ...tradeArgs,
    enabled: Boolean(
      tradeQuote?.status === 'Success' &&
        tradeQuote?.amountOut?.gt(ZERO) &&
        !isLoadingTradeQuote,
    ),
  })

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const { data: pricesMap } = usePrices({
    chainId: depositOption.chainId,
  })

  const { data: tokenData, isLoading: isMyTokensLoading } = useMyTokens({
    account: address,
    chainId: depositOption.chainId,
    includeNative: true,
  })

  const currencies = useMemo(() => {
    if (!tokenData) return []
    const balancesMap = tokenData.balanceMap
    return tokenData?.tokens
      ?.filter((i) => i.symbol?.toLowerCase() !== 'usdc')
      ?.map((currency) => {
        const balance = balancesMap?.get(
          currency.type === 'native'
            ? getNativeAddress(currency.chainId)
            : currency.address,
        )
        const price = pricesMap?.getFraction(currency.wrap().address)
        const usd = balance?.mul(price || 0n)?.toString({ fixed: 2 })
        return {
          currency,
          balance,
          price,
          usd,
        }
      })
  }, [tokenData, pricesMap])

  useEffect(() => {
    if (
      (!token || token.currency.chainId !== depositOption.chainId) &&
      currencies?.length
    ) {
      setToken(currencies[0])
      setSwapAmount('')
      setStep(0)
    }
  }, [token, currencies, depositOption.chainId])

  const { mutateAsync: sendTransactionAsync, isPending: isSwapPending } =
    useSendTransaction({
      mutation: {
        onMutate: () => {
          if (tradeRef && tradeData) {
            tradeRef.current = tradeData
          }
        },
      },
    })
  const swap = useCallback(async () => {
    if (
      !tradeData?.tx ||
      address?.toLowerCase() !== tradeData.tx.from.toLowerCase()
    ) {
      return undefined
    }
    try {
      const hash = await sendTransactionAsync({
        to: tradeData.tx.to,
        data: tradeData.tx.data,
        value: tradeData.tx.value,
        gas: tradeData.tx.gas
          ? addGasMargin(BigInt(tradeData.tx.gas))
          : undefined,
      })
      const promise = client.waitForTransactionReceipt({
        hash,
      })
      const ts = new Date().getTime()
      const trade = tradeRef.current
      void createToast({
        account: address,
        type: 'swap',
        chainId: depositOption.chainId,
        txHash: hash,
        promise,
        summary: {
          pending: `Swapping ${trade?.amountIn?.toSignificant(6)} ${
            token?.currency.symbol
          } for ${trade?.amountOut?.toSignificant(6)} ${
            trade?.amountOut?.currency.symbol
          }`,
          completed: `Swapped ${trade?.amountIn?.toSignificant(6)} ${
            trade?.amountIn?.currency.symbol
          } for ${trade?.amountOut?.toSignificant(6)} ${
            trade?.amountOut?.currency.symbol
          }`,
          failed: `Something went wrong when trying to swap ${trade?.amountIn?.currency.symbol} for ${trade?.amountOut?.currency.symbol}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
        variant: 'perps',
      })
      const receipt = await promise
      console.log(receipt)
      if (receipt.status === 'success') {
        refetchBalances(depositOption.chainId)
        setStep(1)
      }
    } catch (e) {
      console.error(e)
    } finally {
      refetchBalances(depositOption.chainId)
    }
  }, [
    tradeData,
    sendTransactionAsync,
    client,
    address,
    token?.currency.symbol,
    refetchBalances,
    depositOption.chainId,
  ])

  const depositArgs = useMemo(() => {
    if (!tradeRef.current?.minAmountOut || step === 0) return undefined
    return getUSDCArgs({
      chainId: depositOption.chainId,
      amount: tradeRef.current.minAmountOut.amount,
    })
  }, [depositOption.chainId, step])

  const { data: sim } = useSimulateContract({
    abi: depositArgs?.abi,
    chainId: depositArgs?.chainId,
    functionName: depositArgs?.functionName,
    args: depositArgs?.args,
    address: depositArgs?.address,
    query: {
      enabled: Boolean(depositArgs),
    },
  })

  const transferUsdc = useCallback(async () => {
    if (!sim?.request || !tradeRef.current?.minAmountOut) return
    try {
      const hash = await writeContractAsync(sim.request)
      const promise = client.waitForTransactionReceipt({
        hash,
      })
      const ts = new Date().getTime()
      const usdc = tradeRef.current?.minAmountOut.currency
      void createToast({
        account: address,
        type: 'send',
        chainId: usdc?.chainId,
        txHash: hash,
        promise,
        summary: {
          pending: `Depositing ${tradeRef.current.minAmountOut?.toSignificant(6)} ${usdc.symbol}`,
          completed: `Deposited ${tradeRef.current.minAmountOut?.toSignificant(6)} ${usdc.symbol}. Balances will update shortly.`,
          failed: `Something went wrong depositing ${tradeRef.current.minAmountOut?.toSignificant(6)} ${
            usdc.symbol
          }`,
        },
        timestamp: ts,
        groupTimestamp: ts,
        variant: 'perps',
      })
      setStep(2)
      const res = await promise
      if (res.status === 'success') {
        refetchBalances(depositOption.chainId)
        setOpen(false)
        setSwapAmount('')
        setStep(0)
      }
    } catch (error) {
      console.log(error)
    }
  }, [
    sim,
    writeContractAsync,
    depositOption,
    refetchBalances,
    client,
    address,
    setOpen,
  ])

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={token?.currency.id}
        onValueChange={(val: string) => {
          const option = currencies?.find((c) => c.currency.id === val)
          if (option) {
            setToken(option)
            setSwapAmount('')
            setStep(0)
          }
        }}
      >
        <SelectTrigger className="w-full text-sm !px-2 !h-[40px] !gap-1 !border-[#FFFFFF1A] bg-transparent !border">
          {token ? (
            <div>
              {token.currency.name} ({token.currency.symbol})
            </div>
          ) : (
            'Select a Token'
          )}
        </SelectTrigger>
        <SelectContent className="w-full !bg-black/10">
          {currencies?.map((i, idx) => (
            <SelectItem
              key={`${i.currency.id}-${idx}`}
              value={i.currency.id}
              className="font-medium !text-white gap-4 !block"
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  {i.currency.name} ({i.currency.symbol})
                </div>
                <div>
                  {formatUSD(i?.usd || '0')} (
                  {formatNumber(i.balance?.toSignificant(6) || '0')})
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-perps-muted-70">Step 1 (Swap)</p>

          <div className="h-1 w-full overflow-hidden rounded-full bg-perps-muted-20">
            <motion.div
              className="h-full w-full origin-left rounded-full bg-perps-blue"
              initial={false}
              animate={{ scaleX: step > 0 ? 1 : 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-perps-muted-70">Step 2 (Deposit)</p>

          <div className="h-1 w-full overflow-hidden rounded-full bg-perps-muted-20">
            <motion.div
              className="h-full w-full origin-left rounded-full bg-perps-blue"
              initial={false}
              animate={{ scaleX: step > 1 ? 1 : 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="swap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <InputWithKeyboard
              amount={swapAmount}
              setAmount={!token?.currency ? () => {} : setSwapAmount}
              balance={token?.balance}
              currency={
                token?.currency ||
                (toToken(depositOption.chainId) as EvmCurrency)
              }
              error={undefined}
              isLoading={isMyTokensLoading}
              address={address}
            />
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex flex-col my-4 items-center"
          >
            <Currency.Icon
              disableLink
              currency={
                token?.currency ||
                (toToken(depositOption.chainId) as EvmCurrency)
              }
              width={28}
              height={28}
            />
            <p className="font-medium">Swap Successful</p>
            <p className="text-perps-muted-50 text-sm">
              Continue to Deposit USDC into your Perps Account
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col gap-1">
        <StatItem
          label="Max. Received"
          value={`${tradeQuote?.amountOut?.toSignificant(6) || '0.00'} ${toToken(depositOption.chainId)?.symbol || ''}`}
          isLoading={isLoadingTradeQuote}
        />
        <StatItem
          label="Min. Received"
          value={`${tradeQuote?.minAmountOut?.toSignificant(6) || '0.00'} ${toToken(depositOption.chainId)?.symbol || ''}`}
          isLoading={isLoadingTradeQuote}
        />
      </div>
      <PerpsChecker.Legal size="default" variant="perps-tertiary">
        {step === 0 ? (
          <Checker.PartialRoute
            size="default"
            variant="perps-tertiary"
            trade={tradeQuote}
            setSwapAmount={setSwapAmount}
          >
            <Checker.Connect
              size="default"
              variant="perps-tertiary"
              namespace="evm"
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
                      // depositOption.chainId === EvmChainId.HYPEREVM ||
                      Number(tradeQuote?.amountOut?.toString()) >=
                        getMinDepositAmount(depositOption.chainId),
                    )}
                    buttonText={`Minimum Deposit is ${getMinDepositAmount(depositOption.chainId)} USDC`}
                    variant="perps-tertiary"
                    onClick={() => {}}
                    disabled={
                      !tradeQuote ||
                      Number(tradeQuote?.amountOut?.toString()) <
                        getMinDepositAmount(depositOption.chainId)
                    }
                  >
                    <Checker.ApproveERC20
                      size="default"
                      id="approve-erc20"
                      variant="perps-tertiary"
                      amount={_amount}
                      contract={
                        isRedSnwapperChainId(depositOption.chainId)
                          ? RED_SNWAPPER_ADDRESS[depositOption.chainId]
                          : undefined
                      }
                    >
                      <Checker.Success tag="approve-erc20">
                        <Button
                          variant="perps-tertiary"
                          size="default"
                          disabled={!tradeData}
                          className="w-full"
                          onClick={swap}
                          loading={isSwapPending || isLoadingTrade}
                        >
                          Swap
                        </Button>
                      </Checker.Success>
                    </Checker.ApproveERC20>
                  </Checker.Custom>
                </Checker.Amounts>
              </Checker.Network>
            </Checker.Connect>
          </Checker.PartialRoute>
        ) : (
          // <Checker.ApproveERC20
          //   size="default"
          //   amount={tradeRef.current?.amountOut}
          //   variant="perps-tertiary"
          //   contract={depositOption.depositBridge}
          //   id={`${depositOption.chainId}-approve-deposit-${depositOption.depositBridge}`}
          //   enabled={depositOption.chainId === EvmChainId.HYPEREVM}
          // >
          //   <Checker.Success
          //     tag={`${depositOption.chainId}-approve-deposit-${depositOption.depositBridge}`}
          //   >
          <Button
            variant="perps-tertiary"
            size="default"
            disabled={!sim?.request}
            className="w-full"
            onClick={transferUsdc}
            loading={isWriteContractPending}
          >
            Deposit
          </Button>
          //   </Checker.Success>
          // </Checker.ApproveERC20>
        )}
      </PerpsChecker.Legal>
      <p className="text-xs text-perps-muted-50 text-center italic">
        USDC received greater than the quoted minimum received amount will
        remain as USDC in your wallet.
      </p>
    </div>
  )
}

const StatItem = ({
  label,
  value,
  isLoading,
}: {
  label: string
  value: string
  isLoading: boolean
}) => {
  return (
    <div className="flex justify-between items-center gap-2 text-xs">
      <span className="text-perps-muted-50">{label}</span>
      <span className="font-semibold text-perps-muted text-right">
        {isLoading ? <SkeletonBox className="h-4 py-0.5 w-[100px]" /> : value}
      </span>
    </div>
  )
}
