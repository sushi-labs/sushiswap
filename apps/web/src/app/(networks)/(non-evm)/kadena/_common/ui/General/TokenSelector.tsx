import { CheckCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
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
  SkeletonCircle,
  SkeletonText,
  TextField,
  classNames,
} from '@sushiswap/ui'
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import {
  BABENA,
  BTC,
  COMMON_TOKENS,
  DEFAULT_TOKEN_LIST,
  KADENA,
  USDC,
  USDT,
  WIZA,
} from '~kadena/_common/constants/token-list'

import { formatUnitsForInput } from '~kadena/_common/lib/utils/formatters'
import type { IToken, TokenWithBalance } from '~kadena/_common/types/token-type'
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
  const [queryToken, setQueryToken] = useState<IToken | undefined>(undefined)
  // const { customTokens, addOrRemoveToken, hasToken } = useCustomTokens()
  const addOrRemoveToken = () => {}
  const hasToken = () => false

  const [isQueryTokenLoading, setIsQueryTokenLoading] = useState(false)

  // @TODO: remove this during integration
  // loading state should come from query hook
  useEffect(() => {
    setTimeout(() => {
      setIsQueryTokenLoading(false)
    }, 1000)
  }, [])

  // @TODO: remove this during integration
  // query token should come from token info hook
  useEffect(() => {
    if (query) {
      setQueryToken(KADENA)
    } else {
      setQueryToken(undefined)
    }
  }, [query])

  const sortedTokenList: IToken[] = [KADENA, BABENA, WIZA, USDT, USDC, BTC]

  const _onSelect = useCallback(
    (token: IToken) => {
      onSelect(token)
      setOpen(false)
    },
    [onSelect],
  )

  // @TODO: remove this ignore during integration
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const Row = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      return (
        <TokenButton
          style={style}
          token={sortedTokenList?.[index]}
          selectToken={_onSelect}
          key={sortedTokenList?.[index]?.address}
          hasToken={hasToken}
          addOrRemoveToken={addOrRemoveToken}
          isSelected={sortedTokenList?.[index]?.address === selected?.address}
        />
      )
    },
    [selected, _onSelect],
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
            value={query}
            onValueChange={setQuery}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_TOKENS.map((token, idx) => (
            <CommonTokenButton
              key={idx}
              token={token}
              selectToken={_onSelect}
            />
          ))}
        </div>
        <List.Control className="relative flex flex-1 flex-col flex-grow gap-3 px-1 py-0.5 min-h-[128px]">
          <div
            data-state={isQueryTokenLoading ? 'active' : 'inactive'}
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
                    <SkeletonText className="w-full min-w-[100px]" />
                    <SkeletonText
                      fontSize="sm"
                      className="w-full min-w-[60px]"
                    />
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
            data-state={isQueryTokenLoading ? 'inactive' : 'active'}
            className={classNames(
              'data-[state=active]:block data-[state=active]:flex-1 data-[state=inactive]:hidden',
            )}
          >
            {queryToken && (
              <TokenButton
                token={queryToken}
                selectToken={_onSelect}
                key={queryToken.address}
                hasToken={hasToken}
                addOrRemoveToken={addOrRemoveToken}
                isSelected={queryToken.symbol === selected?.symbol}
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
            {sortedTokenList?.length === 0 && !queryToken && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="flex items-center text-xs text-gray-500 dark:text-slate-500">
                    No tokens found on
                    <span className="font-medium ml-1">KADENA</span>.
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-500">
                    Did you try searching with the token address?
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

const TokenButton = ({
  style,
  token,
  selectToken,
  hasToken,
  addOrRemoveToken,
  isSelected,
}: {
  style?: CSSProperties
  token?: IToken | TokenWithBalance
  selectToken: (_token: IToken) => void
  hasToken?: (currency: IToken) => boolean
  isSelected: boolean
  addOrRemoveToken?: (type: 'add' | 'remove', currency: IToken[]) => void
}) => {
  if (!token) return null
  const isOnDefaultList = useMemo(
    () => DEFAULT_TOKEN_LIST.some((t) => t.address === token.address),
    [token],
  )
  const isNew = !hasToken?.(token)
  const isCustomAdded = hasToken?.(token)

  return (
    <div
      className="flex w-full justify-between items-center gap-2 pr-2 h-[64px]"
      style={style}
    >
      <Button
        onClick={() => selectToken(token)}
        key={token.address}
        size="xl"
        className="flex items-center justify-between w-full"
        variant="ghost"
      >
        <div className="flex items-center gap-3 w-full ">
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
              <Icon currency={token} height={35} width={35} />
            </Badge>
          ) : (
            <Icon currency={token} height={35} width={35} />
          )}

          <div className="flex flex-col items-start">
            <p>{token.symbol}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500">
              {token.name}
            </p>
          </div>
        </div>
        {+(token as TokenWithBalance)?.balance > 0 ? (
          <div className="flex flex-col max-w-[140px]">
            <span
              className={classNames(
                isSelected ? 'font-semibold' : 'font-medium',
                'text-right text-gray-900 dark:text-slate-50 truncate',
              )}
            >
              {formatUnitsForInput(
                (token as TokenWithBalance)?.balance,
                token?.decimals,
              ) ?? '0'}
            </span>
          </div>
        ) : null}
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

const CommonTokenButton = ({
  token,
  selectToken,
}: {
  token: IToken
  selectToken: (_token: IToken) => void
}) => {
  return (
    <Button
      onClick={() => selectToken(token)}
      key={token.address}
      size="sm"
      className="flex items-center justify-between w-fit"
      variant="secondary"
    >
      <div className="flex items-center gap-2 w-full ">
        <Icon currency={token} height={18} width={18} />

        <p>{token.symbol}</p>
      </div>
    </Button>
  )
}
