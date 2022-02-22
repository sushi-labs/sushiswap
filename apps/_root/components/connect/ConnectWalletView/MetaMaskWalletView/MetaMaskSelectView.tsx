import { FC } from 'react'
import { CHAINS } from '../../../../chains'
import { ChainId } from 'chain'

interface MetasMaskSelectView {
  chainId: ChainId | undefined
  setChainId?(chainId: number): void
}

const MetaMaskSelectView: FC<MetasMaskSelectView> = ({ chainId, setChainId }) => {
  return (
    <label>
      Chain:{' '}
      <select
        value={`${chainId}`}
        onChange={
          setChainId
            ? (event) => {
                setChainId(Number(event.target.value))
              }
            : undefined
        }
        disabled={!setChainId}
      >
        <option value={-1}>Default</option>
        {Object.entries(CHAINS)
          .filter(([, data]) => data.urls)
          .map(([chainId, data]) => (
            <option key={chainId} value={chainId}>
              {data.name}
            </option>
          ))}
      </select>
    </label>
  )
}

export default MetaMaskSelectView
