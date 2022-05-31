import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import CHAINLINK_TOKENS from '@sushiswap/chainlink-whitelist/dist/sushiswap-chainlink.whitelist.json'
import { ChainId, Currency, NATIVE, Token } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { filterTokens, useSortedTokensByQuery } from 'app/functions/filtering'
import { isAddress } from 'app/functions/validate'
import { useAllTokens, useIsUserAddedToken, useSearchInactiveTokenLists, useToken } from 'app/hooks/Tokens'
import useDebounce from 'app/hooks/useDebounce'
import CurrencyModalView from 'app/modals/SearchModal/CurrencyModalView'
import { useCurrencyModalContext } from 'app/modals/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import React, { KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react'

import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import ImportRow from './ImportRow'
import { useTokenComparator } from './sorting'

interface CurrencySearchProps {
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  currencyList?: (string | undefined)[]
  allowManageTokenList?: boolean
}

export function CurrencySearch({
  otherSelectedCurrency,
  showCommonBases,
  currencyList,
  allowManageTokenList = true,
}: CurrencySearchProps) {
  const { i18n } = useLingui()
  const router = useRouter()
  let allTokens = useAllTokens()
  const { chainId } = useActiveWeb3React()
  const { setView, onDismiss, onSelect, includeNative, showSearch, setImportToken } = useCurrencyModalContext()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)
  const isAddressSearch = isAddress(debouncedQuery)
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)
  const tokenComparator = useTokenComparator()

  if (router.asPath.startsWith('/kashi/create') && chainId) {
    allTokens = Object.keys(allTokens).reduce((obj, key) => {
      // @ts-ignore TYPE NEEDS FIXING
      if (CHAINLINK_TOKENS[chainId].find((address) => address === key)) obj[key] = allTokens[key]
      return obj
    }, {})
  }

  if (currencyList) {
    allTokens = Object.keys(allTokens).reduce((obj, key) => {
      // @ts-ignore TYPE NEEDS FIXING
      if (currencyList.includes(key)) obj[key] = allTokens[key]
      return obj
    }, {})
  }

  useEffect(() => {
    if (isAddressSearch) {
      gtag('event', 'Search by address', {
        event_category: 'Currency Select',
        event_label: isAddressSearch,
      })
    }
  }, [isAddressSearch])

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery)
  }, [allTokens, debouncedQuery])

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator)
  }, [filteredTokens, tokenComparator])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)
  // @ts-ignore TYPE NEEDS FIXING
  const ether = useMemo(() => chainId && ![ChainId.CELO].includes(chainId) && NATIVE[chainId], [chainId])

  const filteredSortedTokensWithETH: Currency[] = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    if (s === '' || s === 'e' || s === 'et' || s === 'eth') {
      return ether ? [ether, ...filteredSortedTokens] : filteredSortedTokens
    }
    return filteredSortedTokens
  }, [debouncedQuery, ether, filteredSortedTokens])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onSelect(currency)
      onDismiss()
    },
    [onSelect, onDismiss]
  )

  // manage focus on modal show
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checkSum = isAddress(input)
    setSearchQuery(checkSum || input)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'eth' && ether) {
          handleCurrencySelect(ether)
        } else if (filteredSortedTokensWithETH.length > 0) {
          if (
            filteredSortedTokensWithETH[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokensWithETH.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokensWithETH[0])
          }
        }
      }
    },
    [debouncedQuery, ether, filteredSortedTokensWithETH, handleCurrencySelect]
  )

  // if no results on main list, show option to expand into inactive
  const filteredInactiveTokens = useSearchInactiveTokenLists(
    filteredTokens.length === 0 || (debouncedQuery.length > 2 && !isAddressSearch) ? debouncedQuery : undefined
  )

  const handleImport = useCallback(() => {
    if (searchToken) {
      setImportToken(searchToken)
    }

    setView(CurrencyModalView.importToken)
  }, [searchToken, setImportToken, setView])

  return (
    <>
      <HeadlessUiModal.Header onClose={onDismiss} header={i18n._(t`Select a token`)} />
      {showSearch && (
        <input
          type="text"
          id="token-search-input"
          placeholder={i18n._(t`Search name or paste address`)}
          autoComplete="off"
          value={searchQuery}
          onChange={handleInput}
          onKeyDown={handleEnter}
          className="w-full bg-[rgba(0,0,0,0.2)] border border-dark-800 focus:border-blue rounded placeholder-secondary font-bold text-base p-4 appearance-none"
        />
      )}
      {showCommonBases && <CommonBases />}

      {searchToken && !searchTokenIsAdded && <ImportRow token={searchToken} onClick={handleImport} />}
      <div className="h-full overflow-hidden overflow-y-auto border rounded border-dark-800 bg-[rgba(0,0,0,0.2)]">
        {filteredSortedTokens?.length > 0 || filteredInactiveTokens?.length > 0 ? (
          <CurrencyList
            currencies={includeNative ? filteredSortedTokensWithETH : filteredSortedTokens}
            otherListTokens={filteredInactiveTokens}
            otherCurrency={otherSelectedCurrency}
          />
        ) : (
          <Typography weight={700} variant="xs" className="flex items-center justify-center h-full text-secondary">
            {i18n._(t`No results found`)}
          </Typography>
        )}
      </div>
      {allowManageTokenList && (
        <div className="flex justify-center">
          <Button
            size="sm"
            id="list-token-manage-button"
            onClick={() => setView(CurrencyModalView.manage)}
            color="blue"
            variant="empty"
          >
            {i18n._(t`Manage Token Lists`)}
          </Button>
        </div>
      )}
    </>
  )
}
