import { FC, useCallback } from 'react'
import { useRP2ExploitCheck } from '@sushiswap/wagmi/future/hooks'
import Button from '@sushiswap/ui/future/components/button/Button'
import { useAccount, writeContract, prepareWriteContract, UserRejectedRequestError } from '@sushiswap/wagmi'
import { CheckIcon } from '@heroicons/react/24/outline'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { Token } from '@sushiswap/currency'
import { Address, erc20ABI } from '@wagmi/core'
import { routeProcessorAddress } from '@sushiswap/route-processor/exports/exports'
import { isRouteProcessorChainId } from '@sushiswap/route-processor'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { BigNumber } from 'ethers'
import { List } from '@sushiswap/ui/future/components/list/List'
import Container from '@sushiswap/ui/future/components/Container'
import { Chain } from '@sushiswap/chain'
import { Dots } from '@sushiswap/ui/future/components/Dots'

const Approvals: FC = () => {
  const { address } = useAccount()
  const { data: tokens, isInitialLoading: isLoading } = useRP2ExploitCheck({
    account: address,
  })

  const revoke = useCallback(
    async (el: Token) => {
      if (isRouteProcessorChainId(el.chainId)) {
        const config = await prepareWriteContract({
          address: el.wrapped.address as Address,
          abi: erc20ABI,
          chainId: el.chainId,
          functionName: 'approve',
          args: [routeProcessorAddress[el.chainId], BigNumber.from(0)],
        })

        try {
          const tx = await writeContract(config)
          const ts = new Date().getTime()

          void createToast({
            account: address,
            type: 'swap',
            chainId: el.chainId,
            txHash: tx.hash,
            promise: tx.wait(),
            summary: {
              pending: `Revoking approval for ${el.symbol}`,
              completed: `Successfully revoked approval for ${el.symbol}`,
              failed: `Failed to revoke approval for ${el.symbol}`,
            },
            timestamp: ts,
            groupTimestamp: ts,
          })
        } catch (e: unknown) {
          if (e instanceof UserRejectedRequestError) {
            // Do nothing
          }
          console.error(e)
        }
      }
    },
    [address]
  )

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
              ) : tokens && tokens?.length > 0 ? (
                tokens?.map((el, i) => {
                  return (
                    <List.KeyValue
                      key={i}
                      subtitle={Chain.from(el.chainId).name}
                      title={
                        <div className="flex items-center gap-1">
                          <Currency.Icon currency={el} width={20} height={20} />
                          {el.name} ({el.symbol})
                        </div>
                      }
                    >
                      <Checker.Connect size="xs" color="blue">
                        <Checker.Network size="xs" color="blue" chainId={el.chainId}>
                          <Button size="xs" color="blue" onClick={() => revoke(el)}>
                            Revoke
                          </Button>
                        </Checker.Network>
                      </Checker.Connect>
                    </List.KeyValue>
                  )
                })
              ) : (
                <List.KeyValue title="No approvals found">
                  <CheckIcon strokeWidth={2} className="text-green" width={24} height={24} />
                </List.KeyValue>
              )}
            </List.Control>
          </List>
        </div>
        <div className="space-y-3"></div>
      </div>
    </Container>
  )
}

export default Approvals
