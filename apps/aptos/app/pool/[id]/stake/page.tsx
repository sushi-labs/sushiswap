'use client'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { AppearOnMount, Container, Link, Typography } from '@sushiswap/ui'
import Loading from 'app/loading'
import { AddSectionMyPosition } from 'components/AddSection/AddSectionMyPosition'
import { AddSectionStake } from 'components/AddSection/AddSectionStake'
import { Layout } from 'components/Layout'
import { useParams } from 'next/navigation'
import { FC, useMemo } from 'react'
import { useAccount } from 'utils/useAccount'
import { isFarm, useFarms } from 'utils/useFarms'
import { usePool } from 'utils/usePool'
import { Pool } from 'utils/usePools'
import { useTokenBalance } from 'utils/useTokenBalance'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { useTotalSupply } from 'utils/useTotalSupply'
import { useUnderlyingTokenBalanceFromPool } from 'utils/useUnderlyingTokenBalanceFromPool'
import { getPIdIndex, useUserHandle, useUserPool } from 'utils/useUserHandle'

const Add: FC = ({}) => {
  return <_Add />
}
const MAINNET_CONTRACT = process.env['MAINNET_CONTRACT'] || process.env['NEXT_PUBLIC_MAINNET_CONTRACT']
const TESTNET_CONTRACT = process.env['TESTNET_CONTRACT'] || process.env['NEXT_PUBLIC_TESTNET_CONTRACT']

const _Add = () => {
  const router = useParams()
  const [chainId, ...address] = decodeURIComponent(router?.id).split(':')
  const tokenAddress = address.join(':')

  const CONTRACT_ADDRESS = chainId === '2' ? TESTNET_CONTRACT : MAINNET_CONTRACT
  const { account } = useWallet()
  const { isLoadingAccount } = useAccount()
  const { data: LPBalance } = useTokenBalance({
    account: account?.address as string,
    currency: `${CONTRACT_ADDRESS}::swap::LPToken<${tokenAddress}>`,
    chainId: Number(chainId),
    enabled: true,
    refetchInterval: 2000,
  })

  const { data: pool } = usePool(Number(chainId), tokenAddress)

  const [reserve0, reserve1] = useMemo(() => {
    return [pool?.data?.balance_x?.value, pool?.data?.balance_y?.value]
  }, [pool])

  const { token0, token1 } = useTokensFromPools(pool as Pool)

  const { data: LPSupply } = useTotalSupply(chainId, tokenAddress)

  const balance = LPSupply && LPBalance ? ((LPBalance / 10 ** LPSupply?.data?.decimals) as number) : 0
  const totalSupply = LPSupply?.data?.supply?.vec?.[0]?.integer?.vec?.[0]?.value

  const [underlying0, underlying1] = useUnderlyingTokenBalanceFromPool({
    balance: LPBalance,
    reserve0: Number(reserve0),
    reserve1: Number(reserve1),
    totalSupply: Number(totalSupply),
    decimals: LPSupply?.data?.decimals,
  })

  // farm

  const { data: farms } = useFarms()
  const farmIndex = isFarm(tokenAddress, farms)
  const { data: coinInfo } = useTotalSupply(chainId, tokenAddress)
  const { data: userHandle } = useUserPool(account?.address)
  const { data: stakes, isInitialLoading: isStakeLoading } = useUserHandle({ address: account?.address, userHandle })
  const pIdIndex = useMemo(() => {
    return getPIdIndex(farmIndex, stakes)
  }, [stakes, farmIndex])
  const stakeAmount = useMemo(() => {
    if (stakes?.data.current_table_items.length && pIdIndex !== -1) {
      return Number(stakes?.data.current_table_items[pIdIndex]?.decoded_value?.amount)
    } else {
      return 0
    }
  }, [stakes, pIdIndex, coinInfo])

  // const farmBalance = LPSupply ? ((stakeAmount / 10 ** LPSupply?.data?.decimals) as number) : 0

  const [farmUnderlying0, farmUnderlying1] = useUnderlyingTokenBalanceFromPool({
    balance: stakeAmount,
    reserve0: Number(reserve0),
    reserve1: Number(reserve1),
    totalSupply: Number(totalSupply),
    decimals: coinInfo?.data?.decimals,
  })
  if (!pool?.id) return <></>
  return (
    <>
      {isLoadingAccount && <Loading />}
      <Layout>
        <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
          <div className="hidden md:block" />
          <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
            <AddSectionStake
              token0={token0}
              token1={token1}
              balance={balance}
              decimals={coinInfo?.data?.decimals}
              lpTokenName={coinInfo?.data?.name}
            />
            <Container className="flex justify-center">
              <Link.External
                href="https://docs.sushi.com/docs/Products/Sushiswap/Liquidity%20Pools"
                className="flex justify-center px-6 py-4 dark:decoration-slate-500 decoration-gray-500 hover:bg-opacity-[0.06] cursor-pointer rounded-2xl"
              >
                <Typography
                  variant="xs"
                  weight={500}
                  className="flex items-center gap-1 text-gray-600 dark:text-slate-500"
                >
                  Learn more about liquidity and yield farming
                  <ArrowTopRightOnSquareIcon height={20} width={20} />
                </Typography>
              </Link.External>
            </Container>
          </div>
          <div className="order-1 sm:order-3">
            <AppearOnMount>
              <AddSectionMyPosition
                balance={balance}
                token0={token0}
                token1={token1}
                underlying0={underlying0}
                underlying1={underlying1}
                farmUnderlying0={farmUnderlying0}
                farmUnderlying1={farmUnderlying1}
              />
            </AppearOnMount>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Add
