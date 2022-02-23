import { FC } from 'react'
import { WalletStatus } from './WalletStatus'
import { getConnectorsToActivate } from '../connectors'
import { ActivateConnector } from './ActivateConnector'

const SushiWalletConnector: FC = () => {
  return (
    <div>
      <WalletStatus />
      {getConnectorsToActivate().map((connector, i) => (
        <ActivateConnector key={i} name={connector.name} activate={connector.activate} />
      ))}
    </div>
  )
}

export default SushiWalletConnector
