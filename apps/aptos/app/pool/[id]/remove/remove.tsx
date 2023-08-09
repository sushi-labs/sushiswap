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

const MAINNET_CONTRACT = process.env['MAINNET_CONTRACT'] || process.env['NEXT_PUBLIC_MAINNET_CONTRACT']
const TESTNET_CONTRACT = process.env['TESTNET_CONTRACT'] || process.env['NEXT_PUBLIC_TESTNET_CONTRACT']
const Remove: FC = () => {
  return <_Remove />
}

const _Remove: FC = () => {
  const [isTransactionPending, setisTransactionPending] = useState<boolean>(false)
  const [percentage, setPercentage] = useState<string>('')

  const router = useParams()
  const [chainId, ...address] = decodeURIComponent(router?.id).split(':')
  const tokenAddress = address.join(':')

  const CONTRACT_ADDRESS = chainId === '2' ? TESTNET_CONTRACT : MAINNET_CONTRACT
  const { account, signAndSubmitTransaction, network } = useWallet()
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

  return (
    <>
      {pool?.id && (
        <Layout>
          <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
            <div className="hidden md:block" />
            <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
              <RemoveSectionUnstake />
              <RemoveSectionLegacy
                pool={pool}
                liquidityBalance={LPBalance}
                token0={token0}
                token1={token1}
                LPSupply={LPSupply}
                balance={balance}
                underlying0={underlying0}
                underlying1={underlying1}
                totalSupply={totalSupply}
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
