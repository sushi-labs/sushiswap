import { XMarkIcon } from '@heroicons/react/24/outline'
import React, { FC, useState } from 'react'

import { classNames } from '../../index'
import { DEFAULT_INPUT_UNSTYLED, Input } from '../input'

interface FormInputProps {
  label: string
  value: number | string
  onChange(value: string): void
  className?: string
  placeholder?: string
  color?: 'default' | 'yellow' | 'red'
  caption?: string
}

export const FormInputNumeric: FC<FormInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  className = '',
  color = 'default',
  caption,
}) => {
  const [focus, setFocus] = useState<boolean>()

  return (
    <>
      <label
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={classNames(
          className,
          color === 'yellow' ? 'bg-yellow/20 dark:bg-yellow/20' : '',
          color === 'red' ? 'bg-red/20 dark:bg-red/20' : '',
          'bg-white bg-dark-800 relative before:absolute before:inset-0 flex transition-all group before:hover:bg-black/[0.04] before:dark:hover:bg-white/[0.04] rounded-xl overflow-hidden cursor-text'
        )}
      >
        <div className="relative px-4 py-2 flex-[1_1_0%]">
          <div
            className={classNames(
              focus || `${value}`.length > 0 ? 'scale-[0.75]' : 'translate-y-[60%]',
              color === 'yellow' ? 'text-yellow-900 dark:text-yellow-200' : '',
              color === 'red' ? 'text-red-700 dark:text-red-500' : '',
              'text-gray-500 dark:text-slate-400 leading-[22px] text-base font-medium w-full whitespace-nowrap overflow-hidden truncate mt-[-3px] mb-[-3px] transition-all duration-200 origin-[left_center] pointer-events-none'
            )}
          >
            {label}
          </div>
          <div className="pt-0.5">
            <Input.Numeric
              value={value}
              onUserInput={onChange}
              name="slippageTolerance"
              variant="unstyled"
              placeholder={focus || `${value}`.length > 0 ? placeholder : ''}
              className={classNames(DEFAULT_INPUT_UNSTYLED, 'leading-[22px]')}
            />
          </div>
        </div>
        {value && (
          <div onClick={() => onChange('')} className="group-hover:flex hidden mr-4 items-center">
            <div className="z-[10] p-[3px] rounded-full bg-black/[0.16] dark:bg-white/[0.16] cursor-pointer">
              <XMarkIcon strokeWidth={3} width={14} height={14} className="text-white" />
            </div>
          </div>
        )}
      </label>
      {caption && (
        <div
          className={classNames(
            color === 'red' ? 'text-red' : color === 'yellow' ? 'text-yellow' : 'text-slate-400 dark:text-gray-600',
            'text-xs px-4 mt-2'
          )}
        >
          {caption}
        </div>
      )}
    </>
  )
}
