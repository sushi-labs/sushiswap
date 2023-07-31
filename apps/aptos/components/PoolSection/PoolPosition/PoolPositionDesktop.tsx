import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Typography } from '@sushiswap/ui'
import { Icon } from 'components/Icon'
import { useParams } from 'next/navigation'
import { FC, useMemo } from 'react'
import { usePool } from 'utils/usePool'
import { Pool, usePools } from 'utils/usePools'
import { useTokenBalance } from 'utils/useTokenBalance'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { useTotalSupply } from 'utils/useTotalSupply'
import { useUnderlyingTokenBalanceFromPool } from 'utils/useUnderlyingTokenBalanceFromPool'
import { formatNumber } from 'utils/utilFunctions'

interface PoolPositionProps {
  row: Pool
  isLoading: boolean
}

const MAINNET_CONTRACT = process.env['MAINNET_CONTRACT'] || process.env['NEXT_PUBLIC_MAINNET_CONTRACT']
const TESTNET_CONTRACT = process.env['TESTNET_CONTRACT'] || process.env['NEXT_PUBLIC_TESTNET_CONTRACT']

export const PoolPositionDesktop: FC<PoolPositionProps> = ({ row, isLoading }) => {
  const router = useParams()
  const { token0, token1 } = useTokensFromPools(row)
  const { network, account } = useWallet()
  const [chainId, ...address] = decodeURIComponent(router?.id).split(':')

  const CONTRACT_ADDRESS = chainId === '2' ? TESTNET_CONTRACT : MAINNET_CONTRACT
  const tokenAddress = address.join(':')
  const { data: pool } = usePool(Number(chainId), tokenAddress)
  const { data: LPBalance } = useTokenBalance({
    account: account?.address as string,
    currency: `${CONTRACT_ADDRESS}::swap::LPToken<${tokenAddress}>`,
    chainId: Number(chainId),
    enabled: true,
    refetchInterval: 2000,
  })
  console.log('LPBalance', LPBalance)

  const [reserve0, reserve1] = useMemo(() => {
    return [pool?.data?.balance_x?.value, pool?.data?.balance_y?.value]
  }, [pool])

  const { data: LPSupply } = useTotalSupply(chainId, tokenAddress)
  const totalSupply = LPSupply?.data?.supply?.vec?.[0]?.integer?.vec?.[0]?.value
  const [underlying0, underlying1] = useUnderlyingTokenBalanceFromPool({
    balance: LPBalance,
    reserve0: Number(reserve0),
    reserve1: Number(reserve1),
    totalSupply: Number(totalSupply),
    decimals: LPSupply?.data?.decimals,
  })

  const balanceX = formatNumber(Number(row.data.balance_x.value), token0.decimals)
  const balanceY = formatNumber(Number(row.data.balance_y.value), token1.decimals)
  const {} = usePools()
  if (isLoading) {
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
  if (true) {
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        {
          <div className="flex items-center justify-between mb-1">
            <Typography variant="sm" weight={600} className="dark:text-slate-100 text-gray-900">
              Unstaked Position
            </Typography>
            <Typography variant="xs" weight={500} className="dark:text-slate-100 text-gray-900">
              {'$0.00'}
            </Typography>
          </div>
        }
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon currency={token0} width={20} height={20} />
            <Typography variant="sm" weight={600} className="dark:text-slate-300 text-gray-700">
              {underlying0?.toFixed(6)} {token0.symbol}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600">
            {'$0.00'}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon currency={token1} width={20} height={20} />
            <Typography variant="sm" weight={600} className="dark:text-slate-300 text-gray-700">
              {underlying1?.toFixed(6)} {token1.symbol}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600">
            {'$0.00'}
          </Typography>
        </div>
      </div>
    )
  }
  return <></>
}
