import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Chip from 'app/components/Chip'
import { DEFAULT_FORM_FIELD_CLASSNAMES } from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import Typography from 'app/components/Typography'
import { getCountryName, ISO_COUNTRIES } from 'app/features/miso/context/utils'
import { classNames } from 'app/functions'
import React, { FC, useCallback } from 'react'
import { useFormContext } from 'react-hook-form'

const BannedCountriesFormField: FC = () => {
  const {
    formState: { errors },
    getValues,
    setValue,
  } = useFormContext()

  const values =
    getValues('bannedCountries')
      ?.split(',')
      // @ts-ignore TYPE NEEDS FIXING
      .filter((el) => el !== '') || []

  const deleteCountry = useCallback(
    // @ts-ignore TYPE NEEDS FIXING
    (values, value) => setValue('bannedCountries', values?.filter((el) => el !== value).join(',')),
    [setValue]
  )

  const addCountry = useCallback(
    (values, e) => {
      return setValue('bannedCountries', [...values, e.target.value].join(','))
    },
    [setValue]
  )

  const list = Object.entries(ISO_COUNTRIES).filter(([k]) => !values.includes(k))

  return (
    <>
      <Typography weight={700}>{i18n._(t`Country Ban`)}</Typography>
      <div className="mt-2 flex flex-col gap-2 rounded-md shadow-sm">
        <select
          multiple
          onChange={(e) => addCountry(values, e)}
          name="bannedCountries"
          className={DEFAULT_FORM_FIELD_CLASSNAMES}
        >
          {list.map(([key, label]) => (
            <option value={key} key={key}>
              {label}
            </option>
          ))}
        </select>
        <div
          className={classNames(
            DEFAULT_FORM_FIELD_CLASSNAMES,
            errors.bannedCountries ? '!border-red' : '',
            'flex flex-wrap gap-2 min-h-[42px] relative w-full py-2 pl-3 pr-10 text-left cursor-pointer'
          )}
        >
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          {values?.map((el, index) => {
            return (
              <Chip
                key={index}
                label={getCountryName(el)}
                onClick={(e) => {
                  e.stopPropagation()

                  deleteCountry(values, el)
                }}
                color="purple"
              />
            )
          })}
        </div>
      </div>
      {errors.bannedCountries ? (
        <FormFieldHelperText className="!text-red">{errors.bannedCountries.name}</FormFieldHelperText>
      ) : (
        <FormFieldHelperText>
          {i18n._(t`Select countries who are not allowed to participate in this auction. Please note that this does
                        not prevent users from actually committing but merely serves as a disclaimer.`)}
        </FormFieldHelperText>
      )}
    </>
  )
}

export default BannedCountriesFormField
