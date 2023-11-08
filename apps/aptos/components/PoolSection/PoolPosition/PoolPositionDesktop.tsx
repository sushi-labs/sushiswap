import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Icon } from 'components/Icon'
import { useParams } from 'next/navigation'
import { FC, useMemo } from 'react'
import { usePool } from 'utils/usePool'
import { Pool } from 'utils/usePools'
import { useTokenBalance } from 'utils/useTokenBalance'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { useTotalSupply } from 'utils/useTotalSupply'
import { useUnderlyingTokenBalanceFromPool } from 'utils/useUnderlyingTokenBalanceFromPool'

interface PoolPositionProps {
  row: Pool
  isLoading: boolean
}

const CONTRACT_ADDRESS =
  process.env['SWAP_CONTRACT'] || process.env['NEXT_PUBLIC_SWAP_CONTRACT']

export const PoolPositionDesktop: FC<PoolPositionProps> = ({
  row,
  isLoading,
}) => {
  const router = useParams()
  const { token0, token1 } = useTokensFromPools(row)
  const { account } = useWallet()
  const tokenAddress = decodeURIComponent(router?.id)
  const { data: pool, isLoading: isPoolLoading } = usePool(tokenAddress)
  const { data: LPBalance, isLoading: isBalanceLoading } = useTokenBalance({
    account: account?.address as string,
    currency: `${CONTRACT_ADDRESS}::swap::LPToken<${tokenAddress}>`,
    enabled: true,
    refetchInterval: 2000,
  })

  const [reserve0, reserve1] = useMemo(() => {
    return [pool?.data?.balance_x?.value, pool?.data?.balance_y?.value]
  }, [pool])

  const { data: LPSupply, isLoading: isLoadingSupply } =
    useTotalSupply(tokenAddress)
  const totalSupply = LPSupply?.data?.supply?.vec?.[0]?.integer?.vec?.[0]?.value
  const [underlying0, underlying1] = useUnderlyingTokenBalanceFromPool({
    balance: LPBalance,
    reserve0: Number(reserve0),
    reserve1: Number(reserve1),
    totalSupply: Number(totalSupply),
    decimals: LPSupply?.data?.decimals,
  })
  if (isLoading || isLoadingSupply || isPoolLoading || isBalanceLoading) {
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex justify-between mb-1 py-0.5">
          <div className="h-[16px] bg-slate-600 animate-pulse w-[100px] rounded-full" />
          <div className="h-[16px] bg-slate-600 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between py-0.5">
          <div className="h-[16px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[16px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between py-0.5">
          <div className="h-[16px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[16px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-3 px-5 py-4">
      {
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm dark:text-slate-100 text-gray-900">
            Unstaked Position
          </span>
          <span className="text-sm dark:text-slate-100 text-gray-900">
            {'$0.00'}
          </span>
        </div>
      }
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon currency={token0} width={20} height={20} />
          <span className="text-sm dark:text-slate-300 text-gray-700">
            {underlying0 ? underlying0?.toFixed(6) : 0} {token0.symbol}
          </span>
        </div>
        <span className="text-sm dark:text-slate-400 text-slate-600">
          {'$0.00'}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon currency={token1} width={20} height={20} />
          <span className="text-sm dark:text-slate-300 text-gray-700">
            {underlying1 ? underlying1?.toFixed(6) : 0} {token1.symbol}
          </span>
        </div>
        <span className="text-sm dark:text-slate-400 text-slate-600">
          {'$0.00'}
        </span>
      </div>
    </div>
  )
}
