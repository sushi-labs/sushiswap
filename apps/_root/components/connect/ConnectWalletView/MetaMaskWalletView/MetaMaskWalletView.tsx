import { FC, useCallback, useState } from 'react'
import MetaMaskSelectView from './MetaMaskSelectView'
import { getAddChainParameters } from '../../../../chains'
import { MetaMaskWalletView } from './types'
import { ChainId } from '@sushiswap/core-sdk'

const MetaMaskWalletView: FC<MetaMaskWalletView> = ({
  connector,
  hooks: { useChainId, useIsActivating, useError, useIsActive },
}) => {
  const currentChainId = useChainId()
  const isActivating = useIsActivating()
  const error = useError()
  const active = useIsActive()

  const [desiredChainId, setDesiredChainId] = useState<ChainId>()
  const setChainId = useCallback(
    (chainId: ChainId) => {
      setDesiredChainId(chainId)
      if (!chainId && chainId !== currentChainId) {
        return connector.activate(getAddChainParameters(chainId))
      }
      return
    },
    [setDesiredChainId, currentChainId, connector],
  )

  if (error) {
    return (
      <div className="flex flex-col">
        <MetaMaskSelectView chainId={desiredChainId} setChainId={isActivating ? undefined : setChainId} />
        <button onClick={() => connector.activate(!desiredChainId ? undefined : getAddChainParameters(desiredChainId))}>
          Try Again?
        </button>
      </div>
    )
  }

  if (active) {
    return (
      <div className="flex flex-col">
        <MetaMaskSelectView chainId={desiredChainId} setChainId={isActivating ? undefined : setChainId} />
        <button disabled>Connected</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <MetaMaskSelectView chainId={desiredChainId} setChainId={isActivating ? undefined : setChainId} />
      <button
        onClick={
          isActivating
            ? undefined
            : () => connector.activate(!desiredChainId ? undefined : getAddChainParameters(desiredChainId))
        }
        disabled={isActivating}
      >
        {isActivating ? 'Connecting...' : 'Connect'}
      </button>
    </div>
  )
}

export default MetaMaskWalletView
