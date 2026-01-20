import { approveAgent } from '@nktkas/hyperliquid/api/exchange'
import { Button } from '@sushiswap/ui'
import { useCallback } from 'react'
import { hlHttpTransport } from 'src/lib/perps/transports'
import { useWalletClient } from 'wagmi'
import { useUserState } from '../user-provider'

export const EnableTrading = () => {
  const { data: walletClientData } = useWalletClient()
  const {
    state: {
      webData2Query: { data },
    },
  } = useUserState()

  const approveAgentFlow = useCallback(async () => {
    if (!walletClientData || !data?.agentAddress) return
    try {
      const res = await approveAgent(
        {
          wallet: walletClientData,
          transport: hlHttpTransport,
        },
        {
          agentAddress: data?.agentAddress,
        },
      )
      if (res.status !== 'ok') {
        console.log('Approval failed', res)
      }
    } catch (error) {
      console.log(error)
    }
  }, [data?.agentAddress, walletClientData])

  if (data?.agentValidUntil && data.agentValidUntil > Date.now() / 1000) {
    return 'Trading Enabled'
  }

  return (
    <Button className="w-full" onClick={approveAgentFlow}>
      Enable Trading
    </Button>
  )
}
