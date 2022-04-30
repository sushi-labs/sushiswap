import { Account, Wallet } from '@sushiswap/wallet-connector'
import Link from 'next/link'
import { useAccount, useConnect, useNetwork } from 'wagmi'


export default function Furo() {
  const { data } = useAccount()
  const { isConnected, isReconnecting, isConnecting } = useConnect()
  const { activeChain } = useNetwork()

  return (
    <div className="h-full">
      <h1 className="py-4 text-2xl font-bold">Overview</h1>
      {!isConnected && (!isReconnecting || !isConnecting) && (
        <div className="flex space-x-4">
          <Wallet.List />
        </div>
      )}
      {(isConnected || isReconnecting) && data?.address && (
        <div>
          <div>
            <Account.Name address={data.address} />
            <Account.Disconnect className="ml-4" />
          </div>
          <div>
            <Link href={`/users/${data.address.toLowerCase()}?chainId=${activeChain?.id}`}>[Dashboard]</Link>
          </div>
        </div>
      )}
    </div>
  )
}
