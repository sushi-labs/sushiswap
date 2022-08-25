import { tryParseAmount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Button, Dots } from '@sushiswap/ui'
import { Approve, Checker, getV3RouterContractConfig } from '@sushiswap/wagmi'
import { FC, useCallback, useMemo, useState } from 'react'
import { useSendTransaction } from 'wagmi'

import { Pair } from '../../.graphclient'
import { useTokensFromPair } from '../../lib/hooks'
import { RemoveSectionUnstakeWidget } from './RemoveSectionUnstakeWidget'

interface AddSectionStakeProps {
  pair: Pair
}

export const RemoveSectionUnstake: FC<AddSectionStakeProps> = ({ pair }) => {
  const [value, setValue] = useState('')
  const { reserve1, reserve0, liquidityToken } = useTokensFromPair(pair)
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction({ chainId: pair.chainId })

  const amount = useMemo(() => {
    return tryParseAmount(value, liquidityToken)
  }, [liquidityToken, value])

  const execute = useCallback(() => {}, [])

  return (
    <RemoveSectionUnstakeWidget
      chainId={pair.chainId}
      value={value}
      setValue={setValue}
      reserve0={reserve0.wrapped}
      reserve1={reserve1.wrapped}
      liquidityToken={liquidityToken}
    >
      <Checker.Connected size="md">
        <Checker.Network size="md" chainId={pair.chainId}>
          <Checker.Amounts size="md" chainId={pair.chainId} amounts={[amount]} fundSource={FundSource.WALLET}>
            <Approve
              className="flex-grow !justify-end"
              components={
                <Approve.Components>
                  <Approve.Token
                    size="md"
                    className="whitespace-nowrap"
                    fullWidth
                    amount={amount}
                    address={getV3RouterContractConfig(pair.chainId).addressOrName}
                  />
                </Approve.Components>
              }
              render={({ approved }) => {
                return (
                  <Button onClick={execute} fullWidth size="md" variant="filled" disabled={!approved || isWritePending}>
                    {isWritePending ? <Dots>Confirm transaction</Dots> : 'Unstake Liquidity'}
                  </Button>
                )
              }}
            />
          </Checker.Amounts>
        </Checker.Network>
      </Checker.Connected>
    </RemoveSectionUnstakeWidget>
  )
}
