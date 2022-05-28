import { isAddress } from '@ethersproject/address'
import { ChainId } from '@sushiswap/chain'
import { Native, Token, Type } from '@sushiswap/currency'
import { filterTokens, useDebounce, useSortedTokensByQuery } from '@sushiswap/hooks'
import { FC, RefObject, useMemo, useRef, useState } from 'react'
import { useToken } from 'wagmi'

interface RenderProps {
  currencies: Type[]
  inputRef: RefObject<HTMLInputElement>
  query: string
  onInput(query: string): void
  searching: boolean
}

interface Props {
  chainId?: ChainId
  tokenMap: Record<string, Token>
  children(props: RenderProps): JSX.Element
  includeNative?: boolean
}

export const TokenListFilterByQuery: FC<Props> = ({ children, chainId, tokenMap, includeNative = false }) => {
  const tokenMapValues = useMemo(() => Object.values(tokenMap), [tokenMap])
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState<string>('')
  const debouncedQuery = useDebounce(query, 400)
  const searching = useRef<boolean>(false)
  const _includeNative =
    includeNative &&
    chainId &&
    (!debouncedQuery || debouncedQuery.toLowerCase().includes(Native.onChain(chainId).symbol.toLowerCase()))

  const { data: searchTokenResult } = useToken({ address: isAddress(debouncedQuery) ? debouncedQuery : undefined })
  const searchToken = useMemo(() => {
    if (!searchTokenResult || !chainId) return undefined
    const { decimals, address, symbol } = searchTokenResult
    return new Token({ chainId, decimals, address, symbol })
  }, [chainId, searchTokenResult])

  const filteredTokens: Token[] = useMemo(() => {
    const filtered = filterTokens(tokenMapValues, debouncedQuery)
    searching.current = false

    if (searchToken && chainId) {
      const { decimals, address, symbol } = searchToken
      const _searchToken = new Token({ chainId, decimals, address, symbol })
      return [_searchToken, ...filtered]
    }
    return filtered
  }, [tokenMapValues, debouncedQuery, searchToken, chainId])

  const filteredSortedTokens = useSortedTokensByQuery(filteredTokens, debouncedQuery)
  const filteredSortedTokensWithNative = useMemo(() => {
    if (_includeNative) return [Native.onChain(chainId), ...filteredSortedTokens]
    return filteredSortedTokens
  }, [_includeNative, chainId, filteredSortedTokens])

  return children({
    currencies: filteredSortedTokensWithNative,
    inputRef,
    query,
    onInput: setQuery,
    searching: searching.current,
  })
}
