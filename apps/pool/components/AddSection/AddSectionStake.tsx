import { Transition } from '@headlessui/react'
import { Amount, Token, tryParseAmount } from '@sushiswap/currency'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button, Dots, Typography } from '@sushiswap/ui'
import { Approve, Checker, Chef, getMasterChefContractConfig } from '@sushiswap/wagmi'
import { FC, Fragment, useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import { ProviderRpcError, useAccount, UserRejectedRequestError } from 'wagmi'

import { Pair } from '../../.graphclient'
import { CHEF_TYPE_MAP } from '../../lib/constants'
import { useTokensFromPair } from '../../lib/hooks'
import { useNotifications } from '../../lib/state/storage'
import { PairWithAlias } from '../../types'
import { usePoolPosition } from '../PoolPositionProvider'
import { usePoolPositionStaked } from '../PoolPositionStakedProvider'
import { AddSectionStakeWidget } from './AddSectionStakeWidget'

interface AddSectionStakeProps {
  pair: Pair
  chefType: Chef
  title?: string
}

export const AddSectionStake: FC<{ poolAddress: string; title?: string }> = ({ poolAddress, title }) => {
  const isMounted = useIsMounted()
  const { data } = useSWR<{ pair: PairWithAlias }>(`/pool/api/pool/${poolAddress.toLowerCase()}`, (url) =>
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
      <_AddSectionStake pair={pair} chefType={CHEF_TYPE_MAP[pair.farm.chefType]} title={title} />
    </Transition>
  )
}

const _AddSectionStake: FC<AddSectionStakeProps> = ({ pair, chefType, title }) => {
  const [hover, setHover] = useState(false)
  const [error, setError] = useState<string>()
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)
  const [value, setValue] = useState('')
  const { reserve1, reserve0, liquidityToken } = useTokensFromPair(pair)
  const { balance } = usePoolPosition()
  const { deposit: _deposit, isWritePending } = usePoolPositionStaked()

  const amount = useMemo(() => {
    return tryParseAmount(value, liquidityToken)
  }, [liquidityToken, value])

  const deposit = useCallback(
    async (amount: Amount<Token> | undefined) => {
      if (!_deposit) return

      try {
        await _deposit(amount)
      } catch (e: unknown) {
        if (!(e instanceof UserRejectedRequestError)) {
          setError((e as ProviderRpcError).message)
        }

        console.log(e)
      }
    },
    [_deposit]
  )

  return (
    <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Transition
        show={Boolean(hover && !balance?.[FundSource.WALLET]?.greaterThan(ZERO) && address)}
        as={Fragment}
        enter="transition duration-300 origin-center ease-out"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        <div className="border border-slate-200/5 flex justify-center items-center z-[100] absolute inset-0 backdrop-blur bg-black bg-opacity-[0.24] rounded-2xl">
          <Typography variant="xs" weight={600} className="bg-white bg-opacity-[0.12] rounded-full p-2 px-3">
            No liquidity tokens found, did you add liquidity first?
          </Typography>
        </div>
      </Transition>
      <div className={balance?.[FundSource.WALLET]?.greaterThan(ZERO) ? '' : 'opacity-40 pointer-events-none'}>
        <AddSectionStakeWidget
          title={title}
          chainId={pair.chainId}
          value={value}
          setValue={setValue}
          reserve0={reserve0}
          reserve1={reserve1}
          liquidityToken={liquidityToken}
        >
          <Checker.Connected size="md">
            <Checker.Network size="md" chainId={pair.chainId}>
              <Checker.Amounts size="md" chainId={pair.chainId} amounts={[amount]} fundSource={FundSource.WALLET}>
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
                        onClick={() => deposit(amount)}
                        fullWidth
                        size="md"
                        variant="filled"
                        disabled={!approved || isWritePending}
                      >
                        {isWritePending ? <Dots>Confirm transaction</Dots> : 'Stake Liquidity'}
                      </Button>
                    )
                  }}
                />
                {error && (
                  <Typography variant="xs" className="text-center text-red" weight={500}>
                    {error}
                  </Typography>
                )}
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connected>
        </AddSectionStakeWidget>
      </div>
    </div>
  )
}
