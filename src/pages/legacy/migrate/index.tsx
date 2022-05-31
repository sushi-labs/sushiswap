import { formatUnits, parseUnits } from '@ethersproject/units'
import { ChevronDownIcon, XIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, JSBI } from '@sushiswap/core-sdk'
import Back from 'app/components/Back'
import Chip from 'app/components/Chip'
import { USER_REJECTED_TX } from 'app/services/web3/WalletError'
import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'

import Button from '../../../components/Button'
import Container from '../../../components/Container'
import Dots from '../../../components/Dots'
import DoubleCurrencyLogo from '../../../components/DoubleLogo'
import Empty from '../../../components/Empty'
import Input from '../../../components/Input'
import Typography from '../../../components/Typography'
import Web3Connect from '../../../components/Web3Connect'
import LPToken from '../../../features/migration/LPToken'
import MetamaskError from '../../../features/migration/MetamaskError'
import useMigrateState, { MigrateState } from '../../../features/migration/useMigrateState'
import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import { useSushiRollContract } from '../../../hooks/useContract'
import { useActiveWeb3React } from '../../../services/web3'

const ZERO = JSBI.BigInt(0)

const AmountInput = ({ state }: { state: MigrateState }) => {
  const { i18n } = useLingui()
  const onPressMax = useCallback(() => {
    if (state.selectedLPToken) {
      state.setAmount(formatUnits(state.selectedLPToken.balance.quotient.toString(), state.selectedLPToken.decimals))
    }
  }, [state])

  useEffect(() => {
    if (state.lpTokens.length === 0 || !state.selectedLPToken) {
      state.setAmount('')
    }
  }, [state])

  if (!state.lpTokens.length) {
    return null
  }

  if (!state.selectedLPToken) {
    return (
      <>
        <div className="p-3 text-center rounded cursor-not-allowed bg-dark-800">
          <Typography variant="lg" className="text-secondary">
            {state.lpTokens.length === 0 ? 'No LP tokens found' : 'Select an LP Token'}
          </Typography>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex justify-between">
        <div className="text-sm text-secondary">
          {i18n._(t`Balance`)}: <span className="text-primary">{state.selectedLPToken.balance.toSignificant(4)}</span>
        </div>
      </div>
      <div className="relative flex items-center w-full mb-4">
        <Input.Numeric
          className="w-full p-3 rounded bg-dark-700 focus:ring focus:ring-pink"
          value={state.amount}
          onUserInput={(val: string) => state.setAmount(val)}
        />
        <Button
          variant="outlined"
          color="pink"
          size="xs"
          onClick={onPressMax}
          className="absolute right-4 focus:ring focus:ring-pink"
        >
          {i18n._(t`MAX`)}
        </Button>
      </div>
    </>
  )
}

interface PositionCardProps {
  lpToken: LPToken
  onToggle: (lpToken: LPToken) => void
  isSelected: boolean
  updating: boolean
  exchange: string | undefined
}

const LPTokenSelect = ({ lpToken, onToggle, isSelected, updating, exchange }: PositionCardProps) => {
  return (
    <div
      key={lpToken.address}
      className="flex items-center justify-between px-3 py-5 rounded cursor-pointer bg-dark-800 hover:bg-dark-700"
      onClick={() => onToggle(lpToken)}
    >
      <div className="flex items-center space-x-3">
        <DoubleCurrencyLogo currency0={lpToken.tokenA} currency1={lpToken.tokenB} size={20} />
        <Typography
          variant="lg"
          className="text-primary"
        >{`${lpToken.tokenA.symbol}/${lpToken.tokenB.symbol}`}</Typography>
        {lpToken.dex && <Chip color="purple" label={lpToken.dex} />}
      </div>
      {isSelected ? <XIcon width={16} height={16} /> : <ChevronDownIcon width={16} height={16} />}
    </div>
  )
}

const MigrateButtons = ({ state, exchange }: { state: MigrateState; exchange: string | undefined }) => {
  const { i18n } = useLingui()

  const [error, setError] = useState<MetamaskError>({})
  const sushiRollContract = useSushiRollContract(state.selectedLPToken?.dex)
  // console.log(
  //   'sushiRollContract address',
  //   sushiRollContract?.address,
  //   state.selectedLPToken?.balance,
  //   state.selectedLPToken?.version
  // )

  const [approval, approve] = useApproveCallback(state.selectedLPToken?.balance, sushiRollContract?.address)
  const noLiquidityTokens = !!state.selectedLPToken?.balance && state.selectedLPToken?.balance.equalTo(ZERO)

  useEffect(() => {
    setError({})
  }, [state.selectedLPToken])

  if (!state.selectedLPToken) return null

  const insufficientAmount = JSBI.lessThan(
    state.selectedLPToken.balance.quotient,
    JSBI.BigInt(parseUnits(state.amount || '0', state.selectedLPToken.decimals).toString())
  )

  const onPress = async () => {
    setError({})
    try {
      console.log('onMigrate')
      await state.onMigrate()
    } catch (error) {
      console.log(error)
      // @ts-ignore TYPE NEEDS FIXING
      setError(error)
    }
  }

  return (
    <div className="space-y-4">
      {insufficientAmount ? (
        <div className="text-sm text-primary">{i18n._(t`Insufficient Balance`)}</div>
      ) : state.loading ? (
        <Dots>{i18n._(t`Loading`)}</Dots>
      ) : (
        <>
          <Button
            fullWidth
            loading={approval === ApprovalState.PENDING}
            onClick={approve}
            disabled={approval !== ApprovalState.NOT_APPROVED}
          >
            {approval === ApprovalState.APPROVED ? i18n._(t`Approved`) : i18n._(t`Approve`)}
          </Button>
          {approval === ApprovalState.APPROVED && (
            <Button
              fullWidth
              loading={state.isMigrationPending}
              disabled={noLiquidityTokens || state.isMigrationPending || !state.amount}
              onClick={onPress}
            >
              {i18n._(t`Migrate`)}
            </Button>
          )}
        </>
      )}

      {error.message && error.code !== USER_REJECTED_TX && (
        <div className="font-medium text-center text-red">{error.message}</div>
      )}
      <div className="text-sm text-center text-low-emphesis">
        {i18n._(
          t`Your ${exchange} ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol} liquidity will become SushiSwap ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol} liquidity.`
        )}
      </div>
    </div>
  )
}

const ExchangeLiquidityPairs = ({ state, exchange }: { state: MigrateState; exchange: undefined | string }) => {
  const { i18n } = useLingui()

  function onToggle(lpToken: LPToken) {
    state.setSelectedLPToken(state.selectedLPToken !== lpToken ? lpToken : undefined)
    state.setAmount('')
  }

  // if (!state.mode) {
  //   return null
  // }

  if (state.lpTokens.length === 0) {
    return <Empty>{i18n._(t`No Liquidity found`)}</Empty>
  }

  return (
    <>
      {state.lpTokens.reduce<JSX.Element[]>((acc, lpToken) => {
        if (lpToken.balance && JSBI.greaterThan(lpToken.balance.quotient, JSBI.BigInt(0))) {
          acc.push(
            <LPTokenSelect
              lpToken={lpToken}
              onToggle={onToggle}
              isSelected={state.selectedLPToken === lpToken}
              updating={state.updatingLPTokens}
              exchange={exchange}
            />
          )
        }
        return acc
      }, [])}
    </>
  )
}

export default function Migrate() {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()

  const state = useMigrateState()

  let exchange

  if (chainId === ChainId.ETHEREUM) {
    exchange = 'Uniswap'
  } else if (chainId === ChainId.BSC) {
    exchange = 'PancakeSwap'
  } else if (chainId === ChainId.MATIC) {
    exchange = 'QuickSwap'
  } else if (chainId === ChainId.FANTOM) {
    exchange = 'SpiritSwap or SpookySwap'
  }

  return (
    <Container id="migrate-page" className="py-4 space-y-6 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>Migrate | Sushi</title>
        <meta key="description" name="description" content="Migrate your liquidity to SushiSwap." />
        <meta key="twitter:description" name="twitter:description" content="Migrate your liquidity to SushiSwap." />
        <meta key="og:description" property="og:description" content="Migrate your liquidity to SushiSwap." />
      </Head>

      <div className="p-4 mb-3 space-y-3">
        <Back />

        <Typography component="h1" variant="h2">
          {i18n._(t`Migrate ${exchange} Liquidity`)}
        </Typography>
      </div>

      {!account ? (
        <Web3Connect className="w-full !bg-dark-900 bg-gradient-to-r from-pink/80 hover:from-pink to-purple/80 hover:to-purple text-white h-[38px]" />
      ) : (
        <div className="p-4 space-y-4 rounded bg-dark-900">
          {state.loading ? (
            <Typography variant="lg" className="p-4 text-center text-primary">
              <Dots>{i18n._(t`Loading your ${exchange} liquidity positions`)}</Dots>
            </Typography>
          ) : (
            <>
              {!state.loading && state.lpTokens.length > 0 && (
                <div>
                  <Typography variant="lg">{i18n._(t`Your Liquidity`)}</Typography>
                  <Typography variant="sm" className="text-secondary">
                    {t`Click on a pool below, input the amount you wish to migrate or select max, and click
                      migrate`}
                  </Typography>
                </div>
              )}
              <ExchangeLiquidityPairs state={state} exchange={exchange} />
              <AmountInput state={state} />
              {state.selectedLPToken && <MigrateButtons state={state} exchange={exchange} />}
            </>
          )}
        </div>
      )}
    </Container>
  )
}
