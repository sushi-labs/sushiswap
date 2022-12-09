import { tryParseAmount } from '@sushiswap/currency'
import { Pair } from '@sushiswap/graph-client'
import { useIsMounted } from '@sushiswap/hooks'
import { AppearOnMount, Button, Dots } from '@sushiswap/ui'
import { Approve, Checker, Chef, getMasterChefContractConfig, useMasterChefWithdraw } from '@sushiswap/wagmi'
import { FC, useMemo, useState } from 'react'
import useSWR from 'swr'

import { CHEF_TYPE_MAP } from '../../lib/constants'
import { useCreateNotification, useTokensFromPair } from '../../lib/hooks'
import { usePoolPositionStaked } from '../PoolPositionStakedProvider'
import { RemoveSectionUnstakeWidget } from './RemoveSectionUnstakeWidget'

interface AddSectionStakeProps {
  pair: Pair
  chefType: Chef
  farmId: number
}

export const RemoveSectionUnstake: FC<{ poolAddress: string }> = ({ poolAddress }) => {
  const isMounted = useIsMounted()
  const { data } = useSWR<{ pair: Pair }>(`/earn/api/pool/${poolAddress}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  if (!data) return <></>
  const { pair } = data
  if (!pair?.farm?.chefType || !isMounted || !pair.farm.id) return <></>

  return (
    <AppearOnMount show={true}>
      <_RemoveSectionUnstake
        pair={pair}
        chefType={CHEF_TYPE_MAP[pair.farm.chefType as keyof typeof CHEF_TYPE_MAP]}
        farmId={Number(pair.farm.id)}
      />
    </AppearOnMount>
  )
}

export const _RemoveSectionUnstake: FC<AddSectionStakeProps> = ({ pair, chefType, farmId }) => {
  const createNotification = useCreateNotification()
  const [value, setValue] = useState('')
  const { reserve0, reserve1, liquidityToken } = useTokensFromPair(pair)
  const { balance } = usePoolPositionStaked()

  const amount = useMemo(() => {
    return tryParseAmount(value, liquidityToken)
  }, [liquidityToken, value])

  const { sendTransaction, isLoading: isWritePending } = useMasterChefWithdraw({
    chainId: liquidityToken.chainId,
    amount,
    pid: farmId,
    chef: chefType,
    onSuccess: createNotification,
  })

  return (
    <RemoveSectionUnstakeWidget
      chainId={pair.chainId}
      value={value}
      setValue={setValue}
      reserve0={reserve0}
      reserve1={reserve1}
      liquidityToken={liquidityToken}
    >
      <Checker.Connected size="md">
        <Checker.Network size="md" chainId={pair.chainId}>
          <Checker.Custom
            showGuardIfTrue={Boolean(amount && balance && amount.greaterThan(balance))}
            guard={<Button size="md">Insufficient Balance</Button>}
          >
            <Approve
              onSuccess={createNotification}
              className="flex-grow !justify-end"
              components={
                <Approve.Components>
                  <Approve.Token
                    size="md"
                    className="whitespace-nowrap"
                    fullWidth
                    amount={amount}
                    address={getMasterChefContractConfig(pair.chainId, chefType)?.address}
                    enabled={Boolean(getMasterChefContractConfig(pair.chainId, chefType)?.address)}
                  />
                </Approve.Components>
              }
              render={({ approved }) => {
                return (
                  <Button
                    onClick={() => sendTransaction?.()}
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
