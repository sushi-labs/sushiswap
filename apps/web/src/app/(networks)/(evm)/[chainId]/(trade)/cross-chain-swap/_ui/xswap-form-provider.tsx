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
  type LifiXSwapSupportedChainId,
  isLifiXSwapSupportedChainId,
} from 'src/config'
import { replaceNetworkSlug } from 'src/lib/network'
import {
  type NearIntentsSupportedChainId,
  isNearIntentsChainId,
} from 'src/lib/swap/near-intents'
import { EvmChainId } from 'sushi/evm'

type XSwapChainId = LifiXSwapSupportedChainId | NearIntentsSupportedChainId

const isXSwapChainId = (chainId: number): chainId is XSwapChainId =>
  isLifiXSwapSupportedChainId(chainId) || isNearIntentsChainId(chainId)

// Two chains share a `providers.tsx` branch when both their LiFi and Near
// support flags match. Crossing branches (e.g. EVM-only ↔ Stellar) requires a
// real Next navigation so the server-rendered Providers re-mounts the right
// domain provider.
const sameXSwapBranch = (a: XSwapChainId, b: XSwapChainId) =>
  isLifiXSwapSupportedChainId(a) === isLifiXSwapSupportedChainId(b) &&
  isNearIntentsChainId(a) === isNearIntentsChainId(b)

interface XSwapFormStateValues<
  TChainId0 extends XSwapChainId = XSwapChainId,
  TChainId1 extends XSwapChainId = XSwapChainId,
> {
  chainId0: TChainId0
  chainId1: TChainId1 | undefined
  token0Param: string | undefined
  token1Param: string | undefined
  swapAmountString: string
  tradeId: string
}

interface XSwapFormMutators<
  TChainId0 extends XSwapChainId = XSwapChainId,
  TChainId1 extends XSwapChainId = XSwapChainId,
> {
  setTradeId: Dispatch<SetStateAction<string>>
  setChainId0(chainId: TChainId0): void
  setChainId1(chainId: TChainId1): void
  setToken0Param(value: string | null): void
  setToken1Param(value: string | null): void
  setTokenParams(token0: string | null, token1: string | null): void
  setSwapAmount(swapAmount: string): void
  switchTokens(): void
}

interface XSwapFormState<
  TChainId0 extends XSwapChainId = XSwapChainId,
  TChainId1 extends XSwapChainId = XSwapChainId,
> extends XSwapFormStateValues<TChainId0, TChainId1>,
    XSwapFormMutators<TChainId0, TChainId1> {}

const XSwapFormContext = createContext<XSwapFormState | null>(null)

interface XSwapFormProviderProps {
  children: React.ReactNode
  defaultChainId: XSwapChainId
}

/* Holds the URL/path-derived form layer for the cross-chain swap route:
 * chainId0 (path), chainId1/token0/token1/swapAmount (query). Chain-agnostic
 * — domain providers (LiFi, Near Intents) layer their own token resolution
 * and default-filling on top of this hook.
 *
 * URL example:
 * /ethereum/cross-chain-swap?chainId1=42161&token0=NATIVE&token1=0x6b35...
 */
