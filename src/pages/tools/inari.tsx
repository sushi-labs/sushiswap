import { ArrowRightIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Container from 'app/components/Container'
import DoubleGlowShadow from 'app/components/DoubleGlowShadow'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums/Feature'
import BalancePanel from 'app/features/inari/BalancePanel'
import InariButton from 'app/features/inari/Button'
import InariDescription from 'app/features/inari/InariDescription'
import SideSwitch from 'app/features/inari/SideSwitch'
import StrategySelector from 'app/features/inari/StrategySelector'
import StrategyStepDisplay from 'app/features/inari/StrategyStepDisplay'
import NetworkGuard from 'app/guards/Network'
import { useAppDispatch } from 'app/state/hooks'
import { setStrategy } from 'app/state/inari/actions'
import { useDerivedInariState, useInariState, useSelectedInariStrategy } from 'app/state/inari/hooks'
import useStakeSushiToBentoStrategy from 'app/state/inari/strategies/useStakeSushiToBentoStrategy'
import { Field } from 'app/state/inari/types'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import React, { useEffect } from 'react'

const Inari = () => {
  const { i18n } = useLingui()
  const { inputValue, outputValue } = useInariState()
  const { tokens, general } = useDerivedInariState()
  const { balances } = useSelectedInariStrategy()
  const dispatch = useAppDispatch()

  // Set initial strategy
  const stakeSushiToBentoStrategy = useStakeSushiToBentoStrategy()
  useEffect(() => {
    dispatch(setStrategy(stakeSushiToBentoStrategy))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <NextSeo title={`Inari`} />
      <Container maxWidth="5xl" className="flex flex-col gap-8 px-4 py-8">
        <div className="flex items-center gap-8">
          <div className="min-w-[140px] min-h-[105px]">
            <Image src="https://app.sushi.com/images/inari/neon-sign.png" alt="inari-sign" width={140} height={105} />
          </div>
          <div className="flex flex-col">
            <Typography variant="h3" className="mb-2 text-high-emphesis" weight={700}>
              {i18n._(t`One-Click Strategies`)}
            </Typography>
            <Typography>
              {i18n._(t`Take your SUSHI and invest in various strategies with one click! Earn extra yields with BentoBox, use as
              collateral on other platforms, and more!`)}
            </Typography>
          </div>
        </div>
        <div className="grid grid-cols-12 space-y-10 md:gap-10 md:space-y-0">
          <div className="col-span-12 md:col-span-3">
            <div className="flex flex-col gap-5">
              <StrategySelector />
            </div>
          </div>
          <div className="grid col-span-12 gap-4 md:col-span-9">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <StrategyStepDisplay />
              <SideSwitch />
            </div>
            <DoubleGlowShadow className="max-w-[100%]">
              <div className="grid gap-8 p-5 border-2 rounded bg-dark-900 border-dark-700">
                <div className="flex flex-col items-start md:flex-row">
                  <div className="w-full mr-2 md:w-3/5">
                    <BalancePanel
                      label={i18n._(t`From`)}
                      showMax
                      value={inputValue}
                      token={tokens?.inputToken}
                      symbol={general?.inputSymbol}
                      balance={balances?.inputTokenBalance}
                      field={Field.INPUT}
                    />
                  </div>
                  <div className="flex items-center md:w-[60px] z-1 relative md:ml-[-16px] md:mr-[-16px] md:mt-[34px] justify-center w-full">
                    <div className="w-[60px] h-[60px] rounded-full md:bg-dark-800 border-2 border-dark-900 p-2 flex items-center justify-center transform rotate-90 md:rotate-0">
                      <ArrowRightIcon width={24} height={24} className="text-high-emphesis" />
                    </div>
                  </div>
                  <div className="w-full md:w-2/5 md:ml-2">
                    <BalancePanel
                      label={i18n._(t`To`)}
                      value={outputValue}
                      token={tokens?.outputToken}
                      symbol={general?.outputSymbol}
                      balance={balances?.outputTokenBalance}
                      field={Field.OUTPUT}
                    />
                  </div>
                </div>
                <InariButton color="gradient" className="font-bold">
                  Execute
                </InariButton>
                <div className="relative mt-0 -m-5 rounded-b p-7 bg-dark-700">
                  <InariDescription />
                </div>
              </div>
            </DoubleGlowShadow>
          </div>
        </div>
      </Container>
    </>
  )
}

Inari.Guard = NetworkGuard(Feature.INARI)

export default Inari
