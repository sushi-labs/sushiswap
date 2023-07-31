import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AppearOnMount, Container, Link, Typography } from '@sushiswap/ui'
import { AddSectionMyPosition } from 'components/AddSection/AddSectionMyPosition/AddSectionMyPosition'
import { Layout } from 'components/Layout'
import { RemoveSectionWidget } from 'components/RemoveSection/RemoveSectionWidget'
import WalletSelector from 'components/WalletSelector'
import { FC, useMemo, useState } from 'react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { useParams } from 'next/navigation'
import { useTokenBalance } from 'utils/useTokenBalance'
import { usePool } from 'utils/usePool'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { Pool } from 'utils/usePools'
import { useTotalSupply } from 'utils/useTotalSupply'
import { useSlippageTolerance } from '@sushiswap/hooks'
import { useUnderlyingTokenBalanceFromPool } from 'utils/useUnderlyingTokenBalanceFromPool'
import { formatNumber } from 'utils/utilFunctions'
import { Network, Provider } from 'aptos'
import { Dots } from '@sushiswap/ui/future/components/Dots'
import { createToast } from 'components/toast'

const MAINNET_CONTRACT = process.env['MAINNET_CONTRACT'] || process.env['NEXT_PUBLIC_MAINNET_CONTRACT']
const TESTNET_CONTRACT = process.env['TESTNET_CONTRACT'] || process.env['NEXT_PUBLIC_TESTNET_CONTRACT']
const Remove: FC = () => {
  return <_Remove />
}

