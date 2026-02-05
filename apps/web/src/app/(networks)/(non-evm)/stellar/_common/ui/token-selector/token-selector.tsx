import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { StrKey } from '@stellar/stellar-sdk'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  List,
  TextField,
} from '@sushiswap/ui'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { DialogHeader, DialogTitle, DialogTrigger } from '@sushiswap/ui'
import { classNames } from '@sushiswap/ui'
import React, {
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { staticTokens } from '~stellar/_common/lib/assets/token-assets'
import { useCommonTokens } from '~stellar/_common/lib/hooks/token/use-common-tokens'
import { useCustomTokens } from '~stellar/_common/lib/hooks/token/use-custom-tokens'
import { useSortedTokenList } from '~stellar/_common/lib/hooks/token/use-sorted-token-list'
import { useTokenBalancesMap } from '~stellar/_common/lib/hooks/token/use-token-balance'
import { useTokenWithCache } from '~stellar/_common/lib/hooks/token/use-token-with-cache'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { useStellarWallet } from '~stellar/providers'
import { TokenIcon } from '../General/TokenIcon'
import { TokenSelectorImportRow } from './token-selector-import-row'
import { TokenListItem } from './token-selector-list-item'

type RowCallback = (row: {
  index: number
  style: CSSProperties
}) => ReactElement<any>

interface PropType {
  id: string
  selected: Token | undefined
  onSelect: (token: Token) => void
  children: ReactNode
}

export default function TokenSelector({
  id,
  selected,
  children,
  onSelect,
}: PropType) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const { connectedAddress } = useStellarWallet()
  const { data: commonTokens } = useCommonTokens()
  const { data: customTokens, mutate: customTokenMutate } = useCustomTokens()
  const { data: queryToken, isLoading: isLoadingQueryToken } =
    useTokenWithCache({
      address: query,
      enabled: StrKey.isValidContract(query),
      keepPreviousData: false,
    })

  // Merge common tokens (from StellarExpert + hardcoded) into the main token map
  const allTokens = useMemo(() => {
    const merged = Object.fromEntries(
      staticTokens.map((token) => [token.contract, token]),
    )
    if (customTokens) {
      Object.entries(customTokens).forEach(([contract, token]) => {
        merged[contract] = token
      })
    }
    if (commonTokens) {
      Object.entries(commonTokens).forEach(([contract, token]) => {
        merged[contract] = token
      })
    }
    return merged
  }, [customTokens, commonTokens])

  const { data: tokenBalances } = useTokenBalancesMap(
    connectedAddress,
    Object.keys(allTokens),
  )

  const { data: sortedTokenList } = useSortedTokenList({
    query,
    tokenMap: allTokens,
    balanceMap: tokenBalances,
  })

  const handleImport = useCallback(
    (currency: Token) => {
      customTokenMutate('add', currency)
      onSelect(currency)
    },
    [onSelect, customTokenMutate],
  )

  const _onSelect = useCallback(
    (token: Token) => {
      onSelect(token)
      setOpen(false)
    },
    [onSelect],
  )

  const Row = useCallback<RowCallback>(
    ({ index, style }) => {
      return (
        <>
          <TokenListItem
            style={style}
            token={sortedTokenList ? sortedTokenList[index] : ({} as Token)}
            selected={selected?.contract === sortedTokenList?.[index]?.contract}
            onSelect={_onSelect}
            id={id}
          />
        </>
      )
    },
    [selected, sortedTokenList, _onSelect, id],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!flex flex-col justify-start min-h-[85vh]">
        <DialogHeader className="!text-left">
          <DialogTitle>Select a token</DialogTitle>
          <DialogDescription>
            Select a token from our default list or search for a token by symbol
            or address.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <TextField
            placeholder="Search by token or address"
            icon={MagnifyingGlassIcon}
            type="text"
            testdata-id={`${id}-address-input`}
            value={query}
            onValueChange={setQuery}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.values(commonTokens ?? {})
            ?.slice(0, 10)
            ?.map((token, idx) => (
              <CommonTokenButton key={idx} token={token} onSelect={_onSelect} />
            ))}
        </div>
        <List.Control className="relative flex flex-1 flex-col flex-grow gap-3 px-1 py-0.5 min-h-[128px]">
          <div
            data-state={
              !sortedTokenList || isLoadingQueryToken ? 'active' : 'inactive'
            }
            className={classNames(
              'data-[state=active]:block data-[state=active]:flex-1 data-[state=inactive]:hidden',
              'py-0.5 h-[64px] -mb-3',
            )}
          >
            <div className="flex items-center w-full h-full px-3 rounded-lg">
              <div className="flex items-center justify-between flex-grow gap-2 rounded">
                <div className="flex flex-row items-center flex-grow gap-4">
                  <SkeletonCircle radius={40} />
                  <div className="flex flex-col items-start">
                    <SkeletonText className="w-[100px]" />
                    <SkeletonText fontSize="sm" className="w-[60px]" />
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <SkeletonText className="w-[80px]" />
                  <SkeletonText
                    fontSize="sm"
                    align="right"
                    className="w-[40px]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            data-state={
              sortedTokenList && !isLoadingQueryToken ? 'active' : 'inactive'
            }
            className={classNames(
              'data-[state=active]:block data-[state=active]:flex-1 data-[state=inactive]:hidden',
            )}
          >
            {queryToken && !allTokens[queryToken.contract.toUpperCase()] && (
              <TokenSelectorImportRow
                token={queryToken}
                onImport={() => {
                  queryToken && handleImport(queryToken)
                }}
              />
            )}
            <AutoSizer disableWidth>
              {({ height }: { height: number }) => (
                <FixedSizeList
                  width="100%"
                  height={height}
                  itemCount={sortedTokenList ? sortedTokenList?.length : 0}
                  itemSize={64}
                  className={'scroll'}
                  style={{ overflow: 'overlay' }}
                >
                  {Row}
                </FixedSizeList>
              )}
            </AutoSizer>
            {sortedTokenList?.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="flex items-center text-xs text-gray-500 dark:text-slate-500">
                    No tokens found on{' '}
                    <span className="font-medium">Stellar</span>.
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-500">
                    Did you try searching with the token code?
                  </span>
                </div>
              </div>
            )}
          </div>
        </List.Control>
      </DialogContent>
    </Dialog>
  )
}

const CommonTokenButton = ({
  token,
  onSelect,
}: { token: Token; onSelect: (token: Token) => void }) => {
  return (
    <Button
      onClick={() => onSelect(token)}
      key={token.contract}
      size="sm"
      className="flex items-center justify-between w-fit"
      variant="secondary"
    >
      <div className="flex items-center gap-2 w-full ">
        <div className="w-6 h-6">
          <TokenIcon currency={token} width={24} height={24} />
        </div>

        <p>{token.code}</p>
      </div>
    </Button>
  )
}
