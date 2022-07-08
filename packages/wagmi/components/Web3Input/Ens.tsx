import {
  Chip,
  classNames,
  DEFAULT_INPUT_CLASSNAME,
  DEFAULT_INPUT_UNSTYLED,
  ERROR_INPUT_CLASSNAME,
  Input,
  Loader,
} from '@sushiswap/ui'
import { AddressProps } from '@sushiswap/ui/input/Address'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'

import { Account } from '../Account'

type EnsInput = Omit<AddressProps, 'ref'> & {
  inputClassName?: string
}

export const EnsInput = forwardRef<HTMLInputElement, EnsInput>(
  ({ onChange, value, className, inputClassName, ...rest }, ref) => {
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
              className,
              DEFAULT_INPUT_CLASSNAME,
              rest.error ? ERROR_INPUT_CLASSNAME : '',
              isLoading || isFetching ? 'pr-4' : '',
              'relative flex flex-col justify-center'
            )}
          >
            <Input.Address
              variant="unstyled"
              error={true}
              ref={ref}
              value={value}
              onChange={onChangeHandler}
              className={classNames(inputClassName, DEFAULT_INPUT_UNSTYLED, 'p-0 h-full')}
              {...rest}
            />
            {showEns && typedRef.current && typedRef.current.length > 0 && !(isLoading || isFetching) && (
              <div className="absolute top-1 bottom-0 flex items-start right-1">
                <div className="rounded-2xl overflow-hidden bg-slate-800 shadow-md">
                  <Chip label={typedRef.current} color="green" />
                </div>
              </div>
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
  }
)
