'use client'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { Container, LinkExternal } from '@sushiswap/ui'
import Loading from 'app/loading'
import { AddSectionMyPosition } from 'components/AddSection/AddSectionMyPosition'
import { AddSectionStake } from 'components/AddSection/AddSectionStake'
import { Layout } from 'components/Layout'
import { useParams } from 'next/navigation'
import { FC, useEffect, useMemo } from 'react'
import requiredNetworkAlert from 'utils/requiredNetworkAlert'
import { useAccount } from 'utils/useAccount'
import { useFarms, useIsFarm } from 'utils/useFarms'
import { useNetwork } from 'utils/useNetwork'
import { usePool } from 'utils/usePool'
import { Pool } from 'utils/usePools'
import useStablePrice from 'utils/useStablePrice'
import { useTokenBalance } from 'utils/useTokenBalance'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { useTotalSupply } from 'utils/useTotalSupply'
import { useUnderlyingTokenBalanceFromPool } from 'utils/useUnderlyingTokenBalanceFromPool'
import { getPIdIndex, useUserHandle, useUserPool } from 'utils/useUserHandle'

const Add: FC = () => {
  return <_Add />
}

const _Add = () => {
  const router = useParams()
  const tokenAddress = decodeURIComponent(router?.id)

  const { account, network, disconnect } = useWallet()
  const { isLoadingAccount } = useAccount()

  const {
    contracts: { swap: swapContract },
  } = useNetwork()

  const { data: LPBalance, isInitialLoading: isBalanceLoading } =
    useTokenBalance({
      account: account?.address as string,
      currency: `${swapContract}::swap::LPToken<${tokenAddress}>`,
      enabled: true,
      refetchInterval: 2000,
    })

  const { data: pool } = usePool(tokenAddress)

  const [reserve0, reserve1] = useMemo(() => {
    return [pool?.data?.balance_x?.value, pool?.data?.balance_y?.value]
  }, [pool])

  const { token0, token1 } = useTokensFromPools(pool as Pool)

  const { data: coinInfo } = useTotalSupply(tokenAddress)

  const balance =
    coinInfo && LPBalance
      ? ((LPBalance / 10 ** coinInfo?.data?.decimals) as number)
      : 0
  const totalSupply = coinInfo?.data?.supply?.vec?.[0]?.integer?.vec?.[0]?.value

  const [underlying0, underlying1] = useUnderlyingTokenBalanceFromPool({
    balance: LPBalance,
    reserve0: Number(reserve0),
    reserve1: Number(reserve1),
    token0,
    token1,
    totalSupply: Number(totalSupply),
  })

  // farm

  const { data: farms } = useFarms()
  const farmIndex = useIsFarm({ poolAddress: tokenAddress, farms })
  const { data: userHandle } = useUserPool(account?.address)
  const { data: stakes, isInitialLoading: isStakeLoading } = useUserHandle({
    userHandle,
  })
  const pIdIndex = useMemo(() => {
    return getPIdIndex(farmIndex, stakes)
  }, [stakes, farmIndex])
  const stakeAmount = useMemo(() => {
    if (stakes?.data.current_table_items.length && pIdIndex !== -1) {
      return Number(
        stakes?.data.current_table_items[pIdIndex]?.decoded_value?.amount,
      )
    } else {
      return 0
    }
  }, [stakes, pIdIndex, coinInfo])

  const token0Price = useStablePrice({ currency: token0 })
  const token1Price = useStablePrice({ currency: token1 })
  const token0RemovePoolPrice = token0Price
    ? (token0Price * Number(reserve0)) / 10 ** token0.decimals
    : 0
  const token1RemovePoolPrice = token1Price
    ? (token1Price * Number(reserve1)) / 10 ** token1.decimals
    : 0
  const LpPrice = coinInfo
    ? (Number(reserve0) + Number(reserve1)) / Number(totalSupply)
    : 0

  const farmBalance = coinInfo
    ? ((stakeAmount / 10 ** coinInfo?.data?.decimals) as number)
    : 0

  const [farmUnderlying0, farmUnderlying1] = useUnderlyingTokenBalanceFromPool({
    balance: stakeAmount,
    reserve0: Number(reserve0),
    reserve1: Number(reserve1),
    token0,
    token1,
    totalSupply: Number(totalSupply),
  })

  useEffect(() => {
    requiredNetworkAlert(network, disconnect)
  }, [network, disconnect])
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
              balance={balance}
              decimals={coinInfo?.data?.decimals}
              lpTokenName={coinInfo?.data?.name}
              price={LpPrice}
            />
            <Container className="flex justify-center">
              <LinkExternal
                href="https://docs.sushi.com/docs/Products/Sushiswap/Liquidity%20Pools"
                className="flex justify-center px-6 py-4 dark:decoration-slate-500 decoration-gray-500 hover:bg-opacity-[0.06] cursor-pointer rounded-2xl"
              >
                <span className="text-xs flex items-center gap-1 text-gray-600 dark:text-slate-500">
                  Learn more about liquidity and yield farming
                  <ArrowTopRightOnSquareIcon height={20} width={20} />
                </span>
              </LinkExternal>
            </Container>
          </div>
          <div className="order-1 sm:order-3">
            <AddSectionMyPosition
              unstakedBalance={balance}
              stakedBalance={farmBalance}
              token0={token0}
              token1={token1}
              underlying0={underlying0}
              underlying1={underlying1}
              farmUnderlying0={farmUnderlying0}
              farmUnderlying1={farmUnderlying1}
              isLoading={isBalanceLoading || isStakeLoading}
            />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Add
