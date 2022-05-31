import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { Fraction } from 'app/entities/bignumber'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { ApprovalState } from './useApproveCallback'
import { useMeowshiContract, useSushiBarContract, useSushiContract } from './useContract'
import { BalanceProps } from './useTokenBalance'

const useMeowshi = (sushi: boolean) => {
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const sushiContract = useSushiContract(true)
  const barContract = useSushiBarContract(true)
  const meowshiContract = useMeowshiContract(true)
  const [pendingApproval, setPendingApproval] = useState(false)

  const [allowance, setAllowance] = useState('0')
  const fetchAllowance = useCallback(async () => {
    if (account) {
      try {
        let allowance
        if (sushi) {
          allowance = await sushiContract?.allowance(account, meowshiContract?.address)
        } else {
          allowance = await barContract?.allowance(account, meowshiContract?.address)
        }

        const formatted = Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString()
        setAllowance(formatted)
      } catch (error) {
        setAllowance('0')
      }
    }
  }, [account, sushi, sushiContract, meowshiContract?.address, barContract])

  useEffect(() => {
    if (account && meowshiContract) {
      if ((sushi && sushiContract) || (!sushi && barContract)) {
        fetchAllowance()
      }
    }

    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, meowshiContract, fetchAllowance, sushiContract, barContract, sushi])

  const approvalState: ApprovalState = useMemo(() => {
    if (!account) return ApprovalState.UNKNOWN
    if (pendingApproval) return ApprovalState.PENDING
    if (!allowance || Number(allowance) === 0) return ApprovalState.NOT_APPROVED

    return ApprovalState.APPROVED
  }, [account, allowance, pendingApproval])

  const approve = useCallback(async () => {
    try {
      setPendingApproval(true)

      let tx
      if (sushi) {
        tx = await sushiContract?.approve(meowshiContract?.address, MaxUint256.toString())
      } else {
        tx = await barContract?.approve(meowshiContract?.address, MaxUint256.toString())
      }

      addTransaction(tx, { summary: 'Approve' })
      await tx.wait()
      return tx
    } catch (e) {
      return e
    } finally {
      setPendingApproval(false)
    }
  }, [sushi, addTransaction, sushiContract, meowshiContract?.address, barContract])

  const meow = useCallback(
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await meowshiContract?.meow(account, amount?.value)
          addTransaction(tx, { summary: 'Enter Meowshi' })
          return tx
        } catch (e) {
          return e
        }
      }
    },
    [account, addTransaction, meowshiContract]
  )

  const unmeow = useCallback(
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await meowshiContract?.unmeow(account, amount?.value)
          addTransaction(tx, { summary: 'Leave Meowshi' })
          return tx
        } catch (e) {
          return e
        }
      }
    },
    [account, addTransaction, meowshiContract]
  )

  const meowSushi = useCallback(
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await meowshiContract?.meowSushi(account, amount?.value)
          addTransaction(tx, { summary: 'Enter Meowshi' })
          return tx
        } catch (e) {
          return e
        }
      }
    },
    [account, addTransaction, meowshiContract]
  )

  const unmeowSushi = useCallback(
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await meowshiContract?.unmeowSushi(account, amount?.value)
          addTransaction(tx, { summary: 'Leave Meowshi' })
          return tx
        } catch (e) {
          return e
        }
      }
    },
    [account, addTransaction, meowshiContract]
  )

  return {
    approvalState,
    approve,
    meow,
    unmeow,
    meowSushi,
    unmeowSushi,
  }
}

export default useMeowshi
