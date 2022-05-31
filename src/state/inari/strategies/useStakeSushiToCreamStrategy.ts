import { I18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, CurrencyAmount, SUSHI, SUSHI_ADDRESS, Token } from '@sushiswap/core-sdk'
import { CRXSUSHI, XSUSHI } from 'app/config/tokens'
import { tryParseAmount } from 'app/functions/parse'
import { useApproveCallback } from 'app/hooks/useApproveCallback'
import { useInariContract, useZenkoContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenBalances } from 'app/state/wallet/hooks'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { useDerivedInariState } from '../hooks'
import { StrategyGeneralInfo, StrategyHook, StrategyTokenDefinitions } from '../types'
import useBaseStrategy from './useBaseStrategy'

export const GENERAL = (i18n: I18n): StrategyGeneralInfo => ({
  name: i18n._(t`SUSHI → Cream`),
  steps: [i18n._(t`SUSHI`), i18n._(t`xSUSHI`), i18n._(t`Cream`)],
  zapMethod: 'stakeSushiToCream',
  unzapMethod: 'unstakeSushiFromCream',
  description: i18n._(
    t`Stake SUSHI for xSUSHI and deposit into Cream in one click. xSUSHI in Cream (crXSUSHI) can be lent or used as collateral for borrowing.`
  ),
  inputSymbol: i18n._(t`SUSHI`),
  outputSymbol: i18n._(t`xSUSHI in Cream`),
})

export const tokenDefinitions: StrategyTokenDefinitions = {
  inputToken: {
    chainId: ChainId.ETHEREUM,
    address: SUSHI_ADDRESS[ChainId.ETHEREUM],
    decimals: 18,
    symbol: 'SUSHI',
  },
  outputToken: {
    chainId: ChainId.ETHEREUM,
    address: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
    decimals: 18,
    symbol: 'XSUSHI',
  },
}

const useStakeSushiToCreamStrategy = (): StrategyHook => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { zapIn, inputValue } = useDerivedInariState()
  const zenkoContract = useZenkoContract()
  const inariContract = useInariContract()
  // @ts-ignore TYPE NEEDS FIXING
  const balances = useTokenBalances(account, [SUSHI[ChainId.ETHEREUM], CRXSUSHI])
  const cTokenAmountRef = useRef<CurrencyAmount<Token>>(null)
  const approveAmount = useMemo(() => (zapIn ? inputValue : cTokenAmountRef.current), [inputValue, zapIn])

  // Override approveCallback for this strategy as we need to approve CRXSUSHI on zapOut
  // @ts-ignore TYPE NEEDS FIXING
  const approveCallback = useApproveCallback(approveAmount, inariContract?.address)
  const general = useMemo(() => GENERAL(i18n), [i18n])
  const { execute, setBalances, ...baseStrategy } = useBaseStrategy({
    id: 'stakeSushiToCreamStrategy',
    general,
    tokenDefinitions,
  })

  const toCTokenAmount = useCallback(
    async (val: CurrencyAmount<Token>) => {
      if (!zenkoContract || !val) return null

      const bal = await zenkoContract.toCtoken(CRXSUSHI.address, val.quotient.toString())
      return CurrencyAmount.fromRawAmount(CRXSUSHI, bal.toString())
    },
    [zenkoContract]
  )

  // Run before executing transaction creation by transforming from xSUSHI value to crXSUSHI value
  // As you will be spending crXSUSHI when unzapping from this strategy
  const preExecute = useCallback(
    async (val: CurrencyAmount<Token>) => {
      if (zapIn) return execute(val)
      // @ts-ignore TYPE NEEDS FIXING
      return execute(await toCTokenAmount(val))
    },
    [execute, toCTokenAmount, zapIn]
  )

  useEffect(() => {
    // @ts-ignore TYPE NEEDS FIXING
    toCTokenAmount(inputValue).then((val) => (cTokenAmountRef.current = val))
  }, [inputValue, toCTokenAmount])

  useEffect(() => {
    if (!zenkoContract || !balances) return

    const main = async () => {
      if (!balances[CRXSUSHI.address]) return tryParseAmount('0', XSUSHI)
      const bal = await zenkoContract.fromCtoken(
        CRXSUSHI.address,
        balances?.[CRXSUSHI.address]?.toFixed().toBigNumber(CRXSUSHI.decimals).toString()
      )
      setBalances({
        // @ts-ignore TYPE NEEDS FIXING
        inputTokenBalance: balances[SUSHI[ChainId.ETHEREUM].address],
        outputTokenBalance: CurrencyAmount.fromRawAmount(XSUSHI, bal.toString()),
      })
    }

    main()
  }, [balances, setBalances, zenkoContract])

  // @ts-ignore TYPE NEEDS FIXING
  return useMemo(
    () => ({
      ...baseStrategy,
      approveCallback: [...approveCallback, approveAmount],
      setBalances,
      execute: preExecute,
    }),
    [approveAmount, approveCallback, baseStrategy, preExecute, setBalances]
  )
}

export default useStakeSushiToCreamStrategy
