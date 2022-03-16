import { FC } from 'react'
import { multisigs, Multisig } from '../constants'

export default function Multisigs() {
  return (
    <>
      <h1>Multisigs</h1>
      {multisigs.map((multisig) => (
        <Multisig key={multisig.address} multisig={multisig} />
      ))}
    </>
  )
}

const Multisig: FC<{ multisig: Multisig }> = ({ multisig }) => {
  return <div>{JSON.stringify(multisig, null, 2)}</div>
}

// export async function getStaticProps() {
//   return {
//     props: {},
//     revalidate: 60 // 60s
//   }
// }
