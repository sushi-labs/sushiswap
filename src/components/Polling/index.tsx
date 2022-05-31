import { getExplorerLink } from 'app/functions/explorer'
import useBlockNumber from 'app/lib/hooks/useBlockNumber'
import { useActiveWeb3React } from 'app/services/web3'
import React, { useEffect, useState } from 'react'

import ExternalLink from '../ExternalLink'

export default function Polling() {
  const { chainId } = useActiveWeb3React()

  const blockNumber = useBlockNumber()

  const [isMounted, setIsMounted] = useState(true)

  useEffect(
    () => {
      const timer1 = setTimeout(() => setIsMounted(true), 1000)

      // this will clear Timeout when component unmount like in willComponentUnmount
      return () => {
        setIsMounted(false)
        clearTimeout(timer1)
      }
    },
    [blockNumber] // useEffect will run only one time
    // if you pass a value to array, like this [data] than clearTimeout will run every time this value changes (useEffect re-run)
  )

  return (
    <ExternalLink
      href={chainId && blockNumber ? getExplorerLink(chainId, blockNumber.toString(), 'block') : ''}
      className={`${!isMounted ? 'text-high-emphesis' : 'text-low-emphesis'}`}
    >
      <div className={`flex items-center space-x-2`}>
        <div>{blockNumber}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 ${!isMounted ? 'animate-spin' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
    </ExternalLink>
  )
}
