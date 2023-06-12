import { AddressProps, Chip, classNames, DEFAULT_INPUT_UNSTYLED, Input, Loader } from '@sushiswap/ui'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'

import { Account } from '../Account'

export interface EnsInputProps extends AddressProps {
  inputClassName?: string
}

export const EnsInput = forwardRef<HTMLInputElement, EnsInputProps>(
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
              isLoading || isFetching ? 'pr-4' : '',
              'without-ring relative flex flex-col justify-center'
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
              <div className="absolute bottom-0 flex items-start top-1 right-1">
                <div className="overflow-hidden shadow-md rounded-2xl bg-slate-800">
                  <Chip label={typedRef.current} color="green" />
                </div>
              </div>
            )}
            {(isLoading || isFetching) && (
              <div className="absolute top-0 bottom-0 flex items-center justify-center right-3">
                <Loader width={16} />
              </div>
            )}
          </div>
        )}
      </Account.EnsToAddressResolver>
    )
  }
)
