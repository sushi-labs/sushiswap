import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CHAIN_KEY } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import Button from 'app/components/Button'
import Form from 'app/components/Form'
import TokenCreationFormGeneralDetails from 'app/features/miso/TokenCreationForm/TokenCreationFormGeneralDetails'
import TokenCreationFormTypeSelector from 'app/features/miso/TokenCreationForm/TokenCreationFormTypeSelector'
import TokenCreationReviewModal from 'app/features/miso/TokenCreationForm/TokenCreationReviewModal'
import { addressValidator } from 'app/functions/yupValidators'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export interface TokenCreationFormInput {
  tokenTypeAddress: string
  tokenName: string
  tokenSymbol: string
  tokenSupply: number
}

const schema = yup.object({
  tokenTypeAddress: addressValidator.required('Must be a valid ERC-20 token address'),
  tokenName: yup.string().required('Must enter a valid name'),
  tokenSymbol: yup.string().required('Must enter a valid symbol'),
  tokenSupply: yup
    .number()
    .typeError('Supply must be a number')
    .required('Must enter a valid number')
    .moreThan(0, 'Token supply must be larger than zero')
    .max(2e256 - 1, 'Token supply can be at most 2^256 - 1 due to network limitations'),
})

const TokenCreationForm: FC = ({}) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [open, setOpen] = useState<boolean>(false)

  const methods = useForm<TokenCreationFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      // @ts-ignore TYPE NEEDS FIXING
      tokenTypeAddress: chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.FixedToken.address : undefined,
    },
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const {
    watch,
    formState: { errors },
  } = methods

  // Validate form on every input
  const data = watch()

  const onSubmit = () => setOpen(true)

  return (
    <>
      <Form {...methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Form.Card>
          <TokenCreationFormTypeSelector />
          <TokenCreationFormGeneralDetails />
          <Form.Submit>
            <div>
              <Button disabled={Object.keys(errors).length > 0} color="blue" type="submit">
                {i18n._(t`Review`)}
              </Button>
            </div>
          </Form.Submit>
        </Form.Card>
      </Form>
      <TokenCreationReviewModal open={open} onDismiss={() => setOpen(false)} data={data} />
    </>
  )
}

export default TokenCreationForm
