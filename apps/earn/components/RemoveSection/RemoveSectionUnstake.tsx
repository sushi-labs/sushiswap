import { Amount, Token, tryParseAmount } from '@sushiswap/currency'
import { Pair } from '@sushiswap/graph-client/.graphclient'
import { useIsMounted } from '@sushiswap/hooks'
import { AppearOnMount, Button, Dots, Typography } from '@sushiswap/ui'
import { Approve, Checker, Chef, getMasterChefContractConfig } from '@sushiswap/wagmi'
import { FC, useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import { ProviderRpcError, UserRejectedRequestError } from 'wagmi'

import { CHEF_TYPE_MAP } from '../../lib/constants'
import { useCreateNotification, useTokensFromPair } from '../../lib/hooks'
import { PairWithAlias } from '../../types'
import { usePoolPositionStaked } from '../PoolPositionStakedProvider'
import { RemoveSectionUnstakeWidget } from './RemoveSectionUnstakeWidget'

interface AddSectionStakeProps {
  pair: Pair
  chefType: Chef
}

export const RemoveSectionUnstake: FC<{ poolAddress: string }> = ({ poolAddress }) => {
  const isMounted = useIsMounted()
  const { data } = useSWR<{ pair: PairWithAlias }>(`/earn/api/pool/${poolAddress}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  if (!data) return <></>
  const { pair } = data
  if (!pair?.farm?.chefType || !isMounted) return <></>

  return (
    <AppearOnMount show={true}>
      <_RemoveSectionUnstake pair={pair} chefType={CHEF_TYPE_MAP[pair.farm.chefType]} />
    </AppearOnMount>
  )
}

export const _RemoveSectionUnstake: FC<AddSectionStakeProps> = ({ pair, chefType }) => {
  const createNotification = useCreateNotification()
  const [value, setValue] = useState('')
  const [error, setError] = useState<string>()
  const { reserve0, reserve1, liquidityToken } = useTokensFromPair(pair)
  const { withdraw: _withdraw, balance, isLoading: isWritePending } = usePoolPositionStaked()

  const amount = useMemo(() => {
    return tryParseAmount(value, liquidityToken)
  }, [liquidityToken, value])

  const withdraw = useCallback(
    async (amount: Amount<Token> | undefined) => {
      if (!_withdraw) return

      try {
        await _withdraw(amount)
      } catch (e: unknown) {
        if (!(e instanceof UserRejectedRequestError)) {
          setError((e as ProviderRpcError).message)
        }

        console.log(e)
      }
    },
    [_withdraw]
  )

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
            {error && (
              <Typography variant="xs" className="text-center text-red" weight={500}>
                {error}
              </Typography>
            )}
          </Checker.Custom>
        </Checker.Network>
      </Checker.Connected>
    </RemoveSectionUnstakeWidget>
  )
}
