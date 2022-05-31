import { defaultAbiCoder } from '@ethersproject/abi'
import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import { ChainId, JSBI, KASHI_ADDRESS, Token, ZERO } from '@sushiswap/core-sdk'
import { CHAINLINK_PRICE_FEED_MAP, ChainlinkPriceFeedEntry } from 'app/config/oracles/chainlink'
import { Feature } from 'app/enums'
import { featureEnabled, getOracle, validateChainlinkOracleData } from 'app/functions'
import { useBentoBoxContract, useBoringHelperContract } from 'app/hooks'
import { useTokens } from 'app/hooks/Tokens'
import useBentoRebases from 'app/hooks/useBentoRebases'
import { useUSDCPricesSubgraph } from 'app/hooks/useUSDCSubgraph'
import { useSingleCallResult } from 'app/lib/hooks/multicall'
import { useClones } from 'app/services/graph'
import { useActiveWeb3React, useQueryFilter } from 'app/services/web3'
import { useMemo } from 'react'

import KashiMediumRiskLendingPair from './KashiMediumRiskLendingPair'

const BLACKLISTED_TOKENS = ['0xC6d54D2f624bc83815b49d9c2203b1330B841cA0', '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F']

const BLACKLISTED_ORACLES = [
  '0x8f2CC3376078568a04eBC600ae5F0a036DBfd812',
  '0x8f7C7181Ed1a2BA41cfC3f5d064eF91b67daef66',
  '0x6b7D436583e5fE0874B7310b74D29A13af816860',
]

const BLACKLISTED_PAIRS = ['0xF71e398B5CBb473a3378Bf4335256295A8eD713d']

export const useKashiMediumRiskLendingPositions = (account: string): KashiMediumRiskLendingPair[] => {
  const addresses = useKashiPairAddresses()
  const markets = useKashiMediumRiskLendingPairs(account, addresses)
  return markets.filter((pair: KashiMediumRiskLendingPair) => JSBI.greaterThan(pair.userAssetFraction, ZERO))
}

export const useKashiMediumRiskBorrowingPositions = (account: string): KashiMediumRiskLendingPair[] => {
  const addresses = useKashiPairAddresses()
  const markets = useKashiMediumRiskLendingPairs(account, addresses)
  return markets.filter(
    (pair: KashiMediumRiskLendingPair) =>
      JSBI.greaterThan(pair.userCollateralShare, ZERO) || JSBI.greaterThan(pair.userBorrowPart, ZERO)
  )
}

// Reduce all tokens down to only those which are found in the Oracle mapping
export function useKashiTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const allTokens = useTokens()
  return useMemo(
    () =>
      Object.values(allTokens).reduce((previousValue: Record<string, Token>, currentValue: Token) => {
        if (
          chainId &&
          CHAINLINK_PRICE_FEED_MAP?.[chainId] &&
          Object.values(CHAINLINK_PRICE_FEED_MAP?.[chainId])?.some((value: ChainlinkPriceFeedEntry) => {
            return currentValue.address === value.from || currentValue.address === value.to
          })
        ) {
          previousValue[currentValue.address] = currentValue
        }
        return previousValue
      }, {}),
    [allTokens, chainId]
  )
}

export function useKashiPairAddresses(): string[] {
  const bentoBoxContract = useBentoBoxContract()
  const { chainId } = useActiveWeb3React()
  const useEvents = useMemo(
    () =>
      Boolean(
        chainId &&
          chainId !== ChainId.BSC &&
          chainId !== ChainId.MATIC &&
          chainId !== ChainId.ARBITRUM &&
          chainId !== ChainId.AVALANCHE
      ),
    [chainId]
  )
  const tokens = useKashiTokens()
  const { data: events } = useQueryFilter({
    chainId,
    contract: bentoBoxContract,
    event: chainId && bentoBoxContract && bentoBoxContract.filters.LogDeploy(KASHI_ADDRESS[chainId]),
    shouldFetch: Boolean(chainId && useEvents && featureEnabled(Feature.KASHI, chainId)),
  })
  const clones = useClones({ chainId, shouldFetch: !useEvents })
  return useMemo(
    () =>
      (useEvents
        ? events?.map((event) => ({
            address:
              // @ts-ignore TYPE NEEDS FIXING
              event.args.cloneAddress,
            // @ts-ignore TYPE NEEDS FIXING
            data: event.args.data,
          }))
        : clones
      )
        // @ts-ignore TYPE NEEDS FIXING
        ?.reduce((previousValue, currentValue) => {
          try {
            const [collateral, asset, oracle, oracleData] = defaultAbiCoder.decode(
              ['address', 'address', 'address', 'bytes'],
              currentValue.data
            )
            if (
              BLACKLISTED_TOKENS.includes(collateral) ||
              BLACKLISTED_TOKENS.includes(asset) ||
              BLACKLISTED_ORACLES.includes(oracle) ||
              !validateChainlinkOracleData(chainId, tokens[collateral], tokens[asset], oracleData)
            ) {
              return previousValue
            }
            return [...previousValue, currentValue.address]
          } catch (error) {
            return previousValue
          }
        }, []),
    [chainId, clones, events, tokens, useEvents]
  )
}

