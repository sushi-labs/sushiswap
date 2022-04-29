import { useEnsName } from 'wagmi'

type Props = {
  address?: string
}

function Name({ address }: Props): JSX.Element {
  const { data, isError, isLoading } = useEnsName({
    address,
  })
  if (isLoading) return <>Fetching name…</>
  if (isError) return <>Error fetching name</>
  return <>{data || address?.slice(0, 6) + '...'}</>
}

export default Name
