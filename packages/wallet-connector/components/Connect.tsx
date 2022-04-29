import React from 'react'
import { useAccount, useConnect } from 'wagmi'

import Account from './Account'
import Wallet from './Wallet'

const Connect = () => {
  const { data, isError, isLoading } = useAccount()
  const { isConnected, isReconnecting } = useConnect()

  if (isError) {
    return <>Error</>
  }

  if (isLoading) {
    return <>Loading...</>
  }

  if (isConnected || isReconnecting) {
    return (
      data?.address && (
        <>
          <Account.Name address={data.address} />
          <Account.Balance address={data.address} />
        </>
      )
    )
  }

  return <Wallet.List />
}

export default Connect
