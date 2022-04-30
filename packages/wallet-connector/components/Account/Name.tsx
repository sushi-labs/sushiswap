import { useEnsName } from 'wagmi'

type Props = {
  address?: string
}

function Name({ address }: Props): JSX.Element {
  const { data } = useEnsName({
    address,
  })
  return <>{data || address?.slice(0, 6) + '...'}</>
}

export default Name
