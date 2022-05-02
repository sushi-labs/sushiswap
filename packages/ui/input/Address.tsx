import { HTMLProps, memo } from 'react'
import classNames from 'classnames'

export type AddressProps = {
  value: string
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'as'>

const matchSpaces = /\s+/g

export const Address = memo(
  ({
    value,
    onChange,
    placeholder = 'Address or ENS name',
    title = 'Address or ENS name',
    className,
    ...rest
  }: AddressProps) => {
    return (
      <>
        <input
          title={title}
          placeholder={placeholder}
          value={value}
          type="text"
          className={classNames('whitespace-nowrap overflow-ellipsis', className)}
          onChange={(event) => onChange && onChange(event.target.value.replace(matchSpaces, ''))}
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          pattern="^(0x[a-fA-F0-9]{40})$"
          {...rest}
        />
      </>
    )
  },
)

export default Address
