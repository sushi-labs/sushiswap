import { useCurrentBlockTimestampMultichain } from '../hooks'
import chain from '@sushiswap/chain'
import { SushiIcon } from '@sushiswap/ui'

export default function Bridge({ chainIds, blockNumbers }: { chainIds: number[]; blockNumbers: number[] }) {
  const chainNames = Object.entries(chain)
    .filter(([chainId1]) => chainIds.find((chainId2) => Number(chainId1) === Number(chainId2)))
    .map(([, chain]) => {
      return chain.name
    })
  const blockTimestamps = useCurrentBlockTimestampMultichain(chainIds, blockNumbers)
  const isReady = blockTimestamps.filter((b) => !!b).length >= 2
  return (
    <>
      <h1>Multichain Bridge</h1>
      <h2>Chain Names:</h2>
      {chainNames.join(',')}
      <h2>Block Timestamps:</h2>
      {isReady && <p data-testid="blockTimestamps">{blockTimestamps.join(',')}</p>}

      <div className="flex flex-col gap-3 p-2 md:p-4 pt-4 rounded-[24px] bg-dark-800 shadow-md shadow-dark-1000">
        <div className="flex justify-between">Swap Settings</div>
        <div className="flex justify-between">From Ethereum BentoBox ✅</div>

        <div>
          <SushiIcon width="1em" height="1em" /> Powered by the SushiSwap protocol
        </div>
      </div>
    </>
  )
}
