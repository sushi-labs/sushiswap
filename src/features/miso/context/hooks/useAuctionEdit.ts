import { CHAIN_KEY } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import { DocumentInput } from 'app/features/miso/context/hooks/useAuctionDocuments'
import { MisoAbiByTemplateId } from 'app/features/miso/context/utils'
import { useContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

export const useAuctionEdit = (
  address?: string,
  launcherAddress?: string,
  templateId?: number,
  liquidityTemplate?: number,
  listAddress?: string
) => {
  const { chainId, account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const liquidityLauncherContract = useContract(
    launcherAddress,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.PostAuctionLauncher.abi : undefined
  )

  const pointListContract = useContract(
    listAddress,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.PointList.abi : undefined
  )

  const auctionContract = useContract(
    address,
    chainId && templateId ? MisoAbiByTemplateId(chainId, templateId) : undefined,
    true
  )

  const editDocuments = useCallback(
    async (documents: DocumentInput[]) => {
      if (!auctionContract) return

      try {
        const [names, data] = documents.reduce<[string[], string[]]>(
          (acc, cur) => {
            acc[0].push(cur.name)
            acc[1].push(cur.data)

            return acc
          },
          [[], []]
        )
        const tx = await auctionContract.setDocuments(names, data)
        addTransaction(tx, { summary: 'Set Auction Documents' })

        return tx
      } catch (e) {
        // @ts-ignore TYPE NEEDS FIXING
        console.error('set document error:', e.message)
      }
    },
    [addTransaction, auctionContract]
  )

  const cancelAuction = useCallback(async () => {
    if (!auctionContract) return

    try {
      const tx = await auctionContract.cancelAuction()
      addTransaction(tx, { summary: 'Cancel Auction' })

      return tx
    } catch (e) {
      // @ts-ignore TYPE NEEDS FIXING
      console.error('cancel auction error:', e.message)
    }
  }, [addTransaction, auctionContract])

  const claimTokens = useCallback(async () => {
    if (!auctionContract || !account) return

    try {
      const tx = await auctionContract['withdrawTokens(address)'](account.toLowerCase())
      addTransaction(tx, { summary: 'Claim tokens' })

      return tx
    } catch (e) {
      console.error('withdraw tokens error: ', e)
    }
  }, [account, addTransaction, auctionContract])

  const finalizeAuction = useCallback(async () => {
    if (!auctionContract) return

    try {
      let tx
      if (liquidityTemplate && liquidityTemplate > 0 && liquidityLauncherContract) {
        tx = await liquidityLauncherContract.finalize()
      } else {
        tx = await auctionContract.finalize()
      }
      addTransaction(tx, { summary: 'Finalize Auction' })
      return tx
    } catch (e) {
      console.error('finalize auction error: ', e)
    }
  }, [addTransaction, auctionContract, liquidityLauncherContract, liquidityTemplate])

  const withdrawDeposits = useCallback(async () => {
    if (!liquidityLauncherContract) return
    if (!(liquidityTemplate && liquidityTemplate > 0)) return

    try {
      const tx = await liquidityLauncherContract.withdrawDeposits()

      addTransaction(tx, { summary: 'Withdraw Deposits' })
      return tx
    } catch (e) {
      console.error('finalize auction error: ', e)
    }
  }, [addTransaction, liquidityLauncherContract, liquidityTemplate])

  const updatePermissionList = useCallback(
    async (address: string) => {
      if (!auctionContract) return

      try {
        const tx = await auctionContract.setList(address)
        addTransaction(tx, { summary: 'Set permission list' })
        return tx
      } catch (e) {
        // @ts-ignore TYPE NEEDS FIXING
        console.error('set permission list error: ', e.message)
      }
    },
    [addTransaction, auctionContract]
  )

  const updatePermissionListStatus = useCallback(
    async (status: boolean) => {
      if (!auctionContract) return

      try {
        const tx = await auctionContract.enableList(status)
        addTransaction(tx, { summary: status ? 'Enable permission list' : 'Disable permission list' })
        return tx
      } catch (e) {
        // @ts-ignore TYPE NEEDS FIXING
        console.error('set permission list status error:', e.message)
      }
    },
    [addTransaction, auctionContract]
  )

  const updatePointList = useCallback(
    async (accounts: string[], amounts: string[]) => {
      if (!pointListContract) return

      try {
        const tx = await pointListContract.setPoints(accounts, amounts)
        addTransaction(tx, { summary: 'Set point list' })
        return tx
      } catch (e) {
        // @ts-ignore TYPE NEEDS FIXING
        console.error('set point list error:', e.message)
      }
    },
    [addTransaction, pointListContract]
  )

  return {
    updatePointList,
    editDocuments,
    cancelAuction,
    claimTokens,
    finalizeAuction,
    updatePermissionList,
    updatePermissionListStatus,
    withdrawDeposits,
  }
}

export default useAuctionEdit
