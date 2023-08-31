import { CheckIcon } from '@heroicons/react-v1/solid'
import { Token } from '@sushiswap/currency'
import { ZERO } from '@sushiswap/math'
import { ROUTE_PROCESSOR_2_ADDRESS, RouteProcessor2ChainId } from '@sushiswap/route-processor-sdk'
import { Badge } from '@sushiswap/ui/components/Badge'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { List } from '@sushiswap/ui/components/list/List'
import { Address } from '@sushiswap/wagmi'
import { useTokenAllowance, useTokenRevokeApproval } from '@sushiswap/wagmi/future/hooks'
import { Checker } from '@sushiswap/wagmi/future/systems'
import React, { FC } from 'react'

export const RevokeItem: FC<{ token: Token; account: Address }> = ({ account, token }) => {
  const { data: allowance, isLoading } = useTokenAllowance({
    chainId: token.chainId,
    token,
    owner: account,
    spender: ROUTE_PROCESSOR_2_ADDRESS[token.chainId as RouteProcessor2ChainId],
  })

  const { write, isPending } = useTokenRevokeApproval({
    account,
    token,
    spender: ROUTE_PROCESSOR_2_ADDRESS[token.chainId as RouteProcessor2ChainId],
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
        <Checker.Connect size="sm">
          <Checker.Network size="sm" chainId={token.chainId}>
            <Button size="sm" disabled={isPending} loading={isPending} onClick={() => write?.()}>
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
      <Button size="sm" variant="secondary" className="pointer-events-none">
        <div className="flex gap-1 items-center">
          <CheckIcon strokeWidth={2} width={16} height={16} className="text-green" />
          Already Revoked
        </div>
      </Button>
    </List.KeyValue>
  )
}
