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
  useMemo,
  useState,
} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { Amount } from 'sushi'
import type { KvmToken, KvmTokenAddress } from 'sushi/kvm'
import { parseUnits } from 'viem'
import { COMMON_KADENA_TOKENS } from '~kadena/_common/constants/token-list'
import { useBaseTokens } from '~kadena/_common/lib/hooks/use-base-tokens'
import { useCustomTokens } from '~kadena/_common/lib/hooks/use-custom-tokens'
import { useSortedTokenList } from '~kadena/_common/lib/hooks/use-sorted-token-list'
import { useTokenBalances } from '~kadena/_common/lib/hooks/use-token-balances'
import { useTokenInfo } from '~kadena/_common/lib/hooks/use-token-info'
import type { TokenWithBalance } from '~kadena/_common/types/token-type'
import { useKadena } from '../../../kadena-wallet-provider'
import { Icon } from './Icon'

export const TokenSelector = ({
  selected,
  onSelect,
  children,
}: {
  selected: KvmToken | undefined
  onSelect: (token: KvmToken) => void
  children: ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { data: baseTokens, isLoading } = useBaseTokens()
  const { activeAccount } = useKadena()
  const { data: queryToken, isLoading: isQueryTokenLoading } = useTokenInfo({
    tokenContract: query,
    enabled: !!query,
  })

  const {
    customTokens,
    hasToken,
    addOrRemoveToken: _addOrRemoveToken,
  } = useCustomTokens()

  const tokenArray = useMemo(() => {
    if (!baseTokens) return []
    const tokens = []
    for (const token of baseTokens) {
      tokens.push(token.address)
    }
    for (const tokenAddress in customTokens) {
      tokens.push(tokenAddress)
    }
    return tokens as KvmTokenAddress[]
  }, [baseTokens, customTokens])

  const { data: tokenBalances } = useTokenBalances({
    account: activeAccount?.accountName ?? '',
    tokenAddresses: !isLoading && tokenArray?.length > 0 ? tokenArray : [],
  })

  const baseTokenMap = useMemo(() => {
    if (!baseTokens) return undefined
    const tokenMap: Record<string, KvmToken> = {}
    baseTokens?.forEach((token) => {
      tokenMap[token.address] = token
    })
    return tokenMap
  }, [baseTokens])

  const { data: sortedTokens } = useSortedTokenList({
    tokenMap: baseTokenMap,
    customTokenMap: customTokens,
    balanceMap: tokenBalances?.balanceMap,
    query: query,
  })

  const _onSelect = useCallback(
    (token: KvmToken) => {
      onSelect(token)
      setOpen(false)
    },
    [onSelect],
  )

  const isOnDefaultList = useCallback(
    (tokenAddress: string) => {
      return !!baseTokenMap?.[tokenAddress ?? '']
    },
    [baseTokenMap],
  )

  const addOrRemoveToken = useCallback(
    (type: 'add' | 'remove', currency: KvmToken[]) => {
      _addOrRemoveToken(type, currency)
      setQuery('')
    },
    [_addOrRemoveToken],
  )

  const Row = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      return (
        <TokenButton
          style={style}
          token={sortedTokens?.[index]}
          selectToken={_onSelect}
          key={sortedTokens?.[index]?.address}
          isSelected={sortedTokens?.[index]?.address === selected?.address}
          isOnDefaultList={isOnDefaultList}
          hasToken={hasToken}
          addOrRemoveToken={addOrRemoveToken}
        />
      )
    },
    [
      selected,
      _onSelect,
      sortedTokens,
      isOnDefaultList,
      hasToken,
      addOrRemoveToken,
    ],
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
          {COMMON_KADENA_TOKENS.map((token, idx) => (
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
                isOnDefaultList={isOnDefaultList}
                isSelected={queryToken.address === selected?.address}
              />
            )}
            <AutoSizer disableWidth>
              {({ height }: { height: number }) => (
                <FixedSizeList
                  width="100%"
                  height={height}
                  itemCount={sortedTokens ? sortedTokens?.length : 0}
                  itemSize={64}
                  className={'scroll'}
                  style={{ overflow: 'overlay' }}
                >
                  {Row}
                </FixedSizeList>
              )}
            </AutoSizer>
            {sortedTokens?.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="flex items-center text-xs text-gray-500 dark:text-slate-500">
                    Token not found on list for
                    <span className="ml-1 font-medium">KADENA</span>.
                  </span>
                  {/* <span className="text-xs text-gray-500 dark:text-slate-500">
										Did you try searching with the token address?
									</span> */}
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
  isSelected,
  hasToken,
  addOrRemoveToken,
  isOnDefaultList,
}: {
  style?: CSSProperties
  token?: KvmToken | TokenWithBalance
  selectToken: (_token: KvmToken) => void
  isSelected: boolean
  hasToken?: (currency: string | KvmToken) => boolean
  addOrRemoveToken?: (type: 'add' | 'remove', currency: KvmToken[]) => void
  isOnDefaultList: (currency: string) => boolean
}) => {
  if (!token) return null

  const isNewCustom = !hasToken?.(token.address)

  const isDefaultToken = isOnDefaultList(token.address)

  const balance = useMemo(() => {
    const amount = (token as TokenWithBalance)?.balance
    if (Number(amount) < 0.001) return '<0.001'
    return new Amount(
      token,
      amount ? parseUnits(amount.toString(), token.decimals) : 0,
    ).toString({
      fixed: 3,
    })
  }, [token])

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
        <div className="flex items-center w-full gap-3 ">
          {isSelected ? (
            <Badge
              position="bottom-right"
              badgeContent={
                <div className="bg-white rounded-full dark:bg-slate-800">
                  <CheckCircleIcon
                    width={14}
                    height={14}
                    className="rounded-full text-blue"
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
              {balance}
            </span>
          </div>
        ) : null}
      </Button>
      {!isDefaultToken ? (
        <Button
          onClick={() => {
            if (isNewCustom) {
              addOrRemoveToken?.('add', [token])
              selectToken(token)
            } else {
              addOrRemoveToken?.('remove', [token])
            }
          }}
          className="z-[1]"
          variant={isNewCustom ? 'default' : 'destructive'}
          size="xs"
        >
          {isNewCustom ? 'Import' : 'Remove'}
        </Button>
      ) : null}
    </div>
  )
}

const CommonTokenButton = ({
  token,
  selectToken,
}: {
  token: KvmToken
  selectToken: (_token: KvmToken) => void
}) => {
  return (
    <Button
      onClick={() => selectToken(token)}
      key={token.address}
      size="sm"
      className="flex items-center justify-between w-fit"
      variant="secondary"
    >
      <div className="flex items-center w-full gap-2 ">
        <Icon currency={token} height={18} width={18} />

        <p>{token.symbol}</p>
      </div>
    </Button>
  )
}
