'use client'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import {
  Badge,
  Currency,
  SkeletonBox,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import {
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { TokenSelector } from 'src/lib/wagmi/components/token-selector/token-selector'
import {
  CROSSMINT_CLIENT_SIDE_API_KEY,
  type CrossmintCheckoutCatalogToken,
  getCrossmintEnvironment,
} from '../crossmint-config'
import { useCrossmintCheckoutTokens } from '../hooks/use-crossmint-checkout-tokens'
import type {
  CrossmintCheckoutTokenClass,
  CrossmintCheckoutTokenEntry,
} from '../types'
import {
  CROSSMINT_STAGING_TOKEN_SELECTOR_CHAIN_IDS,
  CROSSMINT_TOKEN_SELECTOR_CHAIN_IDS,
  type CrossmintTokenSelectorChainId,
  getInitialCrossmintTokenSelectorChainId,
  isCrossmintTokenSelectorChainId,
} from './crossmint-token-selector-config'

const CROSSMINT_MEMECOIN_TOKEN_CLASSES = ['memecoin'] as const

interface CrossmintTokenSelectorProps {
  amount?: ReactNode
  chainIds?: readonly CrossmintTokenSelectorChainId[]
  children?: ReactElement
  className?: string
  defaultChainId?: CrossmintTokenSelectorChainId
  defaultToken?: CrossmintCheckoutCatalogToken
  disabled?: boolean
  fiatValue?: ReactNode
  isAmountLoading?: boolean
  label?: ReactNode
  onAmountChange?(value: string): void
  onSelect(entry: CrossmintCheckoutTokenEntry): void
  selected?: CrossmintCheckoutTokenEntry
  tokenClasses?: readonly CrossmintCheckoutTokenClass[]
}

export function CrossmintTokenSelector({
  amount = '0.0',
  chainIds = CROSSMINT_TOKEN_SELECTOR_CHAIN_IDS,
  children,
  className,
  defaultChainId,
  defaultToken,
  disabled = false,
  fiatValue,
  isAmountLoading = false,
  label = 'Receive',
  onAmountChange,
  onSelect,
  selected,
  tokenClasses,
}: CrossmintTokenSelectorProps) {
  const [isEditingAmount, setIsEditingAmount] = useState(false)
  const [localAmount, setLocalAmount] = useState('')
  const environment = CROSSMINT_CLIENT_SIDE_API_KEY
    ? getCrossmintEnvironment(CROSSMINT_CLIENT_SIDE_API_KEY)
    : undefined
  const environmentChainIds =
    environment === 'staging'
      ? chainIds.filter((chainId) =>
          CROSSMINT_STAGING_TOKEN_SELECTOR_CHAIN_IDS.some(
            (stagingChainId) => stagingChainId === chainId && chainId !== -4,
          ),
        )
      : chainIds
  const chainIdsKey = (
    environmentChainIds.length > 0 ? environmentChainIds : chainIds
  ).join(',')
  const availableChainIds = useMemo(() => {
    const requestedChainIds = chainIdsKey
      .split(',')
      .map(Number)
      .filter(isCrossmintTokenSelectorChainId)

    return requestedChainIds.length > 0
      ? requestedChainIds
      : CROSSMINT_TOKEN_SELECTOR_CHAIN_IDS
  }, [chainIdsKey])
  const [activeChainId, setActiveChainId] =
    useState<CrossmintTokenSelectorChainId>(() =>
      getInitialCrossmintTokenSelectorChainId({
        chainIds: availableChainIds,
        defaultChainId,
        fallbackChainId: defaultToken?.chainId,
        selectedChainId: selected?.token.chainId,
      }),
    )
  const queryChainIds = useMemo(() => [activeChainId], [activeChainId])
  const {
    data: entries = [],
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
  } = useCrossmintCheckoutTokens({
    chainIds: queryChainIds,
    tokenClasses,
  })
  const firstUsdcEntry = useMemo(
    () => entries.find((entry) => entry.token.symbol.toLowerCase() === 'usdc'),
    [entries],
  )
  const supportsMemecoins =
    tokenClasses === undefined || tokenClasses.includes('memecoin')
  const shouldLoadMemeFallback =
    !selected &&
    activeChainId === defaultChainId &&
    !isError &&
    !isLoading &&
    !isFetchingNextPage &&
    !hasNextPage &&
    entries.length > 0 &&
    !firstUsdcEntry &&
    supportsMemecoins
  const {
    data: memeEntries = [],
    fetchNextPage: fetchNextMemePage,
    hasNextPage: hasNextMemePage,
    isError: isMemeError,
    isFetchingNextPage: isFetchingNextMemePage,
    isLoading: isLoadingMemes,
  } = useCrossmintCheckoutTokens({
    chainIds: queryChainIds,
    enabled: shouldLoadMemeFallback,
    tokenClasses: CROSSMINT_MEMECOIN_TOKEN_CLASSES,
  })

  useEffect(() => {
    const nextChainId = getInitialCrossmintTokenSelectorChainId({
      chainIds: availableChainIds,
      defaultChainId,
      fallbackChainId: defaultToken?.chainId,
      selectedChainId: selected?.token.chainId,
    })

    setActiveChainId((currentChainId) =>
      currentChainId === nextChainId ? currentChainId : nextChainId,
    )
  }, [
    availableChainIds,
    defaultChainId,
    defaultToken?.chainId,
    selected?.token.chainId,
  ])

  const entriesByCurrencyId = useMemo(
    () =>
      new Map<string, CrossmintCheckoutTokenEntry>(
        entries.map((entry) => [entry.token.id, entry]),
      ),
    [entries],
  )
  const defaultEntry = defaultToken
    ? entriesByCurrencyId.get(defaultToken.id)
    : undefined

  useEffect(() => {
    if (selected || isError || isLoading || isFetchingNextPage) return

    const isPreferredChain = activeChainId === defaultChainId
    const isFallbackChain = activeChainId === defaultToken?.chainId

    if (isPreferredChain) {
      if (firstUsdcEntry) {
        onSelect(firstUsdcEntry)
        return
      }

      if (hasNextPage) {
        void fetchNextPage()
        return
      }

      if (shouldLoadMemeFallback) {
        if (isMemeError || isLoadingMemes || isFetchingNextMemePage) return

        const firstMemeEntry = memeEntries[0]

        if (firstMemeEntry) {
          onSelect(firstMemeEntry)
          return
        }

        if (hasNextMemePage) {
          void fetchNextMemePage()
          return
        }
      }

      if (
        defaultToken &&
        isCrossmintTokenSelectorChainId(defaultToken.chainId) &&
        availableChainIds.includes(defaultToken.chainId) &&
        defaultToken.chainId !== activeChainId
      ) {
        setActiveChainId(defaultToken.chainId)
      }

      return
    }

    if (!isFallbackChain) return

    const fallbackEntry = defaultEntry ?? firstUsdcEntry

    if (fallbackEntry) {
      onSelect(fallbackEntry)
      return
    }

    if (hasNextPage) void fetchNextPage()
  }, [
    activeChainId,
    availableChainIds,
    defaultChainId,
    defaultEntry,
    defaultToken,
    fetchNextMemePage,
    fetchNextPage,
    firstUsdcEntry,
    hasNextMemePage,
    hasNextPage,
    isError,
    isFetchingNextMemePage,
    isFetchingNextPage,
    isLoading,
    isLoadingMemes,
    isMemeError,
    memeEntries,
    onSelect,
    selected,
    shouldLoadMemeFallback,
  ])

  const currencies = useMemo(
    () =>
      Object.fromEntries(entries.map((entry) => [entry.token.id, entry.token])),
    [entries],
  )
  const selectedCurrency =
    selected?.token.chainId === activeChainId ? selected.token : undefined

  const handleSelect = useCallback(
    (currency: CurrencyFor<CrossmintTokenSelectorChainId>) => {
      const entry = entriesByCurrencyId.get(currency.id)

      if (entry) onSelect(entry)
    },
    [entriesByCurrencyId, onSelect],
  )

  const handleLoadMore = useCallback(() => {
    void fetchNextPage()
  }, [fetchNextPage])

  const tokenTrigger = (
    <button
      type="button"
      disabled={disabled}
      aria-label={
        selected
          ? `Change token. Current token: ${selected.token.symbol}`
          : 'Select a token to buy'
      }
      className={classNames(
        'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-secondary py-2 pl-2 pr-3 font-medium text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      )}
    >
      {selected ? (
        <>
          <span className="h-7 w-7">
            <Badge
              className="z-[11] rounded-full border border-slate-900"
              position="bottom-right"
              badgeContent={
                <NetworkIcon
                  chainId={selected.token.chainId}
                  height={16}
                  width={16}
                />
              }
            >
              <Currency.Icon
                disableLink
                currency={selected.token}
                height={28}
                width={28}
              />
            </Badge>
          </span>
          <span className="max-w-28 truncate text-xl">
            {selected.token.symbol}
          </span>
          <ChevronDownIcon aria-hidden="true" className="h-4 w-4" />
        </>
      ) : (
        <>
          <span className="px-2 text-lg font-semibold">Select token</span>
          <ChevronDownIcon aria-hidden="true" className="h-4 w-4" />
        </>
      )}
    </button>
  )

  const selector = (
    <TokenSelector<CrossmintTokenSelectorChainId, CrossmintTokenSelectorChainId>
      chainId={activeChainId}
      currencies={currencies}
      customListOptions={{
        emptyMessage: 'No purchasable tokens found on this network.',
        hasMore: Boolean(hasNextPage),
        isError,
        isLoading,
        isLoadingMore: isFetchingNextPage,
        onLoadMore: handleLoadMore,
        showBalances: false,
        showPrices: false,
      }}
      includeNative={false}
      networks={availableChainIds}
      onNetworkSelect={setActiveChainId}
      onSelect={handleSelect}
      selected={selectedCurrency}
      selectedNetwork={activeChainId}
    >
      {children ?? tokenTrigger}
    </TokenSelector>
  )

  if (children) return selector

  const amountString = typeof amount === 'string' ? amount : ''
  const editableAmount = isEditingAmount ? localAmount : amountString

  return (
    <div
      className={classNames(
        'flex w-full flex-col items-stretch gap-2 overflow-hidden rounded-xl border border-accent bg-white p-3 pb-2 dark:bg-slate-800',
        className,
      )}
    >
      {label ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : null}
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center py-1 text-3xl font-medium">
          {isAmountLoading ? (
            <SkeletonBox className="h-8 w-2/3 rounded-lg" />
          ) : onAmountChange ? (
            <TextField
              type="number"
              variant="naked"
              disabled={disabled}
              readOnly={disabled}
              maxDecimals={selected?.token.decimals}
              value={editableAmount}
              aria-label={`Amount of ${selected?.token.symbol ?? 'token'} to receive`}
              className="p-0 py-1 !text-3xl font-medium"
              onFocus={() => {
                setLocalAmount(amountString)
                setIsEditingAmount(true)
              }}
              onBlur={() => setIsEditingAmount(false)}
              onValueChange={(value) => {
                setLocalAmount(value)
                onAmountChange(value)
              }}
            />
          ) : (
            <span
              className={classNames(
                'truncate',
                (!amountString || Number(amountString) === 0) &&
                  'text-muted-foreground',
              )}
            >
              ~{amount || '0.0'}
            </span>
          )}
        </div>
        {selector}
      </div>
      <span className="flex h-9 items-center justify-start text-lg font-medium text-gray-500 dark:text-slate-400">
        {fiatValue}
      </span>
    </div>
  )
}
