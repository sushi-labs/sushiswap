'use client'

import { Button, Dots } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { APPROVE_TAG_UNSTAKE } from 'src/lib/constants'
import { useBarWithdraw } from 'src/lib/wagmi/hooks/bar/useBarWithdraw'
import { useQuoteBarWithdraw } from 'src/lib/wagmi/hooks/bar/useQuoteBarWithdraw'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import {
  useApproved,
  withCheckerRoot,
} from 'src/lib/wagmi/systems/Checker/provider'
import { Amount } from 'sushi'
import { EvmChainId, RED_SNWAPPER_ADDRESS, SUSHI, XSUSHI } from 'sushi/evm'
import { BarWidget } from './bar-widget'

export const UnstakeSection = withCheckerRoot(() => {
  const { approved } = useApproved(APPROVE_TAG_UNSTAKE)

  const [input, setInput] = useState('')

  const parsedInput = useMemo(() => {
    return input
      ? Amount.tryFromHuman(XSUSHI[EvmChainId.ETHEREUM], input)
      : undefined
  }, [input])

  const { data: amountOut } = useQuoteBarWithdraw({
    amount: parsedInput,
  })

  const { write, isPending: isWritePending } = useBarWithdraw({
    amountIn: parsedInput,
    amountOut,
    enabled: approved,
  })

  return (
    <BarWidget
      input={input}
      amountOut={amountOut}
      onInput={setInput}
      inputToken={XSUSHI[EvmChainId.ETHEREUM]}
      outputToken={SUSHI[EvmChainId.ETHEREUM]}
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
              id="approve-xsushi"
              className="whitespace-nowrap"
              fullWidth
              amount={parsedInput}
              contract={RED_SNWAPPER_ADDRESS[EvmChainId.ETHEREUM]}
            >
              <Checker.Success tag={APPROVE_TAG_UNSTAKE}>
                <Button
                  size="xl"
                  onClick={() => write?.().then(() => setInput(''))}
                  fullWidth
                  disabled={isWritePending || !approved || !write}
                  testId="unstake-sushi"
                >
                  {isWritePending ? (
                    <Dots>Confirm transaction</Dots>
                  ) : (
                    'Unstake'
                  )}
                </Button>
              </Checker.Success>
            </Checker.ApproveERC20>
          </Checker.Amounts>
        </Checker.Network>
      </Checker.Connect>
    </BarWidget>
  )
})
