import { AddressZero } from '@ethersproject/constants'
import { Switch } from '@headlessui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE } from '@sushiswap/core-sdk'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import ToggleButtonGroup from 'app/components/ToggleButton'
import Typography from 'app/components/Typography'
import { useStore } from 'app/features/miso/context/store'
import {
  ILiquidityDetails,
  liquidityDetailsDefaultValues,
} from 'app/features/miso/context/store/createLiquidityDetailsSlice'
import { useAuctionedToken } from 'app/features/miso/context/store/createTokenDetailsSlice'
import { classNames, formatNumber } from 'app/functions'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, ReactNode, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const useAuctionData = () =>
  useStore(({ paymentCurrencyAddress, tokenAmount, tokenSymbol }) => ({
    paymentCurrencyAddress,
    tokenAmount,
    tokenSymbol,
  }))

export const liquidityLauncherSchema = (tokenAmount: number | null, tokenSymbol: string) =>
  yup.object().shape({
    liqLauncherEnabled: yup.boolean().required(),
    tokenForLiquidity: yup.number().when('liqLauncherEnabled', {
      is: (val: boolean) => val,
      then: yup
        .number()
        .typeError('Must be a valid number')
        .required('Must enter a valid number')
        .integer('Must be a whole number')
        .test({
          message: `Amount of tokens for liquidity seeding must be at least 1 percent of tokens for sale (${
            Number(tokenAmount) / 100
          } ${tokenSymbol})`,
          test: (value, ctx) => {
            if (!ctx.parent.liqLauncherEnabled) return true
            return Number(value) * 100 >= Number(tokenAmount)
          },
        })
        .test({
          message: `Amount of tokens for liquidity cannot be larger than amount of tokens for sale (${Number(
            tokenAmount
          )} ${tokenSymbol})`,
          test: (value, ctx) => {
            if (!ctx.parent.liqLauncherEnabled) return true
            return Number(value) <= Number(tokenAmount)
          },
        }),
      otherwise: yup.number().nullable(),
    }),
    liqLockTime: yup.number().when('liqLauncherEnabled', {
      is: (val: boolean) => val,
      then: yup
        .number()
        .typeError('Must be a number')
        .required('Must enter a valid number')
        .integer('Must be a whole number'),
      otherwise: yup.number().nullable(),
    }),
    liqPercentage: yup.number().when('liqLauncherEnabled', {
      is: (val: boolean) => val,
      then: yup
        .number()
        .typeError('Must be a number')
        .required('Must enter a number')
        .moreThan(0, 'Must be a number between 0 and 100')
        .max(100, 'Must be a number between 0 and 100')
        .integer('Must be a whole number'),
      otherwise: yup.number().nullable(),
    }),
  })

