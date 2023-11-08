import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { Container, LinkExternal } from '@sushiswap/ui'
import { AddSectionMyPosition } from 'components/AddSection/AddSectionMyPosition/AddSectionMyPosition'
import { Layout } from 'components/Layout'
import { RemoveSectionLegacy } from 'components/RemoveSection/RemoveSectionLegacy'
import { RemoveSectionUnstake } from 'components/RemoveSection/RemoveSectionUnstake'
import { useParams } from 'next/navigation'
import { FC, useMemo } from 'react'
import { useFarms, useIsFarm } from 'utils/useFarms'
import { useNetwork } from 'utils/useNetwork'
import { usePool } from 'utils/usePool'
import { Pool } from 'utils/usePools'
import { useTokenBalance } from 'utils/useTokenBalance'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { useTotalSupply } from 'utils/useTotalSupply'
import { useUnderlyingTokenBalanceFromPool } from 'utils/useUnderlyingTokenBalanceFromPool'
import { getPIdIndex, useUserHandle, useUserPool } from 'utils/useUserHandle'

const Remove: FC = () => {
  return <_Remove />
}

const _Remove: FC = () => {
  const router = useParams()
  const tokenAddress = decodeURIComponent(router?.id)

  const { account } = useWallet()

  const {
    contracts: { swap: swapContract },
  } = useNetwork()

  const { data: LPBalance, isInitialLoading: isLoadingBalance } =
    useTokenBalance({
      account: account?.address as string,
      currency: `${swapContract}::swap::LPToken<${tokenAddress}>`,
      enabled: Boolean(swapContract && account?.address && tokenAddress),
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
  }, [stakes, pIdIndex])

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

  return (
    <>
      {pool?.id && (
        <Layout>
          <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
            <div className="hidden md:block" />
            <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
              {farmIndex !== -1 && (
                <RemoveSectionUnstake
                  balance={farmBalance}
                  decimals={coinInfo?.data?.decimals ?? 8}
                  lpTokenName={coinInfo?.data?.name}
                />
              )}
              <RemoveSectionLegacy
                pool={pool}
                liquidityBalance={LPBalance}
                token0={token0}
                token1={token1}
                balance={balance}
                underlying0={underlying0}
                underlying1={underlying1}
                totalSupply={totalSupply}
                isFarm={farmIndex !== -1}
              />
              <Container className="flex justify-center">
                <LinkExternal
                  href="https://docs.sushi.com/docs/Products/Sushiswap/Liquidity%20Pools"
                  className="flex justify-center px-6 py-4 decoration-slate-500 hover:bg-opacity-[0.06] cursor-pointer rounded-2xl"
                >
                  <span className="text-xs flex items-center gap-1 text-gray-600 dark:text-slate-500">
                    Learn more about liquidity and yield farming
                    {/* <Link.External width={16} height={16} className="text-gray-600 dark:text-slate-500" /> */}
                    <ArrowTopRightOnSquareIcon height={20} width={20} />
                  </span>
                </LinkExternal>
              </Container>
            </div>
            <div className="order-1 sm:order-3">
              <AddSectionMyPosition
                unstakedBalance={balance}
                stakedBalance={farmBalance}
                underlying0={underlying0}
                underlying1={underlying1}
                token0={token0}
                token1={token1}
                farmUnderlying0={farmUnderlying0}
                farmUnderlying1={farmUnderlying1}
                isLoading={isStakeLoading || isLoadingBalance}
              />
            </div>
          </div>
        </Layout>
      )}
    </>
  )
}

export default Remove
