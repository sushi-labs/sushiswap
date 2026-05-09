'use client'

import { nanoid } from 'nanoid'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  type Dispatch,
  type FC,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  type SupportedChainId,
  type XSwapSupportedChainId,
  isXSwapSupportedChainId,
} from 'src/config'
import { replaceNetworkSlug } from 'src/lib/network'
import { getChainById } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import {
  getDefaultCurrency,
  getQuoteCurrency,
  getTokenAsString,
} from '../../_ui/derivedstate-swap-helpers'

interface XSwapFormStateValues<
  TChainId0 extends XSwapSupportedChainId = XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId = XSwapSupportedChainId,
> {
  chainId0: TChainId0
  chainId1: TChainId1
  token0Param: string
  token1Param: string
  swapAmountString: string
  tradeId: string
}

interface XSwapFormMutators<
  TChainId0 extends XSwapSupportedChainId = XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId = XSwapSupportedChainId,
> {
  setTradeId: Dispatch<SetStateAction<string>>
  setChainId0(chainId: TChainId0): void
  setChainId1(chainId: TChainId1): void
  setToken0(token0: CurrencyFor<TChainId0> | string): void
  setToken1(token1: CurrencyFor<TChainId1> | string): void
  setTokens(
    token0: CurrencyFor<TChainId0> | string,
    token1: CurrencyFor<TChainId1> | string,
  ): void
  setSwapAmount(swapAmount: string): void
  switchTokens(): void
}

interface XSwapFormState<
  TChainId0 extends XSwapSupportedChainId = XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId = XSwapSupportedChainId,
> extends XSwapFormStateValues<TChainId0, TChainId1>,
    XSwapFormMutators<TChainId0, TChainId1> {}

const XSwapFormContext = createContext<XSwapFormState | null>(
  null,
)

interface XSwapFormProviderProps {
  children: React.ReactNode
  defaultChainId: XSwapSupportedChainId
}

