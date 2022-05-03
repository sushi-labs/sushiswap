import { useCurrentBlockTimestampMultichain } from '../hooks'
import chain from '@sushiswap/chain'

export default function Multicall({ chainIds, blockNumbers }: { chainIds: number[]; blockNumbers: number[] }) {
  const chainNames = Object.entries(chain)
    .filter(([chainId1]) => chainIds.find((chainId2) => Number(chainId1) === Number(chainId2)))
    .map(([, chain]) => {
      return chain.name
    })
  const blockTimestamps = useCurrentBlockTimestampMultichain(chainIds, blockNumbers)
  const isReady = blockTimestamps.filter((b) => !!b).length >= 2
  console.log({ blockNumbers, chainIds, chainNames })
  return (
    <>
      <h1>Multichain Multicall</h1>
      <h2>Chain Names:</h2>
      {chainNames.join(',')}
      <h2>Block Timestamps:</h2>
      {isReady && <p data-testid="blockTimestamps">{blockTimestamps.join(',')}</p>}
    </>
  )
}

// export async function getStaticProps() {
//   return {
//     props: {},
//   }
// }
