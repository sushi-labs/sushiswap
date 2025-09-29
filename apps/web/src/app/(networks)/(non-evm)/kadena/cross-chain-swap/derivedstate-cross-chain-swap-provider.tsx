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
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useCrossChainTradeRoutes as _useCrossChainTradeRoutes } from 'src/lib/hooks/react-query'
import { Amount, ChainId } from 'sushi'
import { isEvmChainId } from 'sushi/evm'
import {
  type KvmChainId,
  type KvmToken,
  type KvmTokenAddress,
  isKvmChainId,
} from 'sushi/kvm'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useSimulateBridgeTransaction } from '~kadena/_common/lib/hooks/use-x-swap-simulate'
import {
  type XSwapToken,
  useXChainSwapTokenInfo,
} from '~kadena/_common/lib/hooks/use-x-swap-token-lists'
import type { EthereumChainId } from '~kadena/_common/ui/General/x-chain-token-selector'
import { useKadena } from '~kadena/kadena-wallet-provider'

interface State {
  mutate: {
    setToken0(token0: XSwapToken | string): void
    setToken1(token1: XSwapToken | string): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
    setTradeId: Dispatch<SetStateAction<string>>
    setSelectedBridge(bridge: string | undefined): void
  }
  state: {
    tradeId: string
    token0: XSwapToken | undefined
    token1: XSwapToken | undefined
    chainId0: EthereumChainId | KvmChainId
    chainId1: EthereumChainId | KvmChainId
    swapAmountString: string
    swapAmount: Amount<XSwapToken> | undefined
    recipient: Address | undefined
    selectedBridge: string | undefined
  }
  isLoading: boolean
  isToken0Loading: boolean
  isToken1Loading: boolean
}

const DerivedStateCrossChainSwapContext = createContext<State>({} as State)

interface DerivedStateCrossChainSwapProviderProps {
  children: React.ReactNode
  defaultChainId: EthereumChainId | KvmChainId
}

/* Parses the URL and provides the chainId, token0, and token1 globally.
 * URL example:
 * /swap?chainId1=2token0=NATIVE&token1=0x6b3595068778dd592e39a122f4f5a5cf09c90fe2
 *
 * If no chainId is provided, it defaults to current connected chainId or Ethereum if wallet is not connected.
 */
const DerivedstateCrossChainSwapProvider: FC<
  DerivedStateCrossChainSwapProviderProps
