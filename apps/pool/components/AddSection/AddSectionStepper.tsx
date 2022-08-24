import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { SUSHI } from '@sushiswap/currency'
import { formatPercent } from '@sushiswap/format'
import { ZERO } from '@sushiswap/math'
import { Button, Currency as UICurrency, Tooltip, Typography } from '@sushiswap/ui'
import { useBalance, Wallet } from '@sushiswap/wagmi'
import { FC } from 'react'
import { useAccount } from 'wagmi'

import { useTokensFromPair } from '../../lib/hooks'
import { PairWithAlias } from '../../types'

interface AddSectionStepperProps {
  step: number
  onClick(step: number): void
  pair: PairWithAlias
}

export const AddSectionStepper: FC<AddSectionStepperProps> = ({ step, onClick, pair }) => {
  return (
    <div className="p-5 flex flex-col gap-4">
      <Typography variant="sm" weight={600} className="text-slate-200">
        Step {step} <span className="text-slate-400">/ 2 : </span>
        {step === 1 ? 'Add Liquidity' : 'Stake'}
      </Typography>
      <Typography variant="sm" weight={400} className="text-slate-400">
        Provide liquidity to earn <b className="text-slate-50">{formatPercent(pair.apr / 100)}</b> Pool APR.
      </Typography>

      <div className="grid grid-cols-2 gap-2">
        <Typography variant="xs" weight={500} className="text-slate-300">
          LP Fee APR:
        </Typography>
        <Typography variant="xs" weight={500} className="text-slate-300 text-right">
          {formatPercent(pair.apr / 100)}
        </Typography>
        <Typography variant="xs" weight={500} className="text-slate-300">
          Reward APR:
        </Typography>
        <Typography variant="xs" weight={500} className="text-slate-300 text-right">
          0%
        </Typography>
        <Typography variant="xs" weight={500} className="text-slate-300">
          Total APR:
        </Typography>
        <Typography variant="xs" weight={500} className="text-slate-300 text-right">
          {formatPercent(pair.apr / 100)}
        </Typography>
        <Typography variant="xs" weight={500} className="text-slate-300">
          Farming Rewards:
        </Typography>
        <div className="flex justify-end">
          <UICurrency.IconList iconWidth={20} iconHeight={20}>
            <UICurrency.Icon currency={SUSHI[pair.chainId]} />
          </UICurrency.IconList>
        </div>
        <div className="col-span-2 mt-3 flex justify-center">
          <StakeButton step={step} onClick={onClick} pair={pair} chainId={pair.chainId} />
        </div>
      </div>
    </div>
  )
}

interface StakeButtonProps {
  step: number
  pair: PairWithAlias
  chainId: ChainId
  onClick(step: number): void
}
export const StakeButton: FC<StakeButtonProps> = ({ step, pair, chainId, onClick }) => {
  const { address } = useAccount()
  const { liquidityToken } = useTokensFromPair(pair)
  const { data: balance } = useBalance({ chainId, account: address, currency: liquidityToken })
  const disabled = !balance?.WALLET?.greaterThan(ZERO)

  const button =
    step === 1 ? (
      <Button
        onClick={() => onClick(2)}
        variant="outlined"
        className={disabled ? 'pointer-events-none' : ''}
        disabled={disabled}
        fullWidth
        size="sm"
        endIcon={<ArrowRightIcon width={12} height={12} />}
      >
        Stake
      </Button>
    ) : (
      <Button
        onClick={() => onClick(1)}
        variant="outlined"
        className={disabled ? 'pointer-events-none' : ''}
        disabled={disabled}
        fullWidth
        size="sm"
        startIcon={<ArrowLeftIcon width={12} height={12} />}
      >
        Add Liquidity
      </Button>
    )

  if (!address) return <Wallet.Button variant="outlined" size="sm" fullWidth appearOnMount={false} />
  return disabled ? (
    <Tooltip
      button={<div className="w-full">{button}</div>}
      panel={
        <div className="text-xs rounded-2xl text-slate-300">No liquidity tokens found, please add liquidity first</div>
      }
    />
  ) : (
    button
  )
}
