import { useAllTokens } from 'hooks'

export default function Test() {
  const tokens = useAllTokens()
  return <>{JSON.stringify(tokens)}</>
}
