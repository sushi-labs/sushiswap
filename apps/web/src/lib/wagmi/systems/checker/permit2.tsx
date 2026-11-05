'use client'

import { Button, type ButtonProps } from '@sushiswap/ui'
import type { ReactElement } from 'react'
import type { Amount } from 'sushi'
import type { EvmAddress, EvmChainId, EvmCurrency } from 'sushi/evm'
import { useConnection } from 'wagmi'
import { usePermit2PermitBatch } from '../../hooks/approvals/hooks/use-permit2-permit-batch'

interface Permit2Props extends ButtonProps {
  chainId: EvmChainId
  spender: EvmAddress
  /** The most of each currency the call may pull; native ones are skipped. */
  amounts: readonly Amount<EvmCurrency>[]
  deadline: bigint | undefined
}

/**
 * Renders its children once the Permit2 allowances `spender` has are known,
 * so they can sign whatever permit is still needed with `usePermit2PermitBatch`
 * right before sending. Holds no signature itself.
 */
function Permit2({
  chainId,
  spender,
  amounts,
  deadline,
  fullWidth = true,
  size = 'xl',
  children,
  ...props
}: Permit2Props): ReactElement {
  const { address } = useConnection()
  const { isPermitRequired, isError, refetch } = usePermit2PermitBatch({
    chainId,
    owner: address,
    spender,
    amounts,
    deadline,
  })

  if (isPermitRequired !== undefined) return <>{children}</>

  return (
    <Button
      {...props}
      fullWidth={fullWidth}
      size={size}
      loading={!isError}
      onClick={() => refetch()}
      type="button"
    >
      {isError ? 'Failed to check Permit2 allowances, retry' : 'Loading'}
    </Button>
  )
}

export { Permit2, type Permit2Props }
