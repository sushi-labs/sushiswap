import { Interface } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { CHAIN_KEY, Currency, CurrencyAmount, Fraction, JSBI } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import { CallState } from '@uniswap/redux-multicall'
import BASE_AUCTION_ABI from 'app/constants/abis/base-auction.json'
import { useContract } from 'app/hooks'
import { useMultipleContractSingleData, useSingleCallResult } from 'app/lib/hooks/multicall'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

export const useAuctionPointLists = (auctionAddresses: string[]): string[] => {
  const callStates = useMultipleContractSingleData(auctionAddresses, new Interface(BASE_AUCTION_ABI), 'pointList')
  if (callStates && Array.isArray(callStates) && callStates.length === auctionAddresses.length) {
    const pointLists = callStates.map((callState: CallState) => String(callState?.result?.[0]))
    return pointLists
  }
  return Array(auctionAddresses.length).fill(AddressZero)
}

export const useAuctionPointListPoints = (
  listAddress?: string,
  accountAddress?: string,
  paymentToken?: Currency
): CurrencyAmount<Currency> | undefined => {
  const { account, chainId } = useActiveWeb3React()

  const contract = useContract(
    listAddress,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.PointList.abi : undefined
  )
  const { result } = useSingleCallResult(
    contract,
    'points',
    accountAddress ? [accountAddress] : account ? [account] : undefined
  )
  if (Array.isArray(result) && result.length > 0 && paymentToken) {
    const { denominator, numerator } = new Fraction(JSBI.BigInt(result[0]), 1)
    return CurrencyAmount.fromFractionalAmount(paymentToken, numerator, denominator)
  }
}

export const useAuctionPointListFunctions = () => {
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const contract = useContract(
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.ListFactory.address : undefined,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.ListFactory.abi : undefined
  )

  const subscribe = useCallback(
    (event: string, cb) => {
      if (!contract) return

      contract.on(event, cb)
    },
    [contract]
  )

  const unsubscribe = useCallback(
    (event: string, cb) => {
      if (!contract) return

      contract.off(event, cb)
    },
    [contract]
  )

  const init = useCallback(
    async (accounts: string[], amounts: string[]) => {
      if (!contract) throw new Error('Contract not initialized')
      if (!account) throw new Error('Wallet not connected')

      const tx = await contract.deployPointList(account, accounts, amounts)
      addTransaction(tx, { summary: 'Initialize permission list' })

      return tx
    },
    [account, addTransaction, contract]
  )

  return {
    subscribe,
    unsubscribe,
    init,
  }
}
