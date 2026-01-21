import type { JsonParsedTokenAccount } from '@solana/kit'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { SVM_FALLBACK_ACCOUNT } from 'src/lib/svm/config'
import { getSvmRpc } from 'src/lib/svm/rpc'
import { getNativeAddress } from 'sushi'
import { type SvmAddress, type SvmChainId, svmAddress } from 'sushi/svm'
import { STALE_TIME } from './config'
import type { UseBalancesReturn } from './types'

const TOKEN_PROGRAM_ID = svmAddress(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
)
const TOKEN_QUERY_THRESHOLD = 4

type TokenAccountParsed = {
  account: {
    data: {
      parsed: {
        info: JsonParsedTokenAccount
      }
    }
  }
}

type FetchSvmBalancesParams = {
  chainId: SvmChainId
  tokenAddresses: SvmAddress[]
  account: SvmAddress
}

const parseTokenAccounts = (
  accounts: readonly TokenAccountParsed[],
  requestedMints: Set<SvmAddress>,
  balanceMap: Map<SvmAddress, bigint>,
) => {
  accounts.forEach((account) => {
    const info = account.account.data.parsed.info
    const mint = info.mint as SvmAddress
    const amount = info.tokenAmount.amount

    if (!requestedMints.has(mint)) {
      return
    }

    const previous = balanceMap.get(mint) ?? 0n
    balanceMap.set(mint, previous + BigInt(amount))
  })
}

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
    if (requestedMints.length <= TOKEN_QUERY_THRESHOLD) {
      const results = await Promise.all(
        requestedMints.map((mint) =>
          rpc
            .getTokenAccountsByOwner(
              account,
              { mint },
              { encoding: 'jsonParsed' },
            )
            .send(),
        ),
      )

      results.forEach((result, index) => {
        const mint = requestedMints[index]
        parseTokenAccounts(result.value, new Set([mint]), balanceMap)
      })
    } else {
      const result = await rpc
        .getTokenAccountsByOwner(
          account,
          { programId: TOKEN_PROGRAM_ID },
          { encoding: 'jsonParsed' },
        )
        .send()
      parseTokenAccounts(result.value, new Set(requestedMints), balanceMap)
    }
  }

  return balanceMap
}

export function useSvmBalances(
  chainId: SvmChainId | undefined,
  tokenAddresses: SvmAddress[] | undefined,
): UseBalancesReturn<SvmChainId> {
  const account = SVM_FALLBACK_ACCOUNT

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
    queryFn: () =>
      fetchSvmBalances({
        chainId: chainId!,
        tokenAddresses: uniqueTokenAddresses!,
        account,
      }),
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
