import React, { FC } from 'react'
import { Token } from '@sushiswap/currency'
import { useTokenAllowance, useTokenRevokeApproval } from '@sushiswap/wagmi/future/hooks'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { NetworkIcon } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { Checker } from '@sushiswap/wagmi/future/systems'
import Button from '@sushiswap/ui/future/components/button/Button'
import { ZERO } from '@sushiswap/math'
import { routeProcessor2Address, RouteProcessor2ChainId } from '@sushiswap/route-processor/exports/exports'
import { CheckIcon } from '@heroicons/react-v1/solid'
import { Address } from 'wagmi'

export const RevokeItem: FC<{ token: Token; account: Address }> = ({ account, token }) => {
  const { data: allowance, isLoading } = useTokenAllowance({
    chainId: token.chainId,
    token,
    owner: account,
    spender: routeProcessor2Address[token.chainId as RouteProcessor2ChainId],
  })

  const { write, isPending } = useTokenRevokeApproval({
    account,
    token,
    spender: routeProcessor2Address[token.chainId as RouteProcessor2ChainId],
  })

  if (isLoading) return <List.KeyValue skeleton />

  if (allowance?.greaterThan(ZERO)) {
    return (
      <List.KeyValue
        flex
        title={
          <div className="flex items-center gap-3">
            <Badge
              position="bottom-right"
              badgeContent={<NetworkIcon chainId={token.chainId} width={16} height={16} />}
            >
              <Currency.Icon currency={token} width={24} height={24} />
            </Badge>
            {token.name} ({token.symbol})
          </div>
        }
      >
        <Checker.Connect size="xs" color="blue">
          <Checker.Network size="xs" color="blue" chainId={token.chainId}>
            <Button size="xs" color="blue" disabled={isPending} loading={isPending} onClick={() => write?.()}>
              Revoke
            </Button>
          </Checker.Network>
        </Checker.Connect>
      </List.KeyValue>
    )
  }

  return (
    <List.KeyValue
      flex
      title={
        <div className="flex items-center gap-3">
          <Badge position="bottom-right" badgeContent={<NetworkIcon chainId={token.chainId} width={16} height={16} />}>
            <Currency.Icon currency={token} width={24} height={24} />
          </Badge>
          {token.name} ({token.symbol})
        </div>
      }
    >
      <Button size="xs" variant="outlined" color="green" className="pointer-events-none">
        <div className="flex gap-1 items-center">
          <CheckIcon strokeWidth={2} width={16} height={16} className="text-green" />
          Already Revoked
        </div>
      </Button>
    </List.KeyValue>
  )
}
