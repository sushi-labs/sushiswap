import type { WalletPosition } from '@sushiswap/graph-client/kadena'
import { useMemo } from 'react'
import { Amount, Fraction, formatUSD } from 'sushi'
import type { KvmTokenAddress } from 'sushi/kvm'
import { KVM_PAIR_TOKEN } from '~kadena/_common/constants/pair'
import { useLpBalance } from '~kadena/_common/lib/hooks/pools/use-lp-balance'
import { usePoolFromTokens } from '~kadena/_common/lib/hooks/pools/use-pool-from-tokens'
import { useKadena } from '~kadena/kadena-wallet-provider'

export const PositionValueCell = ({ data }: { data: WalletPosition }) => {
  const { activeAccount } = useKadena()
  const address = activeAccount?.accountName || ''
  const { data: poolData } = usePoolFromTokens({
    token0: data.pair.token0.address as KvmTokenAddress,
    token1: data.pair.token1.address as KvmTokenAddress,
  })
  const { data: lpData } = useLpBalance({
    account: address,
    token0Address: data.pair.token0.address as KvmTokenAddress,
    token1Address: data.pair.token1.address as KvmTokenAddress,
  })

  const tvl = useMemo(() => {
    const numerator = lpData?.balance.mulHuman(Number(data.pair.tvlUsd)).amount
    const totalSupply = Amount.fromHuman(
      KVM_PAIR_TOKEN,
      poolData?.poolData?.totalSupplyLp ?? 0,
    ).amount
    if (!numerator) return '0'
    if (!totalSupply) return '0'
    return new Fraction({ numerator, denominator: totalSupply })?.toSignificant(
      4,
    )
  }, [lpData, data.pair.tvlUsd, poolData])

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {formatUSD(tvl)}
        </span>
      </div>
    </div>
  )
}
