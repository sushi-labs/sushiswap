'use client'
import React from 'react'
import Remove from './remove'
import { useAccount } from 'utils/useAccount'
import Loading from 'app/loading'

const Pool = () => {
  const { isLoadingAccount } = useAccount()
  return (
    <div>
      {isLoadingAccount && <Loading />}
      <Remove />
    </div>
  )
}

export default Pool
