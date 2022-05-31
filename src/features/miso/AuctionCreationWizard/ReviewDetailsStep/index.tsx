import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, NATIVE, Percent, Price, Token } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import { auctionDetailsSchema } from 'app/features/miso/AuctionCreationWizard/AuctionDetailsStep'
import { generalDetailsSchema } from 'app/features/miso/AuctionCreationWizard/GeneralDetailsStep'
import { liquidityLauncherSchema } from 'app/features/miso/AuctionCreationWizard/LiquidityLauncherStep'
import { tokenSchema } from 'app/features/miso/AuctionCreationWizard/TokenCreationStep'
import { whitelistSchema } from 'app/features/miso/AuctionCreationWizard/WhitelistDetailsStep'
import useAuctionTemplateMap from 'app/features/miso/context/hooks/useAuctionTemplateMap'
import useTokenTemplateMap from 'app/features/miso/context/hooks/useTokenTemplateMap'
import { useStore } from 'app/features/miso/context/store'
import { useAuctionedToken } from 'app/features/miso/context/store/createTokenDetailsSlice'
import { AuctionTemplate, TokenSetup } from 'app/features/miso/context/types'
import { classNames, tryParseAmount } from 'app/functions'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, ReactNode, useMemo } from 'react'

interface Item {
  title: string
  value: any
}

const Table: FC<{ title: string; className?: string }> = ({ children, title, className }) => {
  return (
    <div
      className={classNames(
        className,
        'flex flex-col gap-4 p-4 rounded-2xl border border-dark-800 divide-y divide-dark-900'
      )}
    >
      <Typography weight={700}>{title}</Typography>
      <div className="flex gap-20 pt-4 overflow-auto">{children}</div>
    </div>
  )
}

const Item: FC<Item> = ({ title, value }) => {
  return (
    <div className="flex flex-col gap-1">
      <Typography variant="sm" className="whitespace-nowrap">
        {title}
      </Typography>
      <Typography variant="sm" weight={700} className="whitespace-nowrap">
        {value}
      </Typography>
    </div>
  )
}

