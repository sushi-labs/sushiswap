import { Button } from '@sushiswap/ui'
import { useCallback } from 'react'
import { useAgent } from 'src/lib/perps'
import { useWalletClient } from 'wagmi'
import { useUserState } from '../user-provider'

//@dev this file will be reworked, using as a playground for agent approval flow for now
export const EnableTrading = () => {
  const { data: walletClient } = useWalletClient()
  const {
    state: {
      webData2Query: { data },
    },
  } = useUserState()
  const { agentAccount, createOrRemoveAgent } = useAgent()

  const approveAgentFlow = useCallback(async () => {
    if (!walletClient) return
    try {
      await createOrRemoveAgent({ type: !agentAccount ? 'create' : 'remove' })
    } catch (error) {
      console.log(error)
    }
  }, [walletClient, agentAccount, createOrRemoveAgent])
  // if (data?.agentValidUntil && data.agentValidUntil > Date.now()) {
  //   return null
  // }

  return (
    <Button className="w-full" onClick={approveAgentFlow}>
      {!data?.agentAddress || !agentAccount ? 'Enable' : 'Disable'} Trading
    </Button>
  )
}