const _Remove = () => {
  const { connected } = useWallet()
  const [isTransactionPending, setisTransactionPending] = useState<boolean>(false)
  const [percentage, setPercentage] = useState<string>('')
  const [slippageTolerance] = useSlippageTolerance('removeLiquidity')
  console.log('slippageTolerance', slippageTolerance)
  const slippagePercent = useMemo(() => {
    return (
      Math.floor(+(slippageTolerance === 'AUTO' || slippageTolerance === '' ? '0.5' : slippageTolerance) * 100) / 10000
    )
  }, [slippageTolerance])
  console.log('slippagePercent', slippagePercent)

  const router = useParams()
  const [chainId, ...address] = decodeURIComponent(router?.id).split(':')
  const tokenAddress = address.join(':')

  const CONTRACT_ADDRESS = chainId === '2' ? TESTNET_CONTRACT : MAINNET_CONTRACT
  console.log('tokenAddress', tokenAddress)
  const { account, signAndSubmitTransaction, network } = useWallet()
  const { data: LPBalance } = useTokenBalance({
    account: account?.address as string,
    currency: `${CONTRACT_ADDRESS}::swap::LPToken<${tokenAddress}>`,
    chainId: Number(chainId),
    enabled: true,
    refetchInterval: 2000,
  })

  const { data: pool } = usePool(Number(chainId), tokenAddress)
  console.log('LPBalance', LPBalance)

  const [reserve0, reserve1] = useMemo(() => {
    return [pool?.data?.balance_x?.value, pool?.data?.balance_y?.value]
  }, [pool])

  const { token0, token1 } = useTokensFromPools(pool as Pool)

  const { data: LPSupply } = useTotalSupply(chainId, tokenAddress)

  const balance = LPSupply ? ((LPBalance / 10 ** LPSupply?.data?.decimals) as number) : 0
  const totalSupply = LPSupply?.data?.supply?.vec?.[0]?.integer?.vec?.[0]?.value

  const [underlying0, underlying1] = useUnderlyingTokenBalanceFromPool({
    balance: LPBalance,
    reserve0: Number(reserve0),
    reserve1: Number(reserve1),
    totalSupply: Number(totalSupply),
    decimals: LPSupply?.data?.decimals,
  })

  const currencyAToRemove = useMemo(() => {
    return token0
      ? underlying0
        ? Math.floor((Number(reserve0) * Math.floor((LPBalance * +percentage) / 100)) / Number(totalSupply))
        : 0
      : undefined
  }, [percentage, token0, underlying0, slippagePercent])

  const currencyBToRemove = useMemo(() => {
    return token1
      ? underlying1
        ? Math.floor((Number(reserve1) * Math.floor((LPBalance * +percentage) / 100)) / Number(totalSupply))
        : 0
      : undefined
  }, [percentage, token1, underlying0, slippagePercent])

  console.log('underlying0', currencyAToRemove, currencyBToRemove)

  console.log(LPBalance)

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      currencyAToRemove
        ? slippagePercent === 0
          ? currencyAToRemove
          : Math.floor(currencyAToRemove - (currencyAToRemove * slippagePercent) / 100)
        : undefined,
      currencyBToRemove
        ? slippagePercent === 0
          ? currencyBToRemove
          : Math.floor(currencyBToRemove - (currencyBToRemove * slippagePercent) / 100)
        : undefined,
    ]
  }, [slippagePercent, currencyAToRemove, currencyBToRemove])

  console.log('token0', currencyAToRemove)
  console.log('min', minAmount0, minAmount1)
  console.log('max', pool?.data?.balance_x?.value, pool?.data?.balance_y?.value)
  console.log('lp', Math.floor((LPBalance * +percentage) / 100))

  const networkType = network?.name?.toLowerCase() == 'testnet' ? Network.TESTNET : Network.MAINNET
  console.log('token1', currencyBToRemove)
  const removeLiquidityHandler = async () => {
    const provider = new Provider(networkType)
    if (!account?.address) return []
    setisTransactionPending(true)
    try {
      const response = await signAndSubmitTransaction({
        type: 'entry_function_payload',
        type_arguments: [token0?.address, token1?.address],
        arguments: [Math.floor((LPBalance * +percentage) / 100), minAmount0, minAmount1],
        function: `${CONTRACT_ADDRESS}::router::remove_liquidity`,
      })
      console.log(response)
      await provider.waitForTransaction(response?.hash)
      if (!response?.success) return
      const toastId = `success:${response?.hash}`
      createToast({
        summery: `Successfully removed liquidity from the ${token0.symbol}/${token1.symbol} pair`,
        toastId: toastId,
      })
      setisTransactionPending(false)
      setPercentage('')
    } catch (err) {
      console.log(err)
      const toastId = `failed:${Math.random()}`
      createToast({ summery: `User rejected request`, toastId: toastId })
    } finally {
      setisTransactionPending(false)
    }
  }

  return (
    <>
      <Layout>
        <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
          <div className="hidden md:block" />
          <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
            <RemoveSectionWidget
              percentage={percentage}
              setPercentage={setPercentage}
              token0={token0}
              token1={token1}
              balance={balance}
              token0MinMinimum={formatNumber(minAmount0 as number, token0.decimals)}
              token1MinMinimum={formatNumber(minAmount1 as number, token1.decimals)}
            >
              <>
                {connected ? (
                  <button
                    className={`btn w-full flex items-center justify-center gap-2 cursor-pointer transition-all bg-blue hover:bg-blue-600 active:bg-blue-700 text-white px-6 h-[52px] rounded-xl text-base font-semibold ${
                      Number(percentage) <= 0 || isTransactionPending
                        ? 'pointer-events-none relative opacity-[0.4] overflow-hidden'
                        : ''
                    }`}
                    disabled={Number(percentage) <= 0 || isTransactionPending}
                    onClick={removeLiquidityHandler}
                  >
                    {isTransactionPending ? (
                      <Dots>Confirm transaction</Dots>
                    ) : Number(percentage) > 0 ? (
                      <>Remove Liquidity</>
                    ) : (
                      <>Enter Amount</>
                    )}
                  </button>
                ) : (
                  <WalletSelector hideChevron color="blue" size="xl" fullWidth={true} />
                )}
              </>
            </RemoveSectionWidget>
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
    </>
  )
}

export default Remove
