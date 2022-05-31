import { defaultAbiCoder } from '@ethersproject/abi'
import { CHAIN_KEY } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import { useContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'
import { toWei } from 'web3-utils'

const useAuctionToken = () => {
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const contract = useContract(
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOTokenFactory.address : undefined,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOTokenFactory.abi : undefined
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
    async (name: string, symbol: string, totalSupply: number, tokenTemplateAddress: string) => {
      if (!contract) throw new Error('Contract not initialized')
      if (!account) throw new Error('Wallet not connected')

      const templateId = await contract.getTemplateId(tokenTemplateAddress)
      const tx = await contract.createToken(
        templateId,
        account,
        defaultAbiCoder.encode(
          ['string', 'string', 'address', 'uint256'],
          [name, symbol, account, toWei(totalSupply.toString())]
        )
      )

      addTransaction(tx, { summary: 'Initialize Fixed Token' })

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

export default useAuctionToken
