import { Button, Dots } from '@sushiswap/ui'
import { Checker, useBarWithdraw } from '@sushiswap/wagmi'
import { CheckerProvider } from '@sushiswap/wagmi/systems/Checker/Provider'
import { useMemo, useState } from 'react'
import { ChainId } from 'sushi/chain'
import { XSUSHI, tryParseAmount } from 'sushi/currency'
import { ZERO } from 'sushi/math'
import { UnstakeSectionWidget } from './UnstakeSectionWidget'

const _UnstakeSection = () => {
  const [input, setInput] = useState('')

  const parsedInput = useMemo(() => {
    return tryParseAmount(input, XSUSHI[ChainId.ETHEREUM])
  }, [input])

  const { writeAsync, isLoading: isWritePending } = useBarWithdraw({
    amount: parsedInput,
    enabled: Boolean(parsedInput?.greaterThan(ZERO)),
  })

  return (
    <UnstakeSectionWidget
      input={input}
      parsedInput={parsedInput}
      onInput={setInput}
    >
      <Checker.Connect size="default" variant="outline" fullWidth>
        <Checker.Network
          size="default"
          variant="outline"
          fullWidth
          chainId={ChainId.ETHEREUM}
        >
          <Checker.Amounts
            size="default"
            variant="outline"
            fullWidth
            chainId={ChainId.ETHEREUM}
            amounts={[parsedInput]}
          >
            <Button
              size="default"
              onClick={() => writeAsync?.().then(() => setInput(''))}
              fullWidth
              disabled={isWritePending || !writeAsync}
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
