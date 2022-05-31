import { CurrencyAmount, JSBI, Rebase, Token, ZERO } from '@sushiswap/core-sdk'
import { isAddress, toAmountCurrencyAmount } from 'app/functions'
import { useAllTokens } from 'app/hooks/Tokens'
import { useBentoBoxContract } from 'app/hooks/useContract'
import { useSingleCallResult, useSingleContractMultipleData } from 'app/lib/hooks/multicall'
import { useActiveWeb3React } from 'app/services/web3'
import { OptionalMethodInputs } from 'app/types'
import { useMemo } from 'react'

export interface BentoBalance {
  address: string
  name: string
  symbol: string
  decimals: number
  balance: any
  bentoBalance: any
  wallet: any
  bento: any
}

const BLACKLISTED = [
  '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
  '0x72B886d09C117654aB7dA13A14d603001dE0B777',
  '0x21413c119b0C11C5d96aE1bD328917bC5C8ED67E',
]

export function useBentoMasterContractAllowed(masterContract?: string, user?: string): boolean | undefined {
  const contract = useBentoBoxContract()

  const inputs = useMemo(() => [masterContract, user], [masterContract, user])

  const allowed = useSingleCallResult(contract, 'masterContractApproved', inputs).result

  return useMemo(() => (allowed ? allowed[0] : undefined), [allowed])
}

export const useBentoBalancesV2 = (tokenAddresses?: string[]): { data: CurrencyAmount<Token>[]; loading: boolean } => {
  const { account } = useActiveWeb3React()
  return useBentoBalancesV2ForAccount(account, tokenAddresses)
}

export const useBentoBalancesV2ForAccount = (
  account?: null | string,
  tokenAddresses?: string[]
): { data: CurrencyAmount<Token>[]; loading: boolean } => {
  const { chainId } = useActiveWeb3React()
  return useBentoBalancesWeb3({
    account,
    shouldFetch: !!chainId,
    tokenAddresses,
  })
}

export const useBentoShareForAccount = (account: string | undefined, token: string | undefined) => {
  const contract = useBentoBoxContract()
  const { result } = useSingleCallResult(contract, 'balanceOf', [token, account])
  if (result && Array.isArray(result) && result.length > 0) {
    return result[0]
  }

  return undefined
}

export const useBentoBalanceV2 = (
  tokenAddress?: string
): { data: CurrencyAmount<Token> | undefined; loading: boolean } => {
  const addresses = useMemo(() => (tokenAddress ? [tokenAddress] : []), [tokenAddress])
  const { data, loading } = useBentoBalancesV2(addresses)

  return {
    data: data?.[0],
    loading,
  }
}

export const useBentoBalancesWeb3 = ({
  account,
  shouldFetch = true,
  tokenAddresses,
}: {
  account: string | null | undefined
  shouldFetch?: boolean
  tokenAddresses?: string[]
}) => {
  // const { account } = useActiveWeb3React()
  const contract = useBentoBoxContract()
  const allTokens = useAllTokens()
  const totalsInput = useMemo(
    () =>
      shouldFetch
        ? tokenAddresses && tokenAddresses.length > 0
          ? tokenAddresses.map((el) => [el])
          : Object.keys(allTokens).reduce<string[][]>((acc, token) => {
              if (!BLACKLISTED.includes(token) && isAddress(token)) acc.push([token])
              return acc
            }, [])
        : [],
    [tokenAddresses, allTokens, shouldFetch]
  )

  const totals = useSingleContractMultipleData(contract, 'totals', totalsInput)
  const anyLoading = totals.some((callState) => callState.loading)
  const [tokens, baseTotals, balanceInput] = useMemo(
    () =>
      !anyLoading
        ? totals.reduce<[Token[], Rebase[], OptionalMethodInputs[]]>(
            (acc, el, i) => {
              if (account && el?.result && JSBI.greaterThan(JSBI.BigInt(el.result[0]), JSBI.BigInt(0))) {
                const { base, elastic } = el.result
                acc[0].push(allTokens[totalsInput[i][0]])
                acc[1].push({ base: JSBI.BigInt(base), elastic: JSBI.BigInt(elastic) })
                acc[2].push([totalsInput[i][0], account])
              }

              return acc
            },
            [[], [], []]
          )
        : [[], [], []],
    [account, totalsInput, allTokens, anyLoading, totals]
  )

  const balances = useSingleContractMultipleData(contract, 'balanceOf', balanceInput)
  return useMemo(() => {
    return {
      data: balances.reduce<CurrencyAmount<Token>[]>((acc, el, i) => {
        if (baseTotals[i] && tokens[i] && el.result?.[0]) {
          const amount = toAmountCurrencyAmount(
            baseTotals[i],
            CurrencyAmount.fromRawAmount(tokens[i], JSBI.BigInt(el.result[0]))
          )

          if (amount.greaterThan(ZERO)) {
            acc.push(amount)
          }
        }

        return acc
      }, []),
      loading: anyLoading,
    }
  }, [anyLoading, balances, baseTotals, tokens])
}
