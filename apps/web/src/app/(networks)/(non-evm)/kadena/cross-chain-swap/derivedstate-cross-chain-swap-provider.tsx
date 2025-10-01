'use client'

import type { SimulateBridgeResult } from '@kinesis-bridge/kinesis-sdk/dist/types'
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
    simulateBridgeTx: SimulateBridgeResult | undefined
    isLoadingSimulateBridgeTx: boolean
  }
  isLoading: boolean
  isToken0Loading: boolean
  isToken1Loading: boolean
}

const DerivedStateCrossChainSwapContext = createContext<State>({} as State)

interface DerivedStateCrossChainSwapProviderProps {
  children: React.ReactNode
}

/* Parses the URL and provides the chainId, token0, and token1 globally.
 * URL example:
 * /swap?chainId1=2token0=NATIVE&token1=0x6b3595068778dd592e39a122f4f5a5cf09c90fe2
 *
 * If no chainId is provided, it defaults to current connected chainId or Ethereum if wallet is not connected.
 */
const DerivedstateCrossChainSwapProvider: FC<
  DerivedStateCrossChainSwapProviderProps
> = ({ children }) => {
  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tradeId, setTradeId] = useState(nanoid())
  const [selectedBridge, setSelectedBridge] = useState<string | undefined>(
    undefined,
  )

  const rawChainId0 = decodeChainId(searchParams.get('chainId0'))
  const rawChainId1 = decodeChainId(searchParams.get('chainId1'))

  const isValidChainId = (
    id: number | undefined,
  ): id is KvmChainId | EthereumChainId => {
    if (id === undefined) return false
    return isKvmChainId(id) || isEvmChainId(id)
  }

  // Resolve chainId0 with fallback
  const chainId0: KvmChainId | EthereumChainId = isValidChainId(rawChainId0)
    ? rawChainId0
    : ChainId.KADENA

  // Resolve chainId1 with fallback depending on chainId0
  const chainId1: KvmChainId | EthereumChainId = isValidChainId(rawChainId1)
    ? rawChainId1
    : chainId0 === ChainId.KADENA
      ? ChainId.ETHEREUM
      : ChainId.KADENA

  const defaultedParams = useMemo(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))

    // Ensure chainId1 is set
    if (!params.get('chainId1')) {
      params.set(
        'chainId1',
        chainId0 === ChainId.KADENA
          ? ChainId.ETHEREUM.toString()
          : encodeURIComponent(ChainId.KADENA.toString()),
      )
    }

    // Only apply defaults if both token0 and token1 are missing
    if (!params.get('token0') && !params.get('token1')) {
      params.set(
        'token0',
        chainId0 === ChainId.KADENA
          ? 'n_e595727b657fbbb3b8e362a05a7bb8d12865c1ff.KDA'
          : '0xbddb58bf21b12d70eed91b939ae061572010b11d',
      )

      params.set(
        'token1',
        chainId0 === ChainId.KADENA
          ? '0xbddb58bf21b12d70eed91b939ae061572010b11d'
          : 'n_e595727b657fbbb3b8e362a05a7bb8d12865c1ff.KDA',
      )
    }

    return params
  }, [chainId0, searchParams])

  // Get the searchParams and complete with defaults.
  // This handles the case where some params might not be provided by the user

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (values: { name: string; value: string | null }[]) => {
      const params = new URLSearchParams(defaultedParams.toString()) // use raw
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
    const params = new URLSearchParams(defaultedParams.toString()) // use raw
    const chainId1 = decodeChainId(params.get('chainId1')) || ChainId.KADENA
    const token0 = params.get('token0')
    const token1 = params.get('token1')

    if (!isEvmChainId(chainId1) && !isKvmChainId(chainId1)) {
      console.error('[switchTokens] Invalid chainId1:', chainId1)
      return
    }

    // Instead of changing the pathname, update the chainId0 query string
    const newQueryString = createQueryString([
      { name: 'swapAmount', value: null },
      { name: 'token0', value: token1 as string },
      { name: 'token1', value: token0 as string },
      { name: 'chainId1', value: encodeChainId(chainId0) },
      { name: 'chainId0', value: encodeChainId(chainId1) },
    ])

    const url = `${pathname}?${newQueryString}`
    push(url, { scroll: false })
  }, [pathname, defaultedParams, chainId0, createQueryString, push])

  // Update the URL with a new token0
  const setToken0 = useCallback(
    (_token0: XSwapToken) => {
      // If entity is provided, parse it to a string
      const token0 = _token0.address
      const url = `${pathname}?${createQueryString([
        { name: 'token0', value: token0 },
        {
          name: 'chainId0',
          value: encodeChainId(_token0.chainId),
        },
      ])}`
      push(url, { scroll: false })
    },
    [createQueryString, pathname, push],
  )

  // Update the URL with a new token1
  const setToken1 = useCallback(
    (_token1: XSwapToken) => {
      const url = `${pathname}?${createQueryString([
        { name: 'token1', value: _token1.address },
        {
          name: 'chainId1',
          value: encodeChainId(_token1.chainId),
        },
      ])}`
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

  const { data: token0, isLoading: token0Loading } = useXChainSwapTokenInfo({
    chainId: chainId0 as KvmChainId | EthereumChainId,
    address: defaultedParams.get('token0') as string,
    enabled: isKvmChainId(chainId0) || isEvmChainId(chainId0),
  })

  // token1
  const { data: token1, isLoading: token1Loading } = useXChainSwapTokenInfo({
    chainId: chainId1 as KvmChainId | EthereumChainId,
    address: defaultedParams.get('token1') as string,
    enabled: isKvmChainId(chainId1) || isEvmChainId(chainId1),
  })

  const swapAmountString = defaultedParams.get('swapAmount') || ''

  const swapAmount = useMemo(
    () => (token0 ? Amount.tryFromHuman(token0, swapAmountString) : undefined),
    [token0, swapAmountString],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setSelectedBridge(undefined)
  }, [swapAmount])

  const { data: simulateBridgeTx, isLoading: isLoadingSimulateBridgeTx } =
    useSimulateBridgeTx({
      chainId0,
      chainId1,
      swapAmountString,
      token0,
      token1,
    })

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
            simulateBridgeTx,
            isLoadingSimulateBridgeTx,
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
        simulateBridgeTx,
        isLoadingSimulateBridgeTx,
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

export const useSimulateBridgeTx = ({
  chainId0,
  chainId1,
  swapAmountString,
  token0,
  token1,
}: {
  chainId0: EthereumChainId | KvmChainId
  chainId1: EthereumChainId | KvmChainId
  swapAmountString: string
  token0: XSwapToken | undefined
  token1: XSwapToken | undefined
}) => {
  const { address } = useAccount()
  const { activeAccount } = useKadena()

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

function encodeChainId(id: number): string {
  return id === -3 ? 'kadena' : id.toString()
}

function decodeChainId(value: string | null): number | undefined {
  if (!value) return undefined
  if (value === 'kadena') return -3
  return Number(value)
}
