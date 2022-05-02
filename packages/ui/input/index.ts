import { FC } from 'react'
import Address, { AddressProps } from './Address'

export type InputProps = {
  Address: FC<AddressProps>
}

export const Input: InputProps = { Address }
