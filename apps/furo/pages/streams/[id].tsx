import { useRouter } from 'next/router'
import { FC } from 'react'
import { getBuiltGraphSDK } from '../../.graphclient'


interface StreamProps {
  stream: Stream
}

interface Stream {
  id: string
  status: string
  amount: string
  withdrawnAmount: string
  expiresAt: string
  startedAt: string
  token: Token
}

interface Token {
  id: string
  symbol: string
  name: string
}


const Streams: FC<StreamProps> = (props) => {
  const router = useRouter()
  const id = router.query.id as string
 
  return (
    <>
      <div className="px-2 pt-16">
        <h1 className="py-4 text-2xl font-bold">Stream</h1>
        <div className="grid gap-2">
          {props.stream ? (
              <div key={props.stream.id}>
                {props.stream.status} {``}
                {props.stream.amount} {``} {props.stream.token.symbol} {``}
                {new Date(parseInt(props.stream.startedAt) * 1000).toLocaleString()} {``}
                {new Date(parseInt(props.stream.expiresAt) * 1000).toLocaleString()}
              </div>
          ) : (
            <div><i>No stream found..</i></div>
          )}
        </div>
      </div>
    </>
  )
}

export default Streams

export async function getServerSideProps({ query }) {
  const sdk = await getBuiltGraphSDK()
  return {
    props: await sdk.Stream({ id: query.id }),
  }
}
