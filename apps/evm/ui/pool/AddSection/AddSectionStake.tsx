import { Transition } from '@headlessui/react'
import { ChainId } from '@sushiswap/chain'
import { ChefType, Pool, usePool } from '@sushiswap/client'
import { tryParseAmount } from '@sushiswap/currency'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button } from '@sushiswap/ui/components/button'
import { Dots } from '@sushiswap/ui/components/dots'
import { getMasterChefContractConfig, useAccount, useMasterChefDeposit } from '@sushiswap/wagmi'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { useApproved, withCheckerRoot } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { APPROVE_TAG_STAKE } from 'lib/constants'
import { useGraphPool } from 'lib/hooks'
import { FC, Fragment, useMemo, useState } from 'react'
import { useSWRConfig } from 'swr'

import { usePoolPosition } from '../PoolPositionProvider'
import { AddSectionStakeWidget } from './AddSectionStakeWidget'

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

  const amounts = useMemo(() => {
    return [tryParseAmount(value, liquidityToken)]
  }, [liquidityToken, value])

  const { sendTransaction, isLoading: isWritePending } = useMasterChefDeposit({
    amount: amounts[0],
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
          <p className="text-xs font-semibold  bg-white bg-opacity-[0.12] rounded-full p-2 px-3">
            No liquidity tokens found, did you add liquidity first?
          </p>
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
          <Checker.Connect fullWidth>
            <Checker.Network fullWidth chainId={pool.chainId}>
              <Checker.Amounts fullWidth chainId={pool.chainId as ChainId} amounts={amounts}>
                <Checker.ApproveERC20
                  fullWidth
                  id="stake-approve-slp"
                  amount={amounts[0]}
                  contract={getMasterChefContractConfig(pool.chainId, chefType)?.address}
                  enabled={Boolean(getMasterChefContractConfig(pool.chainId, chefType)?.address)}
                >
                  <Checker.Success tag={APPROVE_TAG_STAKE}>
                    <Button
                      size="xl"
                      onClick={() => sendTransaction?.()}
                      fullWidth
                      disabled={isWritePending || !approved || !sendTransaction}
                      testId="stake-liquidity"
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
