'use client'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { AppearOnMount, Container, Link, Typography } from '@sushiswap/ui'
import Loading from 'app/loading'
import { AddSectionMyPosition } from 'components/AddSection/AddSectionMyPosition'
import { AddSectionStake } from 'components/AddSection/AddSectionStake'
import { Layout } from 'components/Layout'
import { useParams } from 'next/navigation'
import { FC, useEffect, useMemo } from 'react'
import requiredNetworkAlert from 'utils/requiredNetworkAlert'
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
const SWAP_CONTRACT = process.env['NEXT_PUBLIC_SWAP_CONTRACT']

const _Add = () => {
  const router = useParams()
  const tokenAddress = decodeURIComponent(router?.id)

  const { account, network, disconnect } = useWallet()
  const { isLoadingAccount } = useAccount()
  const { data: LPBalance, isInitialLoading: isBalanceLoading } = useTokenBalance({
    account: account?.address as string,
    currency: `${SWAP_CONTRACT}::swap::LPToken<${tokenAddress}>`,
    enabled: true,
    refetchInterval: 2000,
  })

  const { data: pool } = usePool(tokenAddress)

  const [reserve0, reserve1] = useMemo(() => {
    return [pool?.data?.balance_x?.value, pool?.data?.balance_y?.value]
  }, [pool])

  const { token0, token1 } = useTokensFromPools(pool as Pool)

  const { data: coinInfo } = useTotalSupply(tokenAddress)

  const balance = coinInfo && LPBalance ? ((LPBalance / 10 ** coinInfo?.data?.decimals) as number) : 0
  const totalSupply = coinInfo?.data?.supply?.vec?.[0]?.integer?.vec?.[0]?.value

  const [underlying0, underlying1] = useUnderlyingTokenBalanceFromPool({
    balance: LPBalance,
    reserve0: Number(reserve0),
    reserve1: Number(reserve1),
    totalSupply: Number(totalSupply),
    decimals: coinInfo?.data?.decimals,
  })

  // farm

  const { data: farms } = useFarms()
  const farmIndex = isFarm(tokenAddress, farms)
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

  // const farmBalance = coinInfo ? ((stakeAmount / 10 ** coinInfo?.data?.decimals) as number) : 0

  const [farmUnderlying0, farmUnderlying1] = useUnderlyingTokenBalanceFromPool({
    balance: stakeAmount,
    reserve0: Number(reserve0),
    reserve1: Number(reserve1),
    totalSupply: Number(totalSupply),
    decimals: coinInfo?.data?.decimals,
  })
  useEffect(() => {
    requiredNetworkAlert(network, disconnect)
  }, [network])
  if (!pool?.id) return <></>
  if (farmIndex === -1) return <>\</>
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
                isLoading={isBalanceLoading || isStakeLoading}
              />
            </AppearOnMount>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Add
