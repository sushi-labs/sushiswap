'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Container } from '@sushiswap/ui'
import React, { useEffect } from 'react'
import requiredNetworkAlert from '~aptos/(common)/lib/common/required-network-alert'
import { useAccount } from '~aptos/(common)/lib/common/use-account'
import Loading from '~aptos/loading'
import { SimpleSwapWidget } from '~aptos/swap/ui/simple/simple-swap-widget'

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
