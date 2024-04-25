'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import React, { useEffect } from 'react'
import { FC } from 'react'
import { PoolAddFormSelectTokensWidget } from 'ui/pool/pool/add/pool-add-form/pool-add-form-select-tokens-widget'
import { PoolAddFormWidget } from 'ui/pool/pool/add/pool-add-form/pool-add-form-widget'
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
      <PoolAddFormSelectTokensWidget />
      <PoolAddFormWidget />
    </>
  )
}
