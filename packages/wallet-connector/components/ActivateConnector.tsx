import { FC } from 'react'
import { ConnectorToActivate } from '../connectors'

export const ActivateConnector: FC<ConnectorToActivate> = ({ name, activate }) => {
  return (
    <div>
      <p>Connector name: {name}</p>
      <button onClick={() => activate()}>Connect</button>
    </div>
  )
}
