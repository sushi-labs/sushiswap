import { TransactionRequest } from '@ethersproject/providers'
import { ChefType } from '@sushiswap/client'
import { Amount, Token } from '@sushiswap/currency'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'

import { useMasterChefContract } from '../useMasterChefContract'
import { useSendTransaction } from '../useSendTransaction'
import { createToast } from '@sushiswap/ui/future/components/toast'

interface UseMasterChefWithdrawParams {
  chainId: number
  chef: ChefType
  pid: number
  amount?: Amount<Token>
  enabled?: boolean
}

type UseMasterChefWithdraw = (params: UseMasterChefWithdrawParams) => ReturnType<typeof useSendTransaction>

export const useMasterChefWithdraw: UseMasterChefWithdraw = ({ chainId, amount, chef, pid, enabled = true }) => {
  const { address } = useAccount()
  const contract = useMasterChefContract(chainId, chef)

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (data && amount) {
        const ts = new Date().getTime()
        void createToast({
          account: address,
          type: 'burn',
          chainId,
          txHash: data.hash,
          promise: data.wait(),
          summary: {
            pending: `Unstaking ${amount.toSignificant(6)} ${amount.currency.symbol} tokens`,
            completed: `Successfully unstaked ${amount.toSignificant(6)} ${amount.currency.symbol} tokens`,
            failed: `Something went wrong when unstaking ${amount.currency.symbol} tokens`,
          },
          groupTimestamp: ts,
          timestamp: ts,
        })
      }
    },
    [amount, chainId, address]
  )

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      if (!address || !chainId || !amount || !contract) return

      setRequest({
        from: address,
        to: contract.address,
        data: contract.interface.encodeFunctionData(
          chef === ChefType.MiniChef ? 'withdrawAndHarvest' : 'withdraw',
          chef === ChefType.MasterChefV1
            ? [pid, amount.quotient.toString()]
            : [pid, amount.quotient.toString(), address]
        ),
      })
    },
    [address, amount, chainId, chef, contract, pid]
  )

  return useSendTransaction({
    chainId,
    onSettled,
    prepare,
    enabled,
  })
}
