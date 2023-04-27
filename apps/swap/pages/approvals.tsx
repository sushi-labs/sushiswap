import React, { FC, useEffect } from 'react'
import { useRP2ExploitCheck, useTokenAllowance, useTokenRevokeApproval } from '@sushiswap/wagmi/future/hooks'
import Button from '@sushiswap/ui/future/components/button/Button'
import { useAccount } from '@sushiswap/wagmi'
import { CheckIcon } from '@heroicons/react/24/outline'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { Token } from '@sushiswap/currency'
import { Address } from '@wagmi/core'
import { routeProcessor2Address, RouteProcessor2ChainId } from '@sushiswap/route-processor/exports/exports'
import { List } from '@sushiswap/ui/future/components/list/List'
import Container from '@sushiswap/ui/future/components/Container'
import { ZERO } from '@sushiswap/math'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { NetworkIcon } from '@sushiswap/ui'
import Link from 'next/link'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'

const Approvals: FC = () => {
  const { address } = useAccount()
  const { data: tokens, isInitialLoading: isLoading } = useRP2ExploitCheck({
    account: address,
  })

  return (
    <Container maxWidth="lg" className="mx-auto my-[80px] w-full">
      <div className="flex flex-col gap-2 mb-10">
        <Link className="group flex gap-4 items-center mb-2" href="/" shallow={true}>
          <IconButton
            icon={ArrowLeftIcon}
            iconProps={{
              width: 24,
              height: 24,
              transparent: true,
            }}
          />
          <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">Go back to swap</span>
        </Link>
        <h1 className="text-3xl font-medium mt-2">RP2 Approvals</h1>
        <h1 className="text-lg text-gray-600 dark:dark:text-slate-400 text-slate-600">
          {"We'll"} search every network to find any approvals on the RouteProcessor2.
        </h1>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col gap-6 w-full">
          <List>
            <List.Label>Tokens</List.Label>
            <List.Control>
              {isLoading ? (
                <>
                  <List.KeyValue skeleton />
                </>
              ) : tokens && tokens?.length > 0 && address ? (
                tokens?.map((el, i) => {
                  return <Item key={i} token={el} account={address} />
                })
              ) : address ? (
                <List.KeyValue flex title="No approvals found, you're good 👍">
                  <CheckIcon strokeWidth={2} className="text-green" width={20} height={20} />
                </List.KeyValue>
              ) : (
                <List.KeyValue flex title="No wallet connected, please connect wallet">
                  <></>
                </List.KeyValue>
              )}
            </List.Control>
          </List>
        </div>
      </div>
    </Container>
  )
}

const Item: FC<{ token: Token; account: Address }> = ({ account, token }) => {
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

export default Approvals
