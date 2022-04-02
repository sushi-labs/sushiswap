import Link from 'next/link'
import { useAccount, useConnect } from 'wagmi'

export default function Furo() {
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })
  return (
    <div className="px-2 pt-16">
      <h1 className="py-4 text-2xl font-bold">Overview</h1>
      {data.connectors.map((connector) => (
        <button disabled={!connector.ready} key={connector.id} onClick={() => connect(connector)}>
          {`Connect to: ` + connector.name}
          {!connector.ready && ' (unsupported)'}
        </button>
      ))}
      {!error && accountData.address ? (
        <>
          <div>
            <Link href={`/users/${accountData.address.toLowerCase()}/streams/`}>Streams</Link>
          </div>
          <div>
            <Link href={`/users/${accountData.address.toLowerCase()}/vestings/`}>Vestings</Link>
          </div>
        </>
      ) : (
        <div>{error?.message ?? 'Failed to connect'}</div>
      )}
    </div>
  )
}
