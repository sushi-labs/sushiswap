import { FC, useEffect } from 'react'
import { useRP2ExploitCheck, useTokenRevokeApproval } from '@sushiswap/wagmi/future/hooks'
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
import { Chain } from '@sushiswap/chain'
import { Dots } from '@sushiswap/ui/future/components/Dots'

const Approvals: FC = () => {
  const { address } = useAccount()
  const {
    data: tokens,
    isInitialLoading: isLoading,
    refetch,
  } = useRP2ExploitCheck({
    account: address,
  })

  return (
    <Container maxWidth="lg" className="mx-auto my-[160px] w-full">
      <div className="flex justify-center">
        <div className="flex flex-col gap-6 w-full">
          <h1 className="">
            {isLoading ? (
              <Dots>Finding any approvals on the RouteProcessor2</Dots>
            ) : (
              'We searched across all our networks and we found the following tokens where you have balance and which are approved on the RouteProcessor2'
            )}
          </h1>
          <List>
            <List.Label>Tokens</List.Label>
            <List.Control>
              {isLoading ? (
                <>
                  <List.KeyValue skeleton />
                  <List.KeyValue skeleton />
                </>
              ) : tokens && tokens?.length > 0 && address ? (
                tokens?.map((el, i) => {
                  return <Item key={i} token={el} account={address} refetch={refetch} />
                })
              ) : address ? (
                <List.KeyValue flex title="No approvals found, you're good 👍">
                  <CheckIcon strokeWidth={2} className="text-green" width={24} height={24} />
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

const Item: FC<{ token: Token; account: Address; refetch(): void }> = ({ account, token, refetch }) => {
  const { write, isPending } = useTokenRevokeApproval({
    account,
    spender: routeProcessor2Address[token.chainId as RouteProcessor2ChainId],
    token,
  })

  useEffect(() => {
    if (!isPending) {
      refetch()
    }
  }, [isPending, refetch])

  return (
    <List.KeyValue
      subtitle={Chain.from(token.chainId).name}
      title={
        <div className="flex items-center gap-1">
          <Currency.Icon currency={token} width={20} height={20} />
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

export default Approvals
