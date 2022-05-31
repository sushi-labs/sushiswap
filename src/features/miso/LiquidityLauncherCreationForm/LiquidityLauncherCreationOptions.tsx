import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from '@sushiswap/core-sdk'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import Typography from 'app/components/Typography'
import useAuction from 'app/features/miso/context/hooks/useAuction'
import LiquidityLauncherCreationLockupField from 'app/features/miso/LiquidityLauncherCreationForm/LiquidityLauncherCreationLockupField'
import React, { FC } from 'react'
import { useWatch } from 'react-hook-form'

interface LiquidityLauncherCreationOptionsProps {}

const LiquidityLauncherCreationOptions: FC<LiquidityLauncherCreationOptionsProps> = ({}) => {
  const { i18n } = useLingui()
  const [auctionAddress, liqPercentage] = useWatch({ name: ['auctionAddress', 'liqPercentage'] })
  const { auction } = useAuction(auctionAddress)

  return (
    <Form.Section className="pt-8" columns={4} header={<Form.Section.Header header={i18n._(t`Liquidity Options`)} />}>
      <div className="col-span-4">
        <LiquidityLauncherCreationLockupField />
      </div>

      <div className="col-span-4">
        <Form.TextField
          endIcon={
            <Typography variant="sm" weight={700} className="text-secondary">
              %
            </Typography>
          }
          name="liqPercentage"
          label={i18n._(t`Liquidity Launch Percentage*`)}
          placeholder="50"
          helperText={i18n._(
            t`The amount raised from the auction, pairing with tokens to be launched on SushiSwap with equal weighting in the liquidity pool.`
          )}
        />
      </div>

      {auction && (
        <div className="col-span-4">
          <Typography weight={700}>{i18n._(t`Liquidity Pair`)}</Typography>
          <Typography className="mt-2">
            {auction.totalTokens?.multiply(new Percent(liqPercentage, '100')).toSignificant(6)}{' '}
            {auction.auctionToken.symbol} + {new Percent(liqPercentage, '100').toSignificant(6)}% of auction proceeds in{' '}
            {auction.paymentToken.symbol}
          </Typography>
          <FormFieldHelperText>
            {i18n._(t`Liquidity pair token is set to the payment currency from your auction.`)}
          </FormFieldHelperText>
        </div>
      )}
    </Form.Section>
  )
}

export default LiquidityLauncherCreationOptions
