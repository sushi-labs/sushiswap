import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import { useEvmTradeQuote } from 'src/lib/hooks/react-query'
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
  isRedSnwapperChainId,
} from 'sushi/evm'
import { useGasPrice } from 'wagmi'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { InputWithKeyboard } from '../../_common'
import { PerpsChecker } from '../../perps-checker'
import { type AnyTokenDepositOption, HYPEREVM_USDC } from './deposit-dialog'

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
    case EvmChainId.HYPEREVM:
      return HYPEREVM_USDC
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
  const [token, setToken] = useState<TokenToSwap | undefined>(undefined)
  const [swapAmount, setSwapAmount] = useState<string>('')
  const _amount = useMemo(
    () => (token ? Amount.tryFromHuman(token.currency, swapAmount) : undefined),
    [swapAmount, token],
  )
  const { data: gasPrice } = useGasPrice({ chainId: depositOption.chainId })

  const address = useAccount('evm')
  const { data: tradeQuote } = useEvmTradeQuote(
    !token?.currency
      ? undefined
      : {
          chainId: depositOption.chainId,
          fromToken: token.currency,
          toToken: toToken(depositOption.chainId),
          amount: _amount,
          slippagePercentage: SLIPPAGE.toString({ fixed: 2 }),
          gasPrice,
          recipient: address,
          enabled: Boolean(_amount?.gt(ZERO) && token?.currency),
          carbonOffset: false,
        },
  )
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
    }
  }, [token, currencies, depositOption.chainId])

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={token?.currency.id}
        onValueChange={(val: string) => {
          const option = currencies?.find((c) => c.currency.id === val)
          if (option) {
            setToken(option)
            setSwapAmount('')
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
      <InputWithKeyboard
        amount={swapAmount}
        setAmount={!token?.currency ? () => {} : setSwapAmount}
        balance={token?.balance}
        currency={token?.currency || USDC[EvmChainId.ARBITRUM]}
        error={undefined}
        isLoading={isMyTokensLoading}
        address={address}
      />
      <PerpsChecker.Legal size="default" variant="perps-tertiary">
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
                <Checker.ApproveERC20
                  id="approve-erc20"
                  amount={_amount}
                  contract={
                    isRedSnwapperChainId(depositOption.chainId)
                      ? RED_SNWAPPER_ADDRESS[depositOption.chainId]
                      : undefined
                  }
                >
                  <Button
                    variant="perps-tertiary"
                    size="default"
                    // disabled={
                    //   Number(amount) < MIN_DEPOSIT_AMOUNT || !sim?.request
                    // }
                    className="w-full"
                    onClick={() => {
                      setOpen(false)
                    }}
                    // loading={isPending}
                  >
                    Swap and Deposit
                  </Button>
                </Checker.ApproveERC20>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connect>
        </Checker.PartialRoute>
      </PerpsChecker.Legal>
    </div>
  )
}
