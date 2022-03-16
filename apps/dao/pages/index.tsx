import { useCallback, useEffect, useState } from 'react'
import connector from '../lib/connector'

function Header() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setInterval(() => {
      setCount(count + 1)
    }, 1000)
  })
  return <header style={{ background: 'green' }}>{count}</header>
}

export default function Dao() {
  const activate = useCallback(async () => {
    const [network] = connector

    const chainIds = [1, 3, 5]

    for (const chainId of chainIds) {
      await network.activate(chainId)
      const block = await network.provider.send('eth_blockNumber', [])
      console.log('BLOCK:', block)
    }
  }, [])
  return (
    <div>
      <Header />
      <main style={{ background: 'blue' }}>
        <h1>Dao</h1>
        <div>Lorem ipsum</div>
        <button onClick={activate}>Activate</button>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  return {
    props: {},
  }
}
