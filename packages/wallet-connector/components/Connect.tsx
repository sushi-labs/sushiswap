import { useAccount, useConnect } from 'wagmi'

import { Account } from './Account'
import { Wallet } from './Wallet'

export function Connect(): JSX.Element | null {
  const { data, isError, isLoading } = useAccount()
  const { isConnected, isReconnecting } = useConnect()

  if (isError) {
    return <>Error</>
  }

  if (isLoading) {
    return <>Loading...</>
  }

  if (isConnected || isReconnecting) {
    if (!data?.address) return null
    return (
      <>
        <Account.Name address={data.address} />
        <Account.Balance address={data.address} />
      </>
    )
  }

  return <Wallet.List />
}
