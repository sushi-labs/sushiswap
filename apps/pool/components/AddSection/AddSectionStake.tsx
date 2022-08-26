import { Transition } from '@headlessui/react'
import { tryParseAmount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button, Dots, Typography } from '@sushiswap/ui'
import { Approve, Checker, Chef, getMasterChefContractConfig, useBalance, useMasterChef } from '@sushiswap/wagmi'
import { FC, Fragment, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { Pair } from '../../.graphclient'
import { useTokensFromPair } from '../../lib/hooks'
import { AddSectionStakeWidget } from './AddSectionStakeWidget'

interface AddSectionStakeProps {
  pair: Pair
  farmId: number
  chefType: Chef
}

export const AddSectionStake: FC<AddSectionStakeProps> = ({ pair, chefType, farmId }) => {
  const [hover, setHover] = useState(false)
  const { address } = useAccount()
  const [value, setValue] = useState('')
  const { reserve1, reserve0, liquidityToken } = useTokensFromPair(pair)
  const { data: balance } = useBalance({ chainId: pair.chainId, account: address, currency: liquidityToken })
  const { deposit, isLoading: isWritePending } = useMasterChef({
    chainId: pair.chainId,
    chef: chefType,
    pid: farmId,
    token: liquidityToken,
  })

  const amount = useMemo(() => {
    return tryParseAmount(value, liquidityToken)
  }, [liquidityToken, value])

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
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connected>
        </AddSectionStakeWidget>
      </div>
    </div>
  )
}
