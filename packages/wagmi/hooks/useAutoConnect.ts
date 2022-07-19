import { useEffect } from 'react'
import { useClient, useConnect } from 'wagmi'

const AUTOCONNECTED_CONNECTOR_IDS = ['safe']

export const useAutoConnect = () => {
  const client = useClient()
  const { connect, connectors } = useConnect()

  useEffect(() => {
    const ready = connectors.filter((c) => AUTOCONNECTED_CONNECTOR_IDS.includes(c.id)).some((c) => c.ready)
    if (ready) {
      AUTOCONNECTED_CONNECTOR_IDS.forEach((connectorId) => {
        const connector = connectors.find((c) => c.id === connectorId && c.ready)
        if (connector) {
          connect({ connector })
        }
      })
    } else {
      ;(async () => {
        await client.autoConnect()
      })()
    }
  }, [client, connect, connectors])
}
