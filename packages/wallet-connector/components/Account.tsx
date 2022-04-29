import React from 'react'
import { useBalance, useDisconnect, useEnsName } from 'wagmi'

const Name: React.FC<{
  address?: string
}> = ({ address }) => {
  const { data, isError, isLoading } = useEnsName({
    address,
  })
  if (isLoading) return <>Fetching name…</>
  if (isError) return <>Error fetching name</>
  return <>{data || address?.slice(0, 6) + '...'}</>
}

const Balance: React.FC<{
  address: string
}> = ({ address }) => {
  const { data, isError, isLoading } = useBalance({ addressOrName: address, enabled: true })
  if (isLoading) return <>Fetching balance...</>
  if (isError) return <>Error fetching balance</>
  return <>{data?.formatted} ETH</>
}

export default { Balance, Name }
