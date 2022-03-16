import { useCurrentBlockTimestampMultichain } from '../hooks'

export default function Dao({ chainIds, blockNumbers }) {
  console.log({ blockNumbers, chainIds })
  const blockTimestamps = useCurrentBlockTimestampMultichain(chainIds, blockNumbers)
  const isReady = blockTimestamps.filter((b) => !!b).length >= 2
  return (
    <main style={{ background: 'blue' }}>
      <h1>Dao</h1>
      <h2>Hello Multichain Multicall</h2>
      <h3>Block Timestamps:</h3>
      {isReady && <p data-testid="blockTimestamps">{blockTimestamps.join(',')}</p>}
    </main>
  )
}

// export async function getStaticProps() {
//   return {
//     props: {},
//   }
// }
