'use client'

import { useQuery } from '@tanstack/react-query'
import {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react'
import { Amount, ChainId, Fraction } from 'sushi'
import {
  type EvmCurrency,
  EvmToken,
  MASTERCHEF_ADDRESS,
  SUSHI_ADDRESS,
  XSUSHI,
  XSUSHI_ADDRESS,
  erc20Abi_balanceOf,
  erc20Abi_totalSupply,
  masterChefV1Abi_userInfo,
} from 'sushi/evm'
import { useConnection, useReadContract, useReadContracts } from 'wagmi'
import { useAmountBalances } from '~evm/_common/ui/balance-provider/use-balances'

const SnapshotStrategies = [
  {
    name: 'erc20-balance-of',
    params: {
      address: '0x62d11bc0652e9D9B66ac0a4c419950eEb9cFadA6',
      symbol: 'SUSHIPOWAH',
      decimals: '18',
    },
  },
  {
    name: 'erc20-balance-of',
    params: {
      address: '0x6811079E3c63ED96Eb005384d7E7ec8810E3D521',
      decimals: 18,
    },
    network: '137',
  },
]

const SUSHI_ETH_SLP_ADDRESS = '0x795065dCc9f64b5614C407a6EFDC400DA6221FB0'

export const SUSHI_ETH_SLP = new EvmToken({
  chainId: ChainId.ETHEREUM,
  address: SUSHI_ETH_SLP_ADDRESS,
  decimals: 18,
  symbol: 'SUSHI-ETH SLP',
  name: 'SUSHI-ETH LP Token',
})

interface VotingPowerContext {
  votingPower: number | undefined
  balances:
    | {
        xsushi: Amount<EvmCurrency>
        slp: Amount<EvmCurrency>
        xsushiPolygon: Amount<EvmCurrency>
      }
    | undefined
  weights:
    | {
        xsushi: Fraction
        slp: Fraction
        xsushiPolygon: Fraction
      }
    | undefined
  isConnected: boolean
  isLoading: boolean
  isError: boolean
}

const Context = createContext<VotingPowerContext | undefined>(undefined)

export const VotingPowerProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const { address, isConnected } = useConnection()

  const {
    data: votingPowerData,
    isLoading: isVotingPowerLoading,
    isError: isVotingPowerError,
  } = useQuery({
    queryKey: ['snapshot-scores', address],
    queryFn: async () => {
      if (!address) throw new Error()

      // The import is unnecessarily big and gets bundled with the whole app
      const snapshot = (await import('@snapshot-labs/snapshot.js')).default

      const resp = await snapshot.utils.getVp(
        address,
        '1',
        SnapshotStrategies,
        'latest',
        'sushigov.eth',
        true,
      )

      return resp
    },
    enabled: Boolean(address),
    staleTime: 300000,
  })

  const {
    data: ethereumBalances,
    isLoading: isBalancesLoading,
    isError: isBalancesError,
  } = useAmountBalances(
    ChainId.ETHEREUM,
    useMemo(() => [XSUSHI[ChainId.ETHEREUM], SUSHI_ETH_SLP], []),
  )

  const {
    data: contractData,
    isLoading: isContractDataLoading,
    isError: isContractDataError,
  } = useReadContracts({
    contracts: useMemo(
      () =>
        [
          // sushi.balanceOf(SUSHI-ETH LP)
          {
            chainId: ChainId.ETHEREUM,
            abi: erc20Abi_balanceOf,
            address: SUSHI_ADDRESS[ChainId.ETHEREUM],
            functionName: 'balanceOf',
            args: [SUSHI_ETH_SLP_ADDRESS],
          },
          // sushi.balanceOf(XSUSHI)
          {
            chainId: ChainId.ETHEREUM,
            abi: erc20Abi_balanceOf,
            address: SUSHI_ADDRESS[ChainId.ETHEREUM],
            functionName: 'balanceOf',
            args: [XSUSHI_ADDRESS[ChainId.ETHEREUM]],
          },
          // SUSHI-ETH-LP.totalSupply()
          {
            chainId: ChainId.ETHEREUM,
            abi: erc20Abi_totalSupply,
            address: SUSHI_ETH_SLP_ADDRESS,
            functionName: 'totalSupply',
          },
          // xsushi.totalSupply()
          {
            chainId: ChainId.ETHEREUM,
            abi: erc20Abi_totalSupply,
            address: XSUSHI_ADDRESS[ChainId.ETHEREUM],
            functionName: 'totalSupply',
          },
        ] as const,
      [],
    ),
    allowFailure: false,
    query: {
      staleTime: 300000,
    },
  })

  // Users' staked Sushi-ETH SLP
  const {
    data: userStakedSLP,
    isInitialLoading: isUserStakedSLPLoading,
    isError: isUserStakedSLPError,
  } = useReadContract({
    chainId: ChainId.ETHEREUM,
    abi: masterChefV1Abi_userInfo,
    address: MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
    functionName: 'userInfo',
    args: [12n, address!],
    query: {
      enabled: Boolean(address),
      staleTime: 30000,
    },
  })

  const weights = useMemo(() => {
    if (!contractData?.length || isContractDataError) return undefined

    const [
      sushiBalanceSLP,
      sushiBalanceXSUSHI,
      slpTotalSupply,
      xsushiTotalSupply,
    ] = contractData

    const xsushiWeight = new Fraction({
      numerator: sushiBalanceXSUSHI,
      denominator: xsushiTotalSupply,
    })

    const slpWeight = new Fraction({
      numerator: sushiBalanceSLP * 2n,
      denominator: slpTotalSupply,
    })

    return {
      xsushi: xsushiWeight,
      slp: slpWeight,
      xsushiPolygon: new Fraction({ numerator: 1, denominator: 1 }),
    }
  }, [contractData, isContractDataError])

  const balances = useMemo(() => {
    const xSushiBalance = ethereumBalances?.get(XSUSHI[ChainId.ETHEREUM].id)
    const slpBalance = ethereumBalances?.get(SUSHI_ETH_SLP.id)

    if (
      !xSushiBalance ||
      !slpBalance ||
      !votingPowerData?.vp_by_strategy?.[1] ||
      !userStakedSLP
    ) {
      return undefined
    }

    return {
      xsushi: xSushiBalance,
      slp: slpBalance.add(
        new Amount(SUSHI_ETH_SLP, userStakedSLP[0]),
      ) as Amount<EvmCurrency>,
      xsushiPolygon: Amount.fromHuman(
        XSUSHI[ChainId.POLYGON],
        votingPowerData.vp_by_strategy[1].toString(),
      ),
    }
  }, [ethereumBalances, userStakedSLP, votingPowerData?.vp_by_strategy])

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          votingPower: votingPowerData?.vp,
          balances,
          weights,
          isConnected,
          isLoading:
            isVotingPowerLoading ||
            isBalancesLoading ||
            isContractDataLoading ||
            isUserStakedSLPLoading,
          isError:
            isVotingPowerError ||
            isBalancesError ||
            isContractDataError ||
            isUserStakedSLPError,
        }),
        [
          votingPowerData?.vp,
          balances,
          weights,
          isConnected,
          isVotingPowerLoading,
          isBalancesLoading,
          isContractDataLoading,
          isUserStakedSLPLoading,
          isUserStakedSLPError,
          isVotingPowerError,
          isBalancesError,
          isContractDataError,
        ],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const useVotingPower = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside VotingPower Context')
  }

  return context
}
