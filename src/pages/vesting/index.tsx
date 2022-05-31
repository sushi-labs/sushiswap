import { isAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { ArrowRightIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Container from 'app/components/Container'
import Dots from 'app/components/Dots'
import DoubleGlowShadow from 'app/components/DoubleGlowShadow'
import ExternalLink from 'app/components/ExternalLink'
import Loader from 'app/components/Loader'
import QuestionHelper from 'app/components/QuestionHelper'
import { Fraction } from 'app/entities'
import { Feature } from 'app/enums/Feature'
import BalancePanel from 'app/features/inari/BalancePanel'
import InariButton from 'app/features/inari/Button'
import InariDescription from 'app/features/inari/InariDescription'
import SideSwitch from 'app/features/inari/SideSwitch'
import StrategySelector from 'app/features/inari/StrategySelector'
import StrategyStepDisplay from 'app/features/inari/StrategyStepDisplay'
import { formatNumber } from 'app/functions/format'
import NetworkGuard from 'app/guards/Network'
import { useModalOpen, useToggleSelfClaimModal } from 'app/state/application/hooks'
import { ApplicationModal } from 'app/state/application/reducer'
import {
  useClaimCallback as useProtocolClaimCallback,
  useUserUnclaimedAmount as useUserUnclaimedProtocolAmount,
} from 'app/state/claim/protocol/hooks'
import { useClaimCallback, useUserUnclaimedAmount } from 'app/state/claim/weekly/hooks'
import { useDerivedInariState, useInariState, useSelectedInariStrategy } from 'app/state/inari/hooks'
import { Field } from 'app/state/inari/types'
import { useUserHasSubmittedClaim } from 'app/state/transactions/hooks'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

import { useActiveWeb3React } from '../../services/web3'

const Vesting = () => {
  const { i18n } = useLingui()
  const { inputValue, outputValue } = useInariState()
  const { tokens, general } = useDerivedInariState()
  const { balances } = useSelectedInariStrategy()

  return (
    <>
      <NextSeo title={`Vesting`} />
      <Container maxWidth="5xl" className="flex flex-col gap-8 px-4 py-8">
        <div className="flex items-center gap-8">
          <VestingLayout />
        </div>
        <div className="grid grid-cols-12 space-y-10 md:gap-10 md:space-y-0">
          <div className="col-span-12 md:col-span-3">
            <div className="flex flex-col gap-5">
              <StrategySelector />
              <Link href={'/tools/meowshi'}>
                <a
                  className={`bg-dark-900 cursor-pointer border border-transparent pl-5 py-2 rounded whitespace-nowrap w-full font-bold h-[48px] flex items-center text-sm`}
                >
                  {'SUSHI → MEOW'}
                </a>
              </Link>
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

const VestingLayout = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-col w-full space-y-4 md:flex-row md:space-x-8 md:space-y-0">
      <div className="hidden space-y-10 md:block">
        <div className="relative w-full p-4 overflow-hidden rounded bg-dark-900">
          <div className="font-bold text-white">{i18n._(t`Community Approval`)}</div>
          <div
            className="pt-2 text-sm font-bold text-gray-400"
            style={{
              maxWidth: '300px',
              minHeight: '150px',
            }}
          >
            <>
              {i18n._(t`Vesting is executed within the guidelines selected by the community in`)}{' '}
              <ExternalLink href="https://snapshot.org/#/sushi/proposal/QmPwBGy98NARoEcUfuWPgzMdJdiaZub1gVic67DcSs6NZQ">
                SIMP3
              </ExternalLink>
              .
              <br />
              <br />
              {i18n._(t`Please refer to the`)}{' '}
              <ExternalLink href="https://forum.sushiswapclassic.org/t/simp-3-vesting-and-the-future-of-sushiswap/1794">
                {i18n._(t`forum discussion`)}
              </ExternalLink>{' '}
              {i18n._(t`for deliberations on additional points.`)}
              <br />
              <br />
              {i18n._(t`Additional records and weekly merkle updates can be found on`)}{' '}
              <ExternalLink href="https://github.com/sushiswap/sushi-vesting">GitHub</ExternalLink>
            </>
          </div>
        </div>
      </div>
      <WeeklyVesting />
      <ProtocolVesting />
    </div>
  )
}

const ProtocolVesting = () => {
  const { i18n } = useLingui()

  const isOpen = useModalOpen(ApplicationModal.SELF_CLAIM)
  const toggleClaimModal = useToggleSelfClaimModal()

  const { account } = useActiveWeb3React()
  const [attempting, setAttempting] = useState<boolean>(false)
  const { claimCallback } = useProtocolClaimCallback(account)
  const unclaimedAmount: CurrencyAmount<Currency> | undefined = useUserUnclaimedProtocolAmount(account)
  const { claimSubmitted } = useUserHasSubmittedClaim(account ?? undefined)
  const claimConfirmed = false

  function onClaim() {
    setAttempting(true)
    claimCallback()
      // reset modal and log error
      .catch((error) => {
        setAttempting(false)
        console.log(error)
      })
  }

  // once confirmed txn is found, if modal is closed open, mark as not attempting regradless
  useEffect(() => {
    if (claimConfirmed && claimSubmitted && attempting) {
      setAttempting(false)
      if (!isOpen) {
        toggleClaimModal()
      }
    }
  }, [attempting, claimConfirmed, claimSubmitted, isOpen, toggleClaimModal])

  const [totalLocked, setTotalLocked] = useState<string>()
  useEffect(() => {
    const fetchLockup = async () => {
      if (account) {
        fetch(
          'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/amounts-protocols-10959148-12171394.json'
        )
          .then((response) => response.json())
          .then((data) => {
            // console.log('vesting:', data)
            const userLockedAmount = data[account.toLowerCase()] ? data[account.toLowerCase()] : '0'
            const userLocked = Fraction.from(BigNumber.from(userLockedAmount), BigNumber.from(10).pow(18)).toString()
            setTotalLocked(userLocked)
            // console.log('userLocked:', userLocked)
          })
          .catch((error) => {
            console.log(error)
          })
      }
      return []
    }
    fetchLockup()
  }, [account])

  // remove once treasury signature passed
  const pendingTreasurySignature = false

  return (
    <div className="flex flex-col gap-3 md:max-w-[400px]">
      <div className="relative w-full h-full overflow-hidden rounded bg-dark-900">
        <div className="flex flex-col gap-3 p-4">
          <div className="flex flex-row justify-between">
            <div className="font-bold text-white">{i18n._(t`Claimable SUSHI from Protocols`)}</div>
            <QuestionHelper text="If you participated in staking progammes from Alpha Homora, Cream, DefiDollar, Dracula, Harvest, Pickle, Yam, or Badger you can claim your vested SUSHI directly here" />
          </div>
          {/* <div style={{ display: 'flex', alignItems: 'baseline' }}> */}
          <div className="flex flex-col items-baseline pb-4">
            <div className="font-bold text-white text-[36px]">
              {unclaimedAmount?.toFixed(4, { groupSeparator: ',' } ?? {})}
            </div>
            {account ? (
              <div className="text-sm text-secondary">
                {totalLocked ? (
                  i18n._(t`Historical Total Locked: ${formatNumber(totalLocked)} SUSHI`)
                ) : (
                  <Dots>{i18n._(t`Historical Total Locked: Fetching Total`)}</Dots>
                )}
              </div>
            ) : (
              <div className="text-sm text-secondary">{i18n._(t`Historical Total Locked: Connect Wallet`)}</div>
            )}
          </div>

          <Button
            color={
              !isAddress(account ?? '') ||
              claimConfirmed ||
              !unclaimedAmount ||
              Number(unclaimedAmount?.toFixed(8)) <= 0 ||
              pendingTreasurySignature
                ? 'gray'
                : 'gradient'
            }
            disabled={
              !isAddress(account ?? '') ||
              claimConfirmed ||
              !unclaimedAmount ||
              Number(unclaimedAmount?.toFixed(8)) <= 0 ||
              pendingTreasurySignature
            }
            size="default"
            onClick={onClaim}
            className="inline-flex items-center justify-center"
          >
            {pendingTreasurySignature ? (
              <Dots>{i18n._(t`Pending Treasury Transfer`)}</Dots>
            ) : (
              <> {claimConfirmed ? i18n._(t`Claimed`) : i18n._(t`Claim SUSHI`)}</>
            )}

            {attempting && (
              <Loader
                stroke="white"
                style={{
                  marginLeft: '10px',
                }}
              />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

const WeeklyVesting = () => {
  const { i18n } = useLingui()

  const isOpen = useModalOpen(ApplicationModal.SELF_CLAIM)
  const toggleClaimModal = useToggleSelfClaimModal()

  const { account } = useActiveWeb3React()
  const [attempting, setAttempting] = useState<boolean>(false)
  const { claimCallback } = useClaimCallback(account)
  const unclaimedAmount: CurrencyAmount<Currency> | undefined = useUserUnclaimedAmount(account)
  const { claimSubmitted } = useUserHasSubmittedClaim(account ?? undefined)
  const claimConfirmed = false

  function onClaim() {
    setAttempting(true)
    claimCallback()
      // reset modal and log error
      .catch((error) => {
        setAttempting(false)
        console.log(error)
      })
  }

  // once confirmed txn is found, if modal is closed open, mark as not attempting regradless
  useEffect(() => {
    if (claimConfirmed && claimSubmitted && attempting) {
      setAttempting(false)
      if (!isOpen) {
        toggleClaimModal()
      }
    }
  }, [attempting, claimConfirmed, claimSubmitted, isOpen, toggleClaimModal])

  const [totalLocked, setTotalLocked] = useState<string>()
  useEffect(() => {
    const fetchLockup = async () => {
      if (account) {
        fetch('https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/amounts-10959148-12171394.json')
          .then((response) => response.json())
          .then((data) => {
            // console.log('vesting:', data)
            const userLockedAmount = data[account.toLowerCase()] ? data[account.toLowerCase()] : '0'
            const userLocked = Fraction.from(BigNumber.from(userLockedAmount), BigNumber.from(10).pow(18)).toString()
            setTotalLocked(userLocked)
            // console.log('userLocked:', userLocked)
          })
          .catch((error) => {
            console.log(error)
          })
      }
      return []
    }
    fetchLockup()
  }, [account])

  // remove once treasury signature passed
  const pendingTreasurySignature = false

  let vault = ''
  if (!pendingTreasurySignature && Number(unclaimedAmount?.toFixed(8)) > 0) {
    vault = 'https://raw.githubusercontent.com/sushiswap/sushi-content/master/images/sushi-vault-reverse.png'
  } else if (!pendingTreasurySignature && Number(unclaimedAmount?.toFixed(8)) <= 0) {
    vault = 'https://raw.githubusercontent.com/sushiswap/sushi-content/master/images/vesting-safe-off.png'
  } else if (pendingTreasurySignature) {
    vault = 'https://raw.githubusercontent.com/sushiswap/sushi-content/master/images/vesting-safe-closed.png'
  }

  return (
    <div className="flex flex-col gap-3 md:max-w-[400px]">
      <div className="relative w-full h-full overflow-hidden rounded bg-dark-900">
        <div className="flex flex-col gap-3 p-4">
          <div className="flex flex-row justify-between">
            <div className="font-bold text-white">{i18n._(t`Your Claimable SUSHI this Week`)}</div>
            <QuestionHelper text="Your Vested SUSHI will be released each week for the next 6 months. The amount released each week is determined by your historical farming rewards. You do not need to harvest each week as unclaimed amounts from each week will continue to accrue onto the next." />
          </div>
          {/* <div style={{ display: 'flex', alignItems: 'baseline' }}> */}
          <div className="flex flex-col items-baseline pb-4">
            <div className="font-bold text-white text-[36px]">
              {unclaimedAmount?.toFixed(4, { groupSeparator: ',' } ?? {})}
            </div>
            {account ? (
              <div className="text-sm text-secondary">
                {totalLocked ? (
                  i18n._(t`Historical Total Locked: ${formatNumber(totalLocked)} SUSHI`)
                ) : (
                  <Dots>{i18n._(t`Historical Total Locked: Fetching Total`)}</Dots>
                )}
              </div>
            ) : (
              <div className="text-sm text-secondary">{i18n._(t`Historical Total Locked: Connect Wallet`)}</div>
            )}
          </div>

          <Button
            color={
              !isAddress(account ?? '') ||
              claimConfirmed ||
              !unclaimedAmount ||
              Number(unclaimedAmount?.toFixed(8)) <= 0 ||
              pendingTreasurySignature
                ? 'gray'
                : 'gradient'
            }
            disabled={
              !isAddress(account ?? '') ||
              claimConfirmed ||
              !unclaimedAmount ||
              Number(unclaimedAmount?.toFixed(8)) <= 0 ||
              pendingTreasurySignature
            }
            size="default"
            onClick={onClaim}
            className="inline-flex items-center justify-center"
          >
            {pendingTreasurySignature ? (
              <Dots>{i18n._(t`Pending Treasury Transfer`)}</Dots>
            ) : (
              <> {claimConfirmed ? i18n._(t`Claimed`) : i18n._(t`Claim SUSHI`)}</>
            )}

            {attempting && (
              <Loader
                stroke="white"
                style={{
                  marginLeft: '10px',
                }}
              />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

Vesting.Guard = NetworkGuard(Feature.VESTING)

export default Vesting
