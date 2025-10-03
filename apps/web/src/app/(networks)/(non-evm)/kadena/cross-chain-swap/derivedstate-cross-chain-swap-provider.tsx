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
import { type EvmToken, isEvmChainId } from 'sushi/evm'
import { type KvmChainId, type KvmToken, isKvmChainId } from 'sushi/kvm'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useKinesisSwapSimulate } from '~kadena/_common/lib/hooks/kinesis-swap/use-kinesis-simulate'
import {
  findKinesisEquivalentToken,
  useKinesisTokenInfo,
} from '~kadena/_common/lib/hooks/kinesis-swap/use-kinesis-token-info'
import { useKinesisTokenList } from '~kadena/_common/lib/hooks/kinesis-swap/use-kinesis-token-list'
import { useKinesisTokenPrice } from '~kadena/_common/lib/hooks/kinesis-swap/use-kinesis-token-price'
import type { EthereumChainId } from '~kadena/_common/ui/kinesis/token-selector'
import { useKadena } from '~kadena/kadena-wallet-provider'

export type KinesisChainId = KvmChainId | EthereumChainId
export type KinesisToken = KvmToken | EvmToken

function encodeChainId(id: number): string {
  return id === -3 ? 'kadena' : id.toString()
}

function decodeChainId(value: string | null): number | undefined {
  if (!value) return undefined
  if (value === 'kadena') return -3
  return Number(value)
}

interface State {
  mutate: {
    setTokens(token0: KinesisToken | string): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
  }
  state: {
    token0: KinesisToken | undefined
    token1: KinesisToken | undefined
    chainId0: KinesisChainId
    chainId1: KinesisChainId
    swapAmountString: string
    swapAmount: Amount<KinesisToken> | undefined
    bridgeAmount: Amount<KinesisToken> | undefined
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

  const { data: tokenLists } = useKinesisTokenList()

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

  const setTokens = useCallback(
    (_token0: KinesisToken) => {
      const crossChainEquivalentToken = findKinesisEquivalentToken(
        _token0,
        tokenLists ?? { kadena: [], ethereum: [] },
      )

      const url = `${pathname}?${createQueryString([
        { name: 'token0', value: _token0.address },
        { name: 'token1', value: crossChainEquivalentToken?.address ?? null },
        {
          name: 'chainId0',
          value: encodeChainId(_token0.chainId),
        },
        {
          name: 'chainId1',
          value: encodeChainId(crossChainEquivalentToken?.chainId ?? 0),
        },
      ])}`

      push(url, { scroll: false })
    },
    [createQueryString, pathname, push, tokenLists],
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

  const { data: token0, isLoading: token0Loading } = useKinesisTokenInfo({
    chainId: chainId0 as KvmChainId | EthereumChainId,
    address: defaultedParams.get('token0') as string,
    enabled: isKvmChainId(chainId0) || isEvmChainId(chainId0),
  })

  const { data: token1, isLoading: token1Loading } = useKinesisTokenInfo({
    chainId: chainId1 as KvmChainId | EthereumChainId,
    address: defaultedParams.get('token1') as string,
    enabled: isKvmChainId(chainId1) || isEvmChainId(chainId1),
  })

  const swapAmountString = defaultedParams.get('swapAmount') || ''

  const { data: simulateBridgeTx, isLoading: isLoadingSimulateBridgeTx } =
    _useKinesisSwapSimulate({
      chainId0,
      chainId1,
      swapAmountString,
      token0,
      token1,
    })

  console.log('simulateBridgeTx.data', simulateBridgeTx)

  const swapAmount = useMemo(
    () => (token0 ? Amount.tryFromHuman(token0, swapAmountString) : undefined),
    [token0, swapAmountString],
  )

  const bridgeAmount = useMemo(() => {
    if (!token1) return
    if (!simulateBridgeTx?.amountMinReceived) return
    return Amount.tryFromHuman(token1, simulateBridgeTx.amountMinReceived)
  }, [token1, simulateBridgeTx?.amountMinReceived])

  const { data: token0Price } = useKinesisTokenPrice({
    network: chainId0 === ChainId.KADENA ? 'mainnet01' : 'ethereum',
    tokenAddress: token0?.address ?? '',
  })

  console.log('token0Price', token0Price)

  return (
    <DerivedStateCrossChainSwapContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setTokens,
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
        setTokens,
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

const _useKinesisSwapSimulate = ({
  chainId0,
  chainId1,
  swapAmountString,
  token0,
  token1,
}: {
  chainId0: EthereumChainId | KvmChainId
  chainId1: EthereumChainId | KvmChainId
  swapAmountString: string
  token0: KinesisToken | undefined
  token1: KinesisToken | undefined
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

  const res = useKinesisSwapSimulate({
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

  return res
}

export { DerivedstateCrossChainSwapProvider, useDerivedStateCrossChainSwap }
