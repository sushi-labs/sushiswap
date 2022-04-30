import { Account, Wallet } from '@sushiswap/wallet-connector'
import Link from 'next/link'
import { useAccount, useConnect, useNetwork } from 'wagmi'
import { useIsMounted } from '@sushiswap/hooks'

export default function Index() {
  const { data } = useAccount()
  const { isConnected, isReconnecting, isConnecting } = useConnect()
  const isMounted = useIsMounted()
  const { activeChain } = useNetwork()
  return (
    <div className="h-full">
      <h1 className="py-4 text-2xl font-bold">Overview</h1>
      {isMounted && !isConnected && !isReconnecting && !isConnecting && (
        <div className="flex space-x-4">
          <Wallet.List />
        </div>
      )}
      {isMounted && (isConnected || isReconnecting) && (
        <>
          <div>
            <Account.Name address={data?.address} />
            <Account.Disconnect className="ml-4" />
          </div>
          <Link href={`/users/${data?.address?.toLowerCase()}?chainId=${activeChain?.id}`}>Dashboard</Link>
        </>
      )}
    </div>
  )
}
