import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AppearOnMount, Container, Link, Typography } from '@sushiswap/ui'
import { AddSectionMyPosition } from 'components/AddSection/AddSectionMyPosition/AddSectionMyPosition'
import { Layout } from 'components/Layout'
import { FC, useMemo, useState } from 'react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { useParams } from 'next/navigation'
import { useTokenBalance } from 'utils/useTokenBalance'
import { usePool } from 'utils/usePool'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { Pool } from 'utils/usePools'
import { useTotalSupply } from 'utils/useTotalSupply'
import { useUnderlyingTokenBalanceFromPool } from 'utils/useUnderlyingTokenBalanceFromPool'
import { RemoveSectionLegacy } from 'components/RemoveSection/RemoveSectionLegacy'
import { RemoveSectionUnstake } from 'components/RemoveSection/RemoveSectionUnstake'
import { isFarm, useFarms } from 'utils/useFarms'
import { getPIdIndex, useUserHandle, useUserPool } from 'utils/useUserHandle'

const CONTRACT_ADDRESS = process.env['NEXT_PUBLIC_SWAP_CONTRACT'] || process.env['SWAP_CONTRACT']
const Remove: FC = () => {
  return <_Remove />
}

const _Remove: FC = () => {
  const router = useParams()
  const tokenAddress = decodeURIComponent(router?.id)

  const { account } = useWallet()
  const { data: LPBalance, isInitialLoading: isLoadingBalance } = useTokenBalance({
    account: account?.address as string,
    currency: `${CONTRACT_ADDRESS}::swap::LPToken<${tokenAddress}>`,
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

  const farmBalance = coinInfo ? ((stakeAmount / 10 ** coinInfo?.data?.decimals) as number) : 0

  const [farmUnderlying0, farmUnderlying1] = useUnderlyingTokenBalanceFromPool({
    balance: stakeAmount,
    reserve0: Number(reserve0),
    reserve1: Number(reserve1),
    totalSupply: Number(totalSupply),
    decimals: coinInfo?.data?.decimals,
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
                  token0={token0}
                  token1={token1}
                  stakeAmount={stakeAmount}
                  balance={farmBalance}
                  decimals={coinInfo?.data?.decimals}
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
                <Link.External
                  href="https://docs.sushi.com/docs/Products/Sushiswap/Liquidity%20Pools"
                  className="flex justify-center px-6 py-4 decoration-slate-500 hover:bg-opacity-[0.06] cursor-pointer rounded-2xl"
                >
                  <Typography
                    variant="xs"
                    weight={500}
                    className="flex items-center gap-1 text-gray-600 dark:text-slate-500"
                  >
                    Learn more about liquidity and yield farming
                    {/* <Link.External width={16} height={16} className="text-gray-600 dark:text-slate-500" /> */}
                    <ArrowTopRightOnSquareIcon height={20} width={20} />
                  </Typography>
                </Link.External>
              </Container>
            </div>
            <div className="order-1 sm:order-3">
              <AppearOnMount>
                <AddSectionMyPosition
                  balance={balance}
                  underlying0={parseFloat(underlying0?.toFixed(4) as string)}
                  underlying1={parseFloat(underlying1?.toFixed(4) as string)}
                  token0={token0}
                  token1={token1}
                  farmUnderlying0={farmUnderlying0}
                  farmUnderlying1={farmUnderlying1}
                  isLoading={isStakeLoading || isLoadingBalance}
                />
              </AppearOnMount>
            </div>
          </div>
        </Layout>
      )}
    </>
  )
}

export default Remove
