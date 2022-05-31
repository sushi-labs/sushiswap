import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, NATIVE, Price, Token } from '@sushiswap/core-sdk'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import Typography from 'app/components/Typography'
import { AuctionCreationFormInput } from 'app/features/miso/AuctionCreationForm'
import { tryParseAmount } from 'app/functions'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

interface AuctionCreationFormDutchAuctionProps {}

const AuctionCreationFormDutchAuction: FC<AuctionCreationFormDutchAuctionProps> = ({}) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { watch } = useFormContext<AuctionCreationFormInput>()
  const data = watch()
  // @ts-ignore TYPE NEEDS FIXING
  const paymentToken = useToken(data.paymentCurrencyAddress) ?? NATIVE[chainId || 1]
  const auctionToken = useToken(data.token)

  let startPrice: Price<Token, Currency> | undefined
  let endPrice: Price<Token, Currency> | undefined
  let amount: CurrencyAmount<Token> | undefined
  let startBase: CurrencyAmount<Currency> | undefined
  let endBase: CurrencyAmount<Currency> | undefined
  let quote: CurrencyAmount<Token> | undefined
  let minimumRaised: CurrencyAmount<Currency> | undefined
  let maximumRaised: CurrencyAmount<Currency> | undefined
  if (paymentToken && auctionToken && Number(data.startPrice) > 0) {
    startBase = tryParseAmount(data.startPrice?.toString(), paymentToken)
    quote = tryParseAmount('1', auctionToken)
    amount = tryParseAmount(data.tokenAmount?.toString(), auctionToken)

    if (startBase && quote) startPrice = new Price({ baseAmount: quote, quoteAmount: startBase })
    if (startPrice && amount) maximumRaised = startPrice.quote(amount)
  }

  if (paymentToken && auctionToken && Number(data.endPrice) > 0) {
    endBase = tryParseAmount(data.endPrice?.toString(), paymentToken)
    quote = tryParseAmount('1', auctionToken)
    amount = tryParseAmount(data.tokenAmount?.toString(), auctionToken)
    if (endBase && quote) endPrice = new Price({ baseAmount: quote, quoteAmount: endBase })
    if (endPrice && amount) minimumRaised = endPrice.quote(amount)
  }

  return (
    <Form.Section
      columns={4}
      className="pt-8"
      header={<Form.Section.Header header={i18n._(t`Dutch Auction Details`)} />}
    >
      <div className="col-span-4 md:col-span-2">
        <Form.TextField
          {...(paymentToken && {
            endIcon: (
              <Typography variant="sm" weight={700} className="text-secondary">
                {paymentToken.symbol}
              </Typography>
            ),
          })}
          name="startPrice"
          label={i18n._(t`Start Price*`)}
          placeholder={`0.00`}
          helperText={i18n._(t`The price when the auction will start. This value must be higher than the end price`)}
        />
      </div>
      <div className="col-span-4 md:col-span-2">
        <Form.TextField
          {...(paymentToken && {
            endIcon: (
              <Typography variant="sm" weight={700} className="text-secondary">
                {paymentToken.symbol}
              </Typography>
            ),
          })}
          name="endPrice"
          label={i18n._(t`End Price*`)}
          placeholder={`0.00`}
          helperText={i18n._(t`The price when the auction will meet its end date`)}
        />
      </div>
      <div className="col-span-4 md:col-span-2">
        <Typography weight={700}>{i18n._(t`Minimum Raised`)}</Typography>
        <Typography className="mt-2">
          {minimumRaised ? minimumRaised.toSignificant(6) : '0.00'} {paymentToken?.symbol}
        </Typography>
        <FormFieldHelperText>
          {i18n._(
            t`Minimum amount in order to have a successful auction. If this value is not met, users can withdraw their committed payment token and no tokens will be sold`
          )}
        </FormFieldHelperText>
      </div>
      <div className="col-span-4 md:col-span-2">
        <Typography weight={700}>{i18n._(t`Maximum Raised`)}</Typography>
        <Typography className="mt-2">
          {maximumRaised ? maximumRaised?.toExact({}) : '0.00'} {paymentToken?.symbol}
        </Typography>
        <FormFieldHelperText>
          {i18n._(t`Maximum possible raised amount if all tokens were to be sold instantly at the starting price`)}
        </FormFieldHelperText>
      </div>
    </Form.Section>
  )
}

export default AuctionCreationFormDutchAuction
