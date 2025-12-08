'use client'

import { Button, Dots } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { useBarWithdraw } from 'src/lib/wagmi/hooks/bar/useBarWithdraw'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { withCheckerRoot } from 'src/lib/wagmi/systems/Checker/provider'
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
      <Checker.Connect size="xl" fullWidth>
        <Checker.Network
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
          <Checker.Amounts
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
          </Checker.Amounts>
        </Checker.Network>
      </Checker.Connect>
    </UnstakeSectionWidget>
  )
})
