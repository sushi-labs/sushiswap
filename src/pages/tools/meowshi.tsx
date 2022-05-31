import { ArrowDownIcon, InformationCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, Currency, SUSHI, Token } from '@sushiswap/core-sdk'
import Container from 'app/components/Container'
import Typography from 'app/components/Typography'
import { MEOW, XSUSHI } from 'app/config/tokens'
import { Feature } from 'app/enums'
import CurrencyInputPanel from 'app/features/meowshi/CurrencyInputPanel'
import HeaderToggle from 'app/features/meowshi/HeaderToggle'
import MeowshiButton from 'app/features/meowshi/MeowshiButton'
import { e10 } from 'app/functions'
import NetworkGuard from 'app/guards/Network'
import useMeowshiPerXSushi from 'app/hooks/useMeowshiPerXSushi'
import useSushiPerXSushi from 'app/hooks/useXSushiPerSushi'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export interface MeowshiState {
  currencies: {
    [Field.INPUT]: Token
    [Field.OUTPUT]: Token
  }
  setCurrency: (x: Token, field: Field) => void
  fields: {
    independentField: Field
    [Field.INPUT]: string | null
    [Field.OUTPUT]: string | null
  }
  handleInput: (x: string, field: Field) => void
  switchCurrencies: () => void
  meow: boolean
}

export default function Meowshi() {
  const { i18n } = useLingui()
  const sushiPerXSushi = useSushiPerXSushi()
  const [meowshiPerXSushi, xSushiPerMeowshi] = useMeowshiPerXSushi()

  const [fields, setFields] = useState({
    independentField: Field.INPUT,
    [Field.INPUT]: '',
    [Field.OUTPUT]: '',
  })

  const [currencies, setCurrencies] = useState({
    [Field.INPUT]: SUSHI[ChainId.ETHEREUM],
    [Field.OUTPUT]: MEOW,
  })

  const handleInput = useCallback(
    async (val, field) => {
      setFields((prevState) => {
        const inputRate =
          currencies[Field.INPUT] === XSUSHI
            ? meowshiPerXSushi.mul(e10(5))
            : meowshiPerXSushi.mul(e10(5)).mulDiv(e10(18), sushiPerXSushi.toString().toBigNumber(18))
        const outputRate =
          currencies[Field.OUTPUT] === XSUSHI
            ? xSushiPerMeowshi.div(e10(5))
            : xSushiPerMeowshi.mulDiv(sushiPerXSushi.toString().toBigNumber(18), e10(18)).div(e10(5))

        if (field === Field.INPUT) {
          if (currencies[Field.OUTPUT] === MEOW) {
            return {
              independentField: Field.INPUT,
              [Field.INPUT]: val || prevState[Field.INPUT],
              [Field.OUTPUT]: inputRate.mulDiv((val || prevState[Field.INPUT]).toBigNumber(18), e10(18))?.toFixed(18),
            }
          } else {
            return {
              independentField: Field.INPUT,
              [Field.INPUT]: val || prevState[Field.INPUT],
              [Field.OUTPUT]: outputRate.mulDiv((val || prevState[Field.INPUT]).toBigNumber(18), e10(18))?.toFixed(18),
            }
          }
        } else {
          if (currencies[Field.OUTPUT] === MEOW) {
            return {
              independentField: Field.OUTPUT,
              [Field.INPUT]: (val || prevState[Field.OUTPUT]).toBigNumber(18).mulDiv(e10(18), inputRate)?.toFixed(18),
              [Field.OUTPUT]: val || prevState[Field.OUTPUT],
            }
          } else {
            return {
              independentField: Field.OUTPUT,
              [Field.INPUT]: (val || prevState[Field.OUTPUT]).toBigNumber(18).mulDiv(e10(18), outputRate)?.toFixed(18),
              [Field.OUTPUT]: val || prevState[Field.OUTPUT],
            }
          }
        }
      })
    },
    [currencies, meowshiPerXSushi, sushiPerXSushi, xSushiPerMeowshi]
  )

  const setCurrency = useCallback((currency: Currency, field: Field) => {
    setCurrencies((prevState) => ({
      ...prevState,
      [field]: currency,
    }))
  }, [])

  useEffect(() => {
    handleInput(null, fields.independentField)
  }, [fields.independentField, handleInput])

  const switchCurrencies = useCallback(() => {
    // @ts-ignore TYPE NEEDS FIXING
    setCurrencies((prevState) => ({
      [Field.INPUT]: prevState[Field.OUTPUT],
      [Field.OUTPUT]: prevState[Field.INPUT],
    }))
  }, [])

  const meowshiState = useMemo<MeowshiState>(
    () => ({
      // @ts-ignore TYPE NEEDS FIXING
      currencies,
      setCurrency,
      switchCurrencies,
      fields,
      meow: currencies[Field.OUTPUT]?.symbol === 'MEOW',
      handleInput,
    }),
    [currencies, fields, handleInput, setCurrency, switchCurrencies]
  )

  return (
    <Container id="meowshi-page" className="py-4 md:py-8 lg:py-12" maxWidth="2xl">
      <NextSeo title={`Meowshi`} />

      <div className="z-0 relative mb-[-38px] md:mb-[-54px] ml-0 md:ml-4 flex justify-between gap-6 items-center">
        <div className="min-w-[168px] hidden md:block">
          <Image src="https://app.sushi.com/images/meowshi/neon-cat.png" alt="neon-cat" width="168px" height="168px" />
        </div>

        <div className="bg-[rgba(255,255,255,0.04)] p-4 py-2 rounded flex flex-row items-center gap-4 mb-[54px]">
          <InformationCircleIcon width={48} height={48} color="pink" />
          <Typography variant="xs" weight={700}>
            {i18n._(t`MEOW tokens wrap xSUSHI into BentoBox for double yields and can be
              used to vote in special MEOW governor contracts.`)}
          </Typography>
        </div>
      </div>
      <div className="relative grid gap-4 p-4 border-2 rounded z-1 bg-dark-900 shadow-swap border-dark-800">
        <HeaderToggle meowshiState={meowshiState} />
        <CurrencyInputPanel field={Field.INPUT} showMax={true} meowshiState={meowshiState} />
        <div className="relative mt-[-24px] mb-[-24px] ml-[28px] flex items-center">
          <div
            className="inline-flex p-2 border-2 rounded-full cursor-pointer border-dark-900 bg-dark-800"
            onClick={switchCurrencies}
          >
            <ArrowDownIcon width={24} height={24} />
          </div>
          <Typography variant="sm" className="text-secondary ml-[26px]">
            {currencies[Field.INPUT]?.symbol} →{' '}
            {(currencies[Field.INPUT] === SUSHI[ChainId.ETHEREUM] ||
              currencies[Field.OUTPUT] === SUSHI[ChainId.ETHEREUM]) &&
              ' xSUSHI → '}
            {currencies[Field.OUTPUT]?.symbol}
          </Typography>
        </div>
        <CurrencyInputPanel field={Field.OUTPUT} showMax={false} meowshiState={meowshiState} />
        <MeowshiButton meowshiState={meowshiState} />
      </div>
    </Container>
  )
}

Meowshi.Guard = NetworkGuard(Feature.MEOWSHI)