const ReviewDetailsStep: FC<{ children(isValid: boolean): ReactNode }> = ({ children }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const state = useStore((state) => state)
  const auctionToken = useAuctionedToken()
  const paymentToken =
    useToken(state.paymentCurrencyAddress !== AddressZero ? state.paymentCurrencyAddress : undefined) ??
    NATIVE[chainId || 1]
  const { templateIdToLabel: auctionTemplateIdToLabel } = useAuctionTemplateMap()
  const { templateIdToLabel } = useTokenTemplateMap()

  const isValid = useMemo(
    () =>
      tokenSchema.isValidSync(state) &&
      generalDetailsSchema.isValidSync(state) &&
      auctionDetailsSchema.isValidSync(state) &&
      liquidityLauncherSchema(state.tokenAmount, state.tokenSymbol).isValidSync(state) &&
      whitelistSchema.isValidSync(state),
    [state]
  )

  let price: Price<Token, Currency> | undefined
  let startPrice: Price<Token, Currency> | undefined
  let endPrice: Price<Token, Currency> | undefined
  let amount: CurrencyAmount<Token> | undefined
  let base: CurrencyAmount<Currency> | undefined
  let startBase: CurrencyAmount<Currency> | undefined
  let endBase: CurrencyAmount<Currency> | undefined
  let quote: CurrencyAmount<Token> | undefined
  let minimumRaised: CurrencyAmount<Currency> | undefined
  let maximumRaised: CurrencyAmount<Currency> | undefined

  if (
    paymentToken &&
    auctionToken &&
    Number(state.startPrice) > 0 &&
    state.auctionType === AuctionTemplate.DUTCH_AUCTION
  ) {
    startBase = tryParseAmount(state.startPrice?.toString(), paymentToken)
    quote = tryParseAmount('1', auctionToken)
    amount = tryParseAmount(state.tokenAmount?.toString(), auctionToken)

    if (startBase && quote) startPrice = new Price({ baseAmount: quote, quoteAmount: startBase })
    if (startPrice && amount) maximumRaised = startPrice.quote(amount)
  }

  if (
    paymentToken &&
    auctionToken &&
    Number(state.endPrice) > 0 &&
    state.auctionType === AuctionTemplate.DUTCH_AUCTION
  ) {
    endBase = tryParseAmount(state.endPrice?.toString(), paymentToken)
    quote = tryParseAmount('1', auctionToken)
    amount = tryParseAmount(state.tokenAmount?.toString(), auctionToken)
    if (endBase && quote) endPrice = new Price({ baseAmount: quote, quoteAmount: endBase })
    if (endPrice && amount) minimumRaised = endPrice.quote(amount)
  }

  if (paymentToken && auctionToken && Number(state.fixedPrice) > 0 && state.auctionType === AuctionTemplate.CROWDSALE) {
    base = tryParseAmount(state.fixedPrice?.toString(), paymentToken)
    quote = tryParseAmount('1', auctionToken)
    amount = tryParseAmount(state.tokenAmount?.toString(), auctionToken)

    if (base && quote) price = new Price({ baseAmount: quote, quoteAmount: base })
    if (price && amount) maximumRaised = price.quote(amount)
    if (
      maximumRaised &&
      state.minimumTarget &&
      Number.isInteger(Number(state.minimumTarget)) &&
      state.minimumTarget >= 1
    ) {
      minimumRaised = maximumRaised.multiply(new Percent(state.minimumTarget * 100, 10000))
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <Table title={i18n._(t`Token Details`)}>
          {state.tokenSetupType === TokenSetup.CREATE && (
            <>
              <Item title={i18n._(t`Token Type`)} value={templateIdToLabel(state.tokenType)} />
              <Item title={i18n._(t`Token Name`)} value={state.tokenName} />
              <Item title={i18n._(t`Token Symbol`)} value={state.tokenSymbol} />
              <Item title={i18n._(t`Total Supply`)} value={state.tokenSupply} />
            </>
          )}
          {state.tokenSetupType === TokenSetup.PROVIDE && (
            <>
              <Item title={i18n._(t`Token Address`)} value={state.tokenAddress} />
              <Item title={i18n._(t`Token Name`)} value={auctionToken?.name} />
              <Item title={i18n._(t`Token Symbol`)} value={auctionToken?.symbol} />
            </>
          )}
          <Item title={i18n._(t`Tokens for Sale`)} value={state.tokenAmount} />
        </Table>
        <Table title={i18n._(t`General Details`)}>
          <Item title={i18n._(t`Payment Currency`)} value={paymentToken.name} />
          <Item
            title={i18n._(t`Start Date`)}
            value={`${new Date(state.startDate).toLocaleString('en-uS', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              timeZone: 'UTC',
            })} UTC`}
          />
          <Item
            title={i18n._(t`End Date`)}
            value={`${new Date(state.endDate).toLocaleString('en-uS', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              timeZone: 'UTC',
            })} UTC`}
          />
        </Table>
        <Table title={i18n._(t`Auction Details`)}>
          <Item title={i18n._(t`Auction Type`)} value={auctionTemplateIdToLabel(state.auctionType)} />
          {state.auctionType === AuctionTemplate.DUTCH_AUCTION && (
            <>
              <Item title={i18n._(t`Start Price`)} value={`${state.startPrice} ${paymentToken?.symbol}`} />
              <Item title={i18n._(t`End Price`)} value={`${state.endPrice} ${paymentToken?.symbol}`} />
              <Item
                title={i18n._(t`Raise Amount`)}
                value={`${minimumRaised?.toSignificant(6)} - ${maximumRaised?.toSignificant(6)} ${
                  maximumRaised?.currency.symbol
                }`}
              />
            </>
          )}
          {state.auctionType === AuctionTemplate.BATCH_AUCTION && (
            <Item title={i18n._(t`Minimum raise amount`)} value={`${state.minimumRaised} ${paymentToken?.symbol}`} />
          )}
          {state.auctionType === AuctionTemplate.CROWDSALE && (
            <>
              <Item title={i18n._(t`Fixed Price`)} value={`${state.fixedPrice} ${paymentToken?.symbol}`} />
              <Item title={i18n._(t`Minimum percentage sold`)} value={`${state.minimumTarget}%`} />
              <Item
                title={i18n._(t`Raise Amount`)}
                value={`${minimumRaised?.toSignificant(6)} - ${maximumRaised?.toSignificant(6)} ${
                  maximumRaised?.currency.symbol
                }`}
              />
            </>
          )}
        </Table>
        <div className="flex gap-4">
          <Table title={i18n._(t`Liquidity Provision`)} className={state.liqLauncherEnabled ? '' : 'opacity-40'}>
            <Item
              title={i18n._(t`Tokens for liquidity`)}
              value={
                state.liqLauncherEnabled ? (
                  `${state.tokenForLiquidity} ${auctionToken?.symbol}`
                ) : (
                  <span className="italic">Not enabled</span>
                )
              }
            />
            <Item
              title={i18n._(t`Lockup Period`)}
              value={
                state.liqLauncherEnabled ? `${state.liqLockTime} days` : <span className="italic">Not enabled</span>
              }
            />
          </Table>
          <Table title={i18n._(t`Whitelist`)} className={state.whitelistEnabled ? '' : 'opacity-40'}>
            <Item
              title={i18n._(t`Number of whitelisted addresses`)}
              value={
                state.whitelistEnabled ? (
                  `${state.whitelistAddresses.length} addresses`
                ) : (
                  <span className="italic">Not enabled</span>
                )
              }
            />
          </Table>
        </div>
      </div>
      <div className="flex gap-4">{children(isValid)}</div>
    </>
  )
}

export default ReviewDetailsStep
