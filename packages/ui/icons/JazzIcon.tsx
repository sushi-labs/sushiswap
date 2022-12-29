import { FC } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

interface JazzIconProps {
  diameter: number
  address: string
}

export const JazzIcon: FC<JazzIconProps> = ({ diameter, address }) => {
  return <Jazzicon diameter={diameter} seed={jsNumberForAddress(address)} />
}
