import { useSlippageTolerance } from '@sushiswap/hooks'
import { Network, Provider } from 'aptos'
import { useParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { Pool } from 'utils/usePools'
import { useTokenBalance } from 'utils/useTokenBalance'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { CoinInfo, useTotalSupply } from 'utils/useTotalSupply'
import { useUnderlyingTokenBalanceFromPool } from 'utils/useUnderlyingTokenBalanceFromPool'
import { RemoveSectionWidget } from './RemoveSectionWidget'
import { formatNumber } from 'utils/utilFunctions'
import { createToast } from 'components/toast'
import { Dots } from '@sushiswap/ui/future/components/Dots'
import WalletSelector from 'components/WalletSelector'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Token } from 'utils/tokenType'
interface Props {
  pool: Pool
  liquidityBalance: number | undefined
  token0: Token
  token1: Token
  balance: number
  underlying0: number | undefined
  underlying1: number | undefined
  totalSupply: string | undefined
}
const MAINNET_CONTRACT = process.env['MAINNET_CONTRACT'] || process.env['NEXT_PUBLIC_MAINNET_CONTRACT']
const TESTNET_CONTRACT = process.env['TESTNET_CONTRACT'] || process.env['NEXT_PUBLIC_TESTNET_CONTRACT']
export const RemoveSectionLegacy = ({
  pool,
  liquidityBalance,
  token0,
  token1,
  balance,
  underlying0,
  underlying1,
  totalSupply,
}: Props) => {
  const router = useParams()
  const [slippageTolerance] = useSlippageTolerance('removeLiquidity')
  const slippagePercent = useMemo(() => {
    return (
      Math.floor(+(slippageTolerance === 'AUTO' || slippageTolerance === '' ? '0.5' : slippageTolerance) * 100) / 10000
    )
  }, [slippageTolerance])

  const [reserve0, reserve1] = useMemo(() => {
    return [pool?.data?.balance_x?.value, pool?.data?.balance_y?.value]
  }, [pool])

  const [chainId, ...address] = decodeURIComponent(router?.id).split(':')
  const [percentage, setPercentage] = useState<string>('')
  const [isTransactionPending, setisTransactionPending] = useState<boolean>(false)
  const CONTRACT_ADDRESS = chainId === '2' ? TESTNET_CONTRACT : MAINNET_CONTRACT
  const { account, signAndSubmitTransaction, network, connected } = useWallet()

  const networkType = network?.name?.toLowerCase() == 'testnet' ? Network.TESTNET : Network.MAINNET

  const currencyAToRemove = useMemo(() => {
    return token0
      ? underlying0 && liquidityBalance
        ? Math.floor((Number(reserve0) * Math.floor((liquidityBalance * +percentage) / 100)) / Number(totalSupply))
        : 0
      : undefined
  }, [percentage, token0, underlying0, slippagePercent])

  const currencyBToRemove = useMemo(() => {
    return token1
      ? underlying1 && liquidityBalance
        ? Math.floor((Number(reserve1) * Math.floor((liquidityBalance * +percentage) / 100)) / Number(totalSupply))
        : 0
      : undefined
  }, [percentage, token1, underlying0, slippagePercent])

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      currencyAToRemove
        ? slippagePercent === 0
          ? Math.floor(currencyAToRemove)
          : Math.floor(currencyAToRemove - (currencyAToRemove * slippagePercent) / 100)
        : undefined,
      currencyBToRemove
        ? slippagePercent === 0
          ? Math.floor(currencyBToRemove)
          : Math.floor(currencyBToRemove - (currencyBToRemove * slippagePercent) / 100)
        : undefined,
    ]
  }, [slippagePercent, currencyAToRemove, currencyBToRemove])

  const removeLiquidityHandler = async () => {
    const provider = new Provider(networkType)
    if (!account?.address) return []
    setisTransactionPending(true)
    if (!liquidityBalance) return
    try {
      const response = await signAndSubmitTransaction({
        type: 'entry_function_payload',
        type_arguments: [token0?.address, token1?.address],
        arguments: [Math.floor((liquidityBalance * +percentage) / 100), minAmount0, minAmount1],
        function: `${CONTRACT_ADDRESS}::router::remove_liquidity`,
      })
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
    <RemoveSectionWidget
      isFarm={true}
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
  )
}
