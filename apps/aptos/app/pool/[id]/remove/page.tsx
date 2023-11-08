'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import Loading from 'app/loading'
import React, { useEffect } from 'react'
import requiredNetworkAlert from 'utils/requiredNetworkAlert'
import { useAccount } from 'utils/useAccount'
import Remove from './remove'

const Pool = () => {
  const { isLoadingAccount } = useAccount()
  const { network, disconnect } = useWallet()

  useEffect(() => {
    requiredNetworkAlert(network, disconnect)
  }, [network])

  return (
    <div>
      {isLoadingAccount && <Loading />}
      <Remove />
    </div>
  )
}

export default Pool
