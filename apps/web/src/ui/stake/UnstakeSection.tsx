import { Button, Dots } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { useBarWithdraw } from 'src/lib/wagmi/hooks/bar/useBarWithdaw'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import { Amount, ZERO } from 'sushi'
import { EvmChainId, XSUSHI } from 'sushi/evm'
import { UnstakeSectionWidget } from './UnstakeSectionWidget'

const _UnstakeSection = () => {
  const [input, setInput] = useState('')

  const parsedInput = useMemo(() => {
    return Amount.tryFromHuman(XSUSHI[EvmChainId.ETHEREUM], input)
  }, [input])

  const { write, isPending: isWritePending } = useBarWithdraw({
    amount: parsedInput,
    enabled: Boolean(parsedInput?.gt(ZERO)),
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
}

export const UnstakeSection = () => {
  return (
    <CheckerProvider>
      <_UnstakeSection />
    </CheckerProvider>
  )
}
