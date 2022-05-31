import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, Token } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Form from 'app/components/Form'
import useAuction from 'app/features/miso/context/hooks/useAuction'
import LiquidityLauncherCreationFormFindAuction from 'app/features/miso/LiquidityLauncherCreationForm/LiquidityLauncherCreationFormFindAuction'
import LiquidityLauncherCreationOptions from 'app/features/miso/LiquidityLauncherCreationForm/LiquidityLauncherCreationOptions'
import LiquidityLauncherCreationReviewModal from 'app/features/miso/LiquidityLauncherCreationForm/LiquidityLauncherCreationReviewModal'
import { formatData } from 'app/features/miso/LiquidityLauncherCreationForm/utils'
import { addressValidator } from 'app/functions/yupValidators'
import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export interface LiquidityLauncherFormInput {
  auctionAddress?: string
  adminAddress?: string
  liqPercentage?: number
  liqLockTime?: number
}

export interface LiquidityLauncherFormInputValidated {
  auctionAddress: string
  adminAddress: string
  liqPercentage: number
  liqLockTime: number
}

export interface LiquidityLauncherFormInputFormatted {
  auctionAddress: string
  adminAddress: string
  liqPercentage: number
  liqLockTime: number
  tokenAddress: string
  tokenSupply?: CurrencyAmount<Token>
}

const schema = yup.object({
  auctionAddress: addressValidator.required('Target must be a valid address'),
  adminAddress: addressValidator.required('Target must be a valid address'),
  liqPercentage: yup
    .number()
    .typeError('Target must be a percentage')
    .min(0, 'Must be greater than zero')
    .max(100, 'Can be at most 100%'),
  liqLockTime: yup.number().required('Target must be a number').min(30, 'Lockup period must be at least 30 days'),
})

const AuctionCreationFormLiquidityLauncher: FC = () => {
  const { i18n } = useLingui()
  const [open, setOpen] = useState<boolean>(false)

  const methods = useForm<LiquidityLauncherFormInput>({
    defaultValues: {
      liqPercentage: 100,
    },
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const {
    watch,
    formState: { errors, isValid, isValidating },
  } = methods

  const data = watch()

  const { auction } = useAuction(data.auctionAddress)

  const validatedData =
    !isValidating && isValid && auction ? formatData(data as LiquidityLauncherFormInputValidated, auction) : undefined

  const onSubmit = () => setOpen(true)

  return (
    <>
      <Form {...methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Form.Card>
          <LiquidityLauncherCreationFormFindAuction />
          <LiquidityLauncherCreationOptions />
          <Form.Submit>
            <div>
              <Button disabled={Object.keys(errors).length > 0} color="blue" type="submit">
                {i18n._(t`Review`)}
              </Button>
            </div>
          </Form.Submit>
        </Form.Card>
      </Form>
      <LiquidityLauncherCreationReviewModal open={open} onDismiss={() => setOpen(false)} data={validatedData} />
    </>
  )
}

export default AuctionCreationFormLiquidityLauncher
