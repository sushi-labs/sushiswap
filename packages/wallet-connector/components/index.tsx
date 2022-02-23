import { FC } from 'react'
import { WalletStatus } from './WalletStatus'
import { getConnectorsToActivate } from '../connectors'
import { ActivateConnector } from './ActivateConnector'

const SushiWalletConnector: FC = () => {
  return (
    <div>
      <WalletStatus />
      {getConnectorsToActivate().map((connector, i) => (
        <ActivateConnector key={i} name={connector.name} activateFn={connector.activateFn} />
      ))}
    </div>
  )
}

export default SushiWalletConnector
