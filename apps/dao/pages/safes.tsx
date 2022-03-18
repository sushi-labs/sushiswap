import { getSafeInfo, SafeInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { FC } from 'react'
import { multisigs, Multisig, users, User } from '../constants'
import useSWR from 'swr'

// const fetcher = () => Promise.all(multisigs.map(multisig => getSafeInfo('https://safe-client.gnosis.io/v1/chains/', String(multisig.chainId), multisig.address))) 

interface SafesProps {
  safes: SafeInfo[]
}

const Safes: FC<SafesProps> = ({ safes = [] }) => {

  // const { data, error } = useSWR('safes', fetcher, { fallbackData: safes })

  return (
    <>
      <h1>Multisigs</h1>
      {safes.map((safe) => (
        <div key={`${safe.chainId}-${safe.address}`}>{JSON.stringify(safe, null, 2)}</div>
      ))}

    {/* <h1>Users</h1>
    {users.map((user) => (
        <User key={user.address} name={user.name} />
      ))} */}
    </>
  )
}

export default Safes

export const getStaticProps = async () => {
  // const safes = await fetcher()
  const safe = await getSafeInfo('https://safe-client.gnosis.io/v1/chains/', '1','0x19B3Eb3Af5D93b77a5619b047De0EED7115A19e7')
  console.log({ safe })
  return {}
  // return {
  //   props: {
  //     safes
  //   },
  //   revalidate: 60 // 60s
  // }
}
