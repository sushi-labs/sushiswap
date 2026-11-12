'use client'

import {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react'
import { useBarData } from 'src/lib/stake'
import { Amount, Price } from 'sushi'
import {
  EvmChainId,
  type EvmCurrency,
  SUSHI,
  SUSHI_ADDRESS,
  XSUSHI,
  XSUSHI_ADDRESS,
} from 'sushi/evm'
import { erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'

interface SushiBarContext {
  totalSupply: Amount<EvmCurrency> | undefined
  sushiBalance: Amount<EvmCurrency> | undefined
  apy: number | undefined
  isLoading: boolean
  isError: boolean
  pricePer: string
  pricePerInverted: string
  isPricesLoading: boolean
}

const Context = createContext<SushiBarContext | undefined>(undefined)

export const SushiBarProvider: FC<{
  children: ReactNode
  watch?: boolean
}> = ({ children }) => {
  const {
    data,
    isLoading: isLoadingBarData,
    isError: isErrorBarData,
  } = useBarData()
  const { data: prices, isLoading: isPricesLoading } = usePrices({
    chainId: EvmChainId.ETHEREUM,
  })

  const {
    data: balanceAndSupplyData,
    isLoading: isLoadingSushiBalanceData,
    isError: isErrorSushiBalanceData,
  } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: SUSHI_ADDRESS[EvmChainId.ETHEREUM],
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [XSUSHI_ADDRESS[EvmChainId.ETHEREUM]],
        chainId: EvmChainId.ETHEREUM,
      },
      {
        address: XSUSHI_ADDRESS[EvmChainId.ETHEREUM],
        chainId: EvmChainId.ETHEREUM,
        abi: erc20Abi,
        functionName: 'totalSupply' as const,
      },
    ],
    query: {
      select(data) {
        return [
          new Amount(SUSHI[EvmChainId.ETHEREUM], data[0]),
          new Amount(XSUSHI[EvmChainId.ETHEREUM], data[1]),
        ] as const
      },
      refetchInterval: 30000,
    },
  })

  const sushiBalance = balanceAndSupplyData?.[0]
  const totalSupply = balanceAndSupplyData?.[1]

  const { pricePer, pricePerInverted } = useMemo(() => {
    const _sushiPrice = prices?.getFraction(SUSHI_ADDRESS[EvmChainId.ETHEREUM])

    const sushiPrice =
      _sushiPrice !== undefined
        ? Amount.fromHuman(SUSHI[EvmChainId.ETHEREUM], '1')?.mul(_sushiPrice)
        : undefined

    const xSushiPrice =
      sushiPrice && totalSupply && sushiBalance
        ? sushiPrice.mul(sushiBalance.amount).div(totalSupply.amount)
        : undefined

    let price
    if (sushiPrice && xSushiPrice) {
      price = new Price({
        baseAmount: sushiPrice,
        quoteAmount: xSushiPrice,
      })
    }

    return {
      pricePer: price ? price.toSignificant(4) : '0.00',
      pricePerInverted: price ? price.invert().toSignificant(4) : '0.00',
    }
  }, [prices, totalSupply, sushiBalance])

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          sushiBalance,
          totalSupply,
          apy:
            data && data?.apr1m !== undefined
              ? Number(data.apr1m) * 12
              : undefined,
          isLoading: isLoadingBarData || isLoadingSushiBalanceData,
          isError: isErrorBarData || isErrorSushiBalanceData,
          pricePer,
          pricePerInverted,
          isPricesLoading,
        }),
        [
          sushiBalance,
          totalSupply,
          data,
          isLoadingBarData,
          isLoadingSushiBalanceData,
          isErrorBarData,
          isErrorSushiBalanceData,
          pricePer,
          pricePerInverted,
          isPricesLoading,
        ],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const useSushiBar = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside SushiBar Context')
  }

  return context
}
