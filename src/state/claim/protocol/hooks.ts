import { getAddress, isAddress } from '@ethersproject/address'
import { TransactionResponse } from '@ethersproject/providers'
import { ChainId, Currency, CurrencyAmount, JSBI, SUSHI } from '@sushiswap/core-sdk'
import { PROTOCOL_MERKLE_ROOT as MERKLE_ROOT } from 'app/constants'
import { calculateGasMargin } from 'app/functions/trade'
import { useProtocolMerkleDistributorContract as useMerkleDistributorContract } from 'app/hooks/useContract'
import { useSingleCallResult } from 'app/lib/hooks/multicall'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useEffect, useState } from 'react'

interface UserClaimData {
  index: number
  amount: string
  proof: string[]
  flags?: {
    isSOCKS: boolean
    isLP: boolean
    isUser: boolean
  }
}

const CLAIM_PROMISES: { [key: string]: Promise<any | UserClaimData | null> } = {}

// returns the claim for the given address, or null if not valid
function fetchClaim(account: string, chainId: ChainId): Promise<any | UserClaimData | null> {
  if (!isAddress(account)) return Promise.reject(new Error('Invalid address'))
  const key = `${chainId}:${account}`
  // console.log('CLAIM_PROMISE:', CLAIM_PROMISES[key], key)
  return (CLAIM_PROMISES[key] =
    CLAIM_PROMISES[key] ??
    fetch(MERKLE_ROOT)
      .then((response) => response.json())
      .then((data) => {
        const claim: typeof data.claims[0] | undefined = data.claims[getAddress(account)] ?? undefined
        if (!claim) return null

        // console.log('claim:', claim)
        return {
          index: claim.index,
          amount: claim.amount,
          proof: claim.proof,
        }
      })
      .catch((error) => console.error('Failed to get claim data', error)))
}

// parse distributorContract blob and detect if user has claim data
// null means we know it does not
export function useUserClaimData(account: string | null | undefined): UserClaimData | null | undefined {
  const { chainId } = useActiveWeb3React()

  const key = `${chainId}:${account}`
  const [claimInfo, setClaimInfo] = useState<{
    [key: string]: UserClaimData | null
  }>({})

  useEffect(() => {
    if (!account || !chainId) return
    fetchClaim(account, chainId).then((accountClaimInfo) =>
      setClaimInfo((claimInfo) => {
        // console.log('claimInfo:', claimInfo, accountClaimInfo, key)
        return {
          ...claimInfo,
          [key]: accountClaimInfo,
        }
      })
    )
  }, [account, chainId, key])

  return account && chainId ? claimInfo[key] : undefined
}

// check if user is in blob and has not yet claimed UNI
export function useUserHasAvailableClaim(account: string | null | undefined): boolean {
  const userClaimData = useUserClaimData(account)
  const distributorContract = useMerkleDistributorContract()
  const isClaimedResult = useSingleCallResult(distributorContract, 'isClaimed', [userClaimData?.index])
  // user is in blob and contract marks as unclaimed
  return Boolean(userClaimData && !isClaimedResult.loading && isClaimedResult.result?.[0] === false)
}

export function useUserUnclaimedAmount(account: string | null | undefined): CurrencyAmount<Currency> | undefined {
  const { chainId } = useActiveWeb3React()
  const userClaimData = useUserClaimData(account)
  const canClaim = useUserHasAvailableClaim(account)

  const sushi = chainId ? SUSHI[chainId as ChainId] : undefined

  // console.log('claimStats:', {
  //   canClaim: canClaim,
  //   userClaimData: userClaimData,
  //   sushi: sushi
  // })

  if (!sushi) return undefined
  if (!canClaim || !userClaimData) {
    return CurrencyAmount.fromRawAmount(sushi, JSBI.BigInt(0))
  }
  return CurrencyAmount.fromRawAmount(sushi, JSBI.BigInt(userClaimData.amount))
}

export function useClaimCallback(account: string | null | undefined): {
  claimCallback: () => Promise<string>
} {
  // get claim data for this account
  const { library, chainId } = useActiveWeb3React()
  const claimData = useUserClaimData(account)

  // used for popup summary
  const unClaimedAmount: CurrencyAmount<Currency> | undefined = useUserUnclaimedAmount(account)
  const addTransaction = useTransactionAdder()
  const distributorContract = useMerkleDistributorContract()

  const claimCallback = async function () {
    if (!claimData || !account || !library || !chainId || !distributorContract) return

    const args = [claimData.index, account, claimData.amount, claimData.proof]

    return distributorContract.estimateGas['claim'](...args, {}).then((estimatedGasLimit) => {
      return distributorContract
        .claim(...args, {
          value: null,
          gasLimit: calculateGasMargin(estimatedGasLimit),
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Claimed ${unClaimedAmount?.toSignificant(4)} SUSHI`,
            claim: { recipient: account },
          })
          return response.hash
        })
    })
  }

  return { claimCallback }
}
