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
  TextField,
  classNames,
  useBreakpoint,
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
import { Amount, ChainId } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import { KvmChainId, type KvmTokenAddress } from 'sushi/kvm'
import { formatUnits } from 'viem'
import { useBalances } from '~evm/_common/ui/balance-provider/use-balances'
import {
  COMMON_ETHEREUM_TOKENS,
  COMMON_KADENA_TOKENS,
} from '~kadena/_common/constants/token-list'
import { useKinesisTokenList } from '~kadena/_common/lib/hooks/kinesis-swap/use-kinesis-token-list'
import { useSortedTokenList } from '~kadena/_common/lib/hooks/use-sorted-token-list'
import { useTokenBalances } from '~kadena/_common/lib/hooks/use-token-balances'
import type {
  KinesisChainId,
  KinesisToken,
} from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { useKadena } from '../../../kadena-wallet-provider'
import { Icon } from '../General/Icon'
import { DesktopNetworkSelector } from './desktop-network-selector'
import { MobileNetworkSelector } from './mobile-network-selector'

export type EthereumChainId = Extract<EvmChainId, 1>

export const KinesisTokenSelector = ({
  selected,
  onSelect,
  children,
  networks,
}: {
  selected: KinesisToken | undefined
  onSelect: (token: KinesisToken) => void
  children: ReactNode
  networks?: KinesisChainId[]
}) => {
  const { isMd } = useBreakpoint('md')
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { activeAccount } = useKadena()

  const [selectedNetwork, setSelectedNetwork] = useState<KinesisChainId>(
    KvmChainId.KADENA,
  )

  useEffect(() => {
    if (selected) {
      setSelectedNetwork(selected.chainId as KinesisChainId)
    }
  }, [selected])

  const { data: tokenLists, isLoading } = useKinesisTokenList()

  const baseTokens = useMemo(() => {
    if (!tokenLists) return []
    return selectedNetwork === KvmChainId.KADENA
      ? tokenLists.kadena
      : tokenLists.ethereum
  }, [tokenLists, selectedNetwork])

  const kadenaTokenArray = useMemo(() => {
    if (!baseTokens || selectedNetwork === ChainId.ETHEREUM) return []
    return baseTokens.map((token) => token.address) as KvmTokenAddress[]
  }, [baseTokens, selectedNetwork])

  const ethereumTokensArray = useMemo(() => {
    if (!tokenLists || selectedNetwork === ChainId.KADENA) return []
    return tokenLists.ethereum.map((token) => token.address)
  }, [tokenLists, selectedNetwork])

  const { data: evmBalances } = useBalances(
    ChainId.ETHEREUM,
    ethereumTokensArray,
  )

  const { data: tokenBalances } = useTokenBalances({
    account: activeAccount?.accountName ?? '',
    tokenAddresses:
      !isLoading && kadenaTokenArray.length > 0 ? kadenaTokenArray : [],
  })

  const balanceMap = useMemo(() => {
    if (selectedNetwork === ChainId.KADENA) {
      return tokenBalances?.balanceMap
    }
    if (selectedNetwork === ChainId.ETHEREUM) {
      return evmBalances?.entries().reduce(
        (acc, [address, balance]) => {
          acc[address] = balance.toString()
          return acc
        },
        {} as Record<string, string>,
      )
    }
  }, [tokenBalances?.balanceMap, evmBalances, selectedNetwork])

  const baseTokenMap = useMemo(() => {
    if (!baseTokens) return undefined
    const tokenMap: Record<string, KinesisToken> = {}
    baseTokens.forEach((token) => {
      tokenMap[token.address] = token
    })
    return tokenMap
  }, [baseTokens])

  const { data: sortedTokens } = useSortedTokenList({
    tokenMap: baseTokenMap,
    customTokenMap: {},
    balanceMap: balanceMap,
    query: query,
  })

  const _onSelect = useCallback(
    (token: KinesisToken) => {
      onSelect(token)
      setOpen(false)
    },
    [onSelect],
  )

  const Row = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      return (
        <TokenButton
          style={style}
          token={sortedTokens?.[index].currency}
          tokenAmount={sortedTokens?.[index]}
          selectToken={_onSelect}
          key={sortedTokens?.[index]?.currency.address}
          isSelected={
            sortedTokens?.[index]?.currency.address === selected?.address
          }
        />
      )
    },
    [selected, _onSelect, sortedTokens],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={classNames(
          '!flex flex-col md:flex-row justify-start min-h-[85vh] !p-0',
          'md:min-w-[720px]',
        )}
      >
        {networks && selectedNetwork && isMd ? (
          <DesktopNetworkSelector
            networks={networks}
            selectedNetwork={selectedNetwork}
            onSelect={(network) => {
              setSelectedNetwork(network as KinesisChainId)
            }}
          />
        ) : null}

        <div className="flex flex-col flex-1 gap-4 overflow-y-auto relative p-6">
          <DialogHeader className="!text-left">
            <DialogTitle>Select a token</DialogTitle>
            <DialogDescription>
              Select a token from our default list or search for a token by
              symbol or address.
            </DialogDescription>
          </DialogHeader>
          {networks && selectedNetwork && !isMd && (
            <MobileNetworkSelector
              networks={networks}
              selectedNetwork={selectedNetwork}
              onSelect={(network) => {
                setSelectedNetwork(network as KinesisChainId)
              }}
            />
          )}
          <div className="flex gap-2">
            <TextField
              placeholder="Search by token or address"
              icon={MagnifyingGlassIcon}
              type="text"
              value={query}
              onValueChange={setQuery}
            />
          </div>
          {selectedNetwork === KvmChainId.KADENA ? (
            <div className="flex flex-wrap gap-2">
              {COMMON_KADENA_TOKENS.map((token, idx) => (
                <CommonTokenButton
                  key={idx}
                  token={token}
                  selectToken={_onSelect}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {COMMON_ETHEREUM_TOKENS.map((token, idx) => (
                <CommonTokenButton
                  key={idx}
                  token={token}
                  selectToken={_onSelect}
                />
              ))}
            </div>
          )}
          <List.Control className="relative flex flex-1 flex-col flex-grow gap-3 px-1 py-0.5 min-h-[128px]">
            <div className={classNames('flex-1')}>
              <AutoSizer disableWidth>
                {({ height }: { height: number }) => (
                  <FixedSizeList
                    width="100%"
                    height={height}
                    itemCount={sortedTokens ? sortedTokens.length : 0}
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
                      <span className="ml-1 font-medium">
                        {selectedNetwork === KvmChainId.KADENA
                          ? 'KADENA'
                          : 'ETHEREUM'}
                      </span>
                      .
                    </span>
                  </div>
                </div>
              )}
            </div>
          </List.Control>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const TokenButton = ({
  style,
  token,
  tokenAmount,
  selectToken,
  isSelected,
}: {
  style?: CSSProperties
  token?: KinesisToken
  tokenAmount?: Amount<KinesisToken>
  selectToken: (_token: KinesisToken) => void
  isSelected: boolean
}) => {
  if (!token) return null

  const balance = useMemo(() => {
    const amount = formatUnits(tokenAmount?.amount ?? 0n, token.decimals)
    if (Number(amount) < 0.001) return '<0.001'
    return Amount.fromHuman(token, amount).toSignificant(3)
  }, [tokenAmount, token])

  return (
    <div
      className="flex w-full justify-between items-center gap-2 pr-2 h-[64px]"
      style={style}
    >
      <Button
        onClick={() => {
          selectToken(token)
        }}
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
        {tokenAmount?.gt(0n) ? (
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
    </div>
  )
}

const CommonTokenButton = ({
  token,
  selectToken,
}: {
  token: KinesisToken
  selectToken: (_token: KinesisToken) => void
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
