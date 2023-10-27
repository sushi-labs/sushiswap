'use client'
import React, { useEffect } from 'react'
import Remove from './remove'
import { useAccount } from 'utils/useAccount'
import Loading from 'app/loading'
import { useWallet } from '@aptos-labs/wallet-adapter-react'

const Pool = () => {
  const { isLoadingAccount } = useAccount()
  const { network, disconnect } = useWallet()
  useEffect(() => {
    if (network?.name?.toLowerCase() === undefined) {
      disconnect()
    }
    if (network?.name?.toLowerCase() === 'mainnet' || network?.name?.toLowerCase() === 'devnet') {
      disconnect()
      alert('Please switch network to testnet')
    }
  }, [network])
  return (
    <div>
      {isLoadingAccount && <Loading />}
      <Remove />
    </div>
  )
}

export default Pool
