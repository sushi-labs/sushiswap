import { Transition } from '@headlessui/react'
import { tryParseAmount } from '@sushiswap/currency'
import { ChefType, Pool, usePool } from '@sushiswap/client'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button, Dots, Typography } from '@sushiswap/ui'
import { Approve, Checker, getMasterChefContractConfig, useMasterChefDeposit } from '@sushiswap/wagmi'
import { FC, Fragment, useMemo, useState } from 'react'
import { useAccount } from '@sushiswap/wagmi'

import { useGraphPool } from '../../lib/hooks'
import { usePoolPosition } from '../PoolPositionProvider'
import { AddSectionStakeWidget } from './AddSectionStakeWidget'
import { useSWRConfig } from 'swr'

interface AddSectionStakeProps {
  pool: Pool
  chefType: ChefType
  title?: string
  farmId: number
}

export const AddSectionStake: FC<{ poolId: string; title?: string }> = ({ poolId, title }) => {
  const isMounted = useIsMounted()
  const { data: pool } = usePool({ args: poolId, swrConfig: useSWRConfig() })

  if (!pool) return <></>

  if (!pool?.incentives || pool.incentives.length === 0 || !isMounted) return <></>

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
      <_AddSectionStake
        pool={pool}
        chefType={pool.incentives[0].chefType}
        title={title}
        farmId={Number(pool.incentives[0].pid)}
      />
    </Transition>
  )
}

const _AddSectionStake: FC<AddSectionStakeProps> = ({ pool, chefType, title, farmId }) => {
  const [hover, setHover] = useState(false)
  const { address } = useAccount()

  const [value, setValue] = useState('')
  const {
    data: { reserve1, reserve0, liquidityToken },
  } = useGraphPool(pool)
  const { balance } = usePoolPosition()

  const amount = useMemo(() => {
    return tryParseAmount(value, liquidityToken)
  }, [liquidityToken, value])

  const { sendTransaction, isLoading: isWritePending } = useMasterChefDeposit({
    amount,
    chainId: liquidityToken.chainId,
    chef: chefType,
    pid: farmId,
  })

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
        <div className="border dark:border-slate-200/5 border-gray-900/5 flex justify-center items-center z-[100] absolute inset-0 backdrop-blur bg-black bg-opacity-[0.24] rounded-2xl">
          <Typography variant="xs" weight={600} className="bg-white bg-opacity-[0.12] rounded-full p-2 px-3">
            No liquidity tokens found, did you add liquidity first?
          </Typography>
        </div>
      </Transition>
      <div className={balance?.[FundSource.WALLET]?.greaterThan(ZERO) ? '' : 'opacity-40 pointer-events-none'}>
        <AddSectionStakeWidget
          title={title}
          chainId={pool.chainId}
          value={value}
          setValue={setValue}
          reserve0={reserve0}
          reserve1={reserve1}
          liquidityToken={liquidityToken}
        >
          <Checker.Connected size="md">
            <Checker.Network size="md" chainId={pool.chainId}>
              <Checker.Amounts size="md" chainId={pool.chainId} amounts={[amount]} fundSource={FundSource.WALLET}>
                <Approve
                  className="flex-grow !justify-end"
                  components={
                    <Approve.Components>
                      <Approve.Token
                        size="md"
                        className="whitespace-nowrap"
                        fullWidth
                        amount={amount}
                        address={getMasterChefContractConfig(pool.chainId, chefType)?.address}
                        enabled={Boolean(getMasterChefContractConfig(pool.chainId, chefType)?.address)}
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
                        {isWritePending ? <Dots>Confirm transaction</Dots> : 'Stake Liquidity'}
                      </Button>
                    )
                  }}
                />
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connected>
        </AddSectionStakeWidget>
      </div>
    </div>
  )
}
