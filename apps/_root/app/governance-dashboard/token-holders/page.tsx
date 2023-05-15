import React from 'react'

import { HolderSnapshot } from '../components/HolderSnapshot'
import { getSushiPriceUSD, getTokenHolders } from '../lib'
import { TokenHoldersTable } from './TokenHoldersTable'

export default async function TokenHolders({ searchParams }) {
  const [tokenHolders, sushiPrice] = await Promise.all([getTokenHolders(searchParams), getSushiPriceUSD()])

  const totalSupply = Math.trunc(+tokenHolders.totalSupply ?? 0) / 1e18

  const users = tokenHolders.users.map((user, i: number) => {
    const balance = Math.trunc(+user.balance) / 1e18

    return {
      id: user.id,
      rank: i + 1,
      address: user.id,
      quantity: balance,
      ownership: balance / totalSupply,
      value: balance * sushiPrice,
    }
  })

  return (
    <section className="space-y-14">
      {/* @ts-expect-error Async Server Component */}
      <HolderSnapshot />
      <TokenHoldersTable users={users} />
    </section>
  )
}
