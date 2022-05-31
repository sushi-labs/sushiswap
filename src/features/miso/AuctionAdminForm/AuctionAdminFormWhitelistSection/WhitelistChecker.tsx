import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, ZERO } from '@sushiswap/core-sdk'
import Form, { DEFAULT_FORM_FIELD_CLASSNAMES } from 'app/components/Form'
import Typography from 'app/components/Typography'
import { isAddressValidator, pipeline } from 'app/features/miso/AuctionAdminForm/validators'
import { useAuctionPointListPoints } from 'app/features/miso/context/hooks/useAuctionPointList'
import { classNames, isAddress } from 'app/functions'
import React, { FC, useState } from 'react'

interface WhitelistCheckerProps {
  listAddress?: string
  paymentToken?: Currency
}

const WhitelistChecker: FC<WhitelistCheckerProps> = ({ listAddress: listAddressProp, paymentToken }) => {
  const { i18n } = useLingui()
  const [error, setError] = useState<string>()
  const [address, setAddress] = useState<string>()
  const [listAddress, setListAddress] = useState<string>()
  const valid = isAddress(address)
  const points = useAuctionPointListPoints(
    listAddress || listAddressProp,
    !error && valid ? valid : undefined,
    paymentToken
  )

  const whitelisted = address && !error && points && points.greaterThan(ZERO)
  const nonWhitelisted = address && !error && points?.equalTo(ZERO)

  return (
    <>
      <div className="flex flex-col flex-grow">
        <Typography weight={700}>{i18n._(t`Whitelist Checker`)}</Typography>
        <div className="mt-2 flex rounded-md shadow-sm">
          <input
            value={listAddress || listAddressProp}
            onChange={(e) =>
              pipeline({ value: e.target.value }, [isAddressValidator], () => setListAddress(e.target.value), setError)
            }
            placeholder="Permission list address"
            className={classNames(DEFAULT_FORM_FIELD_CLASSNAMES, !!error ? '!border-red' : '')}
          />
        </div>
        <div className="mt-2 flex rounded-md shadow-sm">
          <input
            value={address}
            onChange={(e) =>
              pipeline({ value: e.target.value }, [isAddressValidator], () => setAddress(e.target.value), setError)
            }
            placeholder="User address"
            className={classNames(DEFAULT_FORM_FIELD_CLASSNAMES, !!error ? '!border-red' : '')}
          />
        </div>
        {!!error ? (
          <Form.HelperText className="!text-red">{error}</Form.HelperText>
        ) : (
          <Form.HelperText
            className={classNames(
              'mt-2 text-sm',
              whitelisted ? '!text-green' : nonWhitelisted ? '!text-red' : 'text-gray-500'
            )}
          >
            {whitelisted
              ? i18n._(t`Address is whitelisted for ${points?.toSignificant(6)} ${points?.currency.symbol}!`)
              : nonWhitelisted
              ? i18n._(t`Address is not whitelisted!`)
              : i18n._(t`Check if an address is whitelisted`)}
          </Form.HelperText>
        )}
      </div>
    </>
  )
}

export default WhitelistChecker
