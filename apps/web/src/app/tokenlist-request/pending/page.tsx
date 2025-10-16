'use client'

import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import type { PendingTokens } from '@sushiswap/graph-client/data-api/queries/token-list-submission'
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  DataTable,
  LinkExternal,
  List,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { XIcon } from '@sushiswap/ui/icons/XIcon'
import type { ColumnDef, SortingState, TableState } from '@tanstack/react-table'
import differenceInDays from 'date-fns/differenceInDays'
import React, { useMemo, useState } from 'react'
import { usePendingTokens } from 'src/lib/hooks/api/usePendingTokenListings'
import {
  type TokenSecurity,
  isTokenSecurityIssue,
} from 'src/lib/hooks/react-query'
import { TokenSecurityView } from 'src/lib/wagmi/components/token-security-view'
import { formatNumber, formatUSD } from 'sushi'
import {
  type EvmAddress,
  type EvmChainId,
  EvmToken,
  getEvmChainById,
  shortenEvmAddress,
} from 'sushi/evm'
import { NavigationItems } from '../navigation-items'

const getTokenSecurity = (security: PendingTokens[number]['security']) => {
  const data = {
    is_buyable: {
      goPlus: security.isBuyable,
    },
    is_open_source: {
      goPlus: security.isOpenSource,
    },
    is_proxy: {
      goPlus: security.isProxy,
    },
    is_mintable: {
      goPlus: security.isMintable,
    },
    can_take_back_ownership: {
      goPlus: security.canTakeBackOwnership,
    },
    owner_change_balance: {
      goPlus: security.ownerChangeBalance,
    },
    hidden_owner: {
      goPlus: security.hiddenOwner,
    },
    selfdestruct: {
      goPlus: security.selfDestruct,
    },
    external_call: {
      goPlus: security.externalCall,
    },
    gas_abuse: {
      goPlus: security.gasAbuse,
    },
    buy_tax: {
      goPlus: security.buyTax,
    },
    sell_tax: {
      goPlus: security.sellTax,
    },
    is_sell_limit: {
      goPlus: security.cannotSellAll,
    },
    slippage_modifiable: {
      goPlus: security.slippageModifiable,
    },
    is_honeypot: {
      goPlus: security.isHoneypot,
    },
    transfer_pausable: {
      goPlus: security.transferPausable,
    },
    is_blacklisted: {
      goPlus: security.isBlacklisted,
    },
    is_whitelisted: {
      goPlus: security.isWhitelisted,
    },
    is_anti_whale: {
      goPlus: security.isAntiWhale,
    },
    trading_cooldown: {
      goPlus: security.tradingCooldown,
    },
    is_fake_token: {
      goPlus: !security.isTrueToken,
    },
    is_airdrop_scam: {
      goPlus: security.isAirdropScam,
    },
    trust_list: {
      goPlus: security.trustList,
    },
  }

  return {
    data,
    isHoneypot: data?.is_honeypot?.goPlus,
    isFoT: data?.buy_tax?.goPlus || data?.sell_tax?.goPlus,
    isRisky: Object.entries(data || {}).some(([_key, value]) => {
      const key = _key as keyof TokenSecurity
      if (
        key in isTokenSecurityIssue &&
        isTokenSecurityIssue[key](value.goPlus)
      ) {
        return true
      }
    }),
  }
}

