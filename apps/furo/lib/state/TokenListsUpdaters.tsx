import { SupportedChainIds } from 'config'
import { Updater } from './TokenListsUpdater'

interface Props {
  chainIds: SupportedChainIds
}

export function Updaters({ chainIds }: Props) {
  return (
    <>
      {chainIds.map((chainId) => (
        <Updater key={chainId} chainId={chainId} />
      ))}
    </>
  )
}
