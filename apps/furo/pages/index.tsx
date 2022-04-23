import Link from 'next/link'
import { useAccount, useConnect } from 'wagmi'

export default function Furo() {
  const [{ data: connection, error: connectError}, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })
  // how do I get the chainId?
  const Wallet = () => {
    if (accountData) {
      return (
        <>
          <div>{accountData.ens?.name ? `${accountData.ens?.name} (${accountData.address})` : accountData.address}</div>
          <div>Connected to {accountData.connector.name}</div>
          <button onClick={disconnect}>Disconnect</button>
        </>
      )
    } else {
      return (
        <button
          onClick={() => {
            connect(connection.connectors[0])
          }}
        >
          Connect Wallet
        </button>
      )
    }
  }
  return (
    <div className="h-full">
      <h1 className="py-4 text-2xl font-bold">Overview</h1>
      <Wallet />
      {!connectError && accountData?.address ? (
        <>
          <div>
            <Link href={`/users/${accountData.address.toLowerCase()}/streams/`}>[Streams]</Link>
          </div>
          <div>
            <Link href={`/users/${accountData.address.toLowerCase()}/vestings/`}>[Vestings]</Link>
          </div>
        </>
      ) : (
        <div>{connectError?.message ?? 'Failed to connect'}</div>
      )}
    </div>
  )
}