const COLUMNS: ColumnDef<PendingTokens[number], unknown>[] = [
  {
    id: 'token',
    header: 'Token',
    accessorFn: (row) => row.token.name,
    cell: (props) => (
      <div className="flex items-center gap-5">
        <Badge
          className="border-2 border-slate-900 rounded-full z-[11]"
          position="bottom-right"
          badgeContent={
            <NetworkIcon
              chainId={props.row.original.token.chainId}
              width={12}
              height={12}
            />
          }
        >
          <div className="h-8 w-8 rounded-full overflow-hidden border-2 ring-gray-50 dark:ring-slate-950">
            <img
              src={props.row.original.logoUrl}
              width={32}
              height={32}
              alt={props.row.original.token.symbol}
            />
          </div>
        </Badge>
        <div className="flex flex-col gap-1">
          <span>
            {props.row.original.token.name}{' '}
            <span className="text-muted-foreground">
              ({props.row.original.token.symbol})
            </span>
          </span>
          <LinkExternal
            target="_blank"
            href={getEvmChainById(
              props.row.original.token.chainId as EvmChainId,
            )?.getTokenUrl(props.row.original.token.address as EvmAddress)}
          >
            <span className="flex items-center gap-1 flex-nowrap">
              {shortenEvmAddress(props.row.original.token.address)}{' '}
              <ExternalLinkIcon width={14} height={14} />
            </span>
          </LinkExternal>
        </div>
      </div>
    ),
    meta: {
      body: {
        skeleton: <SkeletonText fontSize="lg" className="min-w-[175px]" />,
      },
    },
  },
  {
    id: 'tweet',
    header: 'Tweet',
    accessorFn: (row) => Boolean(row.tweetUrl),
    cell: (props) =>
      props.row.original.tweetUrl ? (
        <a target="_blank" rel="noreferrer" href={props.row.original.tweetUrl}>
          <XIcon width="20" height="20" />
        </a>
      ) : (
        <XIcon
          width="20"
          height="20"
          className="opacity-30 cursor-not-allowed"
        />
      ),
    meta: {
      body: {
        skeleton: <SkeletonText fontSize="lg" />,
      },
    },
  },
  {
    id: 'marketcapUSD',
    header: 'Market Cap',
    accessorFn: (row) => row.metrics.marketcapUSD,
    cell: (props) => formatUSD(props.row.original.metrics.marketcapUSD),
    meta: {
      body: {
        skeleton: <SkeletonText fontSize="lg" />,
      },
    },
  },
  {
    id: 'volumeUSD24h',
    header: 'Daily Volume',
    accessorFn: (row) => row.metrics.volumeUSD24h,
    cell: (props) => formatUSD(props.row.original.metrics.volumeUSD24h),
    meta: {
      body: {
        skeleton: <SkeletonText fontSize="lg" />,
      },
    },
  },
  {
    id: 'inQueue',
    header: 'In Queue',
    accessorFn: (row) => row.createdAt,
    cell: (props) =>
      `${differenceInDays(
        new Date(),
        new Date(props.row.original.createdAt * 1000),
      )} days`,
    meta: {
      body: {
        skeleton: <SkeletonText fontSize="lg" />,
      },
    },
  },
  {
    id: 'holders',
    header: 'Holders',
    accessorFn: (row) => row.metrics.holders,
    cell: (props) => formatNumber(props.row.original.metrics.holders),
    meta: {
      body: {
        skeleton: <SkeletonText fontSize="lg" />,
      },
    },
  },
  {
    id: 'status',
    header: 'Status',
    cell: (props) => {
      const [trigger, content] = useMemo(
        () => [
          <span
            key="span"
            className={classNames(
              'whitespace-nowrap',
              props.row.original.reasoning.length > 0
                ? 'underline decoration-dotted'
                : '',
            )}
          >
            {props.row.original.reasoning.length} detail
            {props.row.original.reasoning.length !== 1 ? 's' : ''}
          </span>,
          <Card key="card">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[75vh] overflow-hidden">
              <ul className="text-sm">
                {props.row.original.reasoning.map((reason, i) => (
                  <li key={`reason-${i}`}>{reason}</li>
                ))}
              </ul>
              <List className="!pt-0 overflow-hidden">
                <List.Control className="!overflow-y-auto">
                  <TokenSecurityView
                    token={
                      new EvmToken({
                        ...props.row.original.token,
                        address: props.row.original.token.address as EvmAddress,
                        chainId: props.row.original.token.chainId as EvmChainId,
                      })
                    }
                    isTokenSecurityLoading={false}
                    tokenSecurity={getTokenSecurity(
                      props.row.original.security,
                    )}
                  />
                </List.Control>
              </List>
            </CardContent>
          </Card>,
        ],
        [props.row.original],
      )

      return (
        <Popover>
          <PopoverTrigger
            onClick={(e) => e.stopPropagation()}
            asChild
            className="cursor-pointer"
          >
            {trigger}
          </PopoverTrigger>
          <PopoverContent side="right" className="!p-0 max-w-[100vw] w-fit">
            {content}
          </PopoverContent>
        </Popover>
      )
    },
    meta: {
      body: {
        skeleton: <SkeletonText fontSize="lg" />,
      },
    },
  },
]

export default function PendingTokenListingPage() {
  const { data: pendingTokens, isLoading } = usePendingTokens()

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ])

  const [data, count] = useMemo(
    () => [pendingTokens ?? [], pendingTokens?.length ?? 0],
    [pendingTokens],
  )

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [data?.length, sorting])

  return (
    <>
      <Container
        maxWidth="7xl"
        className="px-4 h-[200px] shrink-0 flex flex-col justify-center gap-2"
      >
        <h1 className="text-4xl font-bold">Pending List</h1>
        <p className="text-sm text-muted-foreground max-w-[600px]">
          Tokens not approved will be deleted after 7 days. You may resubmit
          later if there is meaningful progress. Approvals are not guaranteed.
        </p>
      </Container>
      <NavigationItems />
      <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent h-full">
        <Container maxWidth="7xl" className="px-4 py-10">
          <Card>
            <CardHeader>
              <CardTitle>
                {isLoading ? (
                  <div className="!w-28 !h-[18px]">
                    <SkeletonText />
                  </div>
                ) : (
                  <span>
                    Pending Tokens{' '}
                    <span className="text-gray-400 dark:text-slate-500">
                      ({count ?? 0})
                    </span>
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <DataTable
              state={state}
              onSortingChange={setSorting}
              loading={isLoading}
              columns={COLUMNS}
              data={data}
            />
          </Card>
        </Container>
      </div>
    </>
  )
}
