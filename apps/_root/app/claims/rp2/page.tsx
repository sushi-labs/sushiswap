'use client'

import { useRP2ExploitClaimFinder } from '@sushiswap/wagmi/future/hooks'
import { useAccount } from '@sushiswap/wagmi'
import { Container } from '@sushiswap/ui'
import { List } from '@sushiswap/ui/future/components/list/List'
import React from 'react'
import { ClaimItem } from '../components/ClaimItem'
import { Header } from '../components/Header'
import { ConnectButton } from '@sushiswap/wagmi/future/components'

const RP2ClaimPage = () => {
  const { address } = useAccount()
  const claims = useRP2ExploitClaimFinder({
    account: address,
  })

  return (
    <>
      <Header />
      <Container className="mx-auto py-10 prose !prose-invert prose-slate">
        <div className="flex flex-col">
          <h2>Sushi RouteProcessor2 Claim</h2>
          <p className="font-bold">
            Please revoke any token approvals you have on RouteProcessor2. Once you have revoked approvals, you will be
            able to claim any lost funds resulting from the exploit.
          </p>
          <p>If your funds rest in the whitehat contract, they are claimable here.</p>
          <List className="!pt-0 pb-3 relative">
            <List.Control>
              {!address ? (
                <List.KeyValue flex title="No user connected">
                  <ConnectButton size="xs" color="blue" hideChevron />
                </List.KeyValue>
              ) : claims.length > 0 ? (
                claims.map(([chainId, claim]) => (
                  <ClaimItem account={address} key={claim.index} claim={claim} chainId={chainId} />
                ))
              ) : (
                <List.KeyValue flex title="No claims found">
                  <span className="h-[28px]" />
                </List.KeyValue>
              )}
            </List.Control>
          </List>
          <p>
            If your funds do not reside in the whitehat address, you must submit an email to{' '}
            <a href="mailto:security@sushi.com">security@sushi.com</a> or #open-a-ticket and include the transaction
            ID(s) and blockchain(s) data for the lost funds.
          </p>
          <p>
            Blackhat funds will take longer to process, as the team will verify the legitimacy against on-chain data
            that validates them and will get paid accordingly.
          </p>
        </div>
        <hr />
        <h2>My funds were lost in this exploit. What can I do?</h2>
        <p>
          Part of the lost funds got swept by whitehat security teams and part of them are lost to blackhat hackers.
        </p>
        <ol>
          <li>If your funds rest in the whitehat contract, they will be claimable from this page.</li>
          <li>
            If your funds do not reside in the whitehat address, you must submit an email to{' '}
            <a href="mailto:security@sushi.com">security@sushi.com</a> or #open-a-ticket and include the transaction
            ID(s) and blockchain(s) data for the lost funds.
          </li>
        </ol>
        <hr />
        <h2>What is RouteProcessor2 Vulnerability? What happened?</h2>
        <p>
          There was an approval bug in a Sushi contract called RouteProcessor2 and it was exploited by hackers. Money
          was taken from users wallets. No other contract is affected. Sushi liquidity is safe.
        </p>
        <hr />
        <h2>Can we use Sushi safely now?</h2>
        <p>
          The user interface has been updated to remove the affected contract. It is safe to trade and provide liquidity
          on sushi.
        </p>
        <p>
          If you have tokens approved for RouteProcessor2 on any network, you should revoke the approvals as soon as
          possible.
        </p>
      </Container>
    </>
  )
}

export default RP2ClaimPage
