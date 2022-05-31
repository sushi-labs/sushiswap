import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, JSBI, NATIVE, Token } from '@sushiswap/core-sdk'
import Alert from 'app/components/Alert'
import Back from 'app/components/Back'
import Button from 'app/components/Button'
import { AutoColumn } from 'app/components/Column'
import Container from 'app/components/Container'
import CurrencySelectPanel from 'app/components/CurrencySelectPanel'
import Dots from 'app/components/Dots'
import { MinimalPositionCard } from 'app/components/PositionCard'
import { AutoRow } from 'app/components/Row'
import Typography from 'app/components/Typography'
import Web3Connect from 'app/components/Web3Connect'
import { currencyId } from 'app/functions/currency'
import { PairState, useV2Pair } from 'app/hooks/useV2Pairs'
import { useActiveWeb3React } from 'app/services/web3'
import { usePairAdder } from 'app/state/user/hooks'
import { useTokenBalance } from 'app/state/wallet/hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useState } from 'react'
import { Plus } from 'react-feather'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

export default function PoolFinder() {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()

  const router = useRouter()

  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  // @ts-ignore TYPE NEEDS FIXING
  const [currency0, setCurrency0] = useState<Currency | null>(() => (chainId ? NATIVE[chainId] : null))
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = useV2Pair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.quotient, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.quotient, JSBI.BigInt(0))
    )

  const position: CurrencyAmount<Token> | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)

  const hasPosition = Boolean(position && JSBI.greaterThan(position.quotient, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const prerequisiteMessage = (
    <div className="p-5 text-center rounded bg-dark-800">{i18n._(t`Select a token to find your liquidity`)}</div>
  )

  return (
    <Container id="find-pool-page" className="py-4 space-y-6 md:py-8 lg:py-12" maxWidth="2xl">
      <NextSeo title={`Find Pool`} />
      <div className="p-4 mb-3 space-y-3">
        <Back />

        <Typography component="h1" variant="h2">
          {i18n._(t`Import Pool`)}
        </Typography>
      </div>
      <Alert
        message={
          <>
            <b>{i18n._(t`Tip:`)}</b>{' '}
            {i18n._(t`Use this tool to find pairs that don't automatically appear in the interface`)}
          </>
        }
        type="information"
      />
      <div className="relative p-4 space-y-4 rounded bg-dark-900 shadow-liquidity">
        <AutoColumn gap={'md'}>
          <CurrencySelectPanel
            currency={currency0}
            onClick={() => setActiveField(Fields.TOKEN0)}
            onCurrencySelect={handleCurrencySelect}
            otherCurrency={currency1}
            id="pool-currency-input"
          />
          <AutoColumn justify="space-between">
            <AutoRow justify={'flex-start'} style={{ padding: '0 1rem' }}>
              <button className="z-10 -mt-6 -mb-6 rounded-full bg-dark-900 p-3px">
                <div className="p-3 rounded-full bg-dark-800 hover:bg-dark-700">
                  <Plus size="32" />
                </div>
              </button>
            </AutoRow>
          </AutoColumn>
          <CurrencySelectPanel
            currency={currency1}
            onClick={() => setActiveField(Fields.TOKEN1)}
            onCurrencySelect={handleCurrencySelect}
            otherCurrency={currency0}
            id="pool-currency-output"
          />
        </AutoColumn>

        {currency0 && currency1 ? (
          pairState === PairState.EXISTS ? (
            hasPosition && pair ? (
              <MinimalPositionCard pair={pair} />
            ) : (
              <div className="p-5 rounded bg-dark-800">
                <AutoColumn gap="sm" justify="center">
                  {i18n._(t`You don’t have liquidity in this pool yet`)}
                  <Link href={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                    <a className="text-center text-blue text-opacity-80 hover:text-opacity-100">
                      {i18n._(t`Add liquidity`)}
                    </a>
                  </Link>
                </AutoColumn>
              </div>
            )
          ) : validPairNoLiquidity ? (
            <div className="p-5 rounded bg-dark-800">
              <AutoColumn gap="sm" justify="center">
                {i18n._(t`No pool found`)}
                <Link href={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                  <a className="text-center">{i18n._(t`Create pool`)}</a>
                </Link>
              </AutoColumn>
            </div>
          ) : pairState === PairState.INVALID ? (
            <div className="p-5 text-center rounded bg-dark-800">{i18n._(t`Invalid pair`)}</div>
          ) : pairState === PairState.LOADING ? (
            <div className="p-5 text-center rounded bg-dark-800">
              <Dots>{i18n._(t`Loading`)}</Dots>
            </div>
          ) : null
        ) : !account ? (
          <Web3Connect className="w-full" size="lg" color="blue" />
        ) : (
          prerequisiteMessage
        )}

        {hasPosition && (
          <div className="rounded bg-dark-800">
            <AutoColumn gap="sm" justify="center">
              <Button
                color="blue"
                fullWidth={true}
                onClick={() => {
                  router.push(`/pool`)
                }}
              >
                {i18n._(t`Manage this pool`)}
              </Button>
            </AutoColumn>
          </div>
        )}
      </div>
    </Container>
  )
}
