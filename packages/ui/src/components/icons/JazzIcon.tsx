'use client'

import dynamic from 'next/dynamic'
import { FC } from 'react'
import { jsNumberForAddress } from 'react-jazzicon'

interface JazzIconProps {
  diameter: number
  address: string
}

const Jazzicon = dynamic(() => import('react-jazzicon'), { ssr: false })

export const JazzIcon: FC<JazzIconProps> = ({ diameter, address }) => {
  return <Jazzicon diameter={diameter} seed={jsNumberForAddress(address)} />
}
