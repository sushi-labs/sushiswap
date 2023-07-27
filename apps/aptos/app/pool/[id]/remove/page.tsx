'use client'
import { useParams } from 'next/navigation'
import React from 'react'
import Remove from './remove'

const Pool = () => {
  const router = useParams()
  console.log(router?.id)
  const [chainId, ...LPToken] = router?.id?.split(':')
  console.log('queryy', chainId, LPToken.join(':'))
  return (
    <div>
      <Remove />
    </div>
  )
}

export default Pool
