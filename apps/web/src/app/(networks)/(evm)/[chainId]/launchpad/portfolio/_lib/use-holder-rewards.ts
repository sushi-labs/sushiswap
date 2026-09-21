'use client'

import ms from 'ms'
import type { EvmAddress, LaunchpadV2ChainId } from 'sushi/evm'
import { erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'
import { HOLDER_REWARDS_ABI } from '../../_providers/sushi-v2/contract'

interface HolderRewards {
  earned: bigint
  ratePerDay: bigint
}

export function useHolderRewards({
  chainId,
  token,
  distributor,
  holder,
}: {
  chainId: LaunchpadV2ChainId
  token: EvmAddress
  distributor: EvmAddress | undefined
  holder: EvmAddress
}) {
  const contract = {
    chainId,
    address: distributor,
    abi: HOLDER_REWARDS_ABI,
  } as const
  return useReadContracts({
    scopeKey: `holder-rewards:${chainId}:${token}`,
    allowFailure: false,
    contracts: [
      { ...contract, functionName: 'earned', args: [holder] },
      { ...contract, functionName: 'rewardRateScaled' },
      { ...contract, functionName: 'periodFinish' },
      { ...contract, functionName: 'PRECISION' },
      { ...contract, functionName: 'eligibleSupply' },
      {
        chainId,
        address: token,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [holder],
      },
    ],
    query: {
      enabled: Boolean(distributor),
      staleTime: 0,
      refetchInterval: ms('15s'),
      select([
        earned,
        rate,
        periodFinish,
        precision,
        supply,
        balance,
      ]): HolderRewards {
        return {
          earned,
          ratePerDay:
            periodFinish <= BigInt(Math.floor(Date.now() / 1000)) ||
            supply === 0n
              ? 0n
              : (balance * rate * 86_400n) / (supply * precision),
        }
      },
    },
  })
}
