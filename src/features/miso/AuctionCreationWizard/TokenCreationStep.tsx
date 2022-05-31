import { RadioGroup } from '@headlessui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Form from 'app/components/Form'
import { BlocksIcon, MintableTokenIcon, SushiTokenIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import useTokenTemplateMap from 'app/features/miso/context/hooks/useTokenTemplateMap'
import { useStore } from 'app/features/miso/context/store'
import { ITokenDetails, tokenDetailsDefaultValues } from 'app/features/miso/context/store/createTokenDetailsSlice'
import { TokenSetup, TokenType } from 'app/features/miso/context/types'
import { classNames } from 'app/functions'
import { addressValidator } from 'app/functions/yupValidators'
import { useToken } from 'app/hooks/Tokens'
import React, { FC, ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export const tokenSchema = yup.object().shape({
  tokenSetupType: yup
    .number()
    .test({
      message: 'Please select an token setup type',
      test: (value) => value !== TokenSetup.NOT_SET,
    })
    .required('Must select a token setup type'),
  tokenAddress: yup.string().when('tokenSetupType', {
    is: (value: TokenSetup) => value === TokenSetup.PROVIDE,
    then: addressValidator.required('Please enter a valid ERC20-address'),
    otherwise: yup.string().nullable(),
  }),
  tokenType: yup.number().when('tokenSetupType', {
    is: (value: TokenSetup) => value === TokenSetup.CREATE,
    then: yup.number().required('Must select a token type'),
    otherwise: yup.number().nullable(),
  }),
  tokenName: yup.string().when('tokenSetupType', {
    is: (value: TokenSetup) => value === TokenSetup.CREATE,
    then: yup.string().required('Must enter a valid name'),
    otherwise: yup.string().nullable(),
  }),
  tokenSymbol: yup.string().when('tokenSetupType', {
    is: (value: TokenSetup) => value === TokenSetup.CREATE,
    then: yup.string().required('Must enter a valid symbol'),
    otherwise: yup.string().nullable(),
  }),
  tokenSupply: yup.number().when('tokenSetupType', {
    is: (value: TokenSetup) => value === TokenSetup.CREATE,
    then: yup
      .number()
      .typeError('Supply must be a number')
      .required('Must enter a valid number')
      .moreThan(0, 'Token supply must be larger than zero')
      .max(2e256 - 1, 'Token supply can be at most 2^256 - 1 due to network limitations')
      .integer('Must be a whole number')
      .test({
        message: 'Total supply must be more than twice the amount of tokens for sale',
        test: (value, ctx) => {
          if (!ctx.parent.tokenAmount) return true
          if (ctx.parent.tokenSetupType === TokenSetup.PROVIDE) return true
          return value ? value >= ctx.parent.tokenAmount * 2 : false
        },
      }),
    otherwise: yup.number().nullable(),
  }),
  tokenAmount: yup
    .number()
    .typeError('Must be a valid number')
    .required('Must enter a valid number')
    .moreThan(0, 'Token supply must be larger than zero')
    .integer('Must be a whole number')
    .test({
      message: 'Amount of tokens for sale must be less than half the total supply',
      test: (value, ctx) => {
        if (ctx.parent.tokenSetupType === TokenSetup.PROVIDE) return true
        return value ? value * 2 <= ctx.parent.tokenSupply : false
      },
    }),
})

const TokenCreationStep: FC<{ children(isValid: boolean): ReactNode }> = ({ children }) => {
  const { i18n } = useLingui()
  const { templateIdToLabel } = useTokenTemplateMap()

  const setTokenDetails = useStore((state) => state.setTokenDetails)
  const methods = useForm<ITokenDetails>({
    defaultValues: tokenDetailsDefaultValues,
    resolver: yupResolver(tokenSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const {
    watch,
    formState: { isValid },
    setValue,
  } = methods

  const [tokenType, tokenSetupType, tokenAddress] = watch(['tokenType', 'tokenSetupType', 'tokenAddress'])
  const token = useToken(tokenSetupType === TokenSetup.PROVIDE ? tokenAddress : undefined)

  const tokenSetupItems = [
    {
      value: TokenSetup.PROVIDE,
      label: 'Provide token',
      description: i18n._(t`I already have an ERC20 token with 18 decimals`),
    },
    {
      value: TokenSetup.CREATE,
      label: 'Create token',
      description: i18n._(t`I want to create a new ERC20 token.`),
    },
  ]

  const items = [
    {
      icon: <BlocksIcon height={83} width={83} />,
      value: TokenType.FIXED,
      label: templateIdToLabel(TokenType.FIXED),
      description: i18n._(
        t`A "standard" ERC20 token with a fixed supply and protections against further token minting or burning.`
      ),
    },
    {
      icon: <MintableTokenIcon height={83} width={83} />,
      value: TokenType.MINTABLE,
      label: templateIdToLabel(TokenType.MINTABLE),
      description: i18n._(
        t`An ERC20 token with a function allowing further minting at a later date. Creators will have to assign an owner for the minting controls.`
      ),
    },
    {
      icon: <SushiTokenIcon height={83} width={83} />,
      value: TokenType.SUSHI,
      label: templateIdToLabel(TokenType.SUSHI),
      description: i18n._(
        t`Sushi tokens function similar to mintable tokens but with additional capabilities built into the token. Creators will have to assign an owner address for token functions during minting.`
      ),
    },
  ]

  return (
    <Form {...methods} onSubmit={methods.handleSubmit((data: ITokenDetails) => setTokenDetails(data))}>
      <Form.Fields>
        <div className="flex items-center col-span-6">
          <RadioGroup
            value={tokenSetupType || ''}
            onChange={(tokenSetupType) => setValue('tokenSetupType', Number(tokenSetupType), { shouldValidate: true })}
            className="flex gap-10"
          >
            <input className="hidden" name="tokenSetupType" value={tokenSetupType} onChange={() => {}} />
            <div className="flex flex-col w-full gap-0 border divide-y rounded md:flex-row md:gap-5 border-dark-800 md:divide-y-0 md:divide-x divide-dark-800">
              {tokenSetupItems.map<ReactNode>(({ description, label, value }, index) => (
                <RadioGroup.Option value={value} key={value}>
                  {({ checked }) => (
                    <div
                      className={classNames(
                        'flex flex-col border border-transparent gap-2 p-10 rounded h-full cursor-pointer max-w-[300px] hover:text-white',
                        index === 0 ? 'text-center md:text-right' : 'text-center md:text-left'
                      )}
                    >
                      <Typography variant="h3" className={checked ? 'text-purple' : 'text-inherit'}>
                        {label}
                      </Typography>
                      <Typography variant="sm" className={checked ? 'text-purple' : 'text-inherit'}>
                        {description}
                      </Typography>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
        {tokenSetupType === TokenSetup.CREATE && (
          <>
            <div className="col-span-6">
              <RadioGroup
                value={tokenType}
                onChange={(tokenType) => setValue('tokenType', tokenType, { shouldValidate: true })}
                className="grid grid-cols-1 gap-10 mt-2 lg:grid-cols-3 md:grid-cols-2"
              >
                <input className="hidden" name="tokenType" value={tokenType} onChange={() => {}} />
                {items.map(({ icon, value, label, description }) => (
                  <RadioGroup.Option value={value} key={value}>
                    {({ checked }) => (
                      <div
                        className={classNames(
                          checked ? 'bg-dark-1000/40 border-purple' : 'bg-dark-900 hover:border-purple/40',
                          'flex flex-col gap-4 border border-dark-800 p-5 rounded h-full cursor-pointer'
                        )}
                      >
                        <Typography variant="lg" weight={700} className="text-high-emphesis">
                          {label}
                        </Typography>
                        {icon}
                        <Typography className="text-high-emphesis">{description}</Typography>
                      </div>
                    )}
                  </RadioGroup.Option>
                ))}
              </RadioGroup>
            </div>
            <div className="w-full md:w-1/2">
              <Form.TextField
                name="tokenName"
                label={i18n._(t`Name*`)}
                helperText={i18n._(t`This will be the name of your token. Choose wisely, this is final and immutable.`)}
                placeholder="The name of your token"
              />
            </div>
            <div className="w-full md:w-1/2">
              <Form.TextField
                name="tokenSymbol"
                label={i18n._(t`Symbol*`)}
                helperText={i18n._(
                  t`This will be the symbol of your token. Choose wisely, this is final and immutable.`
                )}
                placeholder="The symbol of your token"
              />
            </div>
            <div className="w-full md:w-1/2">
              <Form.TextField
                name="tokenSupply"
                label={i18n._(t`Total supply*`)}
                helperText={
                  tokenType === TokenType.FIXED
                    ? i18n._(
                        t`This will be the initial supply of your token. Because your token type is set to fixed. This value will be final and immutable`
                      )
                    : i18n._(t`This will be the initial supply of your token.`)
                }
                placeholder="The total supply of your token"
              />
            </div>
          </>
        )}
        {tokenSetupType === TokenSetup.PROVIDE && (
          <div className="w-full md:w-1/2">
            <Form.TextField
              label={i18n._(`Token address*`)}
              name="tokenAddress"
              helperText={
                <>
                  <Form.HelperText>{i18n._(t`Your token must be 18 decimals`)}</Form.HelperText>
                  <Form.HelperText className="text-green">
                    {i18n._(t`Provided token: ${token?.symbol}`)}
                  </Form.HelperText>
                </>
              }
              placeholder="Address of the ERC20 token"
            />
          </div>
        )}
        {tokenSetupType !== undefined && (
          <div className="w-full md:w-1/2">
            <Form.TextField
              name="tokenAmount"
              label={i18n._(t`Tokens for sale*`)}
              helperText={i18n._(t`This is the amount of tokens that will be sold to the public`)}
              placeholder="Enter the amount of tokens you would like to auction."
            />
          </div>
        )}
        {children(isValid)}
      </Form.Fields>
    </Form>
  )
}

export default TokenCreationStep
