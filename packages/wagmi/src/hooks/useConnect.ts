'use client'

import { useLocalStorage } from '@sushiswap/hooks'
import { useConnect as useWagmiConnect, useDisconnect as useWagmiDisconnect } from 'wagmi'

export const useConnect: typeof useWagmiConnect = (props) => {
  const [_, setSanctionedAddress] = useLocalStorage('sanctionedAddress', false)

  const { disconnect } = useWagmiDisconnect()

  return useWagmiConnect({
    ...props,
    onSuccess: async (data) => {
      const resp = await fetch('https://api.trmlabs.com/public/v1/sanctions/screening', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: 'Basic ' + Buffer.from('<username>:<password>').toString('base64')
        },
        body: JSON.stringify([{ address: data.account }]),
      })
        .then((response) => response.json())
        .then(
          (
            data: {
              address: string
              isSanctioned: boolean
            }[]
          ) => data[0]
        )

      if (resp.isSanctioned) {
        setSanctionedAddress(true)
        disconnect()
      }
    },
  })
}
