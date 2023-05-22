import { Transition } from '@headlessui/react'
import { tryParseAmount } from '@sushiswap/currency'
import { ChefType, Pool, usePool } from '@sushiswap/client'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Dots, Typography } from '@sushiswap/ui'
import { getMasterChefContractConfig, useMasterChefDeposit } from '@sushiswap/wagmi'
import { FC, Fragment, useMemo, useState } from 'react'
import { useAccount } from '@sushiswap/wagmi'

import { useGraphPool } from '../../lib/hooks'
import { usePoolPosition } from '../PoolPositionProvider'
import { AddSectionStakeWidget } from './AddSectionStakeWidget'
import { useSWRConfig } from 'swr'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { useApproved, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import Button from '@sushiswap/ui/future/components/button/Button'
import { APPROVE_TAG_STAKE } from '../../lib/constants'

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

const _AddSectionStake: FC<AddSectionStakeProps> = withCheckerRoot(({ pool, chefType, title, farmId }) => {
  const [hover, setHover] = useState(false)
  const { address } = useAccount()
  const { approved } = useApproved(APPROVE_TAG_STAKE)
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
    enabled: approved,
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
          <Checker.Connect size="xl" fullWidth>
            <Checker.Network size="xl" fullWidth chainId={pool.chainId}>
              <Checker.Amounts size="xl" fullWidth chainId={pool.chainId} amounts={[amount]}>
                <Checker.ApproveERC20
                  size="xl"
                  fullWidth
                  id="stake-approve-slp"
                  amount={amount}
                  contract={getMasterChefContractConfig(pool.chainId, chefType)?.address}
                  enabled={Boolean(getMasterChefContractConfig(pool.chainId, chefType)?.address)}
                >
                  <Checker.Success tag={APPROVE_TAG_STAKE}>
                    <Button
                      onClick={() => sendTransaction?.()}
                      fullWidth
                      size="xl"
                      variant="filled"
                      disabled={!approved || isWritePending}
                      testId='stake-liquidity'
                    >
                      {isWritePending ? <Dots>Confirm transaction</Dots> : 'Stake Liquidity'}
                    </Button>
                  </Checker.Success>
                </Checker.ApproveERC20>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connect>
        </AddSectionStakeWidget>
      </div>
    </div>
  )
})
