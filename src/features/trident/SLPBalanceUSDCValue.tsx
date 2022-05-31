import { CurrencyAmount, Token, USDC } from '@sushiswap/core-sdk'
import { ConstantProductPool } from '@sushiswap/trident-sdk'
import { useTotalSupply } from 'app/hooks/useTotalSupply'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenBalance } from 'app/state/wallet/hooks'
import { FC, ReactNode } from 'react'

interface _SLPBalanceProps {
  sum: CurrencyAmount<Token>
  amounts?: CurrencyAmount<Token>[]
  index: number
  children: (sum: CurrencyAmount<Token>) => ReactNode
}

const _SLPBalance: FC<_SLPBalanceProps> = ({ sum, amounts, children, index }) => {
  const usdcValue = useUSDCValue(amounts?.[index])

  if (index === 0 && usdcValue) {
    return <>{children(usdcValue)}</>
  }

  return (
    <_SLPBalance index={index - 1} amounts={amounts} sum={sum}>
      {(sum) => (usdcValue ? children(usdcValue?.add(sum)) : <></>)}
    </_SLPBalance>
  )
}

interface SLPBalanceUSDCValueProps {
  pool?: ConstantProductPool
  children: (sum: CurrencyAmount<Token>) => ReactNode
}

const SLPBalanceUSDCValue: FC<SLPBalanceUSDCValueProps> = ({ pool, children }) => {
  const { chainId } = useActiveWeb3React()
  const totalSupply = useTotalSupply(pool?.liquidityToken)
  const balance = useTokenBalance(pool?.liquidityToken.address)
  const liquidityValues =
    pool && totalSupply && balance && pool.assets.map((asset) => pool.getLiquidityValue(asset, totalSupply, balance))

  if (!liquidityValues || !chainId) return <></>

  return (
    <_SLPBalance
      sum={CurrencyAmount.fromRawAmount(USDC[chainId], '0')}
      amounts={liquidityValues}
      index={liquidityValues.length}
    >
      {(sum) => children(sum)}
    </_SLPBalance>
  )
}

export default SLPBalanceUSDCValue
