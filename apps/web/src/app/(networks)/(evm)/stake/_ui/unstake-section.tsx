'use client'

import { Button, Dots } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { useBarWithdraw } from 'src/lib/wagmi/hooks/bar/use-bar-withdraw'
import { Amounts } from 'src/lib/wagmi/systems/checker/amounts'
import { Connect } from 'src/lib/wagmi/systems/checker/connect'
import { Network } from 'src/lib/wagmi/systems/checker/network'
import { withCheckerRoot } from 'src/lib/wagmi/systems/checker/provider'
import { Amount } from 'sushi'
import { EvmChainId, XSUSHI } from 'sushi/evm'
import { UnstakeSectionWidget } from './unstake-section-widget'

export const UnstakeSection = withCheckerRoot(() => {
  const [input, setInput] = useState('')

  const parsedInput = useMemo(() => {
    return input
      ? Amount.tryFromHuman(XSUSHI[EvmChainId.ETHEREUM], input)
      : undefined
  }, [input])

  const { write, isPending: isWritePending } = useBarWithdraw({
    amount: parsedInput,
    enabled: Boolean(parsedInput?.gt(0n)),
  })

  return (
    <UnstakeSectionWidget
      input={input}
      parsedInput={parsedInput}
      onInput={setInput}
    >
      <Connect size="xl" fullWidth>
        <Network
          size="xl"
          fullWidth
          chainId={EvmChainId.ETHEREUM}
          hoverCardContent={
            <span className="text-xs text-muted-foreground text-center w-full">
              {`Sushi Bar is only available on Ethereum Mainnet. You are
                connected to an unsupported network.`}
            </span>
          }
        >
          <Amounts
            size="xl"
            fullWidth
            chainId={EvmChainId.ETHEREUM}
            amount={parsedInput}
          >
            <Button
              size="xl"
              onClick={() => write?.().then(() => setInput(''))}
              fullWidth
              disabled={isWritePending || !write}
              testId="unstake-sushi"
            >
              {isWritePending ? <Dots>Confirm transaction</Dots> : 'Unstake'}
            </Button>
          </Amounts>
        </Network>
      </Connect>
    </UnstakeSectionWidget>
  )
})
