import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useBreakpoint, useDebounce } from '@sushiswap/hooks'
import {
  InterfaceEventName,
  InterfaceModalName,
  Trace,
} from '@sushiswap/telemetry'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  List,
  TextField,
} from '@sushiswap/ui'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { DialogHeader, DialogTitle, DialogTrigger } from '@sushiswap/ui'
import { classNames, gtagEvent } from '@sushiswap/ui'
import React, {
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { useAmountBalances } from 'src/app/(networks)/(evm)/_common/ui/balance-provider/use-balances'
import { DesktopNetworkSelector } from 'src/lib/wagmi/components/token-selector/desktop-network-selector'
import { MobileNetworkSelector } from 'src/lib/wagmi/components/token-selector/mobile-network-selector'
import { TokenSelectorChipBar } from 'src/lib/wagmi/components/token-selector/token-lists/token-selector-chip-bar'
import type { EvmChainId } from 'sushi/evm'
import {
  StellarChainId,
  type StellarContractAddress,
  type StellarToken,
  isStellarContractAddress,
} from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'
import { useCommonTokens } from '~stellar/_common/lib/hooks/token/use-common-tokens'
import { useCustomTokens } from '~stellar/_common/lib/hooks/token/use-custom-tokens'
import { useSortedTokenList } from '~stellar/_common/lib/hooks/token/use-sorted-token-list'
import { useTokenWithCache } from '~stellar/_common/lib/hooks/token/use-token-with-cache'
import { TokenSelectorImportRow } from './token-selector-import-row'
import { TokenListItem } from './token-selector-list-item'

type RowCallback = (row: {
  index: number
  style: CSSProperties
}) => ReactElement<any>

type TokenSelectorNetwork = EvmChainId | SvmChainId | StellarChainId

interface PropType<TNetwork extends TokenSelectorNetwork = StellarChainId> {
  id: string
  selected: StellarToken | undefined
  onSelect?: (token: StellarToken) => void
  children: ReactNode
  hideSearch?: boolean
  networks?: readonly TNetwork[]
  selectedNetwork?: TNetwork
  onNetworkSelect?: (network: TNetwork) => void
  // When provided, replaces the default common+custom token list with the
  // caller-supplied currencies. Custom-token import flow is also disabled
  // because it doesn't make sense against an externally curated list.
  currencies?: Record<string, StellarToken>
}

export default function TokenSelector<
  TNetwork extends TokenSelectorNetwork = StellarChainId,
>({
  id,
  selected,
  children,
  onSelect,
  currencies,
  hideSearch,
  networks,
  selectedNetwork,
  onNetworkSelect,
}: PropType<TNetwork>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const debouncedQuery = useDebounce(query, 250)

  useEffect(() => {
    if (debouncedQuery) gtagEvent('token-search', { query: debouncedQuery })
  }, [debouncedQuery])

  useEffect(() => {
    if (!open) {
      setQuery('')
    }
  }, [open])

  const { data: commonTokens } = useCommonTokens()
  const { data: customTokens, mutate: customTokenMutate } = useCustomTokens()
  const { data: queryToken, isLoading: isLoadingQueryToken } =
    useTokenWithCache({
      address: isStellarContractAddress(query) ? query : undefined,
      enabled: isStellarContractAddress(query),
      keepPreviousData: false,
    })

  // Merge common tokens (from StellarExpert + hardcoded) into the main token map
  const allTokens = useMemo(() => {
    if (currencies) return currencies

    const merged = {} as Record<StellarContractAddress, StellarToken>
    if (customTokens) {
      Object.entries(customTokens).forEach(([contract, token]) => {
        merged[contract as StellarContractAddress] = token
      })
    }
    if (commonTokens) {
      Object.entries(commonTokens).forEach(([contract, token]) => {
        merged[contract as StellarContractAddress] = token
      })
    }
    return merged
  }, [currencies, customTokens, commonTokens])

  const tokenList = useMemo(() => Object.values(allTokens), [allTokens])

  const { data: tokenBalances } = useAmountBalances(
    StellarChainId.STELLAR,
    tokenList,
  )

  const { data: sortedTokenList } = useSortedTokenList({
    query,
    tokenMap: allTokens,
    balanceMap: tokenBalances,
  })

  const handleImport = useCallback(
    (currency: StellarToken) => {
      customTokenMutate('add', currency)
      onSelect?.(currency)
    },
    [onSelect, customTokenMutate],
  )

  const _onSelect = useCallback(
    (token: StellarToken) => {
      onSelect?.(token)
      setOpen(false)
    },
    [onSelect],
  )

  const _onNetworkSelect = useCallback(
    (network: TNetwork) => {
      onNetworkSelect?.(network)
    },
    [onNetworkSelect],
  )

  const { isMd } = useBreakpoint('md')

  const Row = useCallback<RowCallback>(
    ({ index, style }) => {
      const token = sortedTokenList ? sortedTokenList[index] : undefined
      if (!token) return <div style={style} />
      return (
        <TokenListItem
          style={style}
          token={token}
          balance={tokenBalances?.get(token.id)}
          selected={selected?.address === token.address}
          onSelect={_onSelect}
          id={id}
        />
      )
    },
    [selected, sortedTokenList, tokenBalances, _onSelect, id],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={classNames(
          'h-[80vh] !flex !flex-col md:!flex-row w-fit !p-0',
          networks ? 'md:min-w-[720px]' : 'md:min-w-[600px]',
        )}
      >
        <Trace
          name={InterfaceEventName.TOKEN_SELECTOR_OPENED}
          modal={InterfaceModalName.TOKEN_SELECTOR}
          shouldLogImpression
        >
          {networks && selectedNetwork && onNetworkSelect && isMd ? (
            <DesktopNetworkSelector
              networks={networks}
              selectedNetwork={selectedNetwork}
              onSelect={_onNetworkSelect}
            />
          ) : null}
          <div className="flex flex-col gap-4 overflow-y-auto relative p-6">
            <DialogHeader className="!text-left">
              <DialogTitle>Select a token</DialogTitle>
              <DialogDescription>
                Select a token from our default list or search for a token by
                symbol or address.
              </DialogDescription>
            </DialogHeader>
            {networks && selectedNetwork && onNetworkSelect && !isMd ? (
              <MobileNetworkSelector
                networks={networks}
                selectedNetwork={selectedNetwork}
                onSelect={_onNetworkSelect}
              />
            ) : null}
            {!hideSearch ? (
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
            ) : null}
            {currencies ? null : (
              <TokenSelectorChipBar
                chainId={StellarChainId.STELLAR}
                onSelect={_onSelect as (currency: StellarToken) => void}
                includeNative={false}
              />
            )}
            <List.Control className="relative flex flex-1 flex-col flex-grow gap-3 px-1 py-0.5 min-h-[128px]">
              <div
                data-state={
                  !sortedTokenList || isLoadingQueryToken
                    ? 'active'
                    : 'inactive'
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
                  sortedTokenList && !isLoadingQueryToken
                    ? 'active'
                    : 'inactive'
                }
                className={classNames(
                  'data-[state=active]:block data-[state=active]:flex-1 data-[state=inactive]:hidden',
                )}
              >
                {!currencies &&
                  queryToken &&
                  !allTokens[queryToken.address] && (
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
                        No tokens found on
                        <span className="font-medium ml-1"> Stellar</span>.
                      </span>
                      <span className="text-xs text-gray-500 dark:text-slate-500">
                        Did you try searching with the token code?
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </List.Control>
          </div>
        </Trace>
      </DialogContent>
    </Dialog>
  )
}
