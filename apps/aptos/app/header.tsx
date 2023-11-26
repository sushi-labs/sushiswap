'use client'

import { GlobalNav } from '@sushiswap/ui/future/components/GlobalNav'
import { Button } from '@sushiswap/ui/future/components/button'
import React, { FC } from 'react'
import Link from 'next/link'
import WalletSelector from 'components/WalletSelector'

export const Header: FC = () => {
  return (
    <GlobalNav rightElement={<WalletSelector varient="outlined" color="default" size="md" />}>
      <Link href="/swap">
        <Button color="default" variant="empty" size="md">
          Swap
        </Button>
      </Link>
      <Link href="/pool">
        <Button color="default" variant="empty" size="md">
          Pool
        </Button>
      </Link>
    </GlobalNav>
  )
}
