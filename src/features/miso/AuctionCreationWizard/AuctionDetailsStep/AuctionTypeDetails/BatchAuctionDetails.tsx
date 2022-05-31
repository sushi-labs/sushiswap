import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE } from '@sushiswap/core-sdk'
import Form from 'app/components/Form'
import Typography from 'app/components/Typography'
import { useStore } from 'app/features/miso/context/store'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC } from 'react'

const BatchAuctionDetails: FC = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const paymentCurrencyAddress = useStore((state) => state.paymentCurrencyAddress)
  const paymentToken =
    useToken(paymentCurrencyAddress !== AddressZero ? paymentCurrencyAddress : undefined) ?? NATIVE[chainId || 1]

  return (
    <div className="w-full md:w-1/2">
      <Form.TextField
        {...(paymentToken && {
          endIcon: (
            <Typography variant="sm" weight={700} className="text-secondary">
              {paymentToken.symbol}
            </Typography>
          ),
        })}
        name="minimumRaised"
        label={i18n._(t`Minimum raise amount*`)}
        placeholder="0.00"
        helperText={i18n._(t`Minimum amount to raise in order to have a successful auction`)}
      />
    </div>
  )
}

export default BatchAuctionDetails
