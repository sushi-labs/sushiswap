import { isAddress } from '@ethersproject/address'
import { classNames, ERROR_INPUT_CLASSNAME, Input, Loader, Typography } from '@sushiswap/ui'
import { AddressProps } from '@sushiswap/ui/input/Address'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'

import { Account } from '../Account'

type EnsInput = Omit<AddressProps, 'ref'>

export const EnsInput = forwardRef<HTMLInputElement, EnsInput>(({ onChange, value, className, ...rest }, ref) => {
  const typedRef = useRef<string>()
  const [showEns, setShowEns] = useState<boolean>(false)

  const onChangeHandler = useCallback((value: string) => {
    typedRef.current = value
    onChange(value)
  }, [])

  // To avoid jitter
  useEffect(() => {
    if (typedRef.current !== value) {
      setTimeout(() => setShowEns(true), 500)
    } else setShowEns(false)
  }, [value])

  return (
    <Account.EnsToAddressResolver
      name={value}
      onSuccess={(data) => {
        if (data) {
          onChange(data)
        }
      }}
      enabled={value?.includes('.eth')}
    >
      {({ isLoading, data }) => {
        const isInvalid = !isLoading && !data && (value ? !isAddress(value) : false)

        return (
          <div
            className={classNames(
              rest.error || isInvalid ? ERROR_INPUT_CLASSNAME : isLoading ? 'ring-yellow' : 'ring-blue',
              'flex flex-col bg-slate-800 rounded-xl focus-within:ring-1 ring-offset-2 ring-offset-slate-900'
            )}
          >
            <div className="relative flex items-center justify-between gap-1">
              <Input.Address
                error={true}
                ref={ref}
                value={value}
                onChange={onChangeHandler}
                className={classNames(
                  showEns ? 'pb-1.5' : '',
                  '!border-none !ring-offset-0 !shadow-none font-bold placeholder:font-medium !ring-0 w-full',
                  className
                )}
                {...rest}
              />
              {isLoading && (
                <div className="mr-3">
                  <Loader width={24} />
                </div>
              )}
            </div>
            {showEns && (
              <Typography
                variant="xs"
                weight={700}
                className={classNames('transition-[max-height] max-height-0 px-4 pb-2 text-slate-500')}
              >
                {typedRef.current}
              </Typography>
            )}
          </div>
        )
      }}
    </Account.EnsToAddressResolver>
  )
})
