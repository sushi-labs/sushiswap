'use client'

import { Button, Dots } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { APPROVE_TAG_STAKE } from 'src/lib/constants'
import { useBarDeposit } from 'src/lib/wagmi/hooks/bar/use-bar-deposit'
import { Amounts } from 'src/lib/wagmi/systems/checker/amounts'
import { ApproveERC20 } from 'src/lib/wagmi/systems/checker/approve-erc20'
import { Connect } from 'src/lib/wagmi/systems/checker/connect'
import { Network } from 'src/lib/wagmi/systems/checker/network'
import {
  useApproved,
  withCheckerRoot,
} from 'src/lib/wagmi/systems/checker/provider'
import { Success } from 'src/lib/wagmi/systems/checker/success'
import { Amount } from 'sushi'
import { EvmChainId, SUSHI, XSUSHI_ADDRESS } from 'sushi/evm'
import { StakeSectionWidget } from './stake-section-widget'

export const StakeSection = withCheckerRoot(() => {
  const { approved } = useApproved(APPROVE_TAG_STAKE)

  const [input, setInput] = useState('')

  const parsedInput = useMemo(() => {
    return input
      ? Amount.tryFromHuman(SUSHI[EvmChainId.ETHEREUM], input)
      : undefined
  }, [input])

  const { write, isPending: isWritePending } = useBarDeposit({
    amount: parsedInput,
    enabled: Boolean(approved && parsedInput?.gt(0n)),
  })

  return (
    <StakeSectionWidget
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
            <ApproveERC20
              size="xl"
              id="approve-sushi"
              className="whitespace-nowrap"
              fullWidth
              amount={parsedInput}
              contract={XSUSHI_ADDRESS[EvmChainId.ETHEREUM]}
            >
              <Success tag={APPROVE_TAG_STAKE}>
                <Button
                  size="xl"
                  onClick={() => write?.().then(() => setInput(''))}
                  fullWidth
                  disabled={isWritePending || !approved || !write}
                  testId="stake-sushi"
                >
                  {isWritePending ? <Dots>Confirm transaction</Dots> : 'Stake'}
                </Button>
              </Success>
            </ApproveERC20>
          </Amounts>
        </Network>
      </Connect>
    </StakeSectionWidget>
  )
})
