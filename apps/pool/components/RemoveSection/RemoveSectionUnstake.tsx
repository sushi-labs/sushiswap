import { Transition } from '@headlessui/react'
import { Amount, Token, tryParseAmount } from '@sushiswap/currency'
import { Pair } from '@sushiswap/graph-client/.graphclient'
import { useIsMounted } from '@sushiswap/hooks'
import { Button, Dots, Typography } from '@sushiswap/ui'
import { Approve, Checker, Chef, getMasterChefContractConfig } from '@sushiswap/wagmi'
import { FC, useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import { ProviderRpcError, UserRejectedRequestError } from 'wagmi'

import { CHEF_TYPE_MAP } from '../../lib/constants'
import { useTokensFromPair } from '../../lib/hooks'
import { PairWithAlias } from '../../types'
import { usePoolPositionStaked } from '../PoolPositionStakedProvider'
import { RemoveSectionUnstakeWidget } from './RemoveSectionUnstakeWidget'

interface AddSectionStakeProps {
  pair: Pair
  chefType: Chef
}

export const RemoveSectionUnstake: FC<{ poolAddress: string }> = ({ poolAddress }) => {
  const isMounted = useIsMounted()
  const { data } = useSWR<{ pair: PairWithAlias }>(`/pool/api/pool/${poolAddress}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  if (!data) return <></>
  const { pair } = data
  if (!pair.farm?.chefType || !isMounted) return <></>

  return (
    <Transition
      appear
      show={true}
      enter="transition duration-300 origin-center ease-out"
      enterFrom="transform scale-90 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform opacity-100"
      leaveTo="transform opacity-0"
    >
      <_RemoveSectionUnstake pair={pair} chefType={CHEF_TYPE_MAP[pair.farm.chefType]} />
    </Transition>
  )
}

export const _RemoveSectionUnstake: FC<AddSectionStakeProps> = ({ pair, chefType }) => {
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
