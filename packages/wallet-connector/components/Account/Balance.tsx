import { useBalance } from 'wagmi'

type Props = {
  address: string
}

function Balance({ address }: Props): JSX.Element {
  const { data, isError, isLoading } = useBalance({ addressOrName: address, enabled: true })
  if (isLoading) return <>Fetching balance...</>
  if (isError) return <>Error fetching balance</>
  return <>{data?.formatted} ETH</>
}

export default Balance
