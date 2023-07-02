import { XMarkIcon } from '@heroicons/react/24/outline'
import { cva, type VariantProps } from 'class-variance-authority'
import classNames from 'classnames'
import { Loader2, Search as SearchIcon } from 'lucide-react'
import React, { forwardRef, KeyboardEvent, useCallback, useEffect, useState } from 'react'

import { Chip } from '../chip'

const containerVariants = cva('font-medium relative w-full flex items-center gap-1.5 rounded-xl bg-secondary', {
  variants: {
    size: {
      sm: 'min-h-9 h-9 px-3 text-sm',
      default: 'min-h-10 h-10 py-2 px-4 text-sm',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const containerIconVariants = cva('', {
  variants: {
    size: {
      sm: 'w-5 h-5',
      default: 'w-5 h-5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const inputVariants = cva('truncate bg-transparent w-full', {
  variants: {
    size: {
      sm: 'min-h-9 h-9',
      default: 'min-h-10 h-10',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export interface SearchProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {
  className?: string
  id: string
  value: string
  onValueChange(val: string): void
  loading?: boolean
  delimiter?: string
}

const Search = forwardRef<HTMLInputElement, SearchProps>(
  ({ id, loading, value, onValueChange, size = 'default', delimiter }, ref) => {
    const [values, setValues] = useState({
      all: value.split(delimiter || ' '),
      typed: '',
    })

    const _onChange = useCallback(
      (val: string) => {
        if (val.slice(-1) === (delimiter || ' ')) {
          setValues((prev) => ({
            typed: '',
            all: [...prev.all, prev.typed],
          }))
        } else {
          setValues((prev) => ({
            typed: val,
            all: prev.all,
          }))
        }
      },
      [delimiter]
    )

    const remove = useCallback((val: string) => {
      setValues((prev) => ({
        typed: prev.typed,
        all: prev.all.filter((_val) => _val !== val),
      }))
    }, [])

    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace') {
        setValues((prev) => ({
          typed: prev.typed,
          all: prev.all.slice(0, -1),
        }))
      }

      if (event.key === 'Enter') {
        setValues((prev) => ({
          typed: '',
          all: [...prev.all, prev.typed],
        }))
      }
    }, [])

    useEffect(() => {
      if (delimiter) {
        onValueChange(`${values.typed} ${values.all.filter((el) => el !== ' ' && el !== '').join(' ')}`)
      }
    }, [delimiter, onValueChange, values])

    if (delimiter) {
      return (
        <div ref={ref} className={classNames(containerVariants({ size }))}>
          <SearchIcon className={classNames(containerIconVariants({ size }))} />
          <div className="flex gap-1">
            {values.all
              .filter((el) => el !== ' ' && el !== '')
              .map((el, i) => (
                <Chip
                  icon={XMarkIcon}
                  onClick={() => remove(el)}
                  key={i}
                  variant="secondary"
                  className="cursor-pointer"
                >
                  {el}
                </Chip>
              ))}
          </div>

          <input
            id={`${id}-address-input`}
            testdata-id={`${id}-address-input`}
            placeholder="Search"
            value={values.typed}
            onChange={(e) => _onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={inputVariants({ size, className: 'pr-6' })}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            autoComplete="off"
          />
          {(loading || value) && (
            <div className="absolute right-3 flex items-center">
              {loading ? (
                <div>
                  <Loader2 className={containerIconVariants({ size })} />
                </div>
              ) : value ? (
                <div
                  onClick={() =>
                    setValues({
                      all: [],
                      typed: '',
                    })
                  }
                >
                  <XMarkIcon className={containerIconVariants({ size, className: 'cursor-pointer' })} />
                </div>
              ) : null}
            </div>
          )}
        </div>
      )
    }

    return (
      <div ref={ref} className={classNames(containerVariants({ size }))}>
        <SearchIcon className={classNames(containerIconVariants({ size }))} />
        <div />
        <input
          id={`${id}-address-input`}
          testdata-id={`${id}-address-input`}
          placeholder="Search"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={inputVariants({ size, className: 'pr-6' })}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="off"
        />
        {(loading || value) && (
          <div className="absolute right-3 flex items-center">
            {loading ? (
              <div>
                <Loader2 className={containerIconVariants({ size })} />
              </div>
            ) : value ? (
              <div onClick={() => onValueChange('')}>
                <XMarkIcon className={containerIconVariants({ size, className: 'cursor-pointer' })} />
              </div>
            ) : null}
          </div>
        )}
      </div>
    )
  }
)

Search.displayName = 'Search'

export { Search }
