import { classNames, ERROR_INPUT_CLASSNAME, Input, Loader, Typography } from '@sushiswap/ui'
import { AddressProps } from '@sushiswap/ui/input/Address'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'

import { Account } from '../Account'

type EnsInput = Omit<AddressProps, 'ref'>

export const EnsInput = forwardRef<HTMLInputElement, EnsInput>(({ onChange, value, className, ...rest }, ref) => {
  const typedRef = useRef<string>()
  const [showEns, setShowEns] = useState<boolean>(false)

  const onChangeHandler = useCallback(
    (value: string) => {
      typedRef.current = value
      onChange(value)
    },
    [onChange]
  )

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
    >
      {({ isLoading, isFetching }) => (
        <div
          className={classNames(
            rest.error ? ERROR_INPUT_CLASSNAME : 'ring-blue',
            isLoading || isFetching ? 'pr-4' : '',
            'relative flex flex-col bg-slate-800 rounded-xl focus-within:ring-1 ring-offset-2 ring-offset-slate-900'
          )}
        >
          <div
            className={classNames(
              showEns && typedRef.current && typedRef.current.length > 0 ? '' : 'gap-1',
              'flex items-center justify-between'
            )}
          >
            <Input.Address
              error={true}
              ref={ref}
              value={value}
              onChange={onChangeHandler}
              className={classNames(
                className,
                showEns && typedRef.current && typedRef.current.length > 0 ? 'pb-0 pt-1.5' : '',
                '!border-none !ring-offset-0 !shadow-none font-bold placeholder:font-medium !ring-0 w-full truncate'
              )}
              {...rest}
            />
          </div>
          {showEns && typedRef.current && typedRef.current.length > 0 && (
            <Typography
              variant="xxs"
              weight={700}
              className={classNames('transition-[max-height] max-height-0 px-4 pb-2 text-slate-500')}
            >
              {typedRef.current}
            </Typography>
          )}
          {(isLoading || isFetching) && (
            <div className="absolute right-3 flex items-center justify-center top-0 bottom-0">
              <Loader width={16} />
            </div>
          )}
        </div>
      )}
    </Account.EnsToAddressResolver>
  )
})