type BoringHelperKashiPair = {
  collateral: string
  asset: string
  oracle: string
  oracleData: string
  totalCollateralShare: string
  userCollateralShare: string
  totalAsset: {
    elastic: BigNumber
    base: BigNumber
  }
  userAssetFraction: string
  totalBorrow: {
    elastic: BigNumber
    base: BigNumber
  }
  userBorrowPart: BigNumber
  currentExchangeRate: BigNumber
  spotExchangeRate: BigNumber
  oracleExchangeRate: BigNumber
  accrueInfo: {
    interestPerSecond: BigNumber
    lastAccrued: BigNumber
    feesEarnedFraction: BigNumber
  }
}

export function useKashiMediumRiskLendingPairs(
  account: string | null | undefined,
  addresses: string[] = []
): KashiMediumRiskLendingPair[] {
  const { chainId } = useActiveWeb3React()
  const boringHelperContract = useBoringHelperContract()
  const tokens = useKashiTokens()
  const args = useMemo(() => [account ? account : AddressZero, addresses], [account, addresses])
  const { result, valid, loading, syncing, error } = useSingleCallResult(boringHelperContract, 'pollKashiPairs', args, {
    gasRequired: 20_000_000,
  })

  const { rebases } = useBentoRebases(useMemo(() => Object.values(tokens), [tokens]))
  const prices = useUSDCPricesSubgraph(Object.values(tokens))
  // TODO: for skeleton loading
  // const kashiRepositoryContract = useKashiRepositoryContract()
  // const callStates = useSingleContractMultipleData(kashiRepositoryContract, 'getPair', args, NEVER_RELOAD)

  return useMemo(() => {
    if (!chainId || !result || !rebases || !prices) return []

    return result?.[0].reduce((acc: KashiMediumRiskLendingPair[], pair: BoringHelperKashiPair) => {
      if (
        BLACKLISTED_TOKENS.includes(pair.collateral) ||
        BLACKLISTED_TOKENS.includes(pair.asset) ||
        BLACKLISTED_ORACLES.includes(pair.oracle) ||
        !rebases[pair.collateral] ||
        !rebases[pair.collateral]?.token ||
        !rebases[pair.asset] ||
        !rebases[pair.asset]?.token
      ) {
        return acc
      }

      acc.push(
        new KashiMediumRiskLendingPair({
          accrueInfo: {
            feesEarnedFraction: JSBI.BigInt(pair.accrueInfo.feesEarnedFraction.toString()),
            lastAccrued: JSBI.BigInt(pair.accrueInfo.lastAccrued),
            interestPerSecond: JSBI.BigInt(pair.accrueInfo.interestPerSecond.toString()),
          },
          // @ts-ignore
          collateral: rebases[pair.collateral],
          // @ts-ignore
          asset: rebases[pair.asset],
          collateralPrice: prices[pair.collateral],
          assetPrice: prices[pair.asset],
          oracle: getOracle(chainId, pair.oracle, pair.oracleData),
          totalCollateralShare: JSBI.BigInt(pair.totalCollateralShare.toString()),
          totalAsset: {
            elastic: JSBI.BigInt(pair.totalAsset.elastic.toString()),
            base: JSBI.BigInt(pair.totalAsset.base.toString()),
          },
          totalBorrow: {
            elastic: JSBI.BigInt(pair.totalBorrow.elastic.toString()),
            base: JSBI.BigInt(pair.totalBorrow.base.toString()),
          },
          exchangeRate: JSBI.BigInt(pair.currentExchangeRate.toString()),
          oracleExchangeRate: JSBI.BigInt(pair.oracleExchangeRate.toString()),
          spotExchangeRate: JSBI.BigInt(pair.spotExchangeRate.toString()),
          userCollateralShare: JSBI.BigInt(pair.userCollateralShare.toString()),
          userAssetFraction: JSBI.BigInt(pair.userAssetFraction.toString()),
          userBorrowPart: JSBI.BigInt(pair.userBorrowPart.toString()),
        })
      )

      return acc
    }, [])
  }, [chainId, prices, rebases, result])
}

export function useKashiMediumRiskLendingPair(
  account: string | null | undefined,
  address: string
): KashiMediumRiskLendingPair {
  return useKashiMediumRiskLendingPairs(account, [getAddress(address)])[0]
}