const LiquidityLauncherStep: FC<{ children(isValid: boolean): ReactNode }> = ({ children }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const { paymentCurrencyAddress, tokenAmount, tokenSymbol } = useAuctionData()
  const setLiquidityDetails = useStore((state) => state.setLiquidityDetails)
  const paymentToken =
    useToken(paymentCurrencyAddress !== AddressZero ? paymentCurrencyAddress : undefined) ?? NATIVE[chainId || 1]
  const auctionToken = useAuctionedToken()

  const methods = useForm<ILiquidityDetails>({
    defaultValues: liquidityDetailsDefaultValues,
    resolver: yupResolver(liquidityLauncherSchema(tokenAmount, tokenSymbol)),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const {
    getValues,
    setValue,
    reset,
    watch,
    formState: { isValid },
  } = methods
  const [tokenForLiquidity, liqPercentage, liqLauncherEnabled] = watch([
    'tokenForLiquidity',
    'liqPercentage',
    'liqLauncherEnabled',
  ])

  useEffect(() => {
    const value = Math.round((Number(getValues('tokenForLiquidity')) * 100) / Number(tokenAmount))
    setValue('liqPercentage', value > 0 ? value : null, { shouldValidate: true })
  }, [getValues, tokenForLiquidity, setValue, tokenAmount])

  return (
    <Form {...methods} onSubmit={methods.handleSubmit((data: ILiquidityDetails) => setLiquidityDetails(data))}>
      <Form.Fields>
        <div className="flex flex-col">
          <Switch.Group>
            <Typography weight={700}>{i18n._(t`Use liquidity launcher`)}</Typography>
            <div className="mt-2 flex items-center h-[42px]">
              <Switch
                name="whitelistEnabled"
                checked={liqLauncherEnabled}
                onChange={() => {
                  if (liqLauncherEnabled) {
                    reset()
                  } else {
                    setValue('liqLauncherEnabled', !liqLauncherEnabled, { shouldValidate: true })
                  }
                }}
                className={classNames(
                  liqLauncherEnabled ? 'bg-purple border-purple border-opacity-80' : 'bg-dark-700 border-dark-700',
                  'filter bg-opacity-60 border  relative inline-flex items-center h-[32px] rounded-full w-[54px] transition-colors focus:outline-none'
                )}
              >
                <span
                  className={classNames(
                    liqLauncherEnabled ? 'translate-x-[23px]' : 'translate-x-[1px]',
                    'inline-block w-7 h-7 transform rounded-full transition-transform text-blue bg-white'
                  )}
                />
              </Switch>
            </div>
          </Switch.Group>
        </div>
        <div className={classNames('col-span-4', liqLauncherEnabled ? '' : 'opacity-40 pointer-events-none')}>
          <Typography weight={700}>{i18n._(t`Lockup Period*`)}</Typography>
          <div className="flex">
            <ToggleButtonGroup
              size="sm"
              variant="filled"
              value={Number(getValues('liqLockTime'))}
              onChange={(val) => {
                val && setValue('liqLockTime', Number(val), { shouldValidate: true })
              }}
              className="mt-2 flex gap-2"
            >
              <ToggleButtonGroup.Button value={180} className="!px-3 whitespace-nowrap h-[36px]">
                {i18n._(t`${180} days`)}
              </ToggleButtonGroup.Button>
              <ToggleButtonGroup.Button value={90} className="!px-3 whitespace-nowrap h-[36px]">
                {i18n._(t`${90} days`)}
              </ToggleButtonGroup.Button>
              <ToggleButtonGroup.Button value={60} className="!px-3 whitespace-nowrap h-[36px]">
                {i18n._(t`${60} days`)}
              </ToggleButtonGroup.Button>
              <ToggleButtonGroup.Button value={30} className="!px-3 whitespace-nowrap h-[36px]">
                {i18n._(t`${30} days`)}
              </ToggleButtonGroup.Button>
            </ToggleButtonGroup>
          </div>
          <div className="w-1/2">
            <Form.TextField
              name="liqLockTime"
              helperText={i18n._(t`Custom amount of days`)}
              placeholder=""
              endIcon={
                <Typography variant="sm" weight={700} className="text-secondary">
                  {i18n._(t`Days`)}
                </Typography>
              }
            />
          </div>
        </div>
        <div
          className={classNames(
            'flex gap-6 col-span-4',
            liqLauncherEnabled ? '' : 'opacity-40 pointer-events-none',
            ''
          )}
        >
          <div className="w-1/2">
            <Form.TextField
              endIcon={
                <Typography variant="sm" weight={700} className="text-secondary">
                  {auctionToken?.symbol}
                </Typography>
              }
              name="tokenForLiquidity"
              label={i18n._(t`Amount of tokens reserved for liquidity seeding*`)}
              helperText={i18n._(
                t`Must be between ${Number(tokenAmount) / 100} - ${Number(tokenAmount)} ${auctionToken?.symbol}`
              )}
            />
          </div>
        </div>
        <div className={classNames('w-full md:w-1/2', liqLauncherEnabled ? '' : 'opacity-40 pointer-events-none', '')}>
          <Typography weight={700}>{i18n._(t`Liquidity Pair (will consist of)`)}</Typography>
          <Typography className="mt-2">
            {formatNumber((Number(tokenAmount) * Number(liqPercentage)) / 100)} {auctionToken?.symbol} +{' '}
            {Number(liqPercentage)}% of auction {paymentToken?.symbol} proceeds
          </Typography>
          <FormFieldHelperText>
            {i18n._(
              t`The liquidity pair will be seeded by combining the amount of tokens reserved for liquidity seeding paired with the required auction proceeds such that the token price will equal the token price during the auction`
            )}
          </FormFieldHelperText>
        </div>
        {children(isValid || !liqLauncherEnabled)}
      </Form.Fields>
    </Form>
  )
}

export default LiquidityLauncherStep
