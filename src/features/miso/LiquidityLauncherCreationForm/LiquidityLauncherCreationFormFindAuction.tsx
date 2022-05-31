import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import loadingCircle from 'app/animation/loading-circle.json'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import Typography from 'app/components/Typography'
import useAuction from 'app/features/miso/context/hooks/useAuction'
import { useActiveWeb3React } from 'app/services/web3'
import Lottie from 'lottie-react'
import React, { FC } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

interface LiquidityLauncherCreationFormFindAuctionProps {}

const LiquidityLauncherCreationFormFindAuction: FC<LiquidityLauncherCreationFormFindAuctionProps> = ({}) => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const {
    setValue,
    formState: { errors },
  } = useFormContext()
  const [auctionAddress] = useWatch({ name: ['auctionAddress'] })
  const { auction, loading } = useAuction(auctionAddress)

  return (
    <Form.Section
      columns={4}
      header={
        <Form.Section.Header
          header={i18n._(t`General Details`)}
          subheader={i18n._(t`Automatically lock liquidity post-auction`)}
        />
      }
    >
      <div className="col-span-4">
        <Form.TextField
          name="adminAddress"
          label={i18n._(t`Token Creator Address*`)}
          placeholder="0x..."
          helperText={
            <>
              <FormFieldHelperText>
                {i18n._(t`Enter the wallet address used to create the auction token on MISO.`)}
              </FormFieldHelperText>
              <FormFieldHelperText
                className="underline cursor-pointer"
                onClick={() => setValue('adminAddress', account || '')}
              >
                {i18n._(t`Use my address`)}
              </FormFieldHelperText>
            </>
          }
        />
      </div>
      <div className="col-span-4">
        <Form.TextField
          name="auctionAddress"
          label={i18n._(t`Auction Address*`)}
          placeholder="0x..."
          helperText={
            loading ? (
              <div className="w-4 h-4">
                <Lottie animationData={loadingCircle} autoplay loop />
              </div>
            ) : auction ? (
              <FormFieldHelperText className="!text-green">{i18n._(t`Auction found!`)}</FormFieldHelperText>
            ) : (
              i18n._(t`Address of the auction you held for your token`)
            )
          }
          error={
            !errors.auctionAddress && !loading && !auction && auctionAddress?.length > 0
              ? i18n._(t`Auction not found or you do not admin rights`)
              : undefined
          }
        />
      </div>

      {auction && (
        <div className="col-span-4 md:col-span-2">
          <Typography weight={700}>{i18n._(t`Liquidity Pair`)}</Typography>
          <Typography className="mt-2">
            {auction?.auctionToken.symbol} + {auction?.paymentToken.symbol}
          </Typography>
          <FormFieldHelperText>
            {i18n._(t`Liquidity pair token is set to the payment currency from your auction.`)}
          </FormFieldHelperText>
        </div>
      )}
    </Form.Section>
  )
}

export default LiquidityLauncherCreationFormFindAuction