const XSwapFormProvider: FC<XSwapFormProviderProps> = ({
  children,
  defaultChainId,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tradeId, setTradeId] = useState(nanoid())
  const [chainId0State, setChainId0State] =
    useState<XSwapChainId>(defaultChainId)

  const chainId0 = isXSwapChainId(chainId0State)
    ? chainId0State
    : EvmChainId.ETHEREUM

  const chainId1Raw = Number(searchParams.get('chainId1') ?? Number.NaN)
  const chainId1 = isXSwapChainId(chainId1Raw) ? chainId1Raw : undefined

  const token0Param = searchParams.get('token0') ?? undefined
  const token1Param = searchParams.get('token1') ?? undefined
  const swapAmountString = searchParams.get('swapAmount') ?? ''

  const createQueryString = useCallback(
    (values: { name: string; value: string | null }[]) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const { name, value } of values) {
        if (value === null) {
          params.delete(name)
        } else {
          params.set(name, value)
        }
      }
      return params.toString()
    },
    [searchParams],
  )

  const updateSearchParams = useCallback(
    (values: { name: string; value: string | null }[]) => {
      history.pushState(null, '', `${pathname}?${createQueryString(values)}`)
    },
    [pathname, createQueryString],
  )

  const switchTokens = useCallback(() => {
    if (!chainId1) return
    const params = new URLSearchParams(searchParams.toString())
    const token0 = params.get('token0')
    const token1 = params.get('token1')

    const url = `${replaceNetworkSlug(chainId1, pathname)}?${createQueryString([
      { name: 'swapAmount', value: null },
      { name: 'token0', value: token1 },
      { name: 'token1', value: token0 },
      { name: 'chainId1', value: chainId0.toString() },
    ])}`

    if (sameXSwapBranch(chainId0, chainId1)) {
      history.pushState(null, '', url)
      setChainId0State(chainId1)
    } else {
      router.push(url, { scroll: false })
    }
  }, [chainId0, chainId1, pathname, searchParams, createQueryString, router])

  const setChainId0 = useCallback(
    (newChainId: XSwapChainId) => {
      if (chainId1 === newChainId) {
        switchTokens()
        return
      }

      const url = `${replaceNetworkSlug(newChainId, pathname)}?${createQueryString(
        [
          { name: 'swapAmount', value: null },
          { name: 'token0', value: null },
        ],
      )}`

      if (sameXSwapBranch(chainId0, newChainId)) {
        history.pushState(null, '', url)
        setChainId0State(newChainId)
      } else {
        router.push(url, { scroll: false })
      }
    },
    [chainId0, chainId1, pathname, createQueryString, router, switchTokens],
  )

  const setChainId1 = useCallback(
    (newChainId: XSwapChainId) => {
      if (chainId0 === newChainId) {
        switchTokens()
        return
      }
      router.push(
        `${pathname}?${createQueryString([
          { name: 'swapAmount', value: null },
          { name: 'chainId1', value: newChainId.toString() },
          { name: 'token1', value: null },
        ])}`,
        { scroll: false },
      )
    },
    [chainId0, pathname, createQueryString, router, switchTokens],
  )

  const setToken0Param = useCallback(
    (value: string | null) => {
      updateSearchParams([{ name: 'token0', value }])
    },
    [updateSearchParams],
  )

  const setToken1Param = useCallback(
    (value: string | null) => {
      updateSearchParams([{ name: 'token1', value }])
    },
    [updateSearchParams],
  )

  const setTokenParams = useCallback(
    (token0: string | null, token1: string | null) => {
      updateSearchParams([
        { name: 'token0', value: token0 },
        { name: 'token1', value: token1 },
      ])
    },
    [updateSearchParams],
  )

  const setSwapAmount = useCallback(
    (swapAmount: string) => {
      updateSearchParams([{ name: 'swapAmount', value: swapAmount || null }])
    },
    [updateSearchParams],
  )

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
      setToken0Param,
      setToken1Param,
      setTokenParams,
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
      setToken0Param,
      setToken1Param,
      setTokenParams,
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
  TChainId0 extends XSwapChainId = XSwapChainId,
  TChainId1 extends XSwapChainId = XSwapChainId,
>() {
  const Ctx = XSwapFormContext as unknown as React.Context<
    XSwapFormState<TChainId0, TChainId1>
  >

  const context = useContext(Ctx)
  if (!context) {
    throw new Error('useXSwapForm can only be used inside XSwapFormProvider')
  }

  return context
}

export {
  XSwapFormProvider,
  useXSwapForm,
  type XSwapFormState,
  type XSwapFormStateValues,
  type XSwapFormMutators,
  type XSwapChainId,
}
