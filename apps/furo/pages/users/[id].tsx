import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import useSWR from 'swr'
import { UserStreamsQuery, getBuiltGraphSDK, UserStreamsQueryVariables } from '../../.graphclient'
// import useSWR from "swr"

interface StreamsProps {
  //   safe: SafeInfo
  //   balance: SafeBalance
}

const Safe: FC<StreamsProps> = () => {
  const router = useRouter()
  const id = router.query.id as string
  // const [streams, setStreams] = useState<UserStreamsQuery>()
  
  // console.log(id)
  // const { data: sdk } = useSWR('sdk', () => getBuiltGraphSDK())
  // const { data: streams } = useSWR('streams', () => sdk.UserStreams({ id }))
  // useEffect(() => {
  //   ;async () => {
  //     const sdk = await getBuiltGraphSDK()
  //     const streams = await sdk.UserStreams({ id })
  //     setStreams(streams)
  //   }
  // })

  return (
    <>
      <div className="px-2 pt-16">
        <h1 className="py-4 text-2xl font-bold">Streams</h1>
        <h2>Incoming streams</h2>
        <div className="grid grid-cols-2 gap-2">
          {/* {Object.values(props.streams).map( (stream) => (
        <div key={stream.id}> {stream.status} {stream.recipient.id} {stream.amount} {new Date(parseInt(stream.startedAt) * 1000).toDateString()} {new Date(parseInt(stream.expiresAt) * 1000).toDateString()}</div>
      ))} */}
        </div>

        <h2>Outgoing streams</h2>
      </div>
    </>
  )
}

export default Safe

// export async function getStaticPaths() {
//   return {
//     paths: [{ params: { id: '0xc39c2d6eb8adef85f9caa141ec95e7c0b34d8dec' } }],
//     fallback: true,
//   }
// }

// export async function getStaticProps({params}) {
//   const sdk = await getBuiltGraphSDK()
//   console.log(params)
//   return {
//     props: await sdk.UserStreams( params.id ),
//     revalidate: 60,
//   }
// }
