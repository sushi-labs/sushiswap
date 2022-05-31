import { CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { ApprovalState } from 'app/hooks/useApproveCallback'
import useBentoMasterApproveCallback, { BentoMasterApproveCallback } from 'app/hooks/useBentoMasterApproveCallback'
import { useInariContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

import { useDerivedInariState } from '../hooks'
import { BaseStrategyHook } from '../strategies/useBaseStrategy'
import useTrait, { BaseTrait } from './useTrait'

const TRAIT_CONFIG = {
  overrides: ['execute', 'approveCallback', 'bentoApproveCallback'],
}

export interface BaseStrategyWithBentoBoxTraitHook
  extends Omit<BaseStrategyHook, 'approveCallback' | 'bentoApproveCallback'>,
    BaseTrait {
  approveCallback: [ApprovalState, () => Promise<void>] | null
  bentoApproveCallback?: BentoMasterApproveCallback
  overrides: string[]
}

// Use this trait when strategies have BentoBox as their output.
// Strategies that end up in BentoBox don't need to to approve inari to spend tokens when unzapping
// hence the approveCallback is null when unzapping
const useBentoBoxTrait = (props: BaseStrategyHook): BaseStrategyWithBentoBoxTraitHook => {
  // @ts-ignore TYPE NEEDS FIXING
  const trait = useTrait(props, TRAIT_CONFIG)
  const { account } = useActiveWeb3React()
  const { zapIn } = useDerivedInariState()
  const inariContract = useInariContract()
  const addTransaction = useTransactionAdder()
  // @ts-ignore TYPE NEEDS FIXING
  const bentoApproveCallback = useBentoMasterApproveCallback(inariContract.address, {
    otherBentoBoxContract: inariContract,
    contractName: 'Inari',
    functionFragment: 'setBentoApproval',
  })

  // Batch execute with permit if one is provided or else execute normally
  const batchExecute = useCallback(
    async (val: CurrencyAmount<Token>) => {
      if (!inariContract) return

      const method = zapIn ? props.general.zapMethod : props.general.unzapMethod

      try {
        // If we have a permit, batch tx with permit
        if (bentoApproveCallback.permit) {
          const batch = [
            bentoApproveCallback.permit.data,
            inariContract?.interface?.encodeFunctionData(method, [
              account,
              val.toExact().toBigNumber(val.currency.decimals),
            ]),
          ]

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
    [account, addTransaction, bentoApproveCallback.permit, inariContract, props, zapIn]
  )

  // When we unzap from bentoBox we only need an EIP-712 permit,
  // so we don't have to check if we have approved inari to spend the token
  return {
    ...trait,
    execute: batchExecute,
    approveCallback: !zapIn ? null : props.approveCallback,
    bentoApproveCallback,
  }
}

export default useBentoBoxTrait
