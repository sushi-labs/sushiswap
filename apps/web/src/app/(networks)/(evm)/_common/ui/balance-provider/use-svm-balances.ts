import { TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import {
  TOKEN_2022_PROGRAM_ADDRESS,
  findAssociatedTokenPda,
} from '@solana-program/token-2022'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getSvmRpc } from 'src/lib/svm/rpc'
import { useAccount } from 'src/lib/wallet'
import { getNativeAddress } from 'sushi'
import { type SvmAddress, type SvmChainId, svmAddress } from 'sushi/svm'
import { STALE_TIME } from './config'
import type { UseBalancesReturn } from './types'

type FetchSvmBalancesParams = {
  chainId: SvmChainId
  tokenAddresses: SvmAddress[]
  account: SvmAddress
}

const ACCOUNT_FETCH_CHUNK_SIZE = 100

const fetchSvmBalances = async ({
  chainId,
  tokenAddresses,
  account,
}: FetchSvmBalancesParams): Promise<ReadonlyMap<SvmAddress, bigint>> => {
  const nativeAddress = getNativeAddress(chainId) as SvmAddress
  const uniqueTokenAddresses = Array.from(new Set(tokenAddresses))

  const includesNative = uniqueTokenAddresses.includes(nativeAddress)
  const requestedMints = uniqueTokenAddresses.filter(
    (address) => address !== nativeAddress,
  )

  const balanceMap = new Map<SvmAddress, bigint>()
  requestedMints.forEach((mint) => balanceMap.set(mint, 0n))

  const rpc = getSvmRpc()

  if (includesNative) {
    const result = await rpc.getBalance(account).send()
    balanceMap.set(nativeAddress, result.value)
  }

  if (requestedMints.length > 0) {
    const ataToMintMap = new Map<SvmAddress, SvmAddress>()
    const allPotentialAccounts: SvmAddress[] = []

    await Promise.all(
      requestedMints.map(async (mint) => {
        const [classicAta] = await findAssociatedTokenPda({
          mint: mint as SvmAddress,
          owner: account as SvmAddress,
          tokenProgram: TOKEN_PROGRAM_ADDRESS,
        })

        const [token22Ata] = await findAssociatedTokenPda({
          mint: mint as SvmAddress,
          owner: account as SvmAddress,
          tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
        })

        allPotentialAccounts.push(classicAta, token22Ata)
        ataToMintMap.set(classicAta, mint)
        ataToMintMap.set(token22Ata, mint)
      }),
    )

    for (
      let offset = 0;
      offset < allPotentialAccounts.length;
      offset += ACCOUNT_FETCH_CHUNK_SIZE
    ) {
      const slice = allPotentialAccounts.slice(
        offset,
        offset + ACCOUNT_FETCH_CHUNK_SIZE,
      )

      const { value } = await rpc
        .getMultipleAccounts(slice, {
          encoding: 'jsonParsed',
          commitment: 'confirmed',
        })
        .send()

      value.forEach((accountInfo, index) => {
        if (!accountInfo) return

        // Parse the RPC response
        const parsed = (accountInfo as { data?: { parsed?: unknown } }).data
          ?.parsed as
          | { info?: { mint?: string; tokenAmount?: { amount?: string } } }
          | undefined

        const amountStr = parsed?.info?.tokenAmount?.amount
        const parsedMint = parsed?.info?.mint

        // Match the result back to our original requested mint
        const queriedAddress = slice[index]
        const originalMint = ataToMintMap.get(queriedAddress!)

        if (!originalMint || !amountStr) return

        // Safety: Ensure the on-chain mint matches what we expected
        if (parsedMint && parsedMint !== originalMint) return

        // Set the balance (If we found a valid account, overwrite the 0 default)
        balanceMap.set(originalMint, BigInt(amountStr))
      })
    }
  }

  return balanceMap
}

export function useSvmBalances(
  chainId: SvmChainId | undefined,
  tokenAddresses: SvmAddress[] | undefined,
): UseBalancesReturn<SvmChainId> {
  const account = useAccount('svm')

  const uniqueTokenAddresses = useMemo(() => {
    if (!tokenAddresses) {
      return undefined
    }
    return Array.from(new Set(tokenAddresses))
  }, [tokenAddresses])

  const hasTokens = Boolean(uniqueTokenAddresses?.length)

  const query = useQuery({
    queryKey: [
      'svm-balances',
      { chainId, account, tokenAddresses: uniqueTokenAddresses },
    ],
    queryFn: () => {
      if (!chainId || !account || !uniqueTokenAddresses) {
        throw new Error('Missing parameters for fetching SVM balances')
      }

      return fetchSvmBalances({
        chainId: chainId,
        tokenAddresses: uniqueTokenAddresses,
        account,
      })
    },
    enabled: Boolean(chainId && account && hasTokens),
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME,
    refetchInterval: STALE_TIME,
  })

  return useMemo(() => {
    if (!chainId || !tokenAddresses) {
      return {
        data: undefined,
        isError: false,
        isLoading: false,
        isFetching: false,
      }
    }

    if (!hasTokens) {
      return {
        data: new Map(),
        isError: false,
        isLoading: false,
        isFetching: false,
      }
    }

    return {
      data: query.data,
      isError: query.isError,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
    }
  }, [
    query.data,
    query.isError,
    query.isFetching,
    query.isLoading,
    chainId,
    tokenAddresses,
    hasTokens,
  ])
}
