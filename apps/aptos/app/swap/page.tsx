'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Container } from '@sushiswap/ui'
import Loading from 'app/loading'
import React, { useEffect } from 'react'
import { SimpleSwapWidget } from 'ui/swap/simple/simple-swap-widget'
import requiredNetworkAlert from 'utils/requiredNetworkAlert'
import { useAccount } from 'utils/useAccount'

export default function SwapPage() {
  const { disconnect, network } = useWallet()
  const { isLoadingAccount } = useAccount()

  useEffect(() => {
    requiredNetworkAlert(network, disconnect)
  }, [network, disconnect])

  return (
    <>
      {isLoadingAccount && <Loading />}
      <Container maxWidth="lg" className="px-4">
        <SimpleSwapWidget />
      </Container>
    </>
  )
}
