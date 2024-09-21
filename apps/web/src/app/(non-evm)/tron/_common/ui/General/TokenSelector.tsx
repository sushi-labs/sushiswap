import { CheckCircleIcon } from '@heroicons/react/20/solid'
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  List,
} from '@sushiswap/ui'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import {
  DEFAULT_TOKEN_LIST,
  DEFAULT_TOKEN_LIST_WITH_KEY,
} from '~tron/_common/constants/token-list'
import { useCustomTokens } from '~tron/_common/lib/hooks/useCustomTokens'
import { useSortedTokenList } from '~tron/_common/lib/hooks/useSortedTokenList'
import { useTokenInfo } from '~tron/_common/lib/hooks/useTokenInfo'
import { IToken } from '~tron/_common/types/token-type'
import { Search } from '../Input/Search'
import { Icon } from './Icon'

export const TokenSelector = ({
  selected,
  onSelect,
  children,
}: {
  selected: IToken | undefined
  onSelect: (token: IToken) => void
  children: ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { customTokens, addOrRemoveToken, hasToken } = useCustomTokens()
  const { data: queryToken } = useTokenInfo({ tokenAddress: query })

  const { data: sortedTokenList } = useSortedTokenList({
    query,
    tokenMap: DEFAULT_TOKEN_LIST_WITH_KEY,
    customTokenMap: customTokens,
  })

  const _onSelect = useCallback(
    (token: IToken) => {
      onSelect(token)
      setOpen(false)
    },
    [onSelect],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
          <DialogDescription>
            Select a token from our default list or search for a token by symbol
            or address.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <Search
            placeholder="Search by token or address"
            id={'token-search'}
            value={query}
            loading={false}
            onChange={setQuery}
          />
        </div>

        <div className="flex flex-col gap-4">
          <List className="!pt-0">
            <List.Control className="flex flex-col gap-2 p-1 min-h-[250px] max-h-[400px] overflow-y-auto overflow-x-hidden">
              {queryToken ? (
                <TokenButton
                  token={queryToken}
                  selectToken={_onSelect}
                  key={queryToken.address}
                  hasToken={hasToken}
                  addOrRemoveToken={addOrRemoveToken}
                  isSelected={queryToken.symbol === selected?.symbol}
                />
              ) : sortedTokenList?.length === 0 ? (
                <p className="text-gray-400 dark:text-slate-500 text-center pt-2">
                  No tokens found
                </p>
              ) : (
                sortedTokenList?.map((_token) => (
                  <TokenButton
                    token={_token}
                    selectToken={_onSelect}
                    key={_token.address}
                    hasToken={hasToken}
                    addOrRemoveToken={addOrRemoveToken}
                    isSelected={_token.symbol === selected?.symbol}
                  />
                ))
              )}
            </List.Control>
          </List>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const TokenButton = ({
  token,
  selectToken,
  hasToken,
  addOrRemoveToken,
  isSelected,
}: {
  token: IToken
  selectToken: (_token: IToken) => void
  hasToken?: (currency: IToken) => boolean
  isSelected: boolean
  addOrRemoveToken?: (type: 'add' | 'remove', currency: IToken[]) => void
}) => {
  const isOnDefaultList = useMemo(
    () => DEFAULT_TOKEN_LIST.some((t) => t.address === token.address),
    [token],
  )
  const isNew = !hasToken?.(token)
  const isCustomAdded = hasToken?.(token)

  return (
    <div className="flex w-full justify-between items-center gap-2 pr-2">
      <Button
        onClick={() => selectToken(token)}
        key={token.address}
        size="xl"
        className="flex items-center justify-between w-full"
        variant="ghost"
      >
        <div className="flex items-center gap-2 w-full ">
          {isSelected ? (
            <Badge
              position="bottom-right"
              badgeContent={
                <div className="bg-white dark:bg-slate-800 rounded-full">
                  <CheckCircleIcon
                    width={14}
                    height={14}
                    className="text-blue rounded-full"
                  />
                </div>
              }
            >
              <Icon currency={token} height={28} width={28} />
            </Badge>
          ) : (
            <Icon currency={token} height={28} width={28} />
          )}

          <div className="flex flex-col items-start">
            <p>{token.symbol}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500">
              {token.name}
            </p>
          </div>
        </div>
      </Button>
      {isNew && !isOnDefaultList ? (
        <Button
          onClick={() => {
            addOrRemoveToken?.('add', [token])
          }}
          className="z-[1]"
          size="xs"
        >
          Import
        </Button>
      ) : null}
      {isCustomAdded && !isOnDefaultList ? (
        <Button
          className="z-[1]"
          onClick={() => {
            addOrRemoveToken?.('remove', [token])
          }}
          variant="destructive"
          size="xs"
        >
          Remove
        </Button>
      ) : null}
    </div>
  )
}
