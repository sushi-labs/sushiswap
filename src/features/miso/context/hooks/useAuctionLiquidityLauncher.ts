import { defaultAbiCoder } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { CHAIN_KEY } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import { useLiquidityLauncherTemplateMap } from 'app/features/miso/context/hooks/useLiquidityLauncherTemplateMap'
import { LiquidityLauncherTemplate } from 'app/features/miso/context/types'
import { LiquidityLauncherFormInputFormatted } from 'app/features/miso/LiquidityLauncherCreationForm'
import { useContract, useFactoryContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

export const useAuctionLiquidityLauncher = () => {
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const factory = useFactoryContract()
  const contract = useContract(
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOLauncher.address : undefined,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOLauncher.abi : undefined
  )
  const { map: templateMap } = useLiquidityLauncherTemplateMap()

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
    async (data: LiquidityLauncherFormInputFormatted) => {
      if (!contract) throw new Error('Contract not initialized')
      if (!factory) throw new Error('Factory contract not initialized')
      if (!templateMap) throw new Error('Template map not initialized')
      if (!account) throw new Error('Wallet not connected')
      if (!data.tokenSupply) throw new Error('Token supply not defined')

      const templateId = await contract.getTemplateId(
        templateMap[LiquidityLauncherTemplate.PostAuctionLauncher].address
      )

      /**
       * @param _templateId Id of the auction template to create.
       * @param _token The token address to be sold.
       * @param _tokenSupply Amount of tokens to be sold at market.
       * @param _integratorFeeAccount Address to send refferal bonus, if set.
       * @param _data Data to be sent to template on Init.
       */
      const tx = await contract.createLauncher(
        templateId,
        data.tokenAddress,
        data.tokenSupply.quotient.toString(),
        AddressZero, //feeIntegrator

        /**
         * @notice Initializes main contract variables (requires launchwindow to be more than 2 days.)
         * @param _market Auction address for launcher.
         * @param _factory Uniswap V2 factory address.
         * @param _admin Contract owner address.
         * @param _wallet Withdraw wallet address.
         * @param _liquidityPercent Percentage of payment currency sent to liquidity pool.
         * @param _locktime How long the liquidity will be locked. Number of seconds.
         */
        defaultAbiCoder.encode(
          ['address', 'address', 'address', 'address', 'uint256', 'uint256'],
          [data.auctionAddress, factory.address, data.adminAddress, account, data.liqPercentage, data.liqLockTime]
        )
      )

      addTransaction(tx, { summary: 'Initialize Liquidity Launcher' })

      return tx
    },
    [account, addTransaction, contract, factory, templateMap]
  )

  return {
    init,
    subscribe,
    unsubscribe,
  }
}
