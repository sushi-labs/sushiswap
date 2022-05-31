import { CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { useInariContract } from 'app/hooks/useContract'
import { useERC20Permit } from 'app/hooks/useERC20Permit'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

import { useDerivedInariState } from '../hooks'
import { BaseStrategyHook } from '../strategies/useBaseStrategy'
import useTrait, { BaseTrait } from './useTrait'

const TRAIT_CONFIG = {
  overrides: ['approveCallback', 'execute'],
}

export interface BaseStrategyWithHasPermitTokenHook extends BaseStrategyHook, BaseTrait {}

// Use this BaseStrategy when outputToken allows for a batched permitToken
// THIS TRAIT IS UNTESTED, PLEASE TEST THOROUGHLY BEFORE USING
const useHasPermitTokenTrait = (props: BaseStrategyHook): BaseStrategyWithHasPermitTokenHook => {
  // @ts-ignore TYPE NEEDS FIXING
  const trait = useTrait(props, TRAIT_CONFIG)
  const { account } = useActiveWeb3React()
  const { zapIn, inputValue } = useDerivedInariState()
  const inariContract = useInariContract()
  const addTransaction = useTransactionAdder()
  const { signatureData, gatherPermitSignature } = useERC20Permit(inputValue, inariContract?.address, {
    type: 1,
    name: 'SushiSwap',
  })

  // Batch execute with permit if one is provided or else execute normally
  const batchExecute = useCallback(
    async (val: CurrencyAmount<Token>) => {
      const method = zapIn ? props.general.zapMethod : props.general.unzapMethod

      try {
        // If we have a permit, batch tx with permit
        if (signatureData) {
          const batch = [
            signatureData,
            inariContract?.interface?.encodeFunctionData(method, [
              account,
              val.toExact().toBigNumber(val.currency.decimals),
            ]),
          ]

          // @ts-ignore TYPE NEEDS FIXING
          const tx = await inariContract.batch(batch, true)
          addTransaction(tx, {
            summary: `Approve Inari Master Contract and ${zapIn ? 'Deposit' : 'Withdraw'} ${
              props.general.outputSymbol
            }`,
          })

          return tx
        }

        // Else proceed normally
        else return props.execute(val)
      } catch (error) {
        console.error(error)
      }
    },
    [account, addTransaction, inariContract, props, signatureData, zapIn]
  )

  // When we unzap and the token allows for a batched permitToken we don't have to approve inari to spend outputToken.
  // We can use the function permitToken
  return {
    ...trait,
    approveCallback: [
      props.approveCallback[0],
      gatherPermitSignature ? gatherPermitSignature : props.approveCallback[1],
    ],
    execute: batchExecute,
  }
}

export default useHasPermitTokenTrait
