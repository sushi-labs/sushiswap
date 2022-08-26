import { tryParseAmount } from '@sushiswap/currency'
import { Button, Dots } from '@sushiswap/ui'
import { Approve, Checker, Chef, getMasterChefContractConfig, useMasterChef } from '@sushiswap/wagmi'
import { FC, useMemo, useState } from 'react'

import { Pair } from '../../.graphclient'
import { useTokensFromPair } from '../../lib/hooks'
import { RemoveSectionUnstakeWidget } from './RemoveSectionUnstakeWidget'

interface AddSectionStakeProps {
  pair: Pair
  farmId: number
  chefType: Chef
}

export const RemoveSectionUnstake: FC<AddSectionStakeProps> = ({ pair, chefType, farmId }) => {
  const [value, setValue] = useState('')
  const { reserve1, reserve0, liquidityToken } = useTokensFromPair(pair)
  const {
    withdraw,
    balance,
    isLoading: isWritePending,
  } = useMasterChef({
    chainId: pair.chainId,
    chef: chefType,
    pid: farmId,
    token: liquidityToken,
  })

  const amount = useMemo(() => {
    return tryParseAmount(value, liquidityToken)
  }, [liquidityToken, value])

  return (
    <RemoveSectionUnstakeWidget
      chefType={chefType}
      farmId={farmId}
      chainId={pair.chainId}
      value={value}
      setValue={setValue}
      reserve0={reserve0.wrapped}
      reserve1={reserve1.wrapped}
      liquidityToken={liquidityToken}
    >
      <Checker.Connected size="md">
        <Checker.Network size="md" chainId={pair.chainId}>
          <Checker.Custom
            logic={Boolean(amount && balance && amount.greaterThan(balance))}
            button={<Button size="md">Insufficient Balance</Button>}
          >
            <Approve
              className="flex-grow !justify-end"
              components={
                <Approve.Components>
                  <Approve.Token
                    size="md"
                    className="whitespace-nowrap"
                    fullWidth
                    amount={amount}
                    address={getMasterChefContractConfig(pair.chainId, chefType).addressOrName}
                  />
                </Approve.Components>
              }
              render={({ approved }) => {
                return (
                  <Button
                    onClick={() => withdraw(amount)}
                    fullWidth
                    size="md"
                    variant="filled"
                    disabled={!approved || isWritePending}
                  >
                    {isWritePending ? <Dots>Confirm transaction</Dots> : 'Unstake Liquidity'}
                  </Button>
                )
              }}
            />
          </Checker.Custom>
        </Checker.Network>
      </Checker.Connected>
    </RemoveSectionUnstakeWidget>
  )
}
