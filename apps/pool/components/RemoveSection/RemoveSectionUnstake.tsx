import { Transition } from '@headlessui/react'
import { ChainId } from '@sushiswap/chain'
import { Amount, Token, tryParseAmount } from '@sushiswap/currency'
import { useIsMounted } from '@sushiswap/hooks'
import { Button, Dots, Typography } from '@sushiswap/ui'
import { Approve, Checker, Chef, getMasterChefContractConfig, useFarmRewards, useMasterChef } from '@sushiswap/wagmi'
import { FC, useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import { ProviderRpcError, UserRejectedRequestError } from 'wagmi'

import { Pair } from '../../.graphclient'
import { CHEF_TYPE_MAP } from '../../lib/constants'
import { useTokensFromPair } from '../../lib/hooks'
import { PairWithAlias } from '../../types'
import { RemoveSectionUnstakeWidget } from './RemoveSectionUnstakeWidget'

interface AddSectionStakeProps {
  pair: Pair
  farmId: number
  chefType: Chef
}

export const RemoveSectionUnstake: FC<{ chainId: ChainId; poolAddress: string }> = ({ chainId, poolAddress }) => {
  const isMounted = useIsMounted()
  const { data: rewards } = useFarmRewards()
  const { data } = useSWR<{ pair: PairWithAlias }>(`/pool/api/pool/${poolAddress}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  const farmId = rewards?.[chainId]?.farms[poolAddress.toLowerCase()]?.id
  const chefType = rewards?.[chainId]?.farms[poolAddress.toLowerCase()]?.chefType
    ? CHEF_TYPE_MAP[rewards?.[chainId]?.farms[poolAddress.toLowerCase()]?.chefType]
    : undefined

  if (!data || !chefType || farmId === undefined || !isMounted) return <></>
  const { pair } = data

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
      <_RemoveSectionUnstake pair={pair} farmId={farmId} chefType={chefType} />
    </Transition>
  )
}

export const _RemoveSectionUnstake: FC<AddSectionStakeProps> = ({ pair, chefType, farmId }) => {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string>()
  const { reserve1, reserve0, liquidityToken } = useTokensFromPair(pair)
  const {
    withdraw: _withdraw,
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

  const withdraw = useCallback(
    async (amount: Amount<Token> | undefined) => {
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
