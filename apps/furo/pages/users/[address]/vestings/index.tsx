import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { getBuiltGraphSDK } from '../../../../.graphclient'
import Main from '../../../../components/Main'

interface UserProps {
  incomingVestings: Vesting[]
  outgoingVestings: Vesting[]
}

interface Vesting {
  id: string
  status: string
  steps: string
  startedAt: string
  expiresAt: string
  cliffDuration: string
  stepDuration: string
  stepAmount: string
  cliffAmount: string
  totalAmount: string
  withdrawnAmount: string
  fromBentoBox: boolean
  token: Token
  recipient: User
  createdBy: User
}

interface Token {
  id: string
  symbol: string
  name: string
  decimals: string
}

interface User {
  id: string
}

const Vestings: FC<UserProps> = (props) => {
  const router = useRouter()
  const address = router.query.address as string
  let {incomingVestings, outgoingVestings} = props

  return (
    <Main>
      <div className="px-2 pt-16">
        <h1 className="py-4 text-2xl font-bold">Vestings</h1>
        <h1 className="py-4 text-2xl font-bold">Incoming vestings</h1>
        <div className="grid gap-2">
          {incomingVestings.length ? (
            Object.values(incomingVestings).map((vesting) => (
              <div key={vesting.id}>
                {vesting.status} {``}
                {vesting.createdBy.id} {``}
                {vesting.totalAmount} {``} {vesting.token.symbol} {``}
                {new Date(parseInt(vesting.startedAt) * 1000).toLocaleString()} {``}
                {new Date(parseInt(vesting.expiresAt) * 1000).toLocaleString()}
                {<Link href={'/vesting/'.concat(vesting.id)}> View</Link>}
              </div>
            ))
          ) : (
            <div>
              <i>No vestings found..</i>
            </div>
          )}
        </div>
        <h1 className="py-4 text-2xl font-bold">Outgoing vestings</h1>
        <div className="grid gap-2">
          {outgoingVestings.length ? (
            Object.values(outgoingVestings).map((vesting) => (
              <div key={vesting.id}>
                {vesting.status} {``}
                {vesting.recipient.id} {``}
                {vesting.totalAmount} {``} {vesting.token.symbol} {``}
                {new Date(parseInt(vesting.startedAt) * 1000).toLocaleString()} {``}
                {new Date(parseInt(vesting.expiresAt) * 1000).toLocaleString()}
                {<Link href={'/vesting/'.concat(vesting.id)}> View</Link>}
              </div>
            ))
          ) : (
            <div>
              <i>No vestings found..</i>
            </div>
          )}
        </div>
      </div>
    
      </Main>
  )
}

export default Vestings

export async function getServerSideProps({ query }) {
  const sdk = await getBuiltGraphSDK()
  const user = (await sdk.UserVestings({ id: query.address })).vestingUser
  return {
    props: user,
  }
}
