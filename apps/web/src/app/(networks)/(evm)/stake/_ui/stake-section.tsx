'use client'

import { Button, Dots } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { APPROVE_TAG_STAKE } from 'src/lib/constants'
import { useBarDeposit } from 'src/lib/wagmi/hooks/bar/useBarDeposit'
import { useQuoteBarDeposit } from 'src/lib/wagmi/hooks/bar/useQuoteBarDeposit'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import {
  useApproved,
  withCheckerRoot,
} from 'src/lib/wagmi/systems/Checker/provider'
import { Amount } from 'sushi'
import { EvmChainId, RED_SNWAPPER_ADDRESS, SUSHI, XSUSHI } from 'sushi/evm'
import { BarSectionWidget } from './stake-section-widget'

export const StakeSection = withCheckerRoot(() => {
  const { approved } = useApproved(APPROVE_TAG_STAKE)

  const [input, setInput] = useState('')

  const parsedInput = useMemo(() => {
    return Amount.tryFromHuman(SUSHI[EvmChainId.ETHEREUM], input)
  }, [input])

  const { data: amountOut } = useQuoteBarDeposit({
    amount: parsedInput,
  })

  const { write, isPending: isWritePending } = useBarDeposit({
    amountIn: parsedInput,
    amountOut,
    enabled: approved,
  })

  return (
    <BarSectionWidget
      input={input}
      amountOut={amountOut}
      onInput={setInput}
      inputToken={SUSHI[EvmChainId.ETHEREUM]}
      outputToken={XSUSHI[EvmChainId.ETHEREUM]}
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
            <Checker.ApproveERC20
              size="xl"
              id="approve-sushi"
              className="whitespace-nowrap"
              fullWidth
              amount={parsedInput}
              contract={RED_SNWAPPER_ADDRESS[EvmChainId.ETHEREUM]}
            >
              <Checker.Success tag={APPROVE_TAG_STAKE}>
                <Button
                  size="xl"
                  onClick={() => write?.().then(() => setInput(''))}
                  fullWidth
                  disabled={isWritePending || !approved || !write}
                  testId="stake-sushi"
                >
                  {isWritePending ? <Dots>Confirm transaction</Dots> : 'Stake'}
                </Button>
              </Checker.Success>
            </Checker.ApproveERC20>
          </Checker.Amounts>
        </Checker.Network>
      </Checker.Connect>
    </BarSectionWidget>
  )
})