const XSwapFormProvider: FC<XSwapFormProviderProps> = ({
  children,
  defaultChainId,
}) => {
  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tradeId, setTradeId] = useState(nanoid())
  const [chainId, setChainId] = useState<XSwapSupportedChainId>(defaultChainId)

  const chainId0 = isXSwapSupportedChainId(chainId)
    ? chainId
    : EvmChainId.ETHEREUM
  type TChainId0 = typeof chainId0

  // Get the searchParams and complete with defaults.
  // This handles the case where some params might not be provided by the user
  const defaultedParams = useMemo(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))

    if (!params.has('chainId1'))
      params.set(
        'chainId1',
        chainId0 === EvmChainId.ARBITRUM
          ? EvmChainId.ETHEREUM.toString()
          : EvmChainId.ARBITRUM.toString(),
      )
    if (!params.has('token0'))
      params.set('token0', getDefaultCurrency(chainId0 as SupportedChainId))
    if (!params.has('token1'))
      params.set(
        'token1',
        getQuoteCurrency(Number(params.get('chainId1')) as SupportedChainId),
      )

    return params
  }, [chainId0, searchParams])

  // Derive chainId from defaultedParams
  const chainId1 = Number(
    defaultedParams.get('chainId1'),
  ) as XSwapSupportedChainId
  type TChainId1 = typeof chainId1

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (values: { name: string; value: string | null }[]) => {
      const params = new URLSearchParams(defaultedParams)
      values.forEach(({ name, value }) => {
        if (value === null) {
          params.delete(name)
        } else {
          params.set(name, value)
        }
      })
      return params.toString()
    },
    [defaultedParams],
  )

  // Switch token0 and token1
  const switchTokens = useCallback(() => {
    const params = new URLSearchParams(defaultedParams)
    const chainId1Param = +(params.get('chainId1') || 0)
    const token0 = params.get('token0')
    const token1 = params.get('token1')

    if (!isXSwapSupportedChainId(chainId1Param)) {
      console.error('Invalid chainId1:', chainId1Param)
      return
    }

    const pathSegments = pathname.split('/')
    pathSegments[1] = getChainById(chainId1Param).key

    // Can safely cast as defaultedParams are always defined
    history.pushState(
      null,
      '',
      `${replaceNetworkSlug(chainId1Param, pathname)}?${createQueryString([
        { name: 'swapAmount', value: null },
        { name: 'token0', value: token1 as string },
        { name: 'token1', value: token0 as string },
        { name: 'chainId1', value: chainId0.toString() },
      ])}`,
    )

    setChainId(chainId1Param)
  }, [pathname, defaultedParams, chainId0, createQueryString])

  // Update the URL with new from chainId
  const setChainId0 = useCallback(
    (chainId: XSwapSupportedChainId) => {
      if (defaultedParams.get('chainId1') === chainId.toString()) {
        switchTokens()
      } else {
        history.pushState(
          null,
          '',
          `${replaceNetworkSlug(chainId, pathname)}?${createQueryString([
            { name: 'swapAmount', value: null },
            {
              name: 'token0',
              value: getDefaultCurrency(chainId0 as SupportedChainId),
            },
          ])}`,
        )

        setChainId(chainId)
      }
    },
    [createQueryString, defaultedParams, pathname, switchTokens, chainId0],
  )

  // Update the URL with new to chainId
  const setChainId1 = useCallback(
    (chainId: XSwapSupportedChainId) => {
      if (chainId0 === chainId) {
        switchTokens()
      } else {
        push(
          `${pathname}?${createQueryString([
            { name: 'swapAmount', value: null },
            { name: 'chainId1', value: chainId.toString() },
            {
              name: 'token1',
              value: getQuoteCurrency(chainId as SupportedChainId),
            },
          ])}`,
          { scroll: false },
        )
      }
    },
    [createQueryString, pathname, push, switchTokens, chainId0],
  )

  // Update the URL with a new token0
  const setToken0 = useCallback(
    (_token0: string | CurrencyFor<TChainId0>) => {
      // If entity is provided, parse it to a string
      const token0 = getTokenAsString(chainId0 as SupportedChainId, _token0)
      push(
        `${pathname}?${createQueryString([{ name: 'token0', value: token0 }])}`,
        { scroll: false },
      )
    },
    [chainId0, createQueryString, pathname, push],
  )

  // Update the URL with a new token1
  const setToken1 = useCallback(
    (_token1: string | CurrencyFor<TChainId1>) => {
      // If entity is provided, parse it to a string
      const token1 = getTokenAsString(chainId1 as SupportedChainId, _token1)
      push(
        `${pathname}?${createQueryString([{ name: 'token1', value: token1 }])}`,
        { scroll: false },
      )
    },
    [chainId1, createQueryString, pathname, push],
  )

  // Update the URL with both tokens
  const setTokens = useCallback(
    (
      _token0: string | CurrencyFor<TChainId0>,
      _token1: string | CurrencyFor<TChainId1>,
    ) => {
      // If entity is provided, parse it to a string
      const token0 = getTokenAsString(chainId0 as SupportedChainId, _token0)
      const token1 = getTokenAsString(chainId1 as SupportedChainId, _token1)

      push(
        `${pathname}?${createQueryString([
          { name: 'token0', value: token0 },
          { name: 'token1', value: token1 },
        ])}`,
        { scroll: false },
      )
    },
    [chainId0, chainId1, createQueryString, pathname, push],
  )

  // Update the URL with a new swapAmount
  const setSwapAmount = useCallback(
    (swapAmount: string) => {
      push(
        `${pathname}?${createQueryString([
          { name: 'swapAmount', value: swapAmount },
        ])}`,
        { scroll: false },
      )
    },
    [createQueryString, pathname, push],
  )

  const token0Param = defaultedParams.get('token0') as string
  const token1Param = defaultedParams.get('token1') as string
  const swapAmountString = defaultedParams.get('swapAmount') || ''

  const value = useMemo<XSwapFormState>(
    () => ({
      chainId0,
      chainId1,
      token0Param,
      token1Param,
      swapAmountString,
      tradeId,
      setTradeId,
      setChainId0,
      setChainId1,
      setToken0,
      setToken1,
      setTokens,
      setSwapAmount,
      switchTokens,
    }),
    [
      chainId0,
      chainId1,
      token0Param,
      token1Param,
      swapAmountString,
      tradeId,
      setChainId0,
      setChainId1,
      setToken0,
      setToken1,
      setTokens,
      setSwapAmount,
      switchTokens,
    ],
  )

  return (
    <XSwapFormContext.Provider value={value}>
      {children}
    </XSwapFormContext.Provider>
  )
}

function useXSwapForm<
  TChainId0 extends XSwapSupportedChainId = XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId = XSwapSupportedChainId,
>() {
  const Ctx = XSwapFormContext as unknown as React.Context<
    XSwapFormState<TChainId0, TChainId1>
  >

  const context = useContext(Ctx)
  if (!context) {
    throw new Error(
      'useXSwapForm can only be used inside XSwapFormProvider',
    )
  }

  return context
}

export {
  XSwapFormProvider,
  useXSwapForm,
  type XSwapFormState,
  type XSwapFormStateValues,
  type XSwapFormMutators,
}
