import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, NATIVE, Percent, Price, Token } from '@sushiswap/core-sdk'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import Typography from 'app/components/Typography'
import { AuctionCreationFormInput } from 'app/features/miso/AuctionCreationForm'
import { tryParseAmount } from 'app/functions'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

interface AuctionCreationFormCrowdsaleProps {}

const AuctionCreationFormCrowdsale: FC<AuctionCreationFormCrowdsaleProps> = ({}) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { watch } = useFormContext<AuctionCreationFormInput>()
  const data = watch()
  // @ts-ignore TYPE NEEDS FIXING
  const paymentToken = useToken(data.paymentCurrencyAddress) ?? NATIVE[chainId || 1]
  const auctionToken = useToken(data.token)

  let price: Price<Token, Currency> | undefined
  let amount: CurrencyAmount<Token> | undefined
  let base: CurrencyAmount<Currency> | undefined
  let quote: CurrencyAmount<Token> | undefined
  let minimumRaised: CurrencyAmount<Currency> | undefined
  let maximumRaised: CurrencyAmount<Currency> | undefined
  if (paymentToken && auctionToken && Number(data.fixedPrice) > 0) {
    base = tryParseAmount(data.fixedPrice?.toString(), paymentToken)
    quote = tryParseAmount('1', auctionToken)
    amount = tryParseAmount(data.tokenAmount?.toString(), auctionToken)

    if (base && quote) price = new Price({ baseAmount: quote, quoteAmount: base })
    if (price && amount) maximumRaised = price.quote(amount)
    if (maximumRaised && data.minimumTarget)
      minimumRaised = maximumRaised.multiply(new Percent(data.minimumTarget, '100'))
  }

  return (
    <Form.Section columns={4} className="pt-8" header={<Form.Section.Header header={i18n._(t`Crowdsale Details`)} />}>
      <div className="col-span-4 md:col-span-2">
        <Form.TextField
          {...(paymentToken && {
            endIcon: (
              <Typography variant="sm" weight={700} className="text-secondary">
                {paymentToken.symbol}
              </Typography>
            ),
          })}
          name="fixedPrice"
          label={i18n._(t`Fixed Price*`)}
          placeholder="0.00"
          helperText={i18n._(t`Price at which your tokens get sold`)}
        />
      </div>
      <div className="col-span-4 md:col-span-2">
        <Form.TextField
          endIcon={
            <Typography variant="sm" weight={700} className="text-secondary">
              %
            </Typography>
          }
          name="minimumTarget"
          label={i18n._(t`Minimum Target Percentage*`)}
          placeholder="50"
          helperText={i18n._(t`Percentage of tokens that has to sell for a successful auction`)}
        />
      </div>
      <div className="col-span-4 md:col-span-2">
        <Typography weight={700}>{i18n._(t`Minimum Raised`)}</Typography>
        <Typography className="mt-2">
          {minimumRaised ? minimumRaised.toSignificant(6) : '0.00'} {paymentToken?.symbol}{' '}
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
          {maximumRaised ? maximumRaised.toSignificant(6) : '0.00'} {paymentToken?.symbol}{' '}
        </Typography>
        <FormFieldHelperText>
          {i18n._(
            t`Minimum amount in order to have a successful auction. If this value is not met, users can withdraw their committed payment token and no tokens will be sold`
          )}
        </FormFieldHelperText>
      </div>
    </Form.Section>
  )
}

export default AuctionCreationFormCrowdsale