> = ({ children, defaultChainId }) => {
  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tradeId, setTradeId] = useState(nanoid())
  const [selectedBridge, setSelectedBridge] = useState<string | undefined>(
    undefined,
  )

  const chainId0 = Number(searchParams.get('chainId0')) as
    | KvmChainId
    | EthereumChainId

  // Get the searchParams and complete with defaults.
  // This handles the case where some params might not be provided by the user
  useEffect(() => {
    const params = new URLSearchParams(searchParams)

    let updated = false
    if (!params.has('chainId0')) {
      params.set('chainId0', ChainId.ETHEREUM.toString())
      updated = true
    }
    if (!params.has('chainId1')) {
      params.set(
        'chainId1',
        Number(params.get('chainId0')) === ChainId.KADENA
          ? ChainId.ETHEREUM.toString()
          : ChainId.KADENA.toString(),
      )
      updated = true
    }
    if (!params.has('token0')) {
      params.set('token0', '0xbddb58bf21b12d70eed91b939ae061572010b11d')
      updated = true
    }
    if (!params.has('token1')) {
      params.set('token1', 'n_e595727b657fbbb3b8e362a05a7bb8d12865c1ff.KDA')
      updated = true
    }

    if (updated) {
      push(`${pathname}?${params.toString()}`)
    }
  }, []) // run only once on mount

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (values: { name: string; value: string | null }[]) => {
      const params = new URLSearchParams(searchParams)
      values.forEach(({ name, value }) => {
        if (value === null) {
          params.delete(name)
        } else {
          params.set(name, value)
        }
      })
      return params.toString()
    },
    [searchParams],
  )

  // Switch token0 and token1
  const switchTokens = useCallback(() => {
    const params = new URLSearchParams(searchParams)
    const chainId1 = +(params.get('chainId1') || 0)
    const token0 = params.get('token0')
    const token1 = params.get('token1')

    if (!isEvmChainId(chainId1) && !isKvmChainId(chainId1)) {
      console.log('[switchTokens] Invalid chainId1:', chainId1)
      return
    }

    // Instead of changing the pathname, update the chainId0 query string
    const newQueryString = createQueryString([
      { name: 'swapAmount', value: null },
      { name: 'token0', value: token1 as string },
      { name: 'token1', value: token0 as string },
      { name: 'chainId1', value: chainId0.toString() },
      { name: 'chainId0', value: chainId1.toString() },
    ])

    history.pushState(null, '', `${pathname}?${newQueryString}`)

    console.log(
      `[switchTokens] Swapped tokens and updated chainId0 to ${chainId1}, query: ${newQueryString}`,
    )
  }, [pathname, searchParams, chainId0, createQueryString])

  // Update the URL with a new token0
  const setToken0 = useCallback(
    (_token0: XSwapToken) => {
      // If entity is provided, parse it to a string
      console.log('setToken0', _token0)
      const token0 = _token0.address
      push(
        `${pathname}?${createQueryString([
          { name: 'token0', value: token0 },
          { name: 'chainId0', value: _token0.chainId.toString() },
        ])}`,
        { scroll: false },
      )
    },
    [createQueryString, pathname, push],
  )

  // Update the URL with a new token1
  const setToken1 = useCallback(
    (_token1: XSwapToken) => {
      // If entity is provided, parse it to a string
      console.log('setToken1', _token1)

      const url = `${pathname}?${createQueryString([
        { name: 'token1', value: _token1.address },
        { name: 'chainId1', value: _token1.chainId.toString() },
      ])}`
      console.log('url', url)
      push(url, { scroll: false })
    },
    [createQueryString, pathname, push],
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

  // Derive chainId from searchParams
  const chainId1 = Number(searchParams.get('chainId1')) as
    | KvmChainId
    | EthereumChainId

  const { data: token0, isLoading: token0Loading } = useXChainSwapTokenInfo({
    chainId: chainId0,
    address: searchParams.get('token0') as KvmTokenAddress,
    enabled: isKvmChainId(chainId0) || isEvmChainId(chainId0),
  })

  // token1
  const { data: token1, isLoading: token1Loading } = useXChainSwapTokenInfo({
    chainId: chainId1,
    address: searchParams.get('token1') as KvmTokenAddress,
    enabled: isKvmChainId(chainId1) || isEvmChainId(chainId1),
  })

  const swapAmountString = searchParams.get('swapAmount') || ''

  console.log('context swapAmountString', swapAmountString)
  // const [_token0, _token1] = useMemo(
  //   () => [
  //     searchParams.get('token0') === 'NATIVE'
  //       ? EvmNative.fromChainId(chainId0)
  //       : token0,
  //     searchParams.get('token1') === 'NATIVE'
  //       ? EvmNative.fromChainId(chainId1)
  //       : token1,
  //   ],
  //   [searchParams, chainId0, chainId1, token0, token1],
  // )

  const swapAmount = useMemo(
    () => (token0 ? Amount.tryFromHuman(token0, swapAmountString) : undefined),
    [token0, swapAmountString],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setSelectedBridge(undefined)
  }, [swapAmount])

  return (
    <DerivedStateCrossChainSwapContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setToken0,
            setToken1,
            setTradeId,
            switchTokens,
            setSwapAmount,
            setSelectedBridge,
          },
          state: {
            tradeId,
            recipient: undefined,
            chainId0,
            chainId1,
            swapAmountString,
            swapAmount,
            token0,
            token1,
            selectedBridge,
          },
          isLoading: token0Loading || token1Loading,
          isToken0Loading: token0Loading,
          isToken1Loading: token1Loading,
        }
      }, [
        chainId0,
        chainId1,

        setSwapAmount,
        setToken0,
        setToken1,
        switchTokens,
        swapAmount,
        swapAmountString,
        token0,
        token0Loading,
        token1,
        token1Loading,
        tradeId,
        selectedBridge,
      ])}
    >
      {children}
    </DerivedStateCrossChainSwapContext.Provider>
  )
}

const useDerivedStateCrossChainSwap = () => {
  const context = useContext(DerivedStateCrossChainSwapContext)
  if (!context) {
    throw new Error(
      'Hook can only be used inside CrossChain Swap Derived State Context',
    )
  }

  return context
}

export const useSimulateBridgeTx = () => {
  const { address } = useAccount()
  const { activeAccount } = useKadena()
  const {
    state: { token0, token1, swapAmountString, chainId0, chainId1 },
  } = useDerivedStateCrossChainSwap()

  const slippage = '0.05'

  const chainIdIn = chainId0 === ChainId.KADENA ? 2 : 1
  const chainIdOut = chainId1 === ChainId.KADENA ? 2 : 1
  const networkIn = chainId0 === ChainId.KADENA ? 'mainnet01' : 'ethereum'
  const networkOut = chainId1 === ChainId.KADENA ? 'mainnet01' : 'ethereum'
  const senderAddress =
    chainId0 === ChainId.KADENA
      ? (activeAccount?.accountName ?? '')
      : (address ?? '')
  const receiverAddress =
    chainId1 === ChainId.KADENA
      ? (activeAccount?.accountName ?? '')
      : (address ?? '')
  const res = useSimulateBridgeTransaction({
    amountIn: swapAmountString,
    chainIdIn,
    chainIdOut,
    networkIn,
    networkOut,
    senderAddress,
    receiverAddress,
    slippage,
    tokenAddressIn: token0?.address ?? '',
    tokenAddressOut: token1?.address ?? '',
  })

  return res
}

export { DerivedstateCrossChainSwapProvider, useDerivedStateCrossChainSwap }
