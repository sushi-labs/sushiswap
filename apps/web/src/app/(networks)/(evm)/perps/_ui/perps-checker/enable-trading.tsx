import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useCallback } from 'react'
import { useAgent } from 'src/lib/perps/use-agent'
import { useWalletClient } from 'wagmi'

export const EnableTrading: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'default',
  ...props
}) => {
  const { data: walletClient } = useWalletClient()
  const {
    agentAccount,
    createOrRemoveAgent,
    sushiAgent,
    isLoadingSushiAgent,
    sushiAgentError,
    refetchSushiAgent,
  } = useAgent()

  const approveAgentFlow = useCallback(async () => {
    if (!walletClient) return
    try {
      await createOrRemoveAgent({ type: !agentAccount ? 'create' : 'remove' })
      refetchSushiAgent()
    } catch (error) {
      console.log(error)
    }
  }, [walletClient, agentAccount, createOrRemoveAgent, refetchSushiAgent])

  if (isLoadingSushiAgent) {
    return (
      <Button fullWidth={fullWidth} size={size} disabled {...props}>
        Loading Agent...
      </Button>
    )
  }

  if (sushiAgentError) {
    return (
      <Button fullWidth={fullWidth} size={size} {...props}>
        {sushiAgentError?.message || 'Error Loading Agent Info'}
      </Button>
    )
  }

  if (
    !sushiAgent?.address ||
    !agentAccount ||
    agentAccount?.address?.toLowerCase() !==
      sushiAgent?.address?.toLowerCase() ||
    (sushiAgent?.validUntil && sushiAgent?.validUntil <= Date.now())
  ) {
    return (
      <Button
        fullWidth={fullWidth}
        size={size}
        {...props}
        onClick={approveAgentFlow}
      >
        Enable Trading
      </Button>
    )
  }

  return <>{children}</>
}
