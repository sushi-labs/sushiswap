'use client'

import { useRP2ExploitClaimFinder } from '@sushiswap/wagmi/future/hooks'
import { useAccount } from '@sushiswap/wagmi'
import { Container } from '@sushiswap/ui'
import { List } from '@sushiswap/ui/future/components/list/List'
import React from 'react'
import { ClaimItem } from '../components/ClaimItem'
import { Header } from '../components/Header'
import { ConnectButton } from '@sushiswap/wagmi/future/components'

export const RP2ClaimPage = () => {
  const { address } = useAccount()
  const claims = useRP2ExploitClaimFinder({
    account: address,
  })

  return (
    <>
      <Header />
      <Container className="mx-auto py-40 prose !prose-invert prose-slate">
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium tracking-tight text-white md:text-3xl">Sushi RouteProcessor2 Claim</h1>
          <p>
            Firstly, please know that {"Sushi's"} Swap web app is safe to use now. You likely have no exposure if you{' '}
            {"haven't"} interacted with Sushi in the past ten days, as the exploited contract is less than ten days old.
            But check approvals with the link above as a good security practice.
          </p>
        </div>

        <List className="pt-6 relative">
          <List.Label>Claims found on every network</List.Label>
          <List.Control>
            {address ? (
              claims.map(([chainId, claim]) => (
                <ClaimItem account={address} key={claim.index} claim={claim} chainId={chainId} />
              ))
            ) : (
              <List.KeyValue flex title="No user connected">
                <ConnectButton size="xs" color="blue" hideChevron />
              </List.KeyValue>
            )}
          </List.Control>
        </List>
      </Container>
    </>
  )
}

export default RP2ClaimPage
