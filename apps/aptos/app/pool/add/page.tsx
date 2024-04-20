'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import React, { useEffect } from 'react'
import { FC } from 'react'
import { PoolAddDepositWidget } from 'ui/pool/pool/add/pool-add-deposit-widget'
import { PoolAddSelectTokensWidget } from 'ui/pool/pool/add/pool-add-select-tokens-widget'
import requiredNetworkAlert from 'utils/requiredNetworkAlert'
import { usePoolPairs } from 'utils/swap-get-route/use-pool-pairs'

export default function Page() {
  const { network, disconnect } = useWallet()

  usePoolPairs()

  useEffect(() => {
    requiredNetworkAlert(network, disconnect)
  }, [network, disconnect])

  return <_Add />
}

const _Add: FC = () => {
  return (
    <>
      <PoolAddSelectTokensWidget />
      <PoolAddDepositWidget />
    </>
  )
}
