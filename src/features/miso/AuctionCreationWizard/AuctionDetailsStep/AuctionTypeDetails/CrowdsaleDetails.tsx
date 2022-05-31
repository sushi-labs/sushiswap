import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, NATIVE, Percent, Price, Token } from '@sushiswap/core-sdk'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import Typography from 'app/components/Typography'
import { useStore } from 'app/features/miso/context/store'
import { IAuctionDetails } from 'app/features/miso/context/store/createAuctionDetailsSlice'
import { useAuctionedToken } from 'app/features/miso/context/store/createTokenDetailsSlice'
import { tryParseAmount } from 'app/functions'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

const useAuctionData = () =>
  useStore(({ paymentCurrencyAddress, tokenAmount }) => ({
    paymentCurrencyAddress,
    tokenAmount,
  }))

const CrowdsaleDetails: FC = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const { paymentCurrencyAddress, tokenAmount } = useAuctionData()
  const paymentToken =
    useToken(paymentCurrencyAddress !== AddressZero ? paymentCurrencyAddress : undefined) ?? NATIVE[chainId || 1]
  const auctionToken = useAuctionedToken()

  const { watch } = useFormContext<IAuctionDetails>()
  const data = watch()

  let price: Price<Token, Currency> | undefined
  let amount: CurrencyAmount<Token> | undefined
  let base: CurrencyAmount<Currency> | undefined
  let quote: CurrencyAmount<Token> | undefined
  let minimumRaised: CurrencyAmount<Currency> | undefined
  let maximumRaised: CurrencyAmount<Currency> | undefined
  if (paymentToken && auctionToken && Number(data.fixedPrice) > 0) {
    base = tryParseAmount(data.fixedPrice?.toString(), paymentToken)
    quote = tryParseAmount('1', auctionToken)
    amount = tryParseAmount(tokenAmount?.toString(), auctionToken)

    if (base && quote) price = new Price({ baseAmount: quote, quoteAmount: base })
    if (price && amount) maximumRaised = price.quote(amount)
    if (
      maximumRaised &&
      data.minimumTarget &&
      Number.isInteger(Number(data.minimumTarget)) &&
      data.minimumTarget >= 1
    ) {
      minimumRaised = maximumRaised.multiply(new Percent(data.minimumTarget * 100, 10000))
    }
  }

  return (
    <>
      <div className="w-full md:w-1/2">
        <Form.TextField
          {...(paymentToken && {
            endIcon: (
              <Typography variant="sm" weight={700} className="text-secondary">
                {paymentToken.symbol}
              </Typography>
            ),
          })}
          name="fixedPrice"
          label={i18n._(t`Fixed price*`)}
          placeholder="0.00"
          helperText={i18n._(t`Price at which your tokens get sold`)}
        />
      </div>
      <div className="w-full md:w-1/2">
        <Form.TextField
          endIcon={
            <Typography variant="sm" weight={700} className="text-secondary">
              %
            </Typography>
          }
          name="minimumTarget"
          label={i18n._(t`Minimum percentage sold*`)}
          placeholder="50"
          helperText={i18n._(t`Percentage of tokens that has to sell for a successful auction`)}
        />
      </div>
      <div className="w-full md:w-1/2">
        <Typography weight={700}>{i18n._(t`Minimum raised`)}</Typography>
        <Typography className="mt-2">
          {minimumRaised ? minimumRaised.toSignificant(6) : '0.00'} {paymentToken?.symbol}{' '}
        </Typography>
        <FormFieldHelperText>
          {i18n._(
            t`Minimum amount in order to have a successful auction. If this value is not met, users can withdraw their committed payment token and no tokens will be sold`
          )}
        </FormFieldHelperText>
      </div>
      <div className="w-full md:w-1/2">
        <Typography weight={700}>{i18n._(t`Maximum raised`)}</Typography>
        <Typography className="mt-2">
          {maximumRaised ? maximumRaised.toSignificant(6) : '0.00'} {paymentToken?.symbol}{' '}
        </Typography>
        <FormFieldHelperText>
          {i18n._(
            t`Minimum amount in order to have a successful auction. If this value is not met, users can withdraw their committed payment token and no tokens will be sold`
          )}
        </FormFieldHelperText>
      </div>
    </>
  )
}

export default CrowdsaleDetails
