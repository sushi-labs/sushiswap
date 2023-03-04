import { SupportedChainIds } from 'config'
import { Updater } from './MulticallUpdater'

interface Props {
  chainIds: SupportedChainIds
  isDebug?: boolean
}

export function Updaters({ chainIds, isDebug = true }: Props) {
  return (
    <>
      {chainIds.map((chainId) => (
        <Updater key={chainId} chainId={chainId} isDebug={isDebug} />
      ))}
    </>
  )
}
