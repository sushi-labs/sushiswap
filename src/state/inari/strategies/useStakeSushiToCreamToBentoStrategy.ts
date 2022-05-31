import { BigNumber } from '@ethersproject/bignumber'
import { I18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, SUSHI, SUSHI_ADDRESS, Token } from '@sushiswap/core-sdk'
import { CRXSUSHI } from 'app/config/tokens'
import { e10 } from 'app/functions/math'
import { useZenkoContract } from 'app/hooks/useContract'
import useSushiPerXSushi from 'app/hooks/useXSushiPerSushi'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoBalanceV2 } from 'app/state/bentobox/hooks'
import { useTokenBalances } from 'app/state/wallet/hooks'
import { useCallback, useEffect, useMemo } from 'react'

import useBentoBoxTrait from '../traits/useBentoBoxTrait'
import { StrategyGeneralInfo, StrategyHook, StrategyTokenDefinitions } from '../types'
import useBaseStrategy from './useBaseStrategy'

export const GENERAL = (i18n: I18n): StrategyGeneralInfo => ({
  name: i18n._(t`Cream → Bento`),
  steps: [i18n._(t`SUSHI`), i18n._(t`crXSUSHI`), i18n._(t`BentoBox`)],
  zapMethod: 'stakeSushiToCreamToBento',
  unzapMethod: 'unstakeSushiFromCreamFromBento',
  description: i18n._(t`Stake SUSHI for xSUSHI into Cream and deposit crXSUSHI into BentoBox in one click.`),
  inputSymbol: i18n._(t`SUSHI`),
  outputSymbol: i18n._(t`crXSUSHI in BentoBox`),
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
    address: '0x228619CCa194Fbe3Ebeb2f835eC1eA5080DaFbb2',
    decimals: 8,
    symbol: 'crXSUSHI',
  },
}

const useStakeSushiToCreamToBentoStrategy = (): StrategyHook => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const zenkoContract = useZenkoContract()
  // @ts-ignore TYPE NEEDS FIXING
  const balances = useTokenBalances(account, [SUSHI[ChainId.ETHEREUM]])
  const sushiPerXSushi = useSushiPerXSushi(true)
  const { data: crxSushiBentoBalance } = useBentoBalanceV2(CRXSUSHI.address)

  // Strategy ends in BentoBox so use BaseBentoBox strategy
  const general = useMemo(() => GENERAL(i18n), [i18n])
  const baseStrategy = useBaseStrategy({
    id: 'stakeSushiToCreamToBentoStrategy',
    general,
    tokenDefinitions,
  })

  // Add in BentoBox trait as output is in BentoBox
  const { setBalances, calculateOutputFromInput: _, ...strategy } = useBentoBoxTrait(baseStrategy)

  useEffect(() => {
    if (!balances) return

    setBalances({
      inputTokenBalance: balances[SUSHI_ADDRESS[ChainId.ETHEREUM]],
      outputTokenBalance: crxSushiBentoBalance,
    })
  }, [balances, setBalances, crxSushiBentoBalance])

  const calculateOutputFromInput = useCallback(
    async (zapIn: boolean, inputValue: string, inputToken: Token, outputToken: Token) => {
      if (!sushiPerXSushi || !inputValue || !zenkoContract) return null

      if (zapIn) {
        const value = inputValue.toBigNumber(18).mulDiv(e10(18), sushiPerXSushi.toString().toBigNumber(18)).toString()
        const cValue = await zenkoContract.toCtoken(CRXSUSHI.address, value)
        return cValue.toFixed(outputToken.decimals)
      } else {
        const cValue = await zenkoContract.fromCtoken(CRXSUSHI.address, inputValue.toBigNumber(inputToken.decimals))
        const value = BigNumber.from(cValue).mulDiv(sushiPerXSushi.toString().toBigNumber(18), e10(18))
        return value.toFixed(outputToken.decimals)
      }
    },
    [sushiPerXSushi, zenkoContract]
  )

  return useMemo(
    () => ({
      ...strategy,
      setBalances,
      calculateOutputFromInput,
    }),
    [strategy, calculateOutputFromInput, setBalances]
  )
}

export default useStakeSushiToCreamToBentoStrategy
