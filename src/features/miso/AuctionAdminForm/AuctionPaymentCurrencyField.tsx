import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import {
  DAI_ADDRESS,
  FRAX_ADDRESS,
  MIM_ADDRESS,
  NATIVE,
  SUSHI_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
} from '@sushiswap/core-sdk'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import ToggleButtonGroup from 'app/components/ToggleButton'
import Typography from 'app/components/Typography'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

interface AuctionPaymentCurrencyFieldProps {
  name: string
  label: string
}

const AuctionPaymentCurrencyField: FC<AuctionPaymentCurrencyFieldProps> = ({ name, label }) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { getValues, setValue } = useFormContext()
  const paymentTokenAddress = useWatch({ name })
  // @ts-ignore TYPE NEEDS FIXING
  const token = useToken(paymentTokenAddress !== AddressZero ? paymentTokenAddress : undefined) ?? NATIVE[chainId || 1]

  if (!chainId) return <></>

  return (
    <div className="flex flex-col">
      <div>
        <Typography weight={700}>{label}</Typography>
        <div className="flex">
          <ToggleButtonGroup
            size="sm"
            variant="filled"
            value={getValues(name)}
            onChange={(val: string) => setValue(name, val, { shouldValidate: true })}
            className="flex gap-2 mt-2"
          >
            <ToggleButtonGroup.Button value={AddressZero} className="!px-3 h-[36px]">
              {/*@ts-ignore TYPE NEEDS FIXING*/}
              {NATIVE[chainId].symbol}
            </ToggleButtonGroup.Button>
            {chainId in SUSHI_ADDRESS && (
              <ToggleButtonGroup.Button value={SUSHI_ADDRESS[chainId]} className="!px-3 h-[36px]">
                SUSHI
              </ToggleButtonGroup.Button>
            )}
            {chainId in DAI_ADDRESS && (
              <ToggleButtonGroup.Button value={DAI_ADDRESS[chainId]} className="!px-3 h-[36px]">
                DAI
              </ToggleButtonGroup.Button>
            )}
            {chainId in USDT_ADDRESS && (
              <ToggleButtonGroup.Button value={USDC_ADDRESS[chainId]} className="!px-3 h-[36px]">
                USDC
              </ToggleButtonGroup.Button>
            )}
            {chainId in USDT_ADDRESS && (
              <ToggleButtonGroup.Button value={USDT_ADDRESS[chainId]} className="!px-3 h-[36px]">
                USDT
              </ToggleButtonGroup.Button>
            )}
            {chainId in MIM_ADDRESS && (
              <ToggleButtonGroup.Button value={MIM_ADDRESS[chainId]} className="!px-3 h-[36px]">
                MIM
              </ToggleButtonGroup.Button>
            )}
            {chainId in FRAX_ADDRESS && (
              <ToggleButtonGroup.Button value={FRAX_ADDRESS[chainId]} className="!px-3 h-[36px]">
                FRAX
              </ToggleButtonGroup.Button>
            )}
          </ToggleButtonGroup>
        </div>
      </div>
      <div className="flex flex-col flex-grow">
        <Form.TextField
          className={paymentTokenAddress === AddressZero ? 'hidden' : ''}
          name={name}
          helperText={
            <>
              <FormFieldHelperText>
                {i18n._(
                  t`Select the currency you accept as payment during the auction. If you don’t see the ERC-20 token you are looking for, input by pasting the address in the custom field.`
                )}
              </FormFieldHelperText>
              <FormFieldHelperText>{i18n._(t`Selected currency: ${token?.symbol}`)}</FormFieldHelperText>
            </>
          }
          placeholder="0x..."
        />
      </div>
    </div>
  )
}

export default AuctionPaymentCurrencyField
