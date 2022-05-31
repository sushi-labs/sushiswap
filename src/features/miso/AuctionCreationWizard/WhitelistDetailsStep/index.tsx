import { Switch } from '@headlessui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Form from 'app/components/Form'
import Typography from 'app/components/Typography'
import { useStore } from 'app/features/miso/context/store'
import {
  IWhitelistDetails,
  whitelistDetailsDefaultValues,
} from 'app/features/miso/context/store/createWhitelistDetailsSlice'
import WhitelistUpload from 'app/features/miso/WhitelistUpload'
import { classNames } from 'app/functions'
import React, { FC, ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export const whitelistSchema = yup.object().shape({
  whitelistEnabled: yup.boolean().required(),
  whitelistAddresses: yup.array().when('whitelistEnabled', {
    is: (val: boolean) => val,
    then: yup.array().min(1, 'There must be at least 1 whitelisted address when enabled'),
    otherwise: yup.array().nullable(),
  }),
})

const WhitelistDetailsStep: FC<{ children(isValid: boolean): ReactNode }> = ({ children }) => {
  const { i18n } = useLingui()
  const setWhitelistDetails = useStore((state) => state.setWhitelistDetails)
  const methods = useForm<IWhitelistDetails>({
    defaultValues: whitelistDetailsDefaultValues,
    resolver: yupResolver(whitelistSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const {
    setValue,
    watch,
    formState: { isValid },
  } = methods
  const [whitelistEnabled, whitelistAddresses] = watch(['whitelistEnabled', 'whitelistAddresses'])

  return (
    <Form {...methods} onSubmit={methods.handleSubmit((data: IWhitelistDetails) => setWhitelistDetails(data))}>
      <Form.Fields>
        <div className="flex flex-col">
          <Switch.Group>
            <Typography weight={700}>{i18n._(t`Use whitelist`)}</Typography>
            <div className="mt-2 flex items-center h-[42px]">
              <Switch
                name="whitelistEnabled"
                checked={whitelistEnabled}
                onChange={() => setValue('whitelistEnabled', !whitelistEnabled, { shouldValidate: true })}
                className={classNames(
                  whitelistEnabled ? 'bg-purple border-purple border-opacity-80' : 'bg-dark-700 border-dark-700',
                  'filter bg-opacity-60 border  relative inline-flex items-center h-[32px] rounded-full w-[54px] transition-colors focus:outline-none'
                )}
              >
                <span
                  className={classNames(
                    whitelistEnabled ? 'translate-x-[23px]' : 'translate-x-[1px]',
                    'inline-block w-7 h-7 transform rounded-full transition-transform text-blue bg-white'
                  )}
                />
              </Switch>
            </div>
          </Switch.Group>
        </div>
        <div className={classNames(whitelistEnabled ? '' : 'opacity-40 pointer-events-none', 'w-full md:w-1/2')}>
          <WhitelistUpload
            value={whitelistAddresses}
            disabled={false}
            onChange={(param) =>
              typeof param === 'function'
                ? setValue('whitelistAddresses', param(whitelistAddresses), { shouldValidate: true })
                : setValue('whitelistAddresses', param, { shouldValidate: true })
            }
          />
        </div>
        {children(isValid)}
      </Form.Fields>
    </Form>
  )
}

export default WhitelistDetailsStep
