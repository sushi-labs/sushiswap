import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { useDebounce } from '@sushiswap/hooks'
import { filterTokens, useSortedTokensByQuery } from '@sushiswap/hooks/dist/useSortedTokensByQuery'
import { FC, RefObject, useMemo, useRef, useState } from 'react'
import { useToken } from 'wagmi'

interface RenderProps {
  currencies: Token[]
  inputRef: RefObject<HTMLInputElement>
  query: string
  onInput(query: string): void
  searching: boolean
}

interface Props {
  chainId?: ChainId
  tokenMap: Record<string, Token>
  children(props: RenderProps): JSX.Element
}

export const TokenListFilterByQuery: FC<Props> = ({ children, chainId, tokenMap }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState<string>('')
  const debouncedQuery = useDebounce(query, 400)
  const searching = useRef<boolean>(false)

  const { data: searchTokenResult } = useToken({ address: debouncedQuery })
  const searchToken = useMemo(() => {
    if (!searchTokenResult || !chainId) return undefined
    const { decimals, address, symbol } = searchTokenResult
    return new Token({ chainId, decimals, address, symbol })
  }, [chainId, searchTokenResult])

  const filteredTokens: Token[] = useMemo(() => {
    const filtered = filterTokens(Object.values(tokenMap), debouncedQuery)
    searching.current = false

    if (searchToken && chainId) {
      const { decimals, address, symbol } = searchToken
      const _searchToken = new Token({ chainId, decimals, address, symbol })
      return [_searchToken, ...filtered]
    }
    return filtered
  }, [tokenMap, debouncedQuery, searchToken, chainId])

  const filteredSortedTokens = useSortedTokensByQuery(filteredTokens, debouncedQuery)

  return children({
    currencies: filteredSortedTokens,
    inputRef,
    query,
    onInput: setQuery,
    searching: searching.current,
  })
}
