'use client'

import type { SimulateBridgeResult } from '@kinesis-bridge/kinesis-sdk/dist/types'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useCrossChainTradeRoutes as _useCrossChainTradeRoutes } from 'src/lib/hooks/react-query'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { Amount, ChainId } from 'sushi'
import { isEvmChainId } from 'sushi/evm'
import { type KvmChainId, isKvmChainId } from 'sushi/kvm'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useXChainSwapSimulate } from '~kadena/_common/lib/hooks/x-chain-swap/use-x-chain-simulate'
import {
  type XSwapToken,
  useXChainTokenInfo,
} from '~kadena/_common/lib/hooks/x-chain-swap/use-x-chain-token-info'
import type { EthereumChainId } from '~kadena/_common/ui/General/x-chain-token-selector'
import { useKadena } from '~kadena/kadena-wallet-provider'

interface State {
  mutate: {
    setToken0(token0: XSwapToken | string): void
    setToken1(token1: XSwapToken | string): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
  }
  state: {
    token0: XSwapToken | undefined
    token1: XSwapToken | undefined
    chainId0: EthereumChainId | KvmChainId
    chainId1: EthereumChainId | KvmChainId
    swapAmountString: string
    swapAmount: Amount<XSwapToken> | undefined
    bridgeAmount: Amount<XSwapToken> | undefined
    recipient: Address | undefined
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

const DerivedstateCrossChainSwapProvider: FC<
  DerivedStateCrossChainSwapProviderProps
> = ({ children }) => {
  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // const [isTxPending, setIsTxPending] = useState(false)

  const rawChainId0 = decodeChainId(searchParams.get('chainId0'))
  const rawChainId1 = decodeChainId(searchParams.get('chainId1'))

  const isValidChainId = (
    id: number | undefined,
  ): id is KvmChainId | EthereumChainId => {
    if (id === undefined) return false
    return isKvmChainId(id) || isEvmChainId(id)
  }

  const chainId0: KvmChainId | EthereumChainId = isValidChainId(rawChainId0)
    ? rawChainId0
    : ChainId.KADENA

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
          : '0x7786f1eb2ec198a04d8f5e3fc36fab14da370076',
      )

      params.set(
        'token1',
        chainId0 === ChainId.KADENA
          ? '0x7786f1eb2ec198a04d8f5e3fc36fab14da370076'
          : 'n_e595727b657fbbb3b8e362a05a7bb8d12865c1ff.KDA',
      )
    }

    return params
  }, [chainId0, searchParams])

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

  const switchTokens = useCallback(() => {
    const params = new URLSearchParams(defaultedParams.toString()) // use raw
    const chainId1 = decodeChainId(params.get('chainId1'))
    const token0 = params.get('token0')
    const token1 = params.get('token1')

    if (!chainId0 || (!isEvmChainId(chainId0) && !isKvmChainId(chainId0))) {
      return
    }

    if (!chainId1 || (!isEvmChainId(chainId1) && !isKvmChainId(chainId1))) {
      return
    }

    if (!token0 || !token1) {
      return
    }

    const newQueryString = createQueryString([
      { name: 'swapAmount', value: null },
      { name: 'token0', value: token1 },
      { name: 'token1', value: token0 },
      { name: 'chainId1', value: encodeChainId(chainId0) },
      { name: 'chainId0', value: encodeChainId(chainId1) },
    ])

    const url = `${pathname}?${newQueryString}`
    push(url, { scroll: false })
  }, [pathname, defaultedParams, chainId0, createQueryString, push])

  const setToken0 = useCallback(
    (_token0: XSwapToken) => {
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

  const { data: token0, isLoading: token0Loading } = useXChainTokenInfo({
    chainId: chainId0 as KvmChainId | EthereumChainId,
    address: defaultedParams.get('token0') as string,
    enabled: isKvmChainId(chainId0) || isEvmChainId(chainId0),
  })

  const { data: token1, isLoading: token1Loading } = useXChainTokenInfo({
    chainId: chainId1 as KvmChainId | EthereumChainId,
    address: defaultedParams.get('token1') as string,
    enabled: isKvmChainId(chainId1) || isEvmChainId(chainId1),
  })

  const swapAmountString = defaultedParams.get('swapAmount') || ''

  const { data: simulateBridgeTx, isLoading: isLoadingSimulateBridgeTx } =
    _useXChainSwapSimulate({
      chainId0,
      chainId1,
      swapAmountString,
      token0,
      token1,
    })

  const swapAmount = useMemo(
    () => (token0 ? Amount.tryFromHuman(token0, swapAmountString) : undefined),
    [token0, swapAmountString],
  )

  const bridgeAmount = useMemo(() => {
    if (!token1) return
    if (!simulateBridgeTx?.amountMinReceived) return
    return Amount.tryFromHuman(token1, simulateBridgeTx.amountMinReceived)
  }, [token1, simulateBridgeTx?.amountMinReceived])

  return (
    <DerivedStateCrossChainSwapContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setToken0,
            setToken1,
            switchTokens,
            setSwapAmount,
          },
          state: {
            recipient: undefined,
            chainId0,
            chainId1,
            swapAmountString,
            swapAmount,
            bridgeAmount,
            token0,
            token1,
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
        simulateBridgeTx,
        isLoadingSimulateBridgeTx,
        bridgeAmount,
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

const _useXChainSwapSimulate = ({
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
  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.Swap,
  )

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

  console.log('useXChainSwapSimulate params', {
    amountIn: swapAmountString,
    chainIdIn,
    chainIdOut,
    networkIn,
    networkOut,
    senderAddress,
    receiverAddress,
    slippage: slippageTolerance.toString(),
    tokenAddressIn: token0?.address ?? '',
    tokenAddressOut: token1?.address ?? '',
  })

  const res = useXChainSwapSimulate({
    amountIn: swapAmountString,
    chainIdIn,
    chainIdOut,
    networkIn,
    networkOut,
    senderAddress: '0x47Ef3bF350F70724F2fd34206990cdE9C3A6B6F0',
    receiverAddress,
    slippage: slippageTolerance.toString(),
    tokenAddressIn: token0?.address ?? '',
    tokenAddressOut: token1?.address ?? '',
  })

  console.log('useXChainSwapSimulate res', res.data)

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
