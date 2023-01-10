import { isAddress } from '@ethersproject/address'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Token, Type } from '@sushiswap/currency'
import { useDebounce } from '@sushiswap/hooks'
import { Fraction } from '@sushiswap/math'
import { FC, useMemo, useState } from 'react'
import { useToken } from 'wagmi'
import { useSortedTokensByQuery, tokenComparator, filterTokens } from '../../hooks/useSortedTokensByQuery'

interface RenderProps {
  currencies: Type[]
  query: string
  onInput(query: string): void
  searching: boolean
  queryToken: [Token | undefined]
}

interface Props {
  chainId?: ChainId
  tokenMap: Record<string, Token> | undefined
  pricesMap?: Record<string, Fraction>
  balancesMap?: Record<string, Amount<Token>>
  children(props: RenderProps): JSX.Element
  includeNative?: boolean
}

export const TokenSelectorListFilterByQuery: FC<Props> = ({
  children,
  chainId,
  tokenMap,
  balancesMap,
  pricesMap,
  includeNative = true,
}) => {
  const tokenMapValues = useMemo(() => (tokenMap ? Object.values(tokenMap) : []), [tokenMap])
  const [query, setQuery] = useState<string>('')
  const debouncedQuery = useDebounce(query, 400)
  const _includeNative =
    includeNative &&
    chainId &&
    (!debouncedQuery || debouncedQuery.toLowerCase().includes(Native.onChain(chainId).symbol.toLowerCase()))

  const { data: searchTokenResult, isLoading } = useToken({
    address: isAddress(debouncedQuery) && !tokenMap?.[debouncedQuery.toLowerCase()] ? debouncedQuery : undefined,
    chainId,
  })

  const searchToken = useMemo(() => {
    if (!searchTokenResult || !chainId) return undefined
    const { decimals, address, symbol, name } = searchTokenResult
    return new Token({ chainId, decimals, address, symbol, name })
  }, [chainId, searchTokenResult])

  const filteredTokens: Token[] = useMemo(() => filterTokens(tokenMapValues, query), [query, tokenMapValues])
  const sortedTokens: Token[] = useMemo(
    () => [...filteredTokens].sort(tokenComparator(balancesMap, pricesMap)),
    [filteredTokens, pricesMap, balancesMap]
  )

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)

  const filteredSortedTokensWithNative = useMemo(() => {
    if (_includeNative) return [Native.onChain(chainId), ...filteredSortedTokens]
    return filteredSortedTokens
  }, [_includeNative, chainId, filteredSortedTokens])

  return children({
    currencies: filteredSortedTokensWithNative,
    query,
    onInput: setQuery,
    searching: isLoading,
    queryToken: [searchToken],
  })
}
