import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { CHAIN_KEY } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import BASE_AUCTION_ABI from 'app/constants/abis/base-auction.json'
import { AuctionTemplate, RawLauncherInfo } from 'app/features/miso/context/types'
import { useContract, useMisoHelperContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useSingleContractWithCallData } from 'lib/hooks/multicall'
import { useMemo } from 'react'

const AUCTION_INTERFACE = new Interface(BASE_AUCTION_ABI)

// @ts-ignore TYPE NEEDS FIXING
const arrayToMap = (result) =>
  // @ts-ignore TYPE NEEDS FIXING
  result?.reduce((acc, cur) => {
    acc[cur.name] = cur.data
    return acc
  }, {})

export const useAuctionHelperInfo = (auctionAddress?: string, marketTemplateId?: BigNumber, owner?: string) => {
  const contract = useMisoHelperContract()

  const callDatas = useMemo(() => {
    if (!contract || !auctionAddress || !marketTemplateId) {
      return []
    }
    return [
      contract.interface.encodeFunctionData('getDocuments', [auctionAddress]),
      contract.interface.encodeFunctionData('getUserMarketInfo', [auctionAddress, owner]),
      contract.interface.encodeFunctionData(
        marketTemplateId?.toNumber() === AuctionTemplate.BATCH_AUCTION
          ? 'getBatchAuctionInfo'
          : marketTemplateId?.toNumber() === AuctionTemplate.DUTCH_AUCTION
          ? 'getDutchAuctionInfo'
          : 'getCrowdsaleInfo',
        [auctionAddress]
      ),
    ]
  }, [auctionAddress, contract, marketTemplateId, owner])

  const results = useSingleContractWithCallData(contract, callDatas)

  if (
    contract &&
    auctionAddress &&
    marketTemplateId &&
    results &&
    Array.isArray(results) &&
    results.length === callDatas.length &&
    results.every((el) => !el.error)
  ) {
    const [{ result: documents }, { result: marketInfo }, { result: auctionInfo }] = results
    return {
      auctionDocuments: arrayToMap(documents?.[0]),
      marketInfo: marketInfo?.[0],
      auctionInfo: auctionInfo?.[0],
      loading: results.some((el) => el.loading),
      error: results.some((el) => el.error),
    }
  }

  return {
    auctionDocuments: undefined,
    marketInfo: undefined,
    auctionInfo: undefined,
    loading: results.some((el) => el.loading),
    error: results.some((el) => el.error),
  }
}

export const useAuctionDetails = (auctionAddress?: string) => {
  const contract = useContract(auctionAddress, AUCTION_INTERFACE)

  const callDatas = useMemo(() => {
    if (!contract) {
      return []
    }
    return [
      contract.interface.encodeFunctionData('marketTemplate', []),
      contract.interface.encodeFunctionData('pointList', []),
      contract.interface.encodeFunctionData('wallet', []),
    ]
  }, [contract])

  const results = useSingleContractWithCallData(contract, callDatas)

  if (
    contract &&
    auctionAddress &&
    results &&
    Array.isArray(results) &&
    results.length === callDatas.length &&
    results.every((el) => !el.error)
  ) {
    const [{ result: marketTemplate }, { result: pointList }, { result: auctionLauncherAddress }] = results
    return {
      marketTemplateId: marketTemplate?.[0],
      pointListAddress: pointList?.[0],
      auctionLauncherAddress: auctionLauncherAddress?.[0],
      loading: results.some((el) => el.loading),
      error: results.some((el) => el.error),
    }
  }

  return {
    marketTemplateId: undefined,
    pointListAddress: undefined,
    auctionLauncherAddress: undefined,
    loading: results.some((el) => el.loading),
    error: results.some((el) => el.error),
  }
}

export const useAuctionLauncherDetails = (
  launcherAddress?: string
): {
  launcherInfo?: RawLauncherInfo
  liquidityTemplate?: BigNumber
  lpTokenAddress?: string
  token1Balance?: BigNumber
  token2Balance?: BigNumber
} => {
  const { chainId } = useActiveWeb3React()
  const launcher = useContract(
    launcherAddress,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.PostAuctionLauncher.abi : undefined
  )

  const callDatas = useMemo(() => {
    if (!launcher || !launcherAddress) {
      return []
    }
    return [
      launcher.interface.encodeFunctionData('launcherInfo', []),
      launcher.interface.encodeFunctionData('liquidityTemplate', []),
      launcher.interface.encodeFunctionData('getLPTokenAddress', []),
      launcher.interface.encodeFunctionData('getToken1Balance', []),
      launcher.interface.encodeFunctionData('getToken2Balance', []),
    ]
  }, [launcher, launcherAddress])

  const results = useSingleContractWithCallData(launcher, callDatas)

  if (
    launcher &&
    launcherAddress &&
    results &&
    Array.isArray(results) &&
    results.length === callDatas.length &&
    results.every((el) => !el.error)
  ) {
    const [
      { result: launcherInfo },
      { result: liquidityTemplate },
      { result: lpTokenAddress },
      { result: token1Balance },
      { result: token2Balance },
    ] = results
    return {
      launcherInfo: launcherInfo as any,
      liquidityTemplate: liquidityTemplate?.[0],
      lpTokenAddress: lpTokenAddress?.[0],
      token1Balance: token1Balance?.[0],
      token2Balance: token2Balance?.[0],
    }
  }

  return {
    launcherInfo: undefined,
    lpTokenAddress: undefined,
  }
}
