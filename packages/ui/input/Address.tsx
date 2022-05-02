import { HTMLProps, memo } from 'react'
import classNames from 'classnames'

export type AddressProps = {
  value: string
  onUserInput: (input: string) => void
} & Omit<HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>

export const Address = memo(({ value, onUserInput, placeholder, className, ...rest }: AddressProps) => {
  return (
    <>
      <input
        value={value}
        onChange={(event) => {
          onUserInput(event.target.value.replace(/\s+/g, ''))
        }}
        inputMode="text"
        title="Address or ENS name"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        placeholder="Address or ENS name"
        pattern="^(0x[a-fA-F0-9]{40})$"
        // text-specific options
        type="text"
        className={classNames('whitespace-nowrap overflow-ellipsis', className)}
        {...rest}
      />
    </>
  )
})

export default Address
